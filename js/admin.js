document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('product-form');
  const productList = document.getElementById('product-list');

  // Load products from localStorage
  function loadProducts() {
    productList.innerHTML = "";
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach((p, index) => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>৳ ${p.price}</p>
        ${p.discount > 0 ? `<span class="badge">-${p.discount}%</span>` : ""}
        ${p.freeShipping ? `<span class="badge">Free Shipping</span>` : ""}
        <p><strong>Category:</strong> ${p.category}</p>
      `;
      productList.appendChild(card);
    });
  }

  // Add product with file upload
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    if (!file) return alert("Please select an image!");

    const reader = new FileReader();
    reader.onload = function(event) {
      const product = {
        category: document.getElementById('category').value,
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        discount: parseInt(document.getElementById('discount').value),
        freeShipping: document.getElementById('freeShipping').checked,
        image: event.target.result // Base64 string
      };

      let products = JSON.parse(localStorage.getItem('products')) || [];
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
      loadProducts();
      form.reset();
    };

    reader.readAsDataURL(file);
  });

  // Initial load
  loadProducts();
});