function openDialog(dialogId, floorId=None) {
    const dialog = document.getElementById(dialogId)
    dialog.showModal();
  }

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId)
    dialog.close();
  }

async function addNewFloor(dialogId) {
    console.log(dialogId)
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

    const addFloor = await fetch('/api/floors?floor_name='+floorName+'&floor_description='+floorDescription+'&floor_price='+floorPrice, {
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
        console.log('Thêm mới thành công')
    }
        
}


