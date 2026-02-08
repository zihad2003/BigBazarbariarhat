document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const shippingLocation = document.getElementById("shipping-location");
  const shippingCostEl = document.getElementById("shipping-cost");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutPopup = document.getElementById("checkout-popup");
  const closeBtn = document.querySelector(".close-btn");
  const finalTotal = document.getElementById("final-total");

  function updateCartCounter() {
    // FIX: Use reduce to sum quantities, not cart.length
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = totalQty;
  }

  function calculateShipping() {
    return shippingLocation.value === 'ctg' ? 80 : 150;
  }

  function renderCart() {
    cartList.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item, index) => {
      const qty = item.qty || 1;
      subtotal += item.price * qty;
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        ${item.name} - ৳${item.price} x <input type="number" value="${qty}" min="1" data-index="${index}" class="qty-input"> 
        = ৳<span>${item.price * qty}</span>
        <button class="remove-btn" data-index="${index}">❌</button>
      `;
      cartList.appendChild(li);
    });
    const shipping = calculateShipping();
    const total = subtotal + shipping;
    cartSubtotal.textContent = subtotal;
    shippingCostEl.textContent = shipping;
    cartTotalEl.textContent = total;
    finalTotal.textContent = total;
    updateCartCounter();
  }

  cartList.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  cartList.addEventListener("change", e => {
    if (e.target.classList.contains("qty-input")) {
      const index = e.target.dataset.index;
      cart[index].qty = parseInt(e.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  shippingLocation.addEventListener("change", renderCart);

  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) {
      alert("🛒 Your cart is empty! Please add items to continue shopping.");
      return; // stop further action
    }
    checkoutPopup.style.display = "flex";
    finalTotal.textContent = cartTotalEl.textContent;
  });

  closeBtn.addEventListener("click", () => { checkoutPopup.style.display = "none"; });

  document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("cust-name").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;
    // const location = document.getElementById("cust-location").value; // This was unused
    const shipping = calculateShipping();
    const subtotal = parseInt(cartSubtotal.textContent);
    const total = subtotal + shipping;

    // Fill Invoice
    document.getElementById("invoice-date").textContent = `Date: ${new Date().toLocaleString()}`;
    document.getElementById("invoice-name").textContent = name;
    document.getElementById("invoice-phone").textContent = phone;
    document.getElementById("invoice-address").textContent = address;

    const invoiceItems = document.getElementById("invoice-items");
    invoiceItems.innerHTML = "";
    cart.forEach(item => {
      const qty = item.qty || 1;
      const row = document.createElement("tr");
      row.innerHTML = `<td>${item.name}</td><td>${qty}</td><td>${item.price}</td><td>${item.price*qty}</td>`;
      invoiceItems.appendChild(row);
    });

    document.getElementById("invoice-subtotal").textContent = subtotal;
    document.getElementById("invoice-shipping").textContent = shipping;
    document.getElementById("invoice-total").textContent = total;

    checkoutPopup.style.display = "none";
    document.getElementById("invoice").style.display = "block";

    // Optionally: send invoice via SMS API
    const mobile = document.getElementById("cust-mobile").value;
    if(mobile) {
      alert(`Invoice will be sent to ${mobile} via SMS (requires backend integration).`);
    }

    // Clear cart
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
  });

  // Print / Download PDF
  document.querySelector(".print-btn").addEventListener("click", () => {
    // Check if jsPDF is loaded
    if (window.jspdf) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.html(document.getElementById("invoice"), {
        callback: function(pdf) { pdf.save("BigBazar_Invoice.pdf"); },
        x: 10, y: 10
      });
    } else {
      alert("Error: PDF library not loaded.");
    }
  });

  renderCart();
});