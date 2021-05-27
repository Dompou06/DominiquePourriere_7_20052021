const param = (new URL(document.location)).searchParams;
const user = param.get('id');
document.getElementById('messages').href = `./messages.html?id=${user}`;

// S'il n'y a pas de id auteur, c'est donc l'utilisateur qui est sur cette page
else {
    // Fonction affichant ou masquant les options de profil.html
    document.getElementById('select').innerHTML = '<img id="nav--fleche" src="../img/fleche_footer.svg" aria-label="Sélecteur sous forme de flèche" alt="Sélecteur sous forme de flèche" />';

    document.querySelector('#select-options').addEventListener('click', () => {
    // console.log('click');
        let options = document.getElementById('options');
        if(options.classList.contains('hidden') == true) {
            options.classList.remove('hidden');
        }
        else {
            options.classList.add('hidden');
        }
    });
    // Fonction pour changement de département, affichant le nouveau dans 
    const els = document.getElementsByTagName('li');
    for (let i = 0 ; i < els.length ; i++) {
    // On récupère l'ordre du li cliqué
        document.getElementsByTagName('li')[i].addEventListener('click', () => {
        //console.log('test', i);
            let li = document.getElementsByTagName('li')[i].innerHTML;
            //console.log('li', li);
            document.getElementById('departement').value=li;
        });
    }
    // Annuler les modifications et retour au profil 
    document.querySelector('#cancel--update').addEventListener('click', () => {
        document.getElementById('user--profil').classList.remove('hidden');
        document.getElementById('update--profil').classList.add('hidden');
    });
}