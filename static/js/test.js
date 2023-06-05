function ranId(n = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


var table = document.querySelector('#table');
var rowTemplate = document.querySelector('#row-template');
var addButton = document.querySelector('#add-button');

var fileInputUpdate = document.querySelector('#file_input_update');

addButton.addEventListener('click', function () {
    print('test')
    fileInput.click();
});

fileInput.addEventListener('change', function () {
    const files = this.files; // Lấy danh sách các file đã chọn
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

            nameImage.id = baseId;
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
});
function deleteRow(idRow) {
    row = document.querySelector(`#${idRow}`);
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