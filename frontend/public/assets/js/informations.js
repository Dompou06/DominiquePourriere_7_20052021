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
//console.log(els.length);
for (let i = 0 ; i < els.length ; i++) {
    document.getElementsByClassName('picto--infos')[i].addEventListener('click', obj => {
        // console.log(obj.path[2].attributes[0].value);
        const ancreInfo = obj.path[2].attributes[0].value;
        const info = ancreInfo.split('--')[0];
        // console.log(info);
        document.getElementById('contact').classList.add('hidden');
        document.getElementById('comment').classList.add('hidden');
        document.getElementById('mentions').classList.add('hidden');
        document.getElementById('help').classList.add('hidden');
        if(info !== 'infos') {
            document.getElementById(info).classList.remove('hidden');
        }
        else {
            document.getElementById('help').classList.remove('hidden');
        }
    });
}