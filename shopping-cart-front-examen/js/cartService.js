document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Acceso denegado. Inicie sesión.");
        window.location.href = "../index.html";
        return;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "../index.html";
    });

    try {
        const response = await fetch("https://fakestoreapi.com/carts");
        if (!response.ok) throw new Error(`Error al cargar carritos: ${response.status}`);

        const carts = await response.json();
        const cartList = document.getElementById("cartList");
        if (!cartList) throw new Error("Elemento 'cartList' no encontrado.");

        carts.forEach(cart => {
            const col = document.createElement("div");
            col.className = "col-md-6 mb-4";
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Carrito #${cart.id}</h5>
                        <p class="card-text">
                            <strong>Usuario ID:</strong> ${cart.userId}<br>
                            <strong>Fecha:</strong> ${new Date(cart.date).toLocaleDateString()}<br>
                            <strong>Productos:</strong> ${cart.products.length}
                        </p>
                        <button class="btn btn-sm btn-outline-primary view-cart" data-id="${cart.id}">Ver detalles</button>
                    </div>
                </div>
            `;
            cartList.appendChild(col);
        });

 
        document.querySelectorAll(".view-cart").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const cartId = e.target.getAttribute("data-id");
                viewCartDetails(cartId);
            });
        });

        document.getElementById("cartForm")?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userId = parseInt(document.getElementById("userId").value);
            const products = document.getElementById("products").value.split(',').map(p => {
                const [productId, quantity] = p.trim().split(':');
                return { productId: parseInt(productId), quantity: parseInt(quantity) };
            });

            const newCart = { userId, date: new Date().toISOString().split('T')[0], products };

            try {
                const res = await fetch("https://fakestoreapi.com/carts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCart)
                });

                if (!res.ok) throw new Error(`Error al crear carrito: ${res.status}`);

                const data = await res.json();
                alert(`Carrito creado con ID: ${data.id}`);
                location.reload();
            } catch (error) {
                console.error("Error al crear carrito:", error);
                alert("Error al crear carrito");
            }
        });

    } catch (error) {
        console.error("Error al cargar carritos:", error);
        alert("Error al cargar carritos");
    }
});

async function viewCartDetails(cartId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${cartId}`);
        if (!response.ok) throw new Error(`Error al obtener carrito: ${response.status}`);

        const cart = await response.json();

        const productDetails = await Promise.all(
            cart.products.map(async (item) => {
                const productRes = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
                if (!productRes.ok) throw new Error(`Error al obtener producto: ${productRes.status}`);

                const product = await productRes.json();
                return { ...item, title: product.title, price: product.price };
            })
        );


        const total = productDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);


        const modalHTML = `
            <div class="modal fade" id="cartModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles del Carrito #${cart.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <p><strong>Usuario ID:</strong> ${cart.userId}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Fecha:</strong> ${new Date(cart.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <h6>Productos</h6>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productDetails.map(item => `
                                            <tr>
                                                <td>${item.title}</td>
                                                <td>${item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHTML);
        new bootstrap.Modal(document.getElementById("cartModal")).show();

    } catch (error) {
        console.error("Error al obtener detalles del carrito:", error);
        alert("Error al obtener detalles del carrito");
    }
}
