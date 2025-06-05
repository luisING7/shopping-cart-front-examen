function tokenValidate() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "../index.html";
    }
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = "../index.html";
  }
  
  async function loadDashboardData() {
    try {
      const [productsRes, usersRes, cartsRes] = await Promise.all([
        fetch("https://fakestoreapi.com/products?limit=3"),
        fetch("https://fakestoreapi.com/users?limit=3"),
        fetch("https://fakestoreapi.com/carts?limit=3")
      ]);
  
      const products = await productsRes.json();
      const users = await usersRes.json();
      const carts = await cartsRes.json();
  
      renderDashboardSummary(products, users, carts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }
  
  function renderDashboardSummary(products, users, carts) {
    const infoDiv = document.getElementById("info");
    
    infoDiv.innerHTML = `
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Productos</h5>
              <p class="card-text">${products.length} productos recientes</p>
              <a href="productos.html" class="btn btn-sm btn-primary">Ver todos</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Usuarios</h5>
              <p class="card-text">${users.length} usuarios recientes</p>
              <a href="usuarios.html" class="btn btn-sm btn-primary">Ver todos</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Carritos</h5>
              <p class="card-text">${carts.length} carritos recientes</p>
              <a href="carrito.html" class="btn btn-sm btn-primary">Ver todos</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    tokenValidate();
    loadDashboardData();

    document.querySelectorAll(".logout-btn").forEach(btn => {
      btn.addEventListener("click", logout);
    });
  });