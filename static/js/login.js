let host = window.location.host

// console.log(host);
let headers = new Headers();
headers.append("accept", "application/json");
headers.append("Content-Type", "application/x-www-form-urlencoded");
// headers.append('Authorization', localStorage.getItem('Authorization'));


function redirectFloor() {
    window.location.href = "/admin/floor";
}

function login() {
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
    fetch("/api/login/", requestOptions)
        .then(response => response.text().then((e) => {
            headers.append('Authorization', JSON.parse(e).token_type + ' ' + JSON.parse(e).access_token);
            localStorage.setItem('Authorization', JSON.parse(e).token_type + ' ' + JSON.parse(e).access_token);
            console.log(localStorage.getItem('Authorization'));
            redirectFloor();
        }))
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

const btnSubmit = document.getElementById('submit');

btnSubmit.addEventListener('click', (e) => {
    login();
})



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
check_token();
