async function openDialog(dialogId, floorId = None) {

    const dialog = document.getElementById(dialogId)
    fetchFloorTypes(dialog);
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
            const floorTypeId = data.floor_type_id;
            const floorName = data.floor_name;
            const floorimg = data.floor_images;
            const floorDescription = data.floor_description;
            const floorPrice = data.floor_price;
            


            const dialogEditFloor = document.getElementById(dialogId)
            dialogEditFloor.querySelector('#baseFloorId').value = floorId.split('-').slice(1).join("-");
            dialogEditFloor.querySelector('#floorName').value = floorName;
            dialogEditFloor.querySelector('#img_view_edit').src = 'http://' + host + '/' + floorimg;
            dialogEditFloor.querySelector('#floorDescription').value = floorDescription;
            dialogEditFloor.querySelector('#floorPrice').value = floorPrice;
            dialogEditFloor.querySelector('#floorType').value = floorTypeId;
            dialogEditFloor.querySelector('#btnEditFloor').value = floorId;
            

        }
        else{
            dialogEditFloor.querySelector('#baseFloorId').value = '';
            dialogEditFloor.querySelector('#floorName').value = '';
            dialogEditFloor.querySelector('#floorDescription').value = '';
            dialogEditFloor.querySelector('#floorPrice').value = '';
        }


    }
}

async function editFloor(editDialogId) {

    const dialogEditFloor = document.getElementById(editDialogId)
    const floorTypeId = dialogEditFloor.querySelector('#floorType').value;
    const baseFloorId = dialogEditFloor.querySelector('#baseFloorId').value;
    const floorName = dialogEditFloor.querySelector('#floorName').value;
    const floorDescription = dialogEditFloor.querySelector('#floorDescription').value;
    const floorPrice = dialogEditFloor.querySelector('#floorPrice').value;
    const floorImgSrc = dialogEditFloor.querySelector('#img_view_edit').src;
    const oldFloorId = dialogEditFloor.querySelector('#btnEditFloor').value
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem('Authorization'));

    var raw = JSON.stringify({
        "floor_name": floorName,
        "floor_images": floorImgSrc,
        "floor_description": floorDescription,
        "floor_price": floorPrice,
        "floor_type_id": floorTypeId,
        "old_floor_id": oldFloorId,
        "floor_id": baseFloorId
    });


    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // http://${host}
    const updateFloor = await fetch(`/api/floors/`, requestOptions);

    if (updateFloor.status === 202) {
        generateMessage('success', `Bạn đã thay đổi  floor ${oldFloorId} thành công!`);
        closeDialog(editDialogId);
        clearTable();
        loadTable();
    } else if (updateFloor.status === 401) {
        // window.location.href = 'http://' + host + '/login';
        console.log("lỗi")
        generateMessage('warning', 'Bạn vui lòng đăng nhập!');
    } else {
        generateMessage('danger', 'Edit thất bại! Vui lòng kiểm tra lại.');
    }
}
async function urlToFile(url) {
    // Tải ảnh từ URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Lấy metadata của ảnh
    const metadata = { type: 'image/jpeg' };

    // Tạo một đối tượng File với dữ liệu từ blob và metadata
    return new File([blob], 'filename.png', metadata);
}

async function base64ToFile(base64src) {
    // Tách dữ liệu ảnh từ chuỗi base64
    var arr = base64src.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'filename.png', { type: mime });
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
    const floorTypeSelect = dialogAddFloor.querySelector('#floorType').value;
    const baseFloorId = dialogAddFloor.querySelector('#baseFloorId').value;
    const floorName = dialogAddFloor.querySelector('#floorName').value;
    const floorImageFile = dialogAddFloor.querySelector('#floorImageFile').files[0];
    const floorDescription = dialogAddFloor.querySelector('#floorDescription').value;
    const floorPrice = dialogAddFloor.querySelector('#floorPrice').value;
  

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append('floor_id', baseFloorId);
    formData.append('floor_type_id', floorTypeSelect);
    formData.append('floor_name', floorName);
    formData.append('floor_description', floorDescription);
    formData.append('floor_price', floorPrice);
    formData.append('floor_image', floorImageFile);
    const addFloor = await fetch(`/api/floors?floor_id=${baseFloorId}&floor_type_id=${floorTypeSelect}&floor_name=${floorName}&floor_description=${floorDescription}&floor_price=${floorPrice}`, {
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

async function fetchFloorTypes(dialog) {
    const response = await fetch('/api/floortype/');
    if (response.ok) {
        const floorTypes = await response.json();
        const floorTypeSelect = dialog.querySelector('#floorType');

        // Clear existing options
        floorTypeSelect.innerHTML = '';

        // Add options for each floor type
        floorTypes.forEach(floorType => {
            const option = document.createElement('option');
            option.value = floorType.id;
            option.textContent = floorType.name;
            floorTypeSelect.appendChild(option);
        });
        selectedFloorTypeId = floorTypeSelect.value;
        dialog.querySelector('#floortypeid').value = selectedFloorTypeId;
        // Add event listener for change event
        floorTypeSelect.addEventListener('change', () => {
            selectedFloorTypeId = floorTypeSelect.value;
            dialog.querySelector('#floortypeid').value = selectedFloorTypeId;
            console.log('Selected value:', selectedFloorTypeId);
        });
    }
}