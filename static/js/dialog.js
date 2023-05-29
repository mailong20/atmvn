const btnAddFloor = document.getElementById('btnaddFloor');
const btnEditFloor = document.getElementById('btn-edit-floor');
const addDialog = document.getElementById("add-floor-dialog")
const editDialog = document.getElementById("edit-floor-dialog")
btnAddFloor.addEventListener('click', (e) => {
    addDialog.showModal();
})
const btnClodeAddFloor = document.getElementById('btn-close-add-floor');
btnClodeAddFloor.addEventListener('click', (e) => {
    addDialog.close();

})

function editFloor(floor_id) {
    console.log(floor_id)
    editDialog.showModal();
}

async function deleteFloor(floor_id){
    console.log('xóa', floor_id)
    var confirmDeleteFloor = confirm('Are you sure you want to delete this floor?');
    if(confirmDeleteFloor){
        const deletefloor = await fetch('/api/floors/'+floor_id, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('Authorization'),
                'Accept': 'application/json'
            },
        })
        
        if (deletefloor.status === 204) {
           console.log("Thành Công!!!")
           location.reload();
        }
    }
}

