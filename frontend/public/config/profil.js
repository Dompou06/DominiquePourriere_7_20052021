/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const params = (new URL(document.location)).searchParams;
const profilId = params.get('id_profil');
//console.log('profilId', profilId);
//console.log('administrator', administrator);
let urlProfile = '';
if(profilId === null){
    
    urlProfile = 'http://localhost:3000/api/auth/profil/null';
}
else {
    urlProfile = `http://localhost:3000/api/auth/profil/${profilId}`;
}
getProfile = async function () {
    try {
        let response = await fetch(urlProfile,
            { method: 'GET',
                headers: {
                    'Authorization': `Token ${tokenStorage}`
                }
            });
        if(response.ok) {
            let profile = await response.json();
            // console.log('profile', profile);
            document.getElementById('user--profil').innerHTML = `
        <div id="id--profil" class="hidden">${profilId}</div>
        <div class="row m--profile">
        <div class="col-12 col-sm-12 col-md-6">
        <div class="row">
        <div class="col-12 col-sm-12 col-md-5">
        <div class="circle-moyen bgprimary text-center txtweight txtwhite txt--circle mb-2">Nom</div>
        </div>
        <div class="col-12 col-sm-12 col-md-7">
        <div id="firstname" class="mb-2 txtweight">${profile.firstnameDecrypt}</div>
        </div>
        </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6">
        <div class="row">
        <div class="col-12 col-sm-12 col-md-5">
        <div class="circle-moyen bgprimary text-center txtweight txtwhite txt--circle mb-2">Prénom</div>
        </div>
        <div class="col-12 col-sm-12 col-md-7">
        <div id="lastname" class="mb-2 txtweight">${profile.lastnameDecrypt}</div>
        </div>
        </div>
        </div>
        </div>
        <div class="row">
        <div class="col-12 col-sm-12 col-md-6">
        <div class="row">
        <div class="col-12 col-sm-12 col-md-3">
        <div class="circle-moyen bgprimary text-center txtweight txtwhite txt--circle mb-2">Avatar</div>
        </div>
        <div class="col-12 col-sm-12 col-md-7">
        <div id="author--profil" class="circle-moyen text-center mb-2">
        </div>
        </div>
        </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6">
        <div class="row">
        <div class="col-12 col-sm-12 col-md-5">
        <div class="circle-moyen bgprimary text-center"><i class="fas fa-tag"></i></div>
        </div>
        <div class="col-12 col-sm-12 col-md-7">
        <div id="departement--name" class="mb-2 txtweight">${profile.nameDepartement}</div>
        <div id="departement--id" class="hidden">${profile.departement}</div>
        </div>
        </div>
        </div>
        </div>
        `;
            if(profile.image_user === null) {
            //console.log('nofile');
                let user = profile.firstnameDecrypt;
                let userInitial = user.substring(0,1).toUpperCase();
                // console.log('userInitial', userInitial);
                document.getElementById('author--profil').classList.add('bgsecondary');
                document.getElementById('author--profil').innerHTML = `<span id="initial-author" class="">
        ${userInitial}</span>`;
            }
            else {
                document.getElementById('author--profil').innerHTML = 
        `<img id="image--profil" class="" src="http://localhost:3000/media/${profile.image_user}" 
        aria-label="Avatar de ${profile.lastnameDecrypt} ${profile.firstnameDecrypt}" alt="Avatar de  ${profile.lastnameDecrypt} ${profile.firstnameDecrypt}" />`;
            }
            // Si l'utilisateur est celui du profil ou un administrareur
            // console.log('profile.hasAdminRights', profile.hasAdminRights);
            if(profile.hasAdminRights === true) {
            //  console.log('administrator', administrator);
                document.querySelector('.fa-user-alt').classList.remove('txtwhite');
                document.querySelector('.fa-user-alt').classList.add('txtsecondary');
                document.getElementById('select').innerHTML = '<i class="fas fa-caret-down"></i>';
                document.getElementById('select').addEventListener('click', () => {
                    document.getElementById('options').classList.remove('hidden');           
                });
                document.querySelector('#update-profil').addEventListener('click', updateProfile);
                document.querySelector('#delete-profil').addEventListener('click', deleteProfile);
            }

            // Si ce n'est pas l'utilisateur ou un administrateur
            else {
                document.getElementById('select').innerHTML = '<i class="fas fa-user-alt"></i>'; 
                document.getElementById('options').classList.add('hidden');           
                document.getElementById('select').classList.remove('cursor');
            }
        }
        else { console.error('erreur :', response.status); }
    }
    catch (error) { console.log(error); }
};
getProfile();

function updateProfile() {
    const idProfil = document.querySelector('#id--profil').innerHTML;
    //  console.log('idProfil', idProfil);
    const firstname = document.querySelector('#firstname').innerHTML;
    const lastname = document.querySelector('#lastname').innerHTML;
    const dep = document.querySelector('#departement--name').innerHTML;
    const idDepart = document.querySelector('#departement--id').innerHTML;
    document.querySelector('#user--profil').innerHTML = `
   <div class="update--desktop row">
   <div class="col-12">
   <div class="row">
       <input type="text" id="update_id" class="hidden no--empty" value="${idProfil}" required />
       <input type="text" id="update_firstname" class="col-9 col-sm-9 col-md-5 mt-3 no--empty" value="${firstname}" required />
       <input type="text" id="update_lastname" class="col-9 col-sm-9 col-md-5 no--empty" value="${lastname}" required />
   </div>                    
   <div class="row">
       <div class="col-3">
           <div id="author" class="circle-moyen bgprimary text-center">
           </div>
       </div>
       <div class="col-7">
           <label for="avatar" class="label-file col-4 cursor"><i class="fas fa-upload"></i></label>
           <input id="avatar" class="input-file" type="file" value="">
       </div>
   </div>
   <div class="departement--update row">                       
       <div class="btn-group dropup col-3 col-sm-3 col-md-2">
           <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <span><i class="fas fa-tag"></i></span>
           </button>
           <ul id="dropdown_departement" class="dropdown-menu" aria-labelledby="dropdown-menu">
           </ul>
       </div>
       <div class="col-9 col-sm-9 col-md-10">
       <input type="text" id="departement-update" class="col-8" value="${dep}" readonly />
       <input type="text" id="id-departement" class="hidden" value="${idDepart}" readonly />
       </div>
   </div>

</div>
</div>
<div id="button--update" class="row">
<div class="col-1 col-sm-1 col-md-2"></div>
<div class="col-2">
   <div id="cancel--update" class="cursor litlecircle" onclick="cancel()" aria-label="Annulez les modifications">X</div>
 </div>
 <div id="update_reponse" class="col-6 col-sm-6 col-md-4"><!-- Réponse backend si erreur --></div>
 <div class="col-2">
   <div id="valid--profil" class="cursor litlecircle" aria-label="Validez vos modifications"><i class="fas fa-check"></i></div>
  </div>
</div>
   `;
    // On intègre les départements dans le dropdown
    const urlGetDepartements = 'http://localhost:3000/api/departements';
    getDepartements = async function () {
        try {
            let response = await fetch(urlGetDepartements,
            );
            if(response.ok) {
                let departements = await response.json();
                //console.log('departements', departements);
                for (let i = 0; i < departements.length; i++) {
                    document.getElementById('dropdown_departement').innerHTML +=
                `<li id="${departements[i].id}" class="pl-2">${departements[i].name_departement}</li>`;
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
        for (let i = 0 ; i < liDepartement.length ; i++) {
            liDepartement[i].addEventListener('click', () => {  
                let liText = liDepartement[i].innerHTML;
                let liId = liDepartement[i].id;
                document.getElementById('id-departement').value = liId;
                document.getElementById('departement-update').value = liText;
            });
        }
    }); 

    // On envoies les modifications
    document.querySelector('#user--profil #valid--profil').addEventListener('click', () => {
        const noEmpty = document.getElementsByClassName('no--empty');
        let valid = true;
        for (let numberOfFields = 0; numberOfFields < noEmpty.length; numberOfFields++) {
            //console.log(noEmpty[numberOfFields].reportValidity());
            if (!noEmpty[numberOfFields].reportValidity()) {
                valid = false;
            }
        }
        if (valid) {
            const urlPutUser = `http://localhost:3000/api/auth/update/${idProfil}`;
            putUser = async function (data) {
                let reponse = await fetch(urlPutUser, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Token ${tokenStorage}`
                    },
                    body:data
                });
                try {
                    let result = await reponse.json();
                    if(reponse.ok) {
                        window.location.assign(`./profil.html?id_profil=${idProfil}`);
                    }
                    else {
                        console.log(result);
                        document.getElementById('update_reponse').innerHTML = result.message;
                    } 
                }
                catch(error) {
                    console.log(error);
                }
            }; 
            const updateParent = document.querySelector('.update--desktop');
            const childs = updateParent.getElementsByTagName('input');
            const childFile = updateParent.getElementsByTagName('input[type=file]');
            // console.log('childs', childs);
            let id = childs[0].value;
            let firstname = childs[1].value;
            let lastname = childs[2].value;
            let departement = childs[5].value;
            let file = childs[3].files[0];
            //console.log('file', file);
            let dataUpdateUser = {
                id_profile: id,  
                departement: departement,
                firstname: firstname,
                lastname: lastname
            };
            let formData = new FormData();
            let JsonDataUser = JSON.stringify(dataUpdateUser);                
            formData.append('profil', JsonDataUser);
            if(file !== undefined) {
                formData.append('media', file);
            }
            putUser(formData);    
        }
    });


}

function deleteProfile() {
    const idProfil = document.querySelector('#id--profil').innerHTML;
    console.log('idProfil', idProfil);
    const urlPutUser = `http://localhost:3000/api/auth/delete/${profilId}`;
    deleteUser = async function () {
        let reponse = await fetch(urlPutUser, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${tokenStorage}`
            }
        });
        try {
            let result = await reponse.json();
            if(reponse.ok) {
                // On supprime les données dans LocalStorage de l'utilisateur si ce n'est pas un administrateur
                if(result.adminRights === false) {
                    clearStorage();
                    window.location.assign('../index.html');
                }
                //Sinon, c'est l'administrateur qui a supprimé le profil
                else {
                    document.location.assign('../index.html');
                    // document.getElementById('user--profil').innerHTML = result.message;
                }
            }
            else {
                console.log(result);
                document.getElementById('update_reponse').innerHTML = result.message;
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    deleteUser();

    
}
