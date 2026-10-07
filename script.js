
import { brandArray, productsArray } from "./js/data/products.js";



document.addEventListener("DOMContentLoaded",()=>{
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const dots = document.querySelectorAll(".dot");
 

  let currentIndex =0;
  let slideInterval;
  const intervalTime =6000;

  function updateCarousel(index){
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
     

    currentIndex = index;

    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add("active");

  }



  function nextSlide(){
    let nextIndex = currentIndex +1;
    if(nextIndex >= slides.length){
      nextIndex=0;
    }
    updateCarousel(nextIndex);
  }

  function prevSlide(){
    let prevIndex = currentIndex -1;
    if(prevIndex < 0 ){
      prevIndex =slides.length -1;

    }
    updateCarousel(prevIndex);
  }


    // Initialize and Reset the Autoplay Timer
  function startAutoplay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  // Event Listeners for Arrow Buttons
  nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay(); // Reset auto timer upon user manual interaction
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  // Event Listeners for Nav Dots Interaction
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const clickedIndex = parseInt(e.target.getAttribute('data-index'));
      if (clickedIndex !== currentIndex) {
        updateCarousel(clickedIndex);
        startAutoplay();
      }
    });
  });

  // Start Autoplay Engine on initialization
  startAutoplay();
});

const brandsec= document.querySelector('.brand-logo');
const brandwraper = document.querySelector('.brand-wrapper');

function renderBrandCard(){

 brandArray.forEach( (brandItem) =>{

  console.log(brandItem);
   const brandCard = document.createElement("div");
  brandCard.classList.add("brand-card");
   brandCard.innerHTML=`
    <img src="${brandItem.logo}" alt="${brandItem.title}" style="width:80px;">
    <h3>${brandItem.title}</h3>
   `;
   brandwraper.appendChild(brandCard);
});

}

renderBrandCard();



const topBrands =[
  {
    name:"apple",
    logo:"./assets/images/apple-logo.png"
  },
  {
    name:"samsung",
    logo:"./assets/images/samsung-logo.png"
  },
  {
    name:"oneplus",
    logo:"./assets/images/oneplus-logo.png"
  },
  {
    name:"xiaomi",
    logo:"./assets/images/xioami-png.png"
  },
  {
    name:"realme",
    logo:"./assets/images/xioami-png.png"
  },
  {
    name:"google",
    logo:"./assets/images/pixel.png"
  },    
  {
    name:"motorola",
    logo:"./assets/images/motorola.png"
  }
];




const brandWrap = document.querySelector(".logo-wrap");

topBrands.forEach(brand=>{
  const brandCont= document.createElement("div");
  brandCont.classList.add("brandCont");
  const img =document.createElement('img');
  img.classList.add('logo');
  img.src=brand.logo;
  img.alt=`${brand.name} logo`;
  
  brandCont.appendChild(img);
  brandWrap.appendChild(brandCont);

  // styling
  brandWrap.style.display="flex";
  brandWrap.style.gap="30px";
  brandWrap.style.justifyContent="space-around";

  brandCont.style.display="flex";
  brandCont.style.justifyContent="center";
  brandCont.style.alignItems="center";
  
})





 
        const productSection = document.querySelector(".products");
        const productWrapper = document.querySelector(".product-wrap");
        
        const allfirstProducts = productsArray.map((brand)=>{
          return brand.products[0];
        })


        console.log(allfirstProducts.length);
        console.log(typeof(allfirstProducts));

       


        allfirstProducts.map((productdtl)=>{

          // creating innner elements 
          const productCont= document.createElement("div");
          const pimage = document.createElement("img");
          const pdetails = document.createElement("div");
          const ptitle = document.createElement("h3");
          const prating = document.createElement("span");
          const pprice = document.createElement("h3");
          const addCartbtn = document.createElement("button");
          const icon = document.createElement("span");
          const ratingcont= document.createElement("div");
          const carticn =document.createElement("span");
          const imagehyperlink = document.createElement("a");



          productCont.classList.add("productCont");
          imagehyperlink.classList.add("image-link");
          pimage.classList.add("pimage");
          pdetails.classList.add("product-dtl");
          ptitle.classList.add("ptitle");
          ratingcont.classList.add("ratingCont");
          prating.classList.add("rating");
          icon.classList.add("rating-icon");
          pprice.classList.add("product-price");
          addCartbtn.classList.add("addCart");
          carticn.classList.add("cart-icn");


          
          productWrapper.appendChild(productCont);
          productCont.appendChild(imagehyperlink);
          imagehyperlink.appendChild(pimage);
          productCont.appendChild(pdetails);
          pdetails.appendChild(ptitle);
          pdetails.appendChild(ratingcont);
          ratingcont.appendChild(icon);
          ratingcont.appendChild(prating);
          pdetails.appendChild(pprice);
          pdetails.appendChild(addCartbtn);
          addCartbtn.appendChild(carticn);

          imagehyperlink.href="shop";
          pimage.src =`${productdtl.image}`;
          ptitle.innerText =`${productdtl.varName}`;
          icon.innerHTML ='<i class="fa-solid fa-star"></i>';
          prating.innerText =`${productdtl.rating}`;
          pprice.innerHTML = `&#8377 ${productdtl.price}`;
          carticn.innerHTML='<i class="fa-solid fa-cart-plus"></i> Add to Cart';
          
        })












// productsArray.forEach((brand)=>{

//       brand.products.map((dtl)=>{
        
//         const pContainer = document.createElement("div");
//         pContainer.classList.add("pContainer");

//         const imgContainer =document.createElement("div");
//         imgContainer.classList.add("imgContainer");

//         const pImg= document.createElement("img");
//         pImg.classList.add("pImg");

//         pContainer.appendChild(imgContainer);
//         imgContainer.appendChild(pImg);
      

//         productWrapper.appendChild(pContainer);


//         // details Element creation
//         const pdetails = document.createElement("div");
//         pdetails.classList.add("pdetails");

//         const productName=document.createElement("h3");
//         productName.classList.add("productName");

//         const prating= document.createElement("p");
//         prating.classList.add("prating");

//         const pprice= document.createElement("h4");
//         pprice.classList.add("pprice");

//         const addcartbtn = document.createElement("button");
//         addcartbtn.classList.add("add-cart");

//         pContainer.appendChild(pdetails);
//         pdetails.appendChild(productName);
//         pdetails.appendChild(prating);
//         pdetails.appendChild(pprice);
//         pdetails.appendChild(addcartbtn);

//         productName.innerText=dtl.varName;
//         prating.innerText=dtl.rating;
//         pprice.innerText=dtl.price;
//         addcartbtn.innerText="add to cart";
//       })
// })