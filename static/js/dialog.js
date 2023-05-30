
async function openDialog(dialogId, floorId = None) {
    const dialog = document.getElementById(dialogId)
    dialog.showModal();
    if (floorId) {
        const getFloor = await fetch('http://' + host + '/api/floors/' + floorId, {
            headers: {
                'Accept': 'application/json'
            }
        })
        if (getFloor.status === 200) {
            const data = await getFloor.json();
            const floorId = data.floor_id;
            const floorName = data.floor_name;
            const floorimg = data.floor_image;
            const floorDescription = data.floor_description;
            const floorPrice = data.floor_price;


            const dialogEditFloor = document.getElementById(dialogId)
            dialogEditFloor.querySelector('#floorId').value = floorId;
            dialogEditFloor.querySelector('#floorName').value = floorName;
            dialogEditFloor.querySelector('#img_view_edit').src = 'http://' + host + '/' + floorimg;
            dialogEditFloor.querySelector('#floorDescription').value = floorDescription;
            dialogEditFloor.querySelector('#floorPrice').value = floorPrice;

        }


    }
}

async function editFloor(editDialogId) {

    const dialogEditFloor = document.getElementById(editDialogId)
    const floorId = dialogEditFloor.querySelector('#floorId').value;
    const floorName = dialogEditFloor.querySelector('#floorName').value;
    const floorDescription = dialogEditFloor.querySelector('#floorDescription').value;
    const floorPrice = dialogEditFloor.querySelector('#floorPrice').value;
    const floorImgSrc = dialogEditFloor.querySelector('#img_view_edit').src;

    const formData = new FormData();
    formData.append('floor_id', floorId);
    formData.append('floor_name', floorName);
    formData.append('floor_description', floorDescription);
    formData.append('floor_price', floorPrice);

    // formData.append('floor_image', floorImgSrc);
    if (floorImgSrc.startsWith('http')) {
        const floorImageFile = await urlToFile(floorImgSrc);

        // Sử dụng formData để gửi đối tượng tệp
        const formData = new FormData();
        formData.append('floor_image', floorImageFile);
    }
    if (floorImgSrc.startsWith('data:image')) {
        formData.append('floor_image', floorImageFile);
        console.log("testststststst",)
        const floorImageFile = base64ToFile(floorImgSrc);

        // Sử dụng formData để gửi đối tượng tệp
        const formData = new FormData();
        formData.append('floor_image', floorImageFile);
    }

    const updateFloor = await fetch('/api/floors?floor_name=' + floorName + '&floor_description=' + floorDescription + '&floor_price=' + floorPrice
        , {
            method: 'PUT',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
    if (updateFloor.status === 202) {
        generateMessage('success', `Bạn đã thay đổi  floor ${floorId} thành công!`);
        closeDialog(editDialogId);
        clearTable();
        loadTable();

    }

    async function urlToFile(url) {
        // Tải ảnh từ URL
        const response = await fetch(url);
        const blob = await response.blob();

        // Lấy metadata của ảnh
        const metadata = { type: 'image/jpeg' };

        // Tạo một đối tượng File với dữ liệu từ blob và metadata
        return new File([blob], 'filename.jpg', metadata);
    }

    function base64ToFile(base64src) {
        // Tách dữ liệu ảnh từ chuỗi base64
        const data = base64src.split(',')[1];
        const blob = atob(data);

        // Tạo một Uint8Array từ dữ liệu ảnh
        const uint8array = new Uint8Array(blob.length);
        for (let i = 0; i < blob.length; i++) {
            uint8array[i] = blob.charCodeAt(i);
        }

        // Lấy metadata của ảnh
        const metadata = { type: 'image/jpeg' };

        // Tạo một đối tượng File với dữ liệu từ uint8array và metadata
        return new File([uint8array], 'filename.jpg', metadata);
    }







}

function changImage(FileImageId, imgViewId) {
    const uploadImage = document.getElementById(FileImageId);

    var oFReader = new FileReader();
    oFReader.readAsDataURL(uploadImage.files[0]);

    oFReader.onload = function (oFREvent) {
        imgViewId.src = oFREvent.target.result;
    };

}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId)
    dialog.close();
}

async function addNewFloor(dialogId) {
    const dialogAddFloor = document.getElementById(dialogId);
    const floorName = dialogAddFloor.querySelector('#floorName').value;
    const floorImageFile = dialogAddFloor.querySelector('#floorImageFile').files[0];
    const floorDescription = dialogAddFloor.querySelector('#floorDescription').value;
    const floorPrice = dialogAddFloor.querySelector('#floorPrice').value;

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append('floor_name', floorName);
    formData.append('floor_description', floorDescription);
    formData.append('floor_price', floorPrice);
    formData.append('floor_image', floorImageFile);

    const addFloor = await fetch('/api/floors?floor_name=' + floorName + '&floor_description=' + floorDescription + '&floor_price=' + floorPrice, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('Authorization'),
            'Accept': 'application/json'
        },
        body: formData,
        redirect: 'follow',
    })
    console.log(addFloor)
    if (addFloor.status === 201) {
        generateMessage('success', 'Bạn đã thêm floor mới thành công!');
        closeDialog('add-floor-dialog');
        clearTable();
        loadTable();

    }
    else if (addFloor.status === 401) {
        window.location.href = 'http://' + host + '/login';
        generateMessage('warning', 'Bạn vui lòng đăng nhập!');
    } else {
        generateMessage('danger', 'Thêm thất bại! Vui lòng kiểm tra lại.');
    }
}


async function deleteFloor(floor_id) {
    var confirmDeleteFloor = confirm('Are you sure you want to delete this floor?');
    if (confirmDeleteFloor) {
        const deletefloor = await fetch('/api/floors/' + floor_id, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('Authorization'),
                'Accept': 'application/json'
            },
        })

        if (deletefloor.status === 204) {
            generateMessage('success', 'Bạn đã xóa thành công!');
            clearTable();
            loadTable();

        }
        else if (deletefloor.status === 401) {
            window.location.href = 'http://' + host + '/login';
            generateMessage('warning', 'Bạn vui lòng đăng nhập!');

        }
        else {
            generateMessage('danger', 'Bạn đã xóa thất bại!');

        }
    }
}

