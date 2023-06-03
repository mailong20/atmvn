function loadProduct() {
    const floorIdDiv = document.querySelector('#floor_id');
    const floorId = floorIdDiv.getAttribute('value');

    fetch(`/api/floors/${floorId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }).then(response => response.json())
    .then(data=>{
        const product = document.querySelector('#product-infor');
        product.innerHTML =`
        <a class="hinhanh" >
        <img src ="/${data.floor_images}"> </img>
        </a>

        <a class="menu-item1" href="">
            <div class="ten">${data.floor_name} </div>
            <br />
            <br />
            <div>${data.floor_price}</div>
            <br />
            <div class="mieuta">${data.floor_description}</div>        
        </a>
        
        `
    }) .catch(error => {
        // xử lý lỗi trong quá trình gọi API
        console.error(error);
    });
        
      
    }
