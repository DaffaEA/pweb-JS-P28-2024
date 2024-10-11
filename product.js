// For both product.html and cart.html

let currentPage = 0;
let productsPerPage = 15;
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from dummyJSON
const fetchProducts = async () => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  products = data.products;
  allProducts();
};

// Display products based on current page
const displayProducts = (filteredProducts = products) => {
  const container = document.getElementById('deret');
  if (container) {
    container.innerHTML = '';

    const start = currentPage * productsPerPage;
    const end = start + productsPerPage;

    filteredProducts.slice(start, end).forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.className = 'pos';
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
        <p>Harga: $${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
      `;
      container.appendChild(productDiv);
    });

    console.log('currentPage:', currentPage, 'start:', start, 'end:', end);
    console.log('currentProducts:', filterProducts);
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    if (nextButton && prevButton) {
      nextButton.disabled = end >= filteredProducts.length;
      prevButton.disabled = currentPage === 0;
    }
  }
};

// Pagination event listeners
document.getElementById('next-button')?.addEventListener('click', () => {
  currentPage++;
  displayProducts(filteredProducts);
});

document.getElementById('prev-button')?.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    displayProducts(filteredProducts);
  }
});

const allProducts = () => {
  currentPage = 0;
  filteredProducts = products;
  displayProducts(filteredProducts);
};

const filterProducts = (category) => {
    currentPage = 0; 
    filteredProducts = category ? products.filter(product => product.category.toLowerCase() === category.toLowerCase()) : products;
    displayProducts(filteredProducts);
};

const productperPage = (counts) => {
  productsPerPage = parseInt(counts, 10);
  if ((currentPage * productsPerPage) + productsPerPage > 30)
    currentPage = 0;
  displayProducts(filteredProducts);
}

const addToCart = (id, title, price) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    cart.push({ id, title, price, quantity: 1 });
  } else {
    cart[itemIndex].quantity++;
  }
  localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
  alert(`Added ${title} to cart!`);
};

// Cart page functionality
const updateCart = () => {
  const cartItemsDiv = document.getElementById('cart-items');
  if (cartItemsDiv) {
    cartItemsDiv.innerHTML = '';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = 'info';
      cartItemDiv.innerHTML = `
        <p><strong>${item.title}</strong></p>
        <p>Qty: ${item.quantity}</p>
        <a onclick="removeFromCart(${item.id})">Remove</button>
        <a onclick="increaseQuantity(${item.id})">+</button>
        <a onclick="decreaseQuantity(${item.id})">-</button>
        
      `;

      const priceItemDiv = document.createElement('div');
      priceItemDiv.className = 'price';
      priceItemDiv.innerHTML = `
        <p>$${item.price}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      `;

      // Create a parent div for both item and price
      const cartRowDiv = document.createElement('div');
      cartRowDiv.className = 'cart-row'; // Style this as a row with flex/grid if necessary
      
      // Append both item info and price to the row
      cartRowDiv.appendChild(cartItemDiv);
      cartRowDiv.appendChild(priceItemDiv);

      // Append the row to the parent container (cartItemsDiv)
      cartItemsDiv.appendChild(cartRowDiv);

    });

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
  }
};

const removeFromCart = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
  updateCart();
};

const increaseQuantity = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCart();
  }
};

const decreaseQuantity = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex !== -1 && cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCart();
  }
};

const checkout = () => {
  let totalItems = document.getElementById('total-items').textContent;
  let totalPrice = document.getElementById('total-price').textContent;
  alert(`Thank you for your purchase! You bought ${totalItems} items for $${totalPrice}`);
  localStorage.removeItem('cart'); // Clear cart
  updateCart();
};

// Load products on the products page
if (document.getElementById('deret')) {
  fetchProducts();
}

// Update cart on the cart page
if (document.getElementById('cart-items')) {
  updateCart();
}
