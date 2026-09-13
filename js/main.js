/**
 * OKIO Master Interaction Script
 * Minimal loader, compact header scroll, 3D card tilt micro-interaction,
 * newsletter handling, and page-specific dynamic rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. MINIMAL LOADER ENGINE (Section 28)
    // -------------------------------------------------------------
    const loader = document.getElementById('okio-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
            }, 650);
        });
        // Fallback if load already fired
        setTimeout(() => {
            if (!loader.classList.contains('loaded')) {
                loader.classList.add('loaded');
            }
        }, 1200);
    }

    // -------------------------------------------------------------
    // 2. HEADER SCROLL DETECTION (Section 39)
    // -------------------------------------------------------------
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // -------------------------------------------------------------
    // 3. PRODUCT CARD 3D TILT MICRO-INTERACTION (Section 10 & 27)
    // -------------------------------------------------------------
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        initProductCardTilt();
    }

    function initProductCardTilt() {
        document.querySelectorAll('.product-card, .tilt-target').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // -------------------------------------------------------------
    // 4. HERO PARALLAX ON CURSOR (Section 6)
    // -------------------------------------------------------------
    const heroVisual = document.getElementById('hero-can-wrapper');
    if (heroVisual && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 45;
            const y = (e.clientY - window.innerHeight / 2) / 45;
            heroVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    // -------------------------------------------------------------
    // 5. INGREDIENT CARD ACCORDION EXPANSION (Section 11)
    // -------------------------------------------------------------
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            document.querySelectorAll('.ingredient-card').forEach(c => c.classList.remove('active'));
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 6. GENERAL NEWSLETTER CAPTURE (Section 41)
    // -------------------------------------------------------------
    document.querySelectorAll('.newsletter-form, #footer-newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                if (window.okioStore) {
                    window.okioStore.trackEvent('newsletter_signup', { email: input.value, source: 'footer' });
                    window.okioStore.showToast("Welcome to the OKIO Inner Circle. Drop details sent.");
                } else {
                    alert("Welcome to OKIO. Drop details sent.");
                }
                input.value = '';
            }
        });
    });

    // -------------------------------------------------------------
    // 7. PDP (PRODUCT DETAIL PAGE) CONTROLLER (Section 19 & 20)
    // -------------------------------------------------------------
    if (document.getElementById('pdp-container')) {
        initProductDetailPage();
    }

    function initProductDetailPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'yerba-mate-citrus';
        const product = getProductById(productId);

        if (!product) return;

        // Set document title
        document.title = `${product.name} | OKIO Functional Beverage`;

        // Populate elements
        const titleEl = document.getElementById('pdp-title');
        const flavorTagEl = document.getElementById('pdp-flavor-tag');
        const shortDescEl = document.getElementById('pdp-short-desc');
        const mainImgEl = document.getElementById('pdp-main-image');
        const thumbsContainer = document.getElementById('pdp-thumbs-container');
        const flavorSwitcher = document.getElementById('pdp-flavor-options');
        const packGrid = document.getElementById('pdp-pack-grid');
        const priceCurrent = document.getElementById('pdp-price-current');
        const priceCompare = document.getElementById('pdp-price-compare');
        const saveBadge = document.getElementById('pdp-save-badge');
        const stickyPrice = document.getElementById('sticky-pdp-price');
        const ingredientsText = document.getElementById('pdp-ingredients-text');
        const nutritionBody = document.getElementById('pdp-nutrition-body');

        if (titleEl) titleEl.textContent = product.name;
        if (flavorTagEl) {
            flavorTagEl.textContent = product.flavor;
            flavorTagEl.style.color = product.accentColor;
        }
        if (shortDescEl) shortDescEl.textContent = product.longDesc;
        if (mainImgEl) mainImgEl.src = product.image;
        if (ingredientsText) ingredientsText.textContent = product.ingredients;

        // Populate Nutrition table
        if (nutritionBody && product.nutritionFacts) {
            nutritionBody.innerHTML = Object.entries(product.nutritionFacts).map(([key, val]) => `
                <tr>
                    <td>${formatNutritionKey(key)}</td>
                    <td><strong>${val}</strong></td>
                </tr>
            `).join('');
        }

        // Populate Thumbnails
        if (thumbsContainer && product.gallery) {
            thumbsContainer.innerHTML = product.gallery.map((imgSrc, idx) => `
                <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}">
                    <img src="${imgSrc}" alt="${product.name} angle ${idx + 1}">
                </div>
            `).join('');

            thumbsContainer.querySelectorAll('.pdp-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    thumbsContainer.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    if (mainImgEl) mainImgEl.src = thumb.dataset.src;
                });
            });
        }

        // Lightbox Zoom
        const lightbox = document.getElementById('pdp-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const mainImgWrap = document.getElementById('pdp-main-image-wrap');
        if (mainImgWrap && lightbox && lightboxImg) {
            mainImgWrap.addEventListener('click', () => {
                lightboxImg.src = mainImgEl.src;
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            });
            document.getElementById('lightbox-close').addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        }

        // Flavor Switcher buttons
        if (flavorSwitcher) {
            flavorSwitcher.innerHTML = OKIO_DATA.products.map(p => `
                <button class="pdp-flavor-btn ${p.id === product.id ? 'active' : ''}" onclick="window.location.href='product.html?id=${p.slug}'">
                    ${p.shortName}
                </button>
            `).join('');
        }

        // Pack sizes selection
        let selectedPack = product.packSizes[2] || product.packSizes[0];
        let currentQty = 1;

        function updatePricing() {
            if (priceCurrent) priceCurrent.textContent = `₹${selectedPack.price.toLocaleString('en-IN')}`;
            if (stickyPrice) stickyPrice.textContent = `₹${(selectedPack.price * currentQty).toLocaleString('en-IN')}`;
            if (selectedPack.comparePrice) {
                if (priceCompare) {
                    priceCompare.textContent = `₹${selectedPack.comparePrice.toLocaleString('en-IN')}`;
                    priceCompare.style.display = 'inline';
                }
                if (saveBadge && selectedPack.saveText) {
                    saveBadge.textContent = selectedPack.saveText;
                    saveBadge.style.display = 'inline-block';
                }
            } else {
                if (priceCompare) priceCompare.style.display = 'none';
                if (saveBadge) saveBadge.style.display = 'none';
            }
        }

        if (packGrid) {
            packGrid.innerHTML = product.packSizes.map(pack => `
                <div class="pdp-pack-card ${pack.id === selectedPack.id ? 'active' : ''}" data-pack-id="${pack.id}">
                    <div class="pdp-pack-header">
                        <span class="pdp-pack-name">${pack.label}</span>
                        <span class="pdp-pack-price">₹${pack.price}</span>
                    </div>
                    ${pack.saveText ? `<div class="pdp-pack-subtext">${pack.saveText}</div>` : ''}
                </div>
            `).join('');

            packGrid.querySelectorAll('.pdp-pack-card').forEach(card => {
                card.addEventListener('click', () => {
                    packGrid.querySelectorAll('.pdp-pack-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    const packId = card.dataset.packId;
                    selectedPack = product.packSizes.find(p => p.id === packId);
                    updatePricing();
                    if (window.okioStore) {
                        window.okioStore.trackEvent('variant_selected', {
                            product_id: product.id,
                            pack_id: packId,
                            price: selectedPack.price
                        });
                    }
                });
            });
        }
        updatePricing();

        // Stepper
        const qtyVal = document.getElementById('pdp-qty-val');
        document.getElementById('pdp-qty-minus')?.addEventListener('click', () => {
            if (currentQty > 1) {
                currentQty--;
                if (qtyVal) qtyVal.textContent = currentQty;
                updatePricing();
            }
        });
        document.getElementById('pdp-qty-plus')?.addEventListener('click', () => {
            currentQty++;
            if (qtyVal) qtyVal.textContent = currentQty;
            updatePricing();
        });

        // Add to Cart
        document.getElementById('pdp-add-cart-btn')?.addEventListener('click', () => {
            if (window.okioStore) {
                window.okioStore.addToCart(product.id, selectedPack.id, currentQty);
            }
        });

        // Buy Now (Immediate checkout)
        document.getElementById('pdp-buy-now-btn')?.addEventListener('click', () => {
            if (window.okioStore) {
                window.okioStore.addToCart(product.id, selectedPack.id, currentQty);
                window.location.href = 'checkout.html';
            }
        });

        // Sticky Mobile CTA
        document.getElementById('sticky-mobile-cta')?.addEventListener('click', () => {
            if (window.okioStore) {
                window.okioStore.addToCart(product.id, selectedPack.id, currentQty);
            }
        });

        // Track PDP view
        if (window.okioStore) {
            window.okioStore.trackEvent('product_viewed', {
                product_id: product.id,
                product_name: product.name,
                flavor: product.flavor
            });
        }
    }

    function formatNutritionKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    // -------------------------------------------------------------
    // 8. PDP ACCORDION CONTROLS
    // -------------------------------------------------------------
    document.querySelectorAll('.pdp-accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });
});
