/* eslint-disable no-undef */
const param = (new URL(document.location)).searchParams;
//On vérifie qu'il y a un id du profil lorsqu'on a cliqué sur l'auteur dans messages.html
const profilIs = param.has('id_profil');
if(profilIs === true){
    const id_profil = param.get('id_profil');
    const profil = JSON.parse(id_profil);
    // console.log('userId', userId, 'profil', profil);
    //Si le id de l'utilisateur est similaire à celui de l'auteur ou à l'administrateur
    if(userId === profil || userId === userAdmin) {
        // Il peut modifier son profil
        // Fonction affichant ou masquant les options de profil.html
        document.querySelector('#select-options').addEventListener('click', () => {
            // console.log('click');
        });
    }
    //Si l'utilisateur est différent de l'auteur
}
// S'il n'y a pas de id auteur, c'est donc l'utilisateur qui est sur cette page
else {
    // Fonction affichant ou masquant les options de profil.html
    document.getElementById('select').innerHTML = '<i class="fas fa-caret-down"></i>';

    document.querySelector('#select-options').addEventListener('click', () => {
    // console.log('click');
        document.getElementById('options').classList.remove('hidden');           

        let options = document.getElementById('options');
        if(options.classList.contains('hidden') == true) {
            options.classList.remove('hidden');
        }
        else {
            options.classList.add('hidden');
        }
    });

}