/* eslint-disable no-unused-vars */
function initStorage() {
    //On récupère toutes les données déjà intégrées dans la clé user du localStorage
    const user = localStorage.getItem('user');
    if (user !== null) {
        //Si user n'est pas vide
        return JSON.parse(user);
    } else {
        return null;
    }
}
// Ajouter des données dans la clé user
function addStorage(dataUser) {
    let user = initStorage();
    if (!user) { localStorage.setItem('user', JSON.stringify(dataUser)); }
}
// Supprimer une donnée dans la clé user
function removeStorage(dataUser) {
    let user = initStorage();
    //On filtre tous les éléments du tableau
    let userFilter = user.filter(function (data) {
        return data != this;
    }, dataUser);
    //On les réinjecte dans le localStorage sous forme d'un JSOM
    localStorage.setItem('user', JSON.stringify(userFilter));
}
//Supprimer la clé
function clearStorage() {
    localStorage.removeItem('user');
}