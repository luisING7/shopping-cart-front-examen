document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acceso denegado. Inicie sesión.");
    window.location.href = "../index.html";
    return;
  }

  // Configurar logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  try {
    // Cargar lista de productos
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    const productList = document.getElementById("productList");

    products.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description.substring(0, 100)}...</p>
            <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
            <span class="badge bg-primary mb-2">${product.category}</span>
            <button class="btn btn-sm btn-outline-primary view-product" data-id="${product.id}">Ver detalles</button>
          </div>
        </div>
      `;

      productList.appendChild(col);
    });

    // Configurar botones de ver detalles
    document.querySelectorAll(".view-product").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        viewProductDetails(productId);
      });
    });

    // Configurar formulario de agregar producto
    document.getElementById("productForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const newProduct = {
        title: document.getElementById("title").value,
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
        category: document.getElementById("category").value
      };

      try {
        const res = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newProduct)
        });

        const data = await res.json();
        alert(`Producto creado con ID: ${data.id}`);
        location.reload();
      } catch (error) {
        console.error("Error al crear producto:", error);
        alert("Error al crear producto");
      }
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    alert("Error al cargar productos");
  }
});

async function viewProductDetails(productId) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await response.json();
    

    const modalHTML = `
      <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${product.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <img src="${product.image}" class="img-fluid mb-3" alt="${product.title}">
                </div>
                <div class="col-md-6">
                  <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                  <p><strong>Categoría:</strong> ${product.category}</p>
                  <p><strong>Descripción:</strong></p>
                  <p>${product.description}</p>
                  <p><strong>Rating:</strong> ${product.rating?.rate || 'N/A'} (${product.rating?.count || '0'} votos)</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
    
    // Eliminar el modal cuando se cierre
    document.getElementById('productModal').addEventListener('hidden.bs.modal', function () {
      this.remove();
    });
  } catch (error) {
    console.error("Error al cargar detalles del producto:", error);
    alert("Error al cargar detalles del producto");
  }
}