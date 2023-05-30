let host = window.location.host

let headers = new Headers();
headers.append("accept", "application/json");
headers.append("Content-Type", "application/x-www-form-urlencoded");
headers.append('Authorization', localStorage.getItem('Authorization'));

function loadTable() {
    // thực hiện yêu cầu GET đến endpoint của Floor
    fetch('/api/floors/', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('Authorization'),
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const table = document.getElementById('myTable');

            // Thêm dữ liệu vào bảng
            for (let i = 0; i < data.length; i++) {
                const floor = data[i];
                const row = table.insertRow(i + 1);
                row.innerHTML = `
          <td>${i + 1}</td>
          <td>${floor.floor_name}</td>
          <td><img src="http://${host}/${floor.floor_image}" alt="${floor.floor_name}" style="width:80px;height:80px;"></td>
          <td>${floor.floor_description}</td>
          <td>${floor.floor_price}</td>
          <td><button class="button type1" onclick="openDialog('edit-floor-dialog', ${floor.floor_id})"
                <span class="btn-txt">Edit</span>
                </button>
            </td>
            <td>
                <button class="button type2" >
                <span class="btn-txt">Delete</span>
                </button>
            </td>
          `;
            }
        })
        .catch(error => {
            // xử lý lỗi trong quá trình gọi API
            console.error(error);
        });
}


async function check_token() {
    const checkToken = await fetch('/api/login/check_token', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('Authorization'),
            'Accept': 'application/json'
        },
    })
    console.log(checkToken);
    if (checkToken.status === 401) {
        console.log('test');
        // window.location.href = 'http://' + host + '/login';
    }
}


