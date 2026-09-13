/**
 * OKIO Brand Data Matrix
 * Central catalog of OKIO functional beverage variants, specifications, pack sizes & nutritional profiles.
 */

const OKIO_DATA = {
    brand: {
        name: "OKIO",
        tagline: "A Better Way to Refresh.",
        descriptor: "A modern functional beverage built for people who want more from what they drink.",
        supportEmail: "care@drinkokio.com",
        headquarters: "Bengaluru & Mumbai, India",
        freeShippingThreshold: 999,
        standardShippingFee: 99,
        promoCodes: {
            "OKIOFIRST": { discountPercent: 10, minOrder: 0, label: "10% First Drop Discount" },
            "FOCUS20": { discountPercent: 20, minOrder: 1200, label: "20% Multi-Pack Stash Discount" }
        }
    },
    products: [
        {
            id: "okio-yerba-mate-citrus",
            slug: "yerba-mate-citrus",
            name: "OKIO Yerba Mate + Citrus",
            shortName: "Yerba Mate + Citrus",
            flavor: "Yerba Mate + Citrus",
            badge: "Best Seller",
            tag: "Focus & Flow",
            shortDesc: "Clean green tea caffeine coupled with high-altitude yerba mate and cold-pressed lime. Sustained elevation with zero crash.",
            longDesc: "Engineered for high-output minds. OKIO Yerba Mate + Citrus pairs slow-release caffeine derived from organic green tea extract with pure Argentine yerba mate leaves and a sharp splash of fresh lime. Balanced with 100mg of L-Theanine to keep brainwaves calm, steady, and razor-sharp without the tremors of synthetic energy drinks.",
            accentColor: "#a3e635",
            accentRgb: "163, 230, 53",
            accentLabel: "Neon Lime",
            image: "assets/okio_can_yerba.jpg",
            heroImage: "assets/okio_can_yerba.jpg",
            gallery: [
                "assets/okio_can_yerba.jpg",
                "assets/okio_can.png",
                "assets/ingredient_yerba_mate.jpg",
                "assets/ingredient_citrus.jpg",
                "assets/lifestyle_focus.png"
            ],
            rating: 4.9,
            reviewCount: 342,
            category: "single-units",
            packSizes: [
                { id: "single", label: "Single Can (330ml)", units: 1, price: 120, comparePrice: null, popular: false },
                { id: "pack-6", label: "6-Pack", units: 6, price: 699, comparePrice: 720, popular: false, saveText: "Save ₹21" },
                { id: "pack-12", label: "12-Pack", units: 12, price: 1299, comparePrice: 1440, popular: true, saveText: "Most Popular • Save ₹141" },
                { id: "sub-24", label: "24-Pack Subscription", units: 24, price: 2399, comparePrice: 2880, popular: false, saveText: "Save 17% • Auto Dispatched" }
            ],
            tastingNotes: [
                "Crisp cold-pressed citrus upfront",
                "Earthy, clean yerba mate undertone",
                "Pure non-carbonated smooth mineral finish"
            ],
            functionalProfile: [
                { label: "Clean Caffeine", value: "75mg", desc: "Derived from green tea extract for steady 4-hour elevation without spikes." },
                { label: "L-Theanine Synergy", value: "100mg", desc: "Promotes alpha brain wave states for dialed-in calm concentration." },
                { label: "Electrolyte Matrix", value: "Himalayan", desc: "Pure pink salt trace minerals for genuine cellular hydration." },
                { label: "Total Added Sugar", value: "0g", desc: "No refined sugar, zero corn syrup. Naturally sweetened with real fruit extract." }
            ],
            nutritionFacts: {
                servingSize: "1 Can (330ml)",
                servingsPerContainer: "1",
                calories: "15 kcal",
                totalFat: "0g",
                sodium: "45mg",
                totalCarbs: "3.5g",
                dietaryFiber: "0g",
                totalSugars: "2.2g (Naturally occurring from fruit)",
                addedSugars: "0g",
                cleanCaffeine: "75mg",
                lTheanine: "100mg",
                potassium: "65mg"
            },
            ingredients: "Purified Water, Organic Yerba Mate Leaf Extract, Cold-Pressed Lime Juice Concentrate, Natural Green Tea Extract (Standardized to 75mg Clean Caffeine), L-Theanine, Himalayan Pink Salt, Citric Acid, Natural Flavors, Stevia Leaf Extract.",
            faq: [
                { q: "How does OKIO differ from coffee or red energy drinks?", a: "Standard energy drinks rely on 150-200mg synthetic caffeine, taurine, and high carbonation that cause bloating and severe crashes. OKIO uses 75mg organic green tea caffeine paired 1:1.3 with L-Theanine in a smooth non-carbonated base, giving calm clarity instead of nervous palpitations." },
                { q: "When should I drink OKIO Yerba Mate + Citrus?", a: "Perfect at 9:00 AM as your morning launchpad, at 2:30 PM to bypass the post-lunch slump, or 30 minutes before deep work or gym sessions." },
                { q: "Is it suitable for daily consumption?", a: "Yes. With only 75mg caffeine (equivalent to an espresso) and zero artificial preservatives or taurine, OKIO fits cleanly into everyday daily rituals." }
            ]
        },
        {
            id: "okio-hibiscus-yuzu-berry",
            slug: "hibiscus-yuzu-berry",
            name: "OKIO Hibiscus + Yuzu Berry",
            shortName: "Hibiscus + Yuzu Berry",
            flavor: "Hibiscus + Yuzu Berry",
            badge: "Staff Pick",
            tag: "Antioxidant & Clarity",
            shortDesc: "Whole brewed mountain hibiscus flowers paired with aromatic Japanese yuzu and wild berries. Tart, vibrant, and restorative.",
            longDesc: "A masterclass in botanical balance. We steep crimson hibiscus calyces to unlock vibrant anthocyanins and organic polyphenols, then combine them with the sharp aroma of yuzu fruit. Designed for extended creative workflows, calm evening output, or mid-afternoon physical replenishment.",
            accentColor: "#f43f5e",
            accentRgb: "244, 63, 94",
            accentLabel: "Crimson Berry",
            image: "assets/okio_can_hibiscus.jpg",
            heroImage: "assets/okio_can_hibiscus.jpg",
            gallery: [
                "assets/okio_can_hibiscus.jpg",
                "assets/okio_can.png",
                "assets/ingredient_citrus.jpg",
                "assets/lifestyle_gym.png"
            ],
            rating: 4.8,
            reviewCount: 289,
            category: "single-units",
            packSizes: [
                { id: "single", label: "Single Can (330ml)", units: 1, price: 120, comparePrice: null, popular: false },
                { id: "pack-6", label: "6-Pack", units: 6, price: 699, comparePrice: 720, popular: false, saveText: "Save ₹21" },
                { id: "pack-12", label: "12-Pack", units: 12, price: 1299, comparePrice: 1440, popular: true, saveText: "Most Popular • Save ₹141" },
                { id: "sub-24", label: "24-Pack Subscription", units: 24, price: 2399, comparePrice: 2880, popular: false, saveText: "Save 17% • Auto Dispatched" }
            ],
            tastingNotes: [
                "Deep floral hibiscus warmth",
                "Sharp yuzu citrus lift",
                "Subtle wild berry resonance"
            ],
            functionalProfile: [
                { label: "Antioxidant Rich", value: "Anthocyanins", desc: "Natural phytonutrients that protect against oxidative stress." },
                { label: "Balanced Lift", value: "75mg", desc: "Green tea derived caffeine for sustained mental rhythm." },
                { label: "L-Theanine Buffer", value: "100mg", desc: "Harmonizes heart rate and prevents cognitive fatigue." },
                { label: "Non-Carbonated", value: "Pure Still", desc: "Gentle on the digestive tract during workout or deep work." }
            ],
            nutritionFacts: {
                servingSize: "1 Can (330ml)",
                servingsPerContainer: "1",
                calories: "18 kcal",
                totalFat: "0g",
                sodium: "40mg",
                totalCarbs: "4g",
                dietaryFiber: "0g",
                totalSugars: "2.6g",
                addedSugars: "0g",
                cleanCaffeine: "75mg",
                lTheanine: "100mg",
                vitaminC: "30mg"
            },
            ingredients: "Purified Spring Water, Organic Hibiscus Flower Extract, Yuzu Juice, Blackberry Extract, Green Tea Caffeine (75mg), L-Theanine, Himalayan Trace Minerals, Natural Flavors, Stevia Leaf Extract.",
            faq: [
                { q: "Is the red color natural?", a: "100% natural. The vivid ruby shade comes strictly from steeped organic hibiscus petals with zero artificial colorants (no Red 40 or synthetic dyes)." },
                { q: "Can I drink this after exercise?", a: "Absolutely. With natural electrolytes and zero carbonation, it hydrates rapidly without GI discomfort." }
            ]
        },
        {
            id: "okio-ginger-white-peach",
            slug: "ginger-white-peach",
            name: "OKIO Ginger + White Peach",
            shortName: "Ginger + White Peach",
            flavor: "Ginger + White Peach",
            badge: "New Drop",
            tag: "Gut Harmony & Energy",
            shortDesc: "Cold-pressed young ginger root blended with velvety white peach juice. A warming throat kick with soothing fruit undertones.",
            longDesc: "Formulated for physical comfort and cognitive vitality. Fresh spicy gingerols provide digestive harmony and gut comfort, paired seamlessly with the delicate sweetness of ripe white peach. A modern functional tonic that feels rich, grounding, and energizing.",
            accentColor: "#f59e0b",
            accentRgb: "245, 158, 11",
            accentLabel: "Amber Gold",
            image: "assets/okio_can_peach.jpg",
            heroImage: "assets/okio_can_peach.jpg",
            gallery: [
                "assets/okio_can_peach.jpg",
                "assets/okio_can.png",
                "assets/lifestyle_focus.png"
            ],
            rating: 4.9,
            reviewCount: 194,
            category: "single-units",
            packSizes: [
                { id: "single", label: "Single Can (330ml)", units: 1, price: 120, comparePrice: null, popular: false },
                { id: "pack-6", label: "6-Pack", units: 6, price: 699, comparePrice: 720, popular: false, saveText: "Save ₹21" },
                { id: "pack-12", label: "12-Pack", units: 12, price: 1299, comparePrice: 1440, popular: true, saveText: "Most Popular • Save ₹141" },
                { id: "sub-24", label: "24-Pack Subscription", units: 24, price: 2399, comparePrice: 2880, popular: false, saveText: "Save 17% • Auto Dispatched" }
            ],
            tastingNotes: [
                "Velvety white peach aroma",
                "Warming young ginger kick",
                "Crisp, lingering botanical finish"
            ],
            functionalProfile: [
                { label: "Active Gingerol", value: "Cold-Pressed", desc: "Supports gut motility, eases stomach sensitivity, and aids digestion." },
                { label: "Clean Caffeine", value: "75mg", desc: "Natural caffeine for prolonged wakefulness." },
                { label: "L-Theanine", value: "100mg", desc: "Mental calmness and stress alleviation." },
                { label: "Microbiome Friendly", value: "Zero Sugar", desc: "Gentle non-fermenting formulation." }
            ],
            nutritionFacts: {
                servingSize: "1 Can (330ml)",
                servingsPerContainer: "1",
                calories: "16 kcal",
                totalFat: "0g",
                sodium: "42mg",
                totalCarbs: "3.8g",
                dietaryFiber: "0g",
                totalSugars: "2.4g",
                addedSugars: "0g",
                cleanCaffeine: "75mg",
                lTheanine: "100mg",
                gingerol: "12mg"
            },
            ingredients: "Purified Water, Cold-Pressed Young Ginger Juice, White Peach Puree, Green Tea Extract (75mg Clean Caffeine), L-Theanine, Himalayan Pink Salt, Ascorbic Acid, Natural Botanical Flavors.",
            faq: [
                { q: "Is the ginger flavor overpowering?", a: "No. It provides an authentic, crisp warmth in the back of the throat that complements the mellow peach flavor without burning." }
            ]
        },
        {
            id: "okio-discovery-variety-pack",
            slug: "variety-pack",
            name: "The Discovery Variety Pack",
            shortName: "The Discovery Stash",
            flavor: "All 3 Signatures (4 Cans Each)",
            badge: "Collector Edition",
            tag: "The Complete Stash",
            shortDesc: "Experience the entire OKIO spectrum. 4 cans each of Yerba Mate + Citrus, Hibiscus + Yuzu Berry, and Ginger + White Peach.",
            longDesc: "The definitive introduction to modern functional refreshment. Whether stocking your workspace mini-fridge, prepping for intense creative sprints, or sharing with your crew, The Discovery Stash delivers our complete formulation lineup in custom premium OKIO matte packaging.",
            accentColor: "#e2e8f0",
            accentRgb: "226, 232, 240",
            accentLabel: "Liquid Silver",
            image: "assets/okio_variety_pack.jpg",
            heroImage: "assets/okio_variety_pack.jpg",
            gallery: [
                "assets/okio_variety_pack.jpg",
                "assets/okio_can_yerba.jpg",
                "assets/okio_can_hibiscus.jpg",
                "assets/okio_can_peach.jpg"
            ],
            rating: 5.0,
            reviewCount: 478,
            category: "bundles",
            packSizes: [
                { id: "pack-12", label: "12-Pack (4 Cans Each Flavor)", units: 12, price: 1349, comparePrice: 1440, popular: true, saveText: "Top Rated • Save ₹91" },
                { id: "sub-24", label: "24-Pack Subscription (8 Cans Each)", units: 24, price: 2499, comparePrice: 2880, popular: false, saveText: "Save 20% • VIP Drops Access" }
            ],
            tastingNotes: [
                "4x Yerba Mate + Citrus (Crisp & Uplifting)",
                "4x Hibiscus + Yuzu Berry (Tart & Floral)",
                "4x Ginger + White Peach (Warming & Velvety)"
            ],
            functionalProfile: [
                { label: "Full Spectrum", value: "3 Profiles", desc: "Switch your functional drink to match your daily energetic cycle." },
                { label: "Clean Caffeine", value: "75mg / can", desc: "Consistent organic green tea lift across all variants." },
                { label: "L-Theanine", value: "100mg / can", desc: "Signature nootropic stack in every single sip." },
                { label: "Exclusive Packaging", value: "Matte Box", desc: "Shipped in reinforced OKIO studio delivery packaging." }
            ],
            nutritionFacts: {
                servingSize: "1 Can (330ml)",
                servingsPerContainer: "12",
                calories: "15-18 kcal",
                totalFat: "0g",
                sodium: "40-45mg",
                totalCarbs: "3.5-4g",
                dietaryFiber: "0g",
                addedSugars: "0g",
                cleanCaffeine: "75mg per can",
                lTheanine: "100mg per can"
            },
            ingredients: "Includes full ingredient profiles for Yerba Mate + Citrus, Hibiscus + Yuzu Berry, and Ginger + White Peach.",
            faq: [
                { q: "Can I customize the flavor breakdown?", a: "The standard Discovery Stash contains an even 4-4-4 split. Custom flavor splits will be available in our upcoming Build-Your-Box feature." }
            ]
        }
    ],

    lifestyleMoments: [
        {
            title: "Morning Commute",
            time: "08:30 AM",
            location: "Urban Transit • Mumbai",
            desc: "Bypass stale espresso. Step onto the platform with clear mental focus, steady hydration, and zero jitter before your first morning standup.",
            image: "assets/okio_can_yerba.jpg"
        },
        {
            title: "Deep Work Studio",
            time: "02:15 PM",
            location: "Creative Workspace • Bengaluru",
            desc: "When deadlines loom and cognitive drag sets in, the L-Theanine and clean green tea matrix keeps your brain in pristine alpha wave flow.",
            image: "assets/lifestyle_focus.png"
        },
        {
            title: "Physical Conditioning",
            time: "06:00 PM",
            location: "Athletic Club • Indiranagar",
            desc: "Non-carbonated formulation means instant cellular absorption. No gas, no stomach cramping, just pure trace-mineral hydration and kinetic drive.",
            image: "assets/lifestyle_gym.png"
        },
        {
            title: "Late Afternoon & Social",
            time: "08:30 PM",
            location: "Rooftop Gathering • Bandra",
            desc: "An intelligent, sophisticated alternative to alcohol or sugary soda. Tart yuzu berry and young ginger that feel culturally and socially elevated.",
            image: "assets/okio_variety_pack.jpg"
        }
    ],

    ingredientsShowcase: [
        {
            id: "yerba-mate",
            name: "Argentine Yerba Mate",
            tag: "Sustained Elevation",
            desc: "Harvested from selected shaded groves. Yerba mate delivers theobromine and saponins alongside caffeine for an even, smooth energetic baseline.",
            image: "assets/ingredient_yerba_mate.jpg",
            metric: "Clean Energy",
            stat: "4h Stable Curve"
        },
        {
            id: "citrus-yuzu",
            name: "Cold-Pressed Citrus & Yuzu",
            tag: "Bioactive Brightness",
            desc: "Unpasteurized citrus oils and yuzu fruit concentrate provide crisp, authentic aromatic brightness that cuts through mental fatigue.",
            image: "assets/ingredient_citrus.jpg",
            metric: "Natural Vitamin C",
            stat: "100% Real Fruit"
        },
        {
            id: "green-tea-caffeine",
            name: "Natural Green Tea Caffeine",
            tag: "75mg Organic Lift",
            desc: "Unlike synthetic petrochemical-derived caffeine used in traditional sodas, our natural plant-derived caffeine enters the bloodstream gradually.",
            image: "assets/okio_can.png",
            metric: "Sustained Intake",
            stat: "Zero Crash"
        },
        {
            id: "l-theanine",
            name: "L-Theanine Nootropic",
            tag: "Alpha Wave Induction",
            desc: "A natural amino acid that acts as a cognitive damper against nervous agitation, fostering high-acuity focus and mental ease.",
            image: "assets/lifestyle_focus.png",
            metric: "Mind Buffer",
            stat: "100mg Dose"
        }
    ],

    comparisonMatrix: [
        {
            category: "Energy Source",
            okio: "75mg organic green tea caffeine + 100mg L-Theanine",
            legacy: "160mg+ synthetic petroleum caffeine & harsh taurine"
        },
        {
            category: "Taste & Mouthfeel",
            okio: "Crisp, botanical, refreshing, completely non-carbonated",
            legacy: "Heavy syrup, chemical aftertaste, aggressive gas bloating"
        },
        {
            category: "Sugar & Sweetness",
            okio: "0g added cane sugar, lightly kissed with real fruit juices (15 kcal)",
            legacy: "28g to 45g high-fructose corn syrup (180+ empty kcal)"
        },
        {
            category: "Everyday Usability",
            okio: "Calm sustained focus ideal for desk work, meetings & workouts",
            legacy: "Short-lived hyperactive spike followed by severe 3 PM crash"
        },
        {
            category: "Design & Identity",
            okio: "Understated editorial matte black, studio lighting, modern India",
            legacy: "Loud neon graffiti, esports clichés, corporate soda branding"
        }
    ]
};

// Helper methods
function getProductById(id) {
    return OKIO_DATA.products.find(p => p.id === id || p.slug === id) || OKIO_DATA.products[0];
}

function getAllProducts() {
    return OKIO_DATA.products;
}
