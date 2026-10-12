
import { productsArray, brandArray } from "./data/products.js";

// ==================================================
// 1. DOM ELEMENTS
// ==================================================

const brandFilters = document.querySelector("#brandFilters");
const storageFilters = document.querySelector("#storageFilters");
const brandsliders = document.querySelector("#brandsliders");

const minPriceInput = document.querySelector("#minPrice");
const maxPriceInput = document.querySelector("#maxPrice");
const ratingFilter = document.querySelector("#ratingFilter");
const clearFiltersButton = document.querySelector("#clearFilters");

const recentSection = document.querySelector(".recent-section");
const recentProductsContainer = document.querySelector("#recentProducts");
const recentPrev = document.querySelector("#recentPrev");
const recentNext = document.querySelector("#recentNext");

const shopProducts = document.querySelector(".shop-products");

// ==================================================
// 2. FILTER STATE
// ==================================================

const filterState = {
    brand: "All Phones",
    storage: [],
    minPrice: "",
    maxPrice: "",
    rating: false
};

const storageOptions = ["128gb", "256gb", "512gb"];

const RECENT_KEY = "recentlyVisited";
const MAX_RECENT_PRODUCTS = 10;

// ==================================================
// 3. FLATTEN ALL PRODUCTS
// ==================================================

const allProducts = productsArray.flatMap(
    brand => brand.products
);


// 4. CREATE PRODUCT CARD
// ==================================================

function createProductCard(product) {
    return `
        <article
            class="product-card"
            data-product-id="${product.productId}"
        >
            <div class="product-image">
                <img
                    src="${product.image || ""}"
                    alt="${product.varName}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <p>${product.varName.trim()}</p>

                <span>⭐ ${product.rating}</span>

                <h3>
                    ₹ ${Number(product.price).toLocaleString("en-IN")}
                </h3>

                <button
                    type="button"
                    class="view-product"
                    data-product-id="${product.productId}"
                >
                    View Product
                </button>
            </div>
        </article>
    `;
}

// ==================================================
// 5. CREATE BRAND SECTION
// ==================================================

function createBrandSection(brand) {
    return `
        <section
            class="brand-section"
            data-brand="${brand.brand}"
        >
            <div class="section-header">
                <h2>${brand.brand}</h2>

                <div class="slider-buttons">
                    <button
                        type="button"
                        class="brand-prev"
                        aria-label="Previous ${brand.brand} products"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        class="brand-next"
                        aria-label="Next ${brand.brand} products"
                    >
                        →
                    </button>
                </div>
            </div>

            <div class="product-slider">
                ${brand.products.map(createProductCard).join("")}
            </div>
        </section>
    `;
}

// ==================================================
// 6. RENDER BRAND FILTERS
// ==================================================

function renderBrandFilters() {
    brandFilters.innerHTML = brandArray.map(brand => `
        <label class="filter-option">
            <input
                type="radio"
                name="brand"
                value="${brand.title}"
                ${filterState.brand === brand.title ? "checked" : ""}
            >

            ${brand.title}
        </label>
    `).join("");
}

// ==================================================
// 7. RENDER STORAGE FILTERS
// ==================================================

function renderStorageFilters() {
    storageFilters.innerHTML = storageOptions.map(storage => `
        <label class="filter-option">
            <input
                type="checkbox"
                name="storage"
                value="${storage}"
                ${filterState.storage.includes(storage) ? "checked" : ""}
            >

            ${storage.toUpperCase()}
        </label>
    `).join("");
}

// ==================================================
// 8. GET PRODUCT STORAGE
// ==================================================

function getProductStorage(product) {
    const storage = product.storage ?? [];

    const storageArray = Array.isArray(storage)
        ? storage
        : [storage];

    return storageArray.map(value =>
        String(value).trim().toLowerCase()
    );
}

// ==================================================
// 9. FILTER PRODUCTS
// ==================================================

function getFilteredBrands() {
    return productsArray
        .map(brand => {

            // BRAND FILTER
            // "iPhones" in the UI corresponds to "iPhone" in data.

            const matchesBrand =
                filterState.brand === "All Phones" ||
                (
                    filterState.brand === "iPhones"
                        ? brand.brand.toLowerCase() === "iphone"
                        : brand.brand.toLowerCase() ===
                          filterState.brand.toLowerCase()
                );

            if (!matchesBrand) {
                return null;
            }

            // FILTER PRODUCTS WITHIN THIS BRAND

            const filteredProducts = brand.products.filter(product => {

                // STORAGE FILTER
                const productStorage = getProductStorage(product);

                const matchesStorage =
                    filterState.storage.length === 0 ||
                    filterState.storage.some(storage =>
                        productStorage.includes(storage)
                    );

                // MINIMUM PRICE FILTER
                const price = Number(product.price);

                const matchesMinPrice =
                    filterState.minPrice === "" ||
                    price >= Number(filterState.minPrice);

                // MAXIMUM PRICE FILTER
                const matchesMaxPrice =
                    filterState.maxPrice === "" ||
                    price <= Number(filterState.maxPrice);

                // CUSTOMER RATING FILTER
                const matchesRating =
                    !filterState.rating ||
                    Number(product.rating) >= 4;

                // COMBINE ALL CONDITIONS
                return (
                    matchesStorage &&
                    matchesMinPrice &&
                    matchesMaxPrice &&
                    matchesRating
                );
            });

            return {
                ...brand,
                products: filteredProducts
            };
        })

        // HIDE UNSELECTED BRANDS AND EMPTY SECTIONS
        .filter(brand =>
            brand !== null &&
            brand.products.length > 0
        );
}

// ==================================================
// 10. REUSABLE SLIDER
// ==================================================

function setupSlider(section, prevButton, nextButton) {
    const slider = section?.querySelector(".product-slider");

    if (!slider) return;

    function getScrollAmount() {
        const card = slider.querySelector(".product-card");

        if (!card) return 0;

        const sliderStyle = getComputedStyle(slider);
        const gap = parseFloat(sliderStyle.gap) || 0;

        return card.getBoundingClientRect().width + gap;
    }

    nextButton?.addEventListener("click", () => {
        slider.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });
    });

    prevButton?.addEventListener("click", () => {
        slider.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    });
}

// ==================================================
// 11. INITIALIZE BRAND SLIDERS
// ==================================================

function setupBrandSliders() {
    const sections = brandsliders.querySelectorAll(".brand-section");

    sections.forEach(section => {
        const prevButton = section.querySelector(".brand-prev");
        const nextButton = section.querySelector(".brand-next");

        setupSlider(section, prevButton, nextButton);
    });
}

// ==================================================
// 12. RENDER BRAND SECTIONS
// ==================================================

function renderBrandSections(brands) {
    if (brands.length === 0) {
        brandsliders.innerHTML = `
            <p class="no-products">
                No products match your selected filters.
            </p>
        `;
        return;
    }

    brandsliders.innerHTML = brands
        .map(createBrandSection)
        .join("");

    // New buttons need new event listeners.
    setupBrandSliders();
}

// ==================================================
// 13. APPLY FILTERS
// ==================================================

function applyFilters() {
    const filteredBrands = getFilteredBrands();

    renderBrandSections(filteredBrands);
}

// ==================================================
// 14. BRAND FILTER EVENT
// ==================================================

brandFilters.addEventListener("change", event => {
    if (event.target.name !== "brand") return;

    filterState.brand = event.target.value;

    applyFilters();
});

// ==================================================
// 15. STORAGE FILTER EVENT
// ==================================================

storageFilters.addEventListener("change", event => {
    if (event.target.name !== "storage") return;

    const selectedStorage = event.target.value.toLowerCase();

    if (event.target.checked) {
        if (!filterState.storage.includes(selectedStorage)) {
            filterState.storage.push(selectedStorage);
        }
    } else {
        filterState.storage = filterState.storage.filter(
            storage => storage !== selectedStorage
        );
    }

    applyFilters();
});

// ==================================================
// 16. PRICE FILTER EVENTS
// ==================================================

minPriceInput.addEventListener("input", event => {
    filterState.minPrice = event.target.value;
    applyFilters();
});

maxPriceInput.addEventListener("input", event => {
    filterState.maxPrice = event.target.value;
    applyFilters();
});

// ==================================================
// 17. RATING FILTER EVENT
// ==================================================

ratingFilter.addEventListener("change", event => {
    filterState.rating = event.target.checked;

    applyFilters();
});

// ==================================================
// 18. CLEAR ALL FILTERS
// ==================================================

clearFiltersButton.addEventListener("click", () => {
    filterState.brand = "All Phones";
    filterState.storage = [];
    filterState.minPrice = "";
    filterState.maxPrice = "";
    filterState.rating = false;

    minPriceInput.value = "";
    maxPriceInput.value = "";
    ratingFilter.checked = false;

    renderBrandFilters();
    renderStorageFilters();

    applyFilters();
});

// ==================================================
// 19. LOAD RECENTLY VISITED PRODUCTS
// ==================================================

function loadRecentlyVisited() {
    try {
        const storedProducts = JSON.parse(
            localStorage.getItem(RECENT_KEY) || "[]"
        );

        if (!Array.isArray(storedProducts)) {
            return [];
        }

        // Resolve stored IDs against current product data.
        return storedProducts
            .map(item =>
                allProducts.find(
                    product =>
                        product.productId === item.productId
                )
            )
            .filter(Boolean)
            .slice(0, MAX_RECENT_PRODUCTS);

    } catch (error) {
        console.error(
            "Could not load recently visited products:",
            error
        );

        return [];
    }
}

let recentlyVisited = loadRecentlyVisited();

// ==================================================
// 20. SAVE RECENTLY VISITED PRODUCTS
// ==================================================

function saveRecentlyVisited() {
    try {
        localStorage.setItem(
            RECENT_KEY,
            JSON.stringify(recentlyVisited)
        );
    } catch (error) {
        console.error(
            "Could not save recently visited products:",
            error
        );
    }
}

// ==================================================
// 21. RENDER RECENTLY VISITED PRODUCTS
// ==================================================

function renderRecentlyVisited() {
    recentProductsContainer.innerHTML =
        recentlyVisited.length > 0
            ? recentlyVisited.map(createProductCard).join("")
            : `
                <p class="no-products">
                    No recently visited products yet.
                </p>
            `;
}

// ==================================================
// 22. PRODUCT CLICK EVENT DELEGATION
// ==================================================

shopProducts.addEventListener("click", event => {
    const button = event.target.closest(".view-product");

    if (!button) return;

    const productId = button.dataset.productId;

    const clickedProduct = allProducts.find(
        product => product.productId === productId
    );

    if (!clickedProduct) return;

    // Remove duplicate visit.
    recentlyVisited = recentlyVisited.filter(
        product => product.productId !== productId
    );

    // Add the latest visit at the beginning.
    recentlyVisited.unshift(clickedProduct);

    // Limit history to ten products.
    recentlyVisited = recentlyVisited.slice(
        0,
        MAX_RECENT_PRODUCTS
    );

    saveRecentlyVisited();
    renderRecentlyVisited();

    // Product-details navigation can be added here.
});

// ==================================================
// 23. RECENT PRODUCTS SLIDER
// ==================================================

setupSlider(
    recentSection,
    recentPrev,
    recentNext
);

// ==================================================
// 24. INITIALIZE THE SHOP
// ==================================================

renderBrandFilters();
renderStorageFilters();

applyFilters();
renderRecentlyVisited();
