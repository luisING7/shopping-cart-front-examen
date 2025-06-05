/*  GET /users  ───────────────────────────────────────────────── */
function getUsers() {
  document.getElementById('cardHeader').innerHTML = '<h4>Lista de usuarios</h4>';
  document.getElementById('info').innerHTML = '<p>Cargando...</p>';

  fetch('https://fakestoreapi.com/users')
    .then(r => r.json())
    .then(users => {
      let table = `
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>username</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
      `;
      users.forEach(u => {
        table += `
          <tr>
            <td>${u.id}</td>
            <td>${u.name.firstname} ${u.name.lastname}</td>
            <td>${u.username}</td>
            <td>
              <button class="btn btn-outline-info btn-sm" onclick="viewUserDetail(${u.id})">
                Ver
              </button>
            </td>
          </tr>
        `;
      });
      table += '</tbody></table>';
      document.getElementById('info').innerHTML = table;
    })
    .catch(() =>
      (document.getElementById('info').innerHTML =
        '<p>Error al cargar la lista de usuarios.</p>')
    );
}

/*  GET /users/:id  ───────────────────────────────────────────── */
function viewUserDetail(userId) {
  fetch(`https://fakestoreapi.com/users/${userId}`)
    .then(r => r.json())
    .then(u => {
      const modalHTML = `
        <div class="modal fade" id="modalUser" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Usuario #${u.id}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>Nombre:</strong> ${u.name.firstname} ${u.name.lastname}</p>
                <p><strong>Usuario:</strong> ${u.username}</p>
                <p><strong>username:</strong> ${u.username}</p>
                <p><strong>Teléfono:</strong> ${u.phone}</p>
                <p><strong>Dirección:</strong> ${u.address.city}, ${u.address.street} #${u.address.number}</p>
              </div>
            </div>
          </div>
        </div>`;
      document.getElementById('showModal').innerHTML = modalHTML;
      new bootstrap.Modal('#modalUser').show();
    })
    .catch(() => alert('No se pudo obtener el detalle del usuario.'));
}

