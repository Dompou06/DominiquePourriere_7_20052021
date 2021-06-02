/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mobile = window.matchMedia('(max-width: 540px)');
const minTablet = window.matchMedia('(min-width: 541px)');
const maxTablet = window.matchMedia('(max-width: 791px)');
const desktop = window.matchMedia('(min-width: 792px)');
if(tokenStorage === '') {
    // console.log('ok');
    // On clique sur Connexion en version public
    document.querySelector('#connexion p').addEventListener('click', () => {
        // console.log('ok');
        document.getElementById('inscription').classList.add('hidden');
        document.getElementById('nav--home').classList.remove('cancel--inscription');
        document.getElementById('nav--home').classList.remove('nav--cancel');
        if(mobile.matches) {
            document.getElementById('nav--home').className = 'nav--connexion';
        }
        else if (desktop.matches) {
            document.getElementById('inscription_input').classList.add('hidden');
            document.getElementById('connexion_input').classList.add('anim--connexion');
        }
        document.getElementById('connexion_input').classList.add('form--connexion');
        document.getElementById('connexion_input').innerHTML = `
    <input type="text" id="email" placeholder="Email" required />
    <input type="text" id="password" placeholder="Password" required />
    <div id="connexion_button" class="row">
    <div class="col-1"></div>
      <div id="cancel--connexion" class="litlecircle cursor" aria-label="Annulez">X</div>
      <div id="connexion_reponse" class="col-6 col-sm-6 col-md-6"></div>
      <div id="login" class="login litlecircle cursor" aria-label="Validez votre connexion"><i class="fas fa-check"></i></div>
      <div class="col-1 col-sm-1 col-md-2"></div>
      </div>
    `;

        // On masque le formulaire de connexion
        document.querySelector('#cancel--connexion').addEventListener('click', () => { 
            if(mobile.matches) {
                document.getElementById('nav--home').classList.remove('nav--connexion');
            }
            else if (desktop.matches) {
                document.getElementById('connexion_input').classList.remove('anim--connexion');
            }
            document.getElementById('nav--home').classList.add('nav--cancel');
            document.getElementById('connexion_input').innerHTML = '';
            document.getElementById('inscription').classList.remove('hidden');
        });
        // L'utilisateur tente de se connecter
        document.querySelector('#login').addEventListener('click', login, true);
        /* document.querySelector('#login').addEventListener('click', () => {
            console.log('ok');
        });*/
    });
    // On clique sur Inscription en version public
    document.querySelector('#inscription p').addEventListener('click', () => { 
        if(mobile.matches) {      
            document.getElementById('connexion').classList.add('hidden');
            document.getElementById('nav--home').classList.remove('cancel--incription');   
            document.getElementById('nav--home').classList.remove('nav--cancel');  
            document.getElementById('nav--home').classList.remove('nav--connection');   
            document.getElementById('nav--home').classList.add('nav--inscription');
        }
        document.getElementById('inscription_input').classList.remove('hidden');
        document.getElementById('inscription_input').classList.add('form--inscription');
        document.getElementById('inscription_input').innerHTML = `
    <div class="row">
    <div class="btn-group dropright col-2 pl-0 pr-0">
      <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span><i class="fas fa-tag"></i></span>
      </button>
      <ul id="dropdown_departement" class="dropdown-menu" aria-labelledby="dropdown-menu">
      </ul>
    </div>
    <input type="text" id="initial-departement" class="hidden" value="" />
    <input type="text" id="inscription-departement" class="col-6 ml-2 mr-4 pl-0 pr-0" value="" readonly />

    <div id="inscription_file" class="row col-3 pr-0 pl-0">
      <div class="mr-2"><i class="fas fa-user-alt"></i></div>
      <label for="avatar" class="col-8 text-center cursor"><i class="fas fa-upload"></i></label>
      <input id="avatar" class="input-file" type="file">
    </div>
  </div>
    <input type="text" id="inscription_firstname" placeholder="Nom" required />
    <input type="text" id="inscription_lastname" placeholder="Prénom" required />
    <input type="text" id="inscription_email" placeholder="Email" required />
    <input type="text" id="inscription_password" placeholder="Password" required />
    <div id="inscription_button">
    <div class="row">
    <div class="col-1"></div>
      <div id="cancel--inscription" class="litlecircle text-center cursor" aria-label="Annulez">X</div>
      <div id="inscription_reponse" class="col-7 col-sm-7 col-md-4"></div>
      <div id="signup" class="signup litlecircle text-center cursor" aria-label="Validez votre inscription"><i class="fas fa-check"></i></div>
      </div>
    </div>
    `;
        // On intègre les départements dans le dropdown de l'inscription
        const urlGetDepartements = 'http://localhost:3000/api/departements';
        getDepartements = async function () {
            let response = await fetch(urlGetDepartements);
            try {
                if(response.ok) {
                    let departements = await response.json();
                    // console.log('departements', departements);
                    for (let i = 0; i < departements.length; i++) {
                        document.getElementById('dropdown_departement').innerHTML += `<li id="${departements[i].id}" class="pl-2">${departements[i].name_departement}</li>`;
                    }
                }
                else {console.error('erreur :', response.status);}
            }
            catch (error) {
                console.log(error);
            }
        };
        getDepartements();

        // On clique sur une option du menu dropdown de Départements dans Inscription, on remplit l'input inscription-departement
        const dropdownDepartement = document.getElementById('dropdown_departement');
        dropdownDepartement.addEventListener('mousedown', () => {
            let liDepartement = dropdownDepartement.childNodes;
            // console.log(dropdownDepartement.childNodes);  
            for (let i = 0 ; i < liDepartement.length ; i++) {
                // console.log('allLi', i);
                liDepartement[i].addEventListener('click', () => {  
                    document.getElementById('initial-departement').value = '';
                    document.getElementById('inscription-departement').value = '';
                    //  console.log(liDepartement[i].id);
                    let liText = liDepartement[i].innerHTML;
                    let liId = liDepartement[i].id;
                    document.getElementById('initial-departement').value = liId;
                    document.getElementById('inscription-departement').value = liText;
                });     
            }
        });

        // On masque le formulaire d'Inscription'
        document.querySelector('#cancel--inscription').addEventListener('click', () => { 
            document.getElementById('nav--home').classList.remove('nav--inscription');
            document.getElementById('nav--home').classList.remove('nav--connexion');
            document.getElementById('nav--home').classList.add('cancel--incription');
            document.getElementById('inscription_input').innerHTML = '';
            document.getElementById('connexion').classList.remove('hidden');
        });
        // L'utilisateur souhaite s'incrire
        document.getElementById('signup').addEventListener('click', signup, true);
    });
}
else {
    window.onload = autologin;
}

function autologin () {
    // console.log('tokenStorage', tokenStorage);
    if(tokenStorage !== ''){
        const urlAutoLogin = 'http://localhost:3000/api/auth/userid/';
        postUser = async function () {
            let reponse = await fetch(urlAutoLogin, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${tokenStorage}`
                },
            });
            try {
                let result = await reponse.json();
                // console.log('result', result);
                if(reponse.ok) {
                //  console.log('result', result);
                    window.location.assign('./pages/messages.html');
                }
                else {
                // Si le token a expiré ou si on force le retour à la page index
                // console.log('result', result);
                    clearStorage();
                    window.location.assign('./index.html');
                }
            }
            catch (error) {
                //   console.log('error');
            }
        };
        postUser();
    }
}

function login () {
    const loginParent = document.getElementById('connexion');
    const loginInputs = loginParent.getElementsByTagName('input');
    let valid = true;
    for (let numberOfInputs = 0; numberOfInputs < loginInputs.length; numberOfInputs++) {
        //Si certains champs input sont vides et donc ne sont pas conformes à required,
        //console.log(!signupInputs[numberOfInputs].reportValidity());
        if (!loginInputs[numberOfInputs].reportValidity()) {
            valid = false;
        }
    }
    // Si tous les champs sont remplis
    if (valid) {
        let mailValue = document.getElementById('email').value;
        let passwordValue = document.getElementById('password').value;
        const urlPostLogin = 'http://localhost:3000/api/auth/login';
        postLogin = async function (data) {
            // console.log('data', data);
            let postData = await fetch(urlPostLogin, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:data
            });
            try {
                let result = await postData.json();
                //console.log('result', result);

                if(postData.ok) {
                    // console.log('result', result);
                    // console.log('result.userID', result.userId); 
                    let dataUser = { token: result.token };
                    if(dataUser !== '') {
                        //   console.log('dataUser', dataUser);
                        addStorage(dataUser); 
                        window.location.assign('./pages/messages.html');
                    }
                    else {
                        // console.log('no');
                        document.getElementById('connexion_reponse').innerHTML = 'Connexion invalide';
                    }
                }
            }
            catch(error) {
                //console.log('no'); 
                //  console.log('error', error.message);
                // const reponseError = JSON.parse(error);
                document.getElementById('connexion_reponse').innerHTML = 'Connexion invalide';
            }
        };
        const inputLogin = {
            email: mailValue,
            password: passwordValue
        };
        let dataLogin = JSON.stringify(inputLogin);
        // console.log('dataLogin', dataLogin);
        postLogin(dataLogin);
    }
}
function signup() {
    const signupParent = document.getElementById('inscription');
    const signupInputs = signupParent.getElementsByTagName('input');
    let valid = true;
    for (let numberOfInputs = 0; numberOfInputs < signupInputs.length; numberOfInputs++) {
        //Si les champs input requis sont vides,
        //console.log(!signupInputs[numberOfInputs].reportValidity());
        if (!signupInputs[numberOfInputs].reportValidity()) {
            valid = false;
        }
    }
    if (valid) {
        let departementValue = document.getElementById('initial-departement').value;
        let firstnameValue = document.getElementById('inscription_firstname').value;
        let lastnameValue = document.getElementById('inscription_lastname').value;
        let mailValue = document.getElementById('inscription_email').value;
        let passwordValue = document.getElementById('inscription_password').value;
        let avatarValue = document.getElementById('avatar').files[0];
        // console.log('avatarValue', avatarValue);
        const urlPostSignup = 'http://localhost:3000/api/auth/signup';
        const dataSignup = {  
            firstname: firstnameValue,
            lastname: lastnameValue,
            email: mailValue,
            password: passwordValue,
            departement: departementValue
        };
        let JsondataSignup = JSON.stringify(dataSignup);
        let dataWithFile = new FormData();
        dataWithFile.append('user', JsondataSignup);
        dataWithFile.append('media', avatarValue);
        // Pas de fichier avatar
        if(avatarValue === undefined) {
            const insertSignup = async function (data) {
                let reponseSignup = await fetch(urlPostSignup, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                });
                try {
                    let result = await reponseSignup.json();
                    // console.log('reponseSignup.json()', reponseSignup.json());
                    if(reponseSignup.ok) {
                        //  console.log('result', result);
                        const dataUser = {
                            token: result.isToken
                        };
                        addStorage(dataUser); 
                        window.location.assign('./pages/messages.html');
                    } 
                    else {
                        //console.log(result);
                        document.getElementById('inscription_reponse').innerHTML = 'Inscription invalide';
                    }
                }
                catch(error) {
                    // console.log(error);
                    document.getElementById('inscription_reponse').innerHTML = 'Inscription invalide';
                }
            };
            insertSignup(dataSignup);

        }
        //Avec un fichier avatar
        else {
            const insertSignup = async function (data) {
                let reponse = await fetch(urlPostSignup, {
                    method: 'POST',
                    body:data
                });
                try {
                    let result = await reponse.json();
                    console.log('reponse', reponse, 'result', result);
                    if(reponse.ok) {
                        const dataUser = {
                            token: result.isToken
                        };
                        addStorage(dataUser); 
                        window.location.assign('./pages/messages.html');
                    } 
                    else {
                        console.log(result);
                        document.getElementById('inscription_reponse').innerHTML = result.message;
                    }
                }
                catch(error) {
                    console.log(error);
                }
            };
            insertSignup(dataWithFile);   
        }
    }
}