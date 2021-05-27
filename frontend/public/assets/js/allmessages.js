/* eslint-disable no-undef */
document.getElementById('newmessage').href = './newmessage.html';
document.getElementById('profil').href = `./profil.html?id:${userId}`;
// Fonction affichant ou masquant les filtres de messages.html
document.querySelector('#select').addEventListener('click', () => {
    let filtres = document.getElementById('filtres');
    let articles = document.getElementById('articles');
    if(filtres.classList.contains('hidden') == true) {
        filtres.classList.remove('hidden');
        articles.style.height = 67+'vh';
    }
    else {
        filtres.classList.add('hidden');
        articles.style.height = 75+'vh';
    }
});



// Fonction like ou dislike
const els = document.getElementsByTagName('aside');
for (let i = 0 ; i < els.length ; i++) {
    // On récupère l'ordre du aside cliqué
    document.getElementsByTagName('aside')[i].addEventListener('click', () => {
        //console.log('test', i);
        let aside = document.getElementsByTagName('aside')[i];
        //console.log('aside', aside);
        // On se déplace sur le like utilisateur
        let like = aside.querySelector(':nth-child(2) > :nth-child(2)');
        //var like = aside.getElementsByClassName('liked');
        console.log('like', like);
        // S'il a déjà liké ke lessage, on supprime le like
        if (like.classList.contains('hidden') == true) {
            // console.log('hidden', 'true');
            like.classList.remove('hidden');
        }
        else {
            // console.log('hidden', 'false');
            like.classList.add('hidden');
        }
    });
}

