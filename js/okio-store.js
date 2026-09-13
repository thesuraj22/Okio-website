/**
 * OKIO Core Store & E-Commerce Interaction Engine
 * Handles persistent cart state, slide-out drawer, checkout sync, instant search,
 * quick-add sheets, toast alerts, and analytics events across all OKIO pages.
 */

class OkioStore {
    constructor() {
        this.storageKey = 'okio_cart_v2';
        this.promoKey = 'okio_active_promo';
        this.cart = this.loadCart();
        this.appliedPromo = this.loadPromo();
        this.initAnalytics();
        this.ensureDOMStructure();
        this.bindGlobalEvents();
        this.updateCartBadge();
    }

    // --- CART STORAGE & STATE ---
    loadCart() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('LocalStorage error:', e);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        } catch (e) {
            console.warn('LocalStorage save error:', e);
        }
        this.updateCartBadge();
        this.renderDrawer();
        window.dispatchEvent(new CustomEvent('okio:cart-updated', { detail: { cart: this.cart } }));
    }

    loadPromo() {
        try {
            const promo = localStorage.getItem(this.promoKey);
            return promo ? JSON.parse(promo) : null;
        } catch (e) {
            return null;
        }
    }

    savePromo(promo) {
        this.appliedPromo = promo;
        if (promo) {
            localStorage.setItem(this.promoKey, JSON.stringify(promo));
        } else {
            localStorage.removeItem(this.promoKey);
        }
        this.saveCart();
    }

    // --- CART OPERATIONS ---
    addToCart(productId, packSizeId = 'pack-12', quantity = 1, isSubscription = false) {
        const product = getProductById(productId);
        if (!product) return;

        const pack = product.packSizes.find(p => p.id === packSizeId) || product.packSizes[0];
        const cartItemId = `${product.id}__${pack.id}__${isSubscription ? 'sub' : 'one'}`;

        const existingItemIndex = this.cart.findIndex(item => item.id === cartItemId);
        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].qty += quantity;
        } else {
            this.cart.push({
                id: cartItemId,
                productId: product.id,
                name: product.name,
                flavor: product.flavor,
                packId: pack.id,
                packLabel: pack.label,
                units: pack.units,
                price: pack.price,
                comparePrice: pack.comparePrice,
                image: product.image,
                accentColor: product.accentColor,
                qty: quantity,
                isSubscription: isSubscription
            });
        }

        this.saveCart();
        this.trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            pack_size: pack.label,
            price: pack.price,
            quantity: quantity
        });

        this.showToast(`Added ${pack.label} of ${product.shortName} to your stash.`);
        this.openCart();
    }

    updateQty(cartItemId, newQty) {
        const index = this.cart.findIndex(item => item.id === cartItemId);
        if (index > -1) {
            if (newQty <= 0) {
                const removedItem = this.cart[index];
                this.cart.splice(index, 1);
                this.trackEvent('remove_from_cart', {
                    product_id: removedItem.productId,
                    pack_size: removedItem.packLabel
                });
                this.showToast('Item removed from your stash.');
            } else {
                this.cart[index].qty = newQty;
                this.trackEvent('quantity_changed', {
                    cart_item_id: cartItemId,
                    new_quantity: newQty
                });
            }
            this.saveCart();
        }
    }

    removeItem(cartItemId) {
        this.updateQty(cartItemId, 0);
    }

    clearCart() {
        this.cart = [];
        this.appliedPromo = null;
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.promoKey);
        this.saveCart();
    }

    getTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const itemsCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
        
        let discount = 0;
        if (this.appliedPromo && subtotal >= this.appliedPromo.minOrder) {
            discount = Math.round((subtotal * this.appliedPromo.discountPercent) / 100);
        }

        const discountedSubtotal = Math.max(0, subtotal - discount);
        const freeThreshold = OKIO_DATA.brand.freeShippingThreshold;
        const shipping = (subtotal === 0 || discountedSubtotal >= freeThreshold) ? 0 : OKIO_DATA.brand.standardShippingFee;
        const total = discountedSubtotal + shipping;
        const amountNeededForFreeShipping = Math.max(0, freeThreshold - discountedSubtotal);

        return {
            itemsCount,
            subtotal,
            discount,
            shipping,
            total,
            freeThreshold,
            amountNeededForFreeShipping,
            hasFreeShipping: (shipping === 0 && subtotal > 0),
            promo: this.appliedPromo
        };
    }

    applyPromoCode(codeStr) {
        const code = codeStr.trim().toUpperCase();
        const promo = OKIO_DATA.brand.promoCodes[code];
        if (!promo) {
            return { success: false, message: 'Invalid promo code. Use OKIOFIRST for 10% off.' };
        }

        const totals = this.getTotals();
        if (totals.subtotal < promo.minOrder) {
            return { success: false, message: `Add ₹${promo.minOrder - totals.subtotal} more to apply this code.` };
        }

        this.savePromo({ code, ...promo });
        this.trackEvent('promo_applied', { code });
        return { success: true, message: `Promo applied: ${promo.label}` };
    }

    removePromo() {
        this.savePromo(null);
    }

    // --- UI INJECTION & RENDERING ---
    ensureDOMStructure() {
        // Ensure Toast Container
        if (!document.getElementById('okio-toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'okio-toast-container';
            toastContainer.className = 'okio-toast-container';
            document.body.appendChild(toastContainer);
        }

        // Ensure Cart Overlay & Drawer
        if (!document.getElementById('cart-drawer')) {
            const drawerHTML = `
                <div class="cart-drawer-overlay" id="cart-overlay"></div>
                <div class="cart-drawer" id="cart-drawer" role="dialog" aria-label="Shopping Cart">
                    <div class="cart-drawer-header">
                        <div class="header-title-box">
                            <h2>Your Stash</h2>
                            <span class="drawer-item-count" id="drawer-item-count">0 items</span>
                        </div>
                        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close Cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Shipping Progress Meter -->
                    <div class="free-shipping-meter" id="free-shipping-meter">
                        <div class="meter-text" id="meter-text">Add ₹999 for Free Express Delivery</div>
                        <div class="meter-bar-track">
                            <div class="meter-bar-fill" id="meter-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>

                    <div class="cart-drawer-body">
                        <!-- Empty State -->
                        <div class="cart-empty-state" id="cart-empty">
                            <div class="empty-icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <h3>YOUR CART IS EMPTY.</h3>
                            <p>Looks like you haven't found your OKIO yet.</p>
                            <a href="shop.html" class="btn btn-primary btn-empty-shop">SHOP OKIO</a>
                        </div>

                        <!-- Items List -->
                        <div class="cart-items-list" id="cart-items-container"></div>
                    </div>

                    <div class="cart-drawer-footer" id="cart-footer">
                        <div class="cart-summary-row">
                            <span>Subtotal</span>
                            <span id="cart-subtotal" class="summary-val">₹0</span>
                        </div>
                        <div class="cart-summary-row" id="drawer-discount-row" style="display: none;">
                            <span>Discount (<span id="drawer-discount-code"></span>)</span>
                            <span id="drawer-discount-amount" class="summary-val discount-val">-₹0</span>
                        </div>
                        <div class="cart-summary-row">
                            <span>Shipping</span>
                            <span id="cart-shipping-val" class="summary-val">Calculated next</span>
                        </div>
                        <div class="cart-summary-row total-row">
                            <span>Total</span>
                            <span id="cart-total-val" class="summary-val total-price">₹0</span>
                        </div>
                        <div class="drawer-actions">
                            <a href="checkout.html" class="btn btn-primary btn-drawer-checkout" id="drawer-checkout-btn">
                                CHECKOUT • <span id="checkout-btn-price">₹0</span>
                            </a>
                            <button class="btn-continue-shopping" id="drawer-continue-btn">CONTINUE SHOPPING</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
        }

        // Ensure Search Modal
        if (!document.getElementById('search-modal')) {
            const searchHTML = `
                <div class="search-modal-overlay" id="search-overlay"></div>
                <div class="search-modal" id="search-modal" role="dialog" aria-label="Search OKIO">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" id="global-search-input" placeholder="Search flavors, benefits, or ingredients... (e.g. Yerba Mate, Focus, Citrus)" autocomplete="off">
                        <button class="search-close-btn" id="search-close-btn" aria-label="Close Search">✕</button>
                    </div>
                    <div class="search-results-box" id="search-results-box">
                        <div class="search-quick-tags">
                            <span>Popular:</span>
                            <button class="search-tag" data-query="Yerba Mate">Yerba Mate</button>
                            <button class="search-tag" data-query="Citrus">Citrus</button>
                            <button class="search-tag" data-query="Hibiscus">Hibiscus</button>
                            <button class="search-tag" data-query="Variety Pack">Variety Pack</button>
                        </div>
                        <div class="search-results-list" id="search-results-list"></div>
                        <div class="search-empty-state" id="search-empty" style="display: none;">
                            <h3>NOTHING FOUND.</h3>
                            <p>Try another search or explore our core signatures.</p>
                            <a href="shop.html" class="btn btn-secondary">VIEW ALL PRODUCTS</a>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', searchHTML);
        }

        // Ensure Quick-Add Modal Drawer
        if (!document.getElementById('quick-add-modal')) {
            const quickAddHTML = `
                <div class="quick-add-overlay" id="quick-add-overlay"></div>
                <div class="quick-add-sheet" id="quick-add-sheet">
                    <button class="quick-add-close" id="quick-add-close" aria-label="Close Quick Add">✕</button>
                    <div class="quick-add-content" id="quick-add-content">
                        <!-- Populated dynamically via openQuickAdd(productId) -->
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', quickAddHTML);
        }

        // Ensure Exit-Intent Modal
        if (!document.getElementById('exit-intent-modal')) {
            const exitIntentHTML = `
                <div class="exit-intent-overlay" id="exit-intent-overlay"></div>
                <div class="exit-intent-modal" id="exit-intent-modal">
                    <button class="exit-intent-close" id="exit-intent-close" aria-label="Close Modal">✕</button>
                    <div class="exit-intent-body">
                        <div class="exit-badge">INNER CIRCLE</div>
                        <h2>WAIT — BEFORE YOU GO.</h2>
                        <p>Unlock 10% off your first OKIO stash with code <strong class="promo-highlight">OKIOFIRST</strong> plus priority access to seasonal drops.</p>
                        <form class="exit-form" id="exit-intent-form" onsubmit="event.preventDefault(); return false;">
                            <input type="email" id="exit-intent-email" required placeholder="Enter your email address...">
                            <button type="submit" class="btn btn-primary">CLAIM 10% OFF</button>
                        </form>
                        <span class="exit-subtext">No spam. Only fresh drops and cognitive focus.</span>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', exitIntentHTML);
        }

        // Render current drawer content
        this.renderDrawer();
    }

    renderDrawer() {
        const cartEmpty = document.getElementById('cart-empty');
        const cartFooter = document.getElementById('cart-footer');
        const itemsContainer = document.getElementById('cart-items-container');
        const itemCountLabel = document.getElementById('drawer-item-count');
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping-val');
        const totalEl = document.getElementById('cart-total-val');
        const btnPriceEl = document.getElementById('checkout-btn-price');
        const meterText = document.getElementById('meter-text');
        const meterBarFill = document.getElementById('meter-bar-fill');
        const discountRow = document.getElementById('drawer-discount-row');
        const discountCode = document.getElementById('drawer-discount-code');
        const discountAmount = document.getElementById('drawer-discount-amount');

        if (!itemsContainer) return;

        const totals = this.getTotals();

        if (itemCountLabel) {
            itemCountLabel.textContent = `${totals.itemsCount} ${totals.itemsCount === 1 ? 'item' : 'items'}`;
        }

        // Shipping Meter
        if (meterText && meterBarFill) {
            if (totals.subtotal === 0) {
                meterText.innerHTML = `Add <strong>₹${OKIO_DATA.brand.freeShippingThreshold}</strong> for Free Express Delivery`;
                meterBarFill.style.width = '0%';
            } else if (totals.hasFreeShipping) {
                meterText.innerHTML = `<strong>Unlocked!</strong> You qualify for Free Express Delivery across India.`;
                meterBarFill.style.width = '100%';
                meterBarFill.style.background = '#a3e635';
            } else {
                const percent = Math.min(100, Math.round((totals.subtotal / totals.freeThreshold) * 100));
                meterText.innerHTML = `You're <strong>₹${totals.amountNeededForFreeShipping}</strong> away from Free Express Delivery.`;
                meterBarFill.style.width = `${percent}%`;
                meterBarFill.style.background = '#ffffff';
            }
        }

        if (this.cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartFooter) cartFooter.style.display = 'none';
            itemsContainer.innerHTML = '';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';

        // Render line items
        itemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item-row" data-id="${item.id}">
                <div class="cart-item-img-box" style="border-color: ${item.accentColor}33">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="item-header-row">
                        <h4>${item.name}</h4>
                        <button class="cart-remove-btn" onclick="window.okioStore.removeItem('${item.id}')" aria-label="Remove item">
                            ✕
                        </button>
                    </div>
                    <div class="item-variant-label">${item.packLabel} ${item.isSubscription ? '• Monthly' : ''}</div>
                    <div class="item-price-stepper-row">
                        <div class="cart-stepper">
                            <button class="stepper-btn" onclick="window.okioStore.updateQty('${item.id}', ${item.qty - 1})" aria-label="Decrease quantity">−</button>
                            <span class="stepper-val">${item.qty}</span>
                            <button class="stepper-btn" onclick="window.okioStore.updateQty('${item.id}', ${item.qty + 1})" aria-label="Increase quantity">+</button>
                        </div>
                        <div class="item-line-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Summary calculations
        if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
        if (discountRow) {
            if (totals.discount > 0) {
                discountRow.style.display = 'flex';
                discountCode.textContent = totals.promo.code;
                discountAmount.textContent = `-₹${totals.discount.toLocaleString('en-IN')}`;
            } else {
                discountRow.style.display = 'none';
            }
        }
        if (shippingEl) {
            shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
            if (totals.shipping === 0) shippingEl.classList.add('free-highlight');
            else shippingEl.classList.remove('free-highlight');
        }
        if (totalEl) totalEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;
        if (btnPriceEl) btnPriceEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;
    }

    updateCartBadge() {
        const counts = document.querySelectorAll('.cart-count-badge');
        const totals = this.getTotals();
        counts.forEach(el => {
            el.textContent = totals.itemsCount;
            el.style.transform = 'scale(1.3)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
        });
    }

    openCart() {
        const overlay = document.getElementById('cart-overlay');
        const drawer = document.getElementById('cart-drawer');
        if (overlay && drawer) {
            overlay.classList.add('active');
            drawer.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }

    closeCart() {
        const overlay = document.getElementById('cart-overlay');
        const drawer = document.getElementById('cart-drawer');
        if (overlay && drawer) {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- QUICK ADD MODAL ---
    openQuickAdd(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const content = document.getElementById('quick-add-content');
        const overlay = document.getElementById('quick-add-overlay');
        const sheet = document.getElementById('quick-add-sheet');

        if (!content || !overlay || !sheet) return;

        content.innerHTML = `
            <div class="qa-header">
                <div class="qa-thumb">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="qa-meta">
                    <span class="qa-badge" style="color: ${product.accentColor}">${product.flavor}</span>
                    <h3>${product.name}</h3>
                    <p class="qa-desc">${product.shortDesc}</p>
                </div>
            </div>
            <div class="qa-pack-selection">
                <label class="qa-section-label">Select Pack Size</label>
                <div class="qa-pack-grid">
                    ${product.packSizes.map((pack, idx) => `
                        <div class="qa-pack-option ${idx === 2 ? 'active' : ''}" data-pack-id="${pack.id}" data-price="${pack.price}">
                            <div class="qa-pack-title">${pack.label}</div>
                            <div class="qa-pack-price">₹${pack.price}</div>
                            ${pack.saveText ? `<div class="qa-pack-save">${pack.saveText}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="qa-actions">
                <div class="qa-qty-control">
                    <button class="qa-qty-btn" id="qa-qty-minus">−</button>
                    <span class="qa-qty-val" id="qa-qty-val">1</span>
                    <button class="qa-qty-btn" id="qa-qty-plus">+</button>
                </div>
                <button class="btn btn-primary qa-submit-btn" id="qa-submit-btn">
                    ADD TO STASH • <span id="qa-btn-price">₹${product.packSizes[2] ? product.packSizes[2].price : product.packSizes[0].price}</span>
                </button>
            </div>
        `;

        overlay.classList.add('active');
        sheet.classList.add('active');
        document.body.classList.add('no-scroll');

        // Bind quick add interactions
        let selectedPackId = product.packSizes[2] ? product.packSizes[2].id : product.packSizes[0].id;
        let selectedPrice = product.packSizes[2] ? product.packSizes[2].price : product.packSizes[0].price;
        let currentQty = 1;

        const packOptions = content.querySelectorAll('.qa-pack-option');
        const qtyVal = content.getElementById('qa-qty-val');
        const btnPrice = content.getElementById('qa-btn-price');
        const submitBtn = content.getElementById('qa-submit-btn');

        packOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                packOptions.forEach(p => p.classList.remove('active'));
                opt.classList.add('active');
                selectedPackId = opt.dataset.packId;
                selectedPrice = parseInt(opt.dataset.price, 10);
                if (btnPrice) btnPrice.textContent = `₹${(selectedPrice * currentQty).toLocaleString('en-IN')}`;
            });
        });

        content.getElementById('qa-qty-minus').addEventListener('click', () => {
            if (currentQty > 1) {
                currentQty--;
                qtyVal.textContent = currentQty;
                if (btnPrice) btnPrice.textContent = `₹${(selectedPrice * currentQty).toLocaleString('en-IN')}`;
            }
        });

        content.getElementById('qa-qty-plus').addEventListener('click', () => {
            currentQty++;
            qtyVal.textContent = currentQty;
            if (btnPrice) btnPrice.textContent = `₹${(selectedPrice * currentQty).toLocaleString('en-IN')}`;
        });

        submitBtn.addEventListener('click', () => {
            this.addToCart(product.id, selectedPackId, currentQty);
            this.closeQuickAdd();
        });
    }

    closeQuickAdd() {
        const overlay = document.getElementById('quick-add-overlay');
        const sheet = document.getElementById('quick-add-sheet');
        if (overlay && sheet) {
            overlay.classList.remove('active');
            sheet.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- SEARCH OVERLAY ---
    openSearch() {
        const overlay = document.getElementById('search-overlay');
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('global-search-input');
        if (overlay && modal) {
            overlay.classList.add('active');
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
            if (input) {
                input.value = '';
                setTimeout(() => input.focus(), 100);
                this.performSearch('');
            }
        }
    }

    closeSearch() {
        const overlay = document.getElementById('search-overlay');
        const modal = document.getElementById('search-modal');
        if (overlay && modal) {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    performSearch(queryStr) {
        const query = queryStr.trim().toLowerCase();
        const resultsContainer = document.getElementById('search-results-list');
        const emptyState = document.getElementById('search-empty');

        if (!resultsContainer || !emptyState) return;

        if (!query) {
            // Show all products by default
            const all = OKIO_DATA.products;
            this.renderSearchResults(all, resultsContainer, emptyState);
            return;
        }

        const matches = OKIO_DATA.products.filter(p => {
            return p.name.toLowerCase().includes(query) ||
                   p.flavor.toLowerCase().includes(query) ||
                   p.shortDesc.toLowerCase().includes(query) ||
                   p.tag.toLowerCase().includes(query) ||
                   p.ingredients.toLowerCase().includes(query);
        });

        this.renderSearchResults(matches, resultsContainer, emptyState);
    }

    renderSearchResults(items, container, emptyEl) {
        if (items.length === 0) {
            container.innerHTML = '';
            emptyEl.style.display = 'block';
            return;
        }

        emptyEl.style.display = 'none';
        container.innerHTML = items.map(p => `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${p.slug}'">
                <img src="${p.image}" alt="${p.name}" class="res-thumb">
                <div class="res-info">
                    <span class="res-badge" style="color: ${p.accentColor}">${p.flavor}</span>
                    <h4>${p.name}</h4>
                    <p>${p.shortDesc}</p>
                </div>
                <div class="res-action">
                    <span class="res-price">From ₹${p.packSizes[0].price}</span>
                    <span class="res-link">View Can →</span>
                </div>
            </div>
        `).join('');
    }

    // --- EXIT INTENT ---
    initExitIntent() {
        let shown = sessionStorage.getItem('okio_exit_intent_shown');
        if (shown) return;

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 20 && !sessionStorage.getItem('okio_exit_intent_shown') && this.cart.length > 0) {
                sessionStorage.setItem('okio_exit_intent_shown', 'true');
                this.openExitIntent();
            }
        });
    }

    openExitIntent() {
        const overlay = document.getElementById('exit-intent-overlay');
        const modal = document.getElementById('exit-intent-modal');
        if (overlay && modal) {
            overlay.classList.add('active');
            modal.classList.add('active');
        }
    }

    closeExitIntent() {
        const overlay = document.getElementById('exit-intent-overlay');
        const modal = document.getElementById('exit-intent-modal');
        if (overlay && modal) {
            overlay.classList.remove('active');
            modal.classList.remove('active');
        }
    }

    // --- TOAST ALERTS ---
    showToast(message, duration = 3000) {
        const container = document.getElementById('okio-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'okio-toast';
        toast.innerHTML = `
            <span class="toast-dot"></span>
            <span class="toast-message">${message}</span>
        `;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // --- ANALYTICS PIPELINE ---
    initAnalytics() {
        window.OKIO_ANALYTICS = {
            events: [],
            track: (name, data = {}) => {
                const eventPayload = {
                    event: name,
                    timestamp: new Date().toISOString(),
                    path: window.location.pathname,
                    ...data
                };
                this.trackEvent(name, data);
            }
        };
    }

    trackEvent(name, data = {}) {
        const eventPayload = {
            event: name,
            timestamp: new Date().toISOString(),
            ...data
        };
        if (window.OKIO_ANALYTICS && window.OKIO_ANALYTICS.events) {
            window.OKIO_ANALYTICS.events.push(eventPayload);
        }
        console.log(`[OKIO Analytics] Event: ${name}`, data);
    }

    // --- GLOBAL EVENT BINDINGS ---
    bindGlobalEvents() {
        // Cart trigger buttons
        document.addEventListener('click', (e) => {
            const cartTrigger = e.target.closest('#cart-trigger, .cart-trigger, [data-open-cart]');
            if (cartTrigger) {
                e.preventDefault();
                this.openCart();
            }

            const cartClose = e.target.closest('#cart-close-btn, #cart-overlay, #drawer-continue-btn');
            if (cartClose) {
                e.preventDefault();
                this.closeCart();
            }

            // Quick add close
            const qaClose = e.target.closest('#quick-add-close, #quick-add-overlay');
            if (qaClose) {
                e.preventDefault();
                this.closeQuickAdd();
            }

            // Search open/close
            const searchTrigger = e.target.closest('#search-trigger, .search-trigger, [data-open-search]');
            if (searchTrigger) {
                e.preventDefault();
                this.openSearch();
            }

            const searchClose = e.target.closest('#search-close-btn, #search-overlay');
            if (searchClose) {
                e.preventDefault();
                this.closeSearch();
            }

            // Search tag pill click
            const searchTag = e.target.closest('.search-tag');
            if (searchTag) {
                const query = searchTag.dataset.query;
                const input = document.getElementById('global-search-input');
                if (input) {
                    input.value = query;
                    this.performSearch(query);
                }
            }

            // Exit intent close
            const exitClose = e.target.closest('#exit-intent-close, #exit-intent-overlay');
            if (exitClose) {
                e.preventDefault();
                this.closeExitIntent();
            }

            // Direct Add to Cart buttons with attributes data-add-id
            const addBtn = e.target.closest('[data-add-id]');
            if (addBtn) {
                e.preventDefault();
                const prodId = addBtn.dataset.addId;
                const packId = addBtn.dataset.packId || 'pack-12';
                const qty = parseInt(addBtn.dataset.qty || '1', 10);
                this.addToCart(prodId, packId, qty);
            }

            // Quick Add sheet trigger
            const quickAddBtn = e.target.closest('[data-quick-add]');
            if (quickAddBtn) {
                e.preventDefault();
                const prodId = quickAddBtn.dataset.quickAdd;
                this.openQuickAdd(prodId);
            }
        });

        // Search live filter
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Global hotkey Cmd/Ctrl + K for search & Esc to close drawers
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            if (e.key === 'Escape') {
                this.closeCart();
                this.closeQuickAdd();
                this.closeSearch();
                this.closeExitIntent();
            }
        });

        // Exit intent form submit
        const exitForm = document.getElementById('exit-intent-form');
        if (exitForm) {
            exitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('exit-intent-email').value;
                this.trackEvent('newsletter_signup', { email, source: 'exit_intent' });
                this.applyPromoCode('OKIOFIRST');
                this.showToast('Code OKIOFIRST applied! Enjoy 10% off your stash.');
                this.closeExitIntent();
                this.openCart();
            });
        }

        // Mobile header drawer toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
                if (mobileNav.classList.contains('active')) {
                    document.body.classList.add('no-scroll');
                } else {
                    document.body.classList.remove('no-scroll');
                }
            });

            // Close on link click
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }

        // Initialize exit intent trigger
        this.initExitIntent();
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.okioStore = new OkioStore();
});
