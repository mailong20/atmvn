try{
    if (localStorage.getItem('role') !== 'admin') {
        console.log('Hello!!', localStorage.getItem('role'));
      }
}
catch{
    console.log('You do not have permission to access this resource.');
}
