/* =========================================================
   PRODUCTS DATA
========================================================= */
const products = [
  {
    id: 1,
    name: "Injected humour",
    oldPrice: "$888",
    price: 677,
    category: "Shart",
    color: "Black",
    tags: ["New", "Black"],
    image:
      "https://images.unsplash.com/photo-1564257577054-8f1c6f4b6f5c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Classical literature",
    oldPrice: "$222",
    price: 137,
    category: "Tops",
    color: "Blue",
    tags: ["Brand"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Classical literature",
    oldPrice: "$111",
    price: 98,
    category: "Tops",
    color: "White",
    tags: ["White"],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Classical literature",
    oldPrice: "$456",
    price: 245,
    category: "T-Shirt",
    color: "Blue",
    tags: ["New", "Brand"],
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Injected humour",
    oldPrice: "$888",
    price: 677,
    category: "Tops",
    color: "Black",
    tags: ["Black"],
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Classical literature",
    oldPrice: "$888",
    price: 677,
    category: "Shart",
    color: "Blue",
    tags: ["Brand"],
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Classical literature",
    oldPrice: "$345",
    price: 309,
    category: "Pants",
    color: "Green",
    tags: ["New"],
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Classical literature",
    oldPrice: "$234",
    price: 220,
    category: "Tops",
    color: "Purple",
    tags: ["Brand"],
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    name: "Injected humour",
    oldPrice: "$888",
    price: 677,
    category: "Shart",
    color: "Black",
    tags: ["Black"],
    image:
      "https://images.unsplash.com/photo-1564257577054-8f1c6f4b6f5c?auto=format&fit=crop&w=700&q=85",
  },
];

/* State Management */
let activeFilters = {
  category: null,
  color: null,
  tag: null,
  maxPrice: 1000,
};
let currentPage = 1;
const itemsPerPage = 6;

/* DOM References */
const productGrid = document.getElementById("productGrid");
const sortSelect = document.getElementById("sortSelect");
const filterToggle = document.getElementById("filterToggle");
const sidebar = document.querySelector(".shop-sidebar");
const backToTop = document.getElementById("backToTop");
const priceRangeInput = document.getElementById("priceRangeInput");
const priceValueLabel = document.getElementById("priceValueLabel");

/* Track Wishlist State */
const wishlistSet = new Set();

/* =========================================================
   RENDER PRODUCTS & PAGINATION
========================================================= */
function getFilteredAndSortedProducts() {
  let result = products.filter((product) => {
    const matchCategory =
      !activeFilters.category || product.category === activeFilters.category;
    const matchColor =
      !activeFilters.color || product.color === activeFilters.color;
    const matchTag =
      !activeFilters.tag || product.tags.includes(activeFilters.tag);
    const matchPrice = product.price <= activeFilters.maxPrice;
    return matchCategory && matchColor && matchTag && matchPrice;
  });

  const sortValue = sortSelect ? sortSelect.value : "default";
  if (sortValue === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}

function renderProducts() {
  const filteredList = getFilteredAndSortedProducts();

  if (filteredList.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 py-5 text-center">
        <p class="text-muted fs-5 mb-3">No products match your selected filters.</p>
        <button class="btn btn-outline-dark btn-sm" onclick="resetAllFilters()">Reset All Filters</button>
      </div>`;
    renderPagination(0);
    return;
  }

  // Calculate Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  productGrid.innerHTML = paginatedList
    .map((product) => {
      const isWishlisted = wishlistSet.has(product.id);
      return `
      <article class="product-card">
        <div class="product-image">
          <button
            class="wishlist ${isWishlisted ? "active" : ""}"
            data-id="${product.id}"
            aria-label="Add ${product.name} to wishlist">
            <i class="bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="price-row">
            <span class="old-price">${product.oldPrice}</span>
            <span class="new-price">$${product.price.toFixed(2)}</span>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  // Re-bind Wishlist Event Listeners
  document.querySelectorAll(".wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.dataset.id, 10);
      if (wishlistSet.has(id)) {
        wishlistSet.delete(id);
      } else {
        wishlistSet.add(id);
      }
      renderProducts();
    });
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";

  let html = `
    <button data-page="prev" aria-label="Previous" ${currentPage === 1 ? "disabled style='opacity:0.5;cursor:default;'" : ""}>
      <i class="bi bi-chevron-left"></i>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>
    `;
  }

  html += `
    <button data-page="next" aria-label="Next" ${currentPage === totalPages ? "disabled style='opacity:0.5;cursor:default;'" : ""}>
      <i class="bi bi-chevron-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = html;

  // Pagination Click Listeners
  paginationContainer.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetPage = this.dataset.page;
      if (targetPage === "prev" && currentPage > 1) {
        currentPage--;
      } else if (targetPage === "next" && currentPage < totalPages) {
        currentPage++;
      } else if (!isNaN(parseInt(targetPage, 10))) {
        currentPage = parseInt(targetPage, 10);
      }
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* =========================================================
   FILTER & SORT LISTENERS
========================================================= */

// Category Filter Toggle
document.querySelectorAll(".category-list button").forEach((button) => {
  button.addEventListener("click", function () {
    const category = this.dataset.category;
    if (activeFilters.category === category) {
      activeFilters.category = null; // Toggle off if already selected
    } else {
      activeFilters.category = category;
    }

    // Update active class state visually
    document
      .querySelectorAll(".category-list button")
      .forEach((b) => b.classList.remove("fw-bold"));
    if (activeFilters.category) this.classList.add("fw-bold");

    currentPage = 1;
    renderProducts();
  });
});

// Color Filter Toggle
document.querySelectorAll(".color-list button").forEach((button) => {
  button.addEventListener("click", function () {
    const color = this.dataset.color;
    if (activeFilters.color === color) {
      activeFilters.color = null; // Toggle off
    } else {
      activeFilters.color = color;
    }

    document
      .querySelectorAll(".color-list button")
      .forEach((b) => b.classList.remove("fw-bold"));
    if (activeFilters.color) this.classList.add("fw-bold");

    currentPage = 1;
    renderProducts();
  });
});

// Tag Filter Toggle
document.querySelectorAll(".tags button").forEach((button) => {
  button.addEventListener("click", function () {
    const tag = this.textContent.trim();
    if (activeFilters.tag === tag) {
      activeFilters.tag = null;
    } else {
      activeFilters.tag = tag;
    }

    document
      .querySelectorAll(".tags button")
      .forEach((b) => b.classList.remove("fw-bold"));
    if (activeFilters.tag) this.classList.add("fw-bold");

    currentPage = 1;
    renderProducts();
  });
});

// Reset Function
window.resetAllFilters = function () {
  activeFilters = { category: null, color: null, tag: null, maxPrice: 1000 };
  document
    .querySelectorAll(".category-list button, .color-list button, .tags button")
    .forEach((b) => b.classList.remove("fw-bold"));
  if (priceRangeInput) {
    priceRangeInput.value = 1000;
    if (priceValueLabel) priceValueLabel.textContent = "$25 - $1000";
  }
  currentPage = 1;
  renderProducts();
};

// Sort Selector
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}

// Price Slider Handler
if (priceRangeInput) {
  priceRangeInput.addEventListener("input", function () {
    activeFilters.maxPrice = parseFloat(this.value);
    if (priceValueLabel) {
      priceValueLabel.textContent = `$25 - $${this.value}`;
    }
    currentPage = 1;
    renderProducts();
  });
}

// Mobile Filter Sidebar Toggle
if (filterToggle && sidebar) {
  filterToggle.addEventListener("click", function () {
    sidebar.classList.toggle("show-mobile");
  });
}

// Back to Top Button
if (backToTop) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 450) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Initialize */
renderProducts();
