import { productsArray } from "./data/products.js";


// ================================
// CREATE PRODUCT CARD
// ================================

function createProductCard(product) {

    return `
        <article 
            class="product-card"
            data-product-id="${product.productId}"
        >

            <div class="product-image">

                <img 
                    src="${product.image}"
                    alt="${product.varName}"
                >

            </div>

            <div class="product-info">

                <p>${product.varName}</p>

                <span>⭐ ${product.rating}</span>

                <h3>₹ ${product.price}</h3>

                <button 
                    class="view-product"
                    data-product-id="${product.productId}"
                >
                    View Product
                </button>

            </div>

        </article>
    `;
}


// ================================
// CREATE BRAND SECTION
// ================================

function createBrandSection(brand) {

    const productCards = brand.products.map((product) => {
        return createProductCard(product);
    });

    return `
        <section class="brand-section">

            <div class="section-header">

                <h2>${brand.brand}</h2>

                <div class="slider-buttons">

                    <button class="brand-prev">
                        ←
                    </button>

                    <button class="brand-next">
                        →
                    </button>

                </div>

            </div>

            <div class="product-slider">

                ${productCards.join("")}

            </div>

        </section>
    `;
}


// ================================
// RENDER BRANDS
// ================================

function renderBrandSections(brands) {

    const brandSections = brands.map((brand) => {
        return createBrandSection(brand);
    });

    const container =
        document.querySelector("#brandsliders");

    container.innerHTML =
        brandSections.join("");
}

renderBrandSections(productsArray);


// ================================
// ALL PRODUCTS
// ================================

const allProducts =
    productsArray.flatMap((brand) => {
        return brand.products;
    });


// ================================
// RECENTLY VISITED STATE
// ================================

const RECENT_KEY = "recentlyVisited";

let recentlyVisited = [];


// ================================
// LOAD FROM LOCAL STORAGE
// ================================

function loadRecentlyVisited() {

    const storedProducts =
        localStorage.getItem(RECENT_KEY);

    if (!storedProducts) {
        return;
    }

    try {

        recentlyVisited =
            JSON.parse(storedProducts);

    } catch (error) {

        console.log(
            "Could not load recently visited products"
        );

        recentlyVisited = [];
    }
}


// ================================
// SAVE TO LOCAL STORAGE
// ================================

function saveRecentlyVisited() {

    localStorage.setItem(
        RECENT_KEY,
        JSON.stringify(recentlyVisited)
    );
}


// ================================
// RENDER RECENT PRODUCTS
// ================================

function renderRecentlyVisited() {

    const container =
        document.querySelector("#recentProducts");

    const productCards =
        recentlyVisited.map((product) => {

            return createProductCard(product);

        });

    container.innerHTML =
        productCards.join("");
}


// ================================
// REUSABLE SLIDER
// ================================

function setupSlider(
    section,
    prevButton,
    nextButton
) {

    const slider =
        section.querySelector(".product-slider");

    if (!slider) {
        return;
    }


    const getScrollAmount = () => {

        const card =
            slider.querySelector(".product-card");

        if (!card) {
            return 0;
        }

        const gap =
            parseFloat(
                getComputedStyle(slider).gap
            );

        return card.offsetWidth + gap;
    };


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                slider.scrollBy({
                    left: getScrollAmount(),
                    behavior: "smooth"
                });

            }
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            () => {

                slider.scrollBy({
                    left: -getScrollAmount(),
                    behavior: "smooth"
                });

            }
        );

    }

}


// ================================
// BRAND SLIDERS
// ================================

const brandSections =
    document.querySelectorAll(".brand-section");

brandSections.forEach((section) => {

    const prevButton =
        section.querySelector(".brand-prev");

    const nextButton =
        section.querySelector(".brand-next");

    setupSlider(
        section,
        prevButton,
        nextButton
    );

});


// ================================
// RECENT SLIDER
// ================================

const recentSection =
    document.querySelector(".recent-section");

const recentPrev =
    document.querySelector("#recentPrev");

const recentNext =
    document.querySelector("#recentNext");

setupSlider(
    recentSection,
    recentPrev,
    recentNext
);


// ================================
// EVENT DELEGATION
// ================================

const shopProducts =
    document.querySelector(".shop-products");

shopProducts.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(".view-product");

        if (!button) {
            return;
        }


        const clickedProductId =
            button.dataset.productId;


        const clickedProduct =
            allProducts.find((product) => {

                return product.productId === clickedProductId;

            });


        if (!clickedProduct) {
            return;
        }


        // Remove duplicate
        recentlyVisited =
            recentlyVisited.filter((product) => {

                return product.productId !== clickedProductId;

            });


        // Add latest product to beginning
        recentlyVisited.unshift(
            clickedProduct
        );


        // Save
        saveRecentlyVisited();


        // Update UI
        renderRecentlyVisited();

    }
);


// ================================
// INITIAL LOAD
// ================================

loadRecentlyVisited();

renderRecentlyVisited();