let host = window.location.host

// console.log(host);
let headers = new Headers();
headers.append("accept", "application/json");
headers.append("Content-Type", "application/x-www-form-urlencoded");
// headers.append('Authorization', localStorage.getItem('Authorization'));


function redirectFloor() {
    window.location.href = "/admin/floor";
}

async function login() {
    let username = document.getElementById('userEmail');
    let password = document.getElementById('userPass');

    // console.log(username.value, password.value);

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "");
    urlencoded.append("username", username.value);
    urlencoded.append("password", password.value);
    urlencoded.append("scope", "");
    urlencoded.append("client_id", "");
    urlencoded.append("client_secret", "");

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: urlencoded,
        redirect: 'follow'
    };

    // headers.append('Authorization', e.access_token)
    const checkLogin = await fetch("/api/login/", requestOptions)

    if (checkLogin.status === 200) {
        const data = await checkLogin.json();
        const accessToken = data.access_token;
        const tokenType = data.token_type;
        console.log(accessToken, tokenType);
        headers.append('Authorization', tokenType + ' ' + accessToken);
        localStorage.setItem('Authorization', tokenType + ' ' + accessToken);
        // generateMessage('success', "Bạn đăng nhập thành công!")
        redirectFloor();
    }
    else {
        generateMessage("danger", 'Đăng nhập thất bại!')

    }
}



function check_token() {

    fetch('/api/login/check_token', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('Authorization'),
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == "success") {
                redirectFloor()

            }

        })
        .catch(error => {
            // xử lý lỗi trong quá trình gọi API
            console.error(error);
        });
}

