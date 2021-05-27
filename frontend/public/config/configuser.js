/* eslint-disable no-unused-vars */
//On récupère les données du localstorage
let tokenStorage = '';
let dataStorage = '';
const key = window.localStorage.getItem('user');
if(key) {
    dataStorage = JSON.parse(key);
    tokenStorage = dataStorage.token;
    // console.log('tokenStorage', tokenStorage);
}
/*else {
    //userId = '';
    let tokenStorage = '';
    console.log('tokenStorage', tokenStorage);
}*/
// console.log('user', key);
//let userId = '';
//let tokenStorage = '';
//let moderator = '';
//let administrator = '';
/*if(key) {
    const dataStorage = JSON.parse(key);
    // console.log('retour', dataStorage);
    // userId = dataStorage.id;
    let tokenStorage = dataStorage.token;
    //moderator = dataStorage.moderation;
    // administrator = dataStorage.admin;
    console.log('tokenStorage', tokenStorage);
    // console.log('moderator', dataStorage.moderation);
    //console.log('administrator', administrator);
}
else {
    //userId = '';
    let tokenStorage = '';
    console.log('tokenStorage', tokenStorage);
}
*/
