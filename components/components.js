async function loadComponents(selector,file) {
    const element =document.querySelector(selector);
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;

}

loadComponents("#header","./pages/navbar.html");
loadComponents("#footer","./pages/footer.html");