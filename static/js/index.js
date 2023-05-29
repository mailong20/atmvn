const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', (e) => {
    localStorage.removeItem('Authorization')
})
