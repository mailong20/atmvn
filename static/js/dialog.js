function ranId(n = 15) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function openDialog(dialogId, floorId = None) {

    const dialog = document.getElementById(dialogId)
    fetchFloorTypes(dialog);
    dialog.showModal();
    if (floorId) {
        const table_image = dialog.querySelector("#table");
        const rows = table_image.rows;
        while (rows.length > 2) {
            table_image.deleteRow(rows.length - 1);
        }
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
            const floorimgs = data.floor_images;
            const floorDescription = data.floor_description;
            const floorPrice = data.floor_price;

            floorimglist = floorimgs.split('~');
            floorImages = floorimglist.map(function (floorimg) {
                const items = floorimg.split('|');
                if (items.length === 2) {
                    return items;
                }
            }).filter(function (item) {
                return item !== undefined;
            });


            addImageFromEdit(dialogId, floorImages)
            const dialogEditFloor = document.getElementById(dialogId)
            dialogEditFloor.querySelector('#baseFloorId').value = floorId.split('-').slice(1).join("-");
            dialogEditFloor.querySelector('#floorName').value = floorName;
            // dialogEditFloor.querySelector('#img_view_edit').src = 'http://' + host + '/' + floorimg;
            dialogEditFloor.querySelector('#floorDescription').value = floorDescription;
            dialogEditFloor.querySelector('#floorPrice').value = floorPrice;
            dialogEditFloor.querySelector('#floorType').value = floorTypeId;
            dialogEditFloor.querySelector('#btnEditFloor').value = floorId;


        }
    }
    else {
        dialog.querySelector('#baseFloorId').value = '';
        dialog.querySelector('#floorName').value = '';
        dialog.querySelector('#floorDescription').value = '';
        dialog.querySelector('#floorPrice').value = '';
        const table_image = dialog.querySelector("#table");
        const rows = table_image.rows;
        while (rows.length > 2) {
            table_image.deleteRow(rows.length - 1);
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
    const oldFloorId = dialogEditFloor.querySelector('#btnEditFloor').value
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem('Authorization'));

    const tbody = dialogEditFloor.querySelector('#table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.shift();
    const imageDict = {};
    rows.forEach((row) => {
        const nameInput = row.querySelector('input[type="text"]');
        const previewImage = row.querySelector('img');
        const name = nameInput.value;
        const src = previewImage.src;
        imageDict[name] = src;

    });
    const floorImageString = JSON.stringify(imageDict);
    if (baseFloorId && floorName && floorImageString && floorDescription && floorPrice && floorTypeId && oldFloorId) {
        console.log("Long", Object.keys(imageDict).length)
        if (Object.keys(imageDict).length > 20) {
            generateMessage('warning', 'Ảnh quá nhiều, lớn hơn 20 ảnh!');
            return
        }
    } else {
        // Code to execute if one or more variables are empty
        generateMessage('warning', 'Một hoặc nhiều cột trống!');
        return
    }
    var raw = JSON.stringify({
        "floor_name": floorName,
        "floor_images": floorImageString,
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

    const floorDescription = dialogAddFloor.querySelector('#floorDescription').value;
    const floorPrice = dialogAddFloor.querySelector('#floorPrice').value;

    const tbody = dialogAddFloor.querySelector('#table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.shift();
    const imageDict = {};
    rows.forEach((row) => {
        const nameInput = row.querySelector('input[type="text"]');
        const previewImage = row.querySelector('img');
        const name = nameInput.value;
        const src = previewImage.src;
        imageDict[name] = src;

    });
    const floorImageString = JSON.stringify(imageDict);

    var raw = JSON.stringify({
        "floor_id": baseFloorId,
        "floor_name": floorName,
        "floor_images": floorImageString,
        "floor_description": floorDescription,
        "floor_price": floorPrice,
        "floor_type_id": floorTypeSelect
    });
    if (baseFloorId && floorName && floorImageString && floorDescription && floorPrice && floorTypeSelect) {
        if (Object.keys(imageDict).length > 20) {
            generateMessage('warning', 'Ảnh quá nhiều, lớn hơn 10 ảnh!');
            return
        }
    } else {
        // Code to execute if one or more variables are empty
        generateMessage('warning', 'Một hoặc nhiều cột trống!');
        return
    }
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem('Authorization'));
    const addFloor = await fetch('/api/floors/', {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    })
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


function addImageFromEdit(dialogId, imgs) {
    dialog = document.getElementById(dialogId);
    var table = dialog.querySelector('#table');
    fileInput = dialog.querySelector('.add-files');
    var rowTemplate = dialog.querySelector('#row-template-add');
    for (let i = 0; i < imgs.length; i++) { // Lặp qua danh sách các file để xử lý mỗi tệp tin riêng lẻ
        img = imgs[i]
        const newRow = rowTemplate.cloneNode(true);
        const baseId = ranId();
        newRow.id = baseId;
        const nameImage = newRow.querySelector('#name_image');
        const previewImg = newRow.querySelector('#preview');
        const fileUpdate = newRow.querySelector('#file_input_update');
        const editButton = newRow.querySelector('#edit-button');
        const saveButton = newRow.querySelector('#save-button');
        const deleteButton = newRow.querySelector('#delete-button');

        nameImage.value = img[0]
        previewImg.src = `/${img[1]}`;

        previewImg.addEventListener('click', function () {
            fileUpdate.click();
        });


        deleteButton.addEventListener('click', function () {
            deleteRow(newRow.id);
        });

        editButton.addEventListener('click', function () {
            this.style.display = 'none';
            saveButton.style.display = '';
            previewImg.style.pointerEvents = '';
            nameImage.disabled = false;
        });

        saveButton.addEventListener('click', function () {
            this.style.display = 'none';
            editButton.style.display = '';
            previewImg.style.pointerEvents = 'none';
            nameImage.disabled = true;
        });

        table.querySelector('tbody').appendChild(newRow);
        newRow.style.display = '';
    }
}

function openImage(dialogId) {
    dialog = document.getElementById(dialogId);
    dialog.querySelector('.add-files').click();
}

function addImage(dialogId) {
    dialog = document.getElementById(dialogId);
    var table = dialog.querySelector('#table');
    fileInput = dialog.querySelector('.add-files');
    var rowTemplate = dialog.querySelector('#row-template-add');
    const files = fileInput.files; // Lấy danh sách các file đã chọn
    for (let i = 0; i < files.length; i++) { // Lặp qua danh sách các file để xử lý mỗi tệp tin riêng lẻ
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            const newRow = rowTemplate.cloneNode(true);
            const baseId = ranId();
            newRow.id = baseId;
            const nameImage = newRow.querySelector('#name_image');
            const previewImg = newRow.querySelector('#preview');
            const fileUpdate = newRow.querySelector('#file_input_update');
            const editButton = newRow.querySelector('#edit-button');
            const saveButton = newRow.querySelector('#save-button');
            const deleteButton = newRow.querySelector('#delete-button');

            nameImage.value = file.name.slice(0, file.name.lastIndexOf('.'));
            previewImg.src = reader.result;

            previewImg.addEventListener('click', function () {
                fileUpdate.click();
            });


            deleteButton.addEventListener('click', function () {
                deleteRow(newRow.id);
            });

            editButton.addEventListener('click', function () {
                this.style.display = 'none';
                saveButton.style.display = '';
                previewImg.style.pointerEvents = '';
                nameImage.disabled = false;
            });

            saveButton.addEventListener('click', function () {
                this.style.display = 'none';
                editButton.style.display = '';
                previewImg.style.pointerEvents = 'none';
                nameImage.disabled = true;
            });

            table.querySelector('tbody').appendChild(newRow);
            newRow.style.display = '';
        });
        reader.readAsDataURL(file);
    }
}

function deleteRow(idRow) {
    row = document.getElementById(idRow);
    if (row) {
        row.remove()
    }
}


function updateImage(rowId) {
    console.log(rowId)
    row = document.querySelector(`#${rowId}`);
    var fileUpdate = row.querySelector('#file_input_update');
    const previewImg = row.querySelector('#preview');

    var oFReader = new FileReader();
    oFReader.readAsDataURL(fileUpdate.files[0]);

    oFReader.onload = function (oFREvent) {
        previewImg.src = oFREvent.target.result;
    };
}