document.addEventListener("DOMContentLoaded", () => {
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    console.error("Error parsing cart from localStorage", e);
    cart = [];
  }

  // --- Get DOM Elements ---
  const cartCount = document.getElementById("cart-count");
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popup-img");
  const popupName = document.getElementById("popup-name");
  const popupPrice = document.getElementById("popup-price");
  const popupQty = document.getElementById("popup-qty");
  const popupCancel = document.getElementById("popup-cancel");
  const popupConfirm = document.getElementById("popup-confirm");

  let currentProduct = null;

  // --- Core Functions ---
  function updateCartCounter() {
    if (!cartCount) return;
    // FIX: Use reduce to sum quantities, not cart.length
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = totalQty;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function showMessage(msg) {
    const box = document.createElement("div");
    box.className = "msg-box";
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.classList.add("show"), 100);
    setTimeout(() => {
      box.classList.remove("show");
      setTimeout(() => box.remove(), 300);
    }, 3000); // Show for 3 seconds
  }

  // --- Event Listeners ---

  // 1. Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!popup) return; // Make sure popup exists on this page
      
      currentProduct = {
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        image: btn.dataset.image
      };
      
      // Populate and show the popup
      popupImg.src = currentProduct.image;
      popupName.textContent = currentProduct.name;
      popupPrice.textContent = currentProduct.price;
      popupQty.value = 1; // Reset quantity to 1
      popup.style.display = "flex";
    });
  });

  // 2. Popup Cancel button
  if (popupCancel) {
    popupCancel.addEventListener("click", () => {
      popup.style.display = "none";
      currentProduct = null;
    });
  }

  // 3. Popup Confirm button
  if (popupConfirm) {
    popupConfirm.addEventListener("click", () => {
      const qty = parseInt(popupQty.value) || 1;
      
      // Check if item already in cart
      const existing = cart.find(item => item.name === currentProduct.name && item.image === currentProduct.image);
      
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ ...currentProduct, qty });
      }
      
      saveCart();
      updateCartCounter();
      popup.style.display = "none";
      showMessage(`✅ ${currentProduct.name} added to cart!`);
      currentProduct = null;
    });
  }

  // --- Initial Page Load ---
  updateCartCounter();
});