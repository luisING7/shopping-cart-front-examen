

document.getElementById("formLogin").addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    login(username, password)
});

function login(username, password){
    let message = '';
    let alertType = '';

    localStorage.removeItem('token'); 

    fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({username, password})
    })
    .then(response => {
        if (response.status === 200){
            alertType = 'success';
            message = 'Inicio de sesión exitoso';
            response.json().then(data => {
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    location.href = 'admin/dashboard.html'; 
                }, 1500);
            });
        } else {
            alertType = 'danger';
            message = 'Correo o contraseña incorrectos.';
        }
        alertBuilder(alertType, message);
    })
    .catch(error => {
        alertType = 'danger';
        message = 'Error inesperado.';
        alertBuilder(alertType, message);
        console.error(error);
    });
}

function alertBuilder(alertType, message){
    const alert = `
        <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    document.getElementById('alert').innerHTML = alert;
}
