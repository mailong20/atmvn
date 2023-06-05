function loadProduct() {
    
    const floorIdDiv = document.getElementById("floor_id_detail");
    const floorId = floorIdDiv.getAttribute('value');
    fetch(`/api/floors/${floorId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }).then(response => response.json())
    .then(data=>{
        floorimglist = data.floor_images.split('~');
        floorImgs = floorimglist.map(function(floorimg) {
            const items = floorimg.split('|');
            if (items.length === 2) {
                return items;
            }
        }).filter(function(item) {
            return item !== undefined;
            });
        const img_zoom = document.getElementById('main-img');
        img_zoom.src = `/${floorImgs[0][1]}`
        const product_title = document.getElementById('floor-name');
        product_title.textContent = data.floor_name
        const card_text = document.getElementById('floor-description');
        card_text.textContent = data.floor_description
        const product_price = document.getElementById('floor-price');
        product_price.textContent = `Giá: ${data.floor_price}`
        const miniSlide = document.getElementsByClassName('mini-slide')[0];
        floorImgs.forEach((img, index) => {
            miniSlide.innerHTML += `
            <img src='/${img[1]}' onclick="document.getElementById('main-img').src='/${img[1]}'" alt="${img[0]}" data-index="${index}">
            `;
        });

            
        
    }) .catch(error => {
        // xử lý lỗi trong quá trình gọi API
        console.error(error);
    });
        
      
    }
