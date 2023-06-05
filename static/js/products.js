function openProduct(productid) {
    window.location.href = `/product/${productid}`;
}
function loadProductList() {
    const floorTypeIdDiv = document.querySelector('#floor_type_id');
    const floorTypeId = floorTypeIdDiv.getAttribute('value');

    fetch(`/api/floors/bytype/${floorTypeId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productList = document.getElementById('productList');

            // Thêm dữ liệu vào list
            for (let i = 0; i < data.length; i++) {
                const floor = data[i];
                const floor_id = floor.floor_id
                const floor_name = floor.floor_name
                const floor_price = floor.floor_price
                const floor_images = floor.floor_images
                floorimglist = floor_images.split('~');
                floorImgs = floorimglist.map(function(floorimg) {
                    const items = floorimg.split('|');
                    if (items.length === 2) {
                        return items;
                    }
                }).filter(function(item) {
                    return item !== undefined;
                  });
                console.log(floorImgs);
                productList.innerHTML += `
                <div class="product" onclick="openProduct('${floor_id}');">
                <div class="productimg">
                    <img src="/${floorImgs[0][1]}" alt="${floor_name}"/>
                    <div class="productitem"> 
                        <p class="productid">${floor_id}</p>
                    </div>
                    <div class="productitem"> 
                        <p class="productname">${floor_name}</p>
                    </div>
                    <div class="productitem"> 
                        <p class="productprice">${floor_price}</p>
                    </div>
                </div>
            </div>
                `;    
            }
        })
        .catch(error => {
            // xử lý lỗi trong quá trình gọi API
            console.error(error);
        });
    }

