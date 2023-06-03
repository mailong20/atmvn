const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', (e) => {
    localStorage.removeItem('Authorization')
})
function loadFloorType(){
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("/api/floortype/", requestOptions)
    .then(response => response.json())
        .then(data => {
            const dropdownfloortype = document.getElementById('dropdown-equipment');

            // Thêm dữ liệu vào list
            for (let i = 0; i < data.length; i++) {
                const floortype = data[i];
                
               
                dropdownfloortype.innerHTML += `
                <li><a class="dropdown-item" href="/products/${floortype.id}">${floortype.name}</a></li>
                `;    
            }
        })
        .catch(error => {
            // xử lý lỗi trong quá trình gọi API
            console.error(error);
        });
}
