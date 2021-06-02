// Fonction affichant ou masquant les pictos infos de informations.html
document.querySelector('#select').addEventListener('click', () => {
    let infos = document.getElementById('infos');
    //let articles = document.getElementById('articles');
    if(infos.classList.contains('hidden') == true) {
        infos.classList.remove('hidden');
    }
    else {
        infos.classList.add('hidden');
    }
});
// Affichage selon paramètre dans URL
//console.log('url', window.location.search);
let searchParams = new URLSearchParams(window.location.search);
// Vérification que le get est bien info
searchParams.has('info'); 
// Récupération de sa valeur
let param = searchParams.get('info');
//console.log('param', param);
document.getElementById('contact').classList.add('hidden');
document.getElementById('comment').classList.add('hidden');
document.getElementById('mentions').classList.add('hidden');
document.getElementById('help').classList.add('hidden');
document.getElementById(param).classList.remove('hidden');

// Affichage selon choix dans sélecteur 
const els = document.getElementsByClassName('picto--infos');
//console.log('els', els.length);
for (let i = 0 ; i < els.length ; i++) {
    document.getElementsByClassName('picto--infos')[i].addEventListener('click', () => {
        if(window.matchMedia('(min-width: 768px)').matches) {
            document.getElementById('infos').classList.add('hidden');
        }
        document.getElementById('contact').classList.add('hidden');
        document.getElementById('comment').classList.add('hidden');
        document.getElementById('mentions').classList.add('hidden');
        document.getElementById('help').classList.add('hidden');
        if(i === 0) {
            document.getElementById('contact').classList.remove('hidden');
        }
        else if(i === 1)  {
            document.getElementById('comment').classList.remove('hidden');
        }
        else if(i === 2)  {
            document.getElementById('mentions').classList.remove('hidden');
        }
        else if(i === 3)  {
            document.getElementById('help').classList.remove('hidden');
        }
    });
}