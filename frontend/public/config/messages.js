/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//console.log('userId', userId);
// console.log('administrator', administrator);
const urlGetMessages = 'http://localhost:3000/api/messages';
getMessages = async function () {
    try {
        let response = await fetch(urlGetMessages,
            { method: 'GET'}
        );
        if(response.ok) {
            let messages = await response.json();
            for (let i = 0; i < messages.length; i++) {
                let likes = messages[i].like_created_at;
                // Si l'article n'a pas encore été liké
                let numberLikes = '';
                if (likes !== null) { numberLikes = likes.length; } 
                const article = `<section id="message_${messages[i].id_message}" class="row" aria-label="Voir le message">
              <div class="articlebody">
              <article class="row">         
              <div class="circles">
              <div class="circle-moyen bgsecondary text-center">${messages[i].initial}</div>
              <a href="./profil.html/id_profil=${messages[i].author}" aria-label="Voir le profil de l'auteur" alt="Voir le profil de l'auteur">  
              <div class="avatar circle-moyen bgprimary text-center hidden"></div>
              </a> 
              <div id="update_${messages[i].id_message}" class="action cursor hidden" onclick="updateMessage(${messages[i].id_message})" aria-label="Modifiez le message">
              <i class="fas fa-pencil-alt"></i>
              </div> 
              <div id="delete_${messages[i].id_message}" class="action txtweight cursor hidden" onclick="deleteMessage(${messages[i].id_message})" aria-label="Supprimez le message">
              <i class="fas fa-trash"></i>
              </div>
              </div>
              <div class="message">
              <div class="article-titre article--titre--ellipsis txtweight" onclick="oneMessage(${messages[i].id_message})">${messages[i].title}</div>
              <div class="informations"></div>
              <div class="download--file hidden">
              <label for="file_${messages[i].id_message}" class="cursor" aria-label="Changez de fichier"><i class="fas fa-upload"></i></label>
              <input id="file_${messages[i].id_message}" class="input-file" type="file" accept="image/png, image/jpeg, image/jpg" />
              <input id="caption_${messages[i].id_message}" class="caption hidden" aria-label="Description du fichier" placeholder="Description" value="" />             
              </div> 
              <div id="" class="file hidden"></div>
              <div class="article--body"></div>
              <div class="buttons--update row hidden">
              <div class="col-1 col-sm-1 col-md-1"></div>
              <div class="button--cancel cursor" onclick="cancel()" aria-label="Annulez les modifications">X</div>
              <div class="update_reponse col-6 col-sm-6 col-md-8"><!-- Réponse backend si erreur --></div>
              <div class="button--update cursor" aria-label="Validez vos modifications"><i class="fas fa-check"></i></div>
              <div class="col-1 col-sm-1 col-md-1"></div>
              </div>
              </div>
            </article>
            </div>
            <aside class="col-1">
              <div class="like cursor circle-like">
                <i class="fas fa-thumbs-up"></i><br />
                <span class="number-like">${numberLikes}</span>
              </div>
              <div class="liked hidden">${messages[i].userslike}</div>
            </aside>
          </section>`;
                // On affiche les cinq premiers articles
                if(i < 5) { document.getElementById('articles--1').innerHTML += article; }
                // On affiche les cinq derniers articles
                else { document.getElementById('articles--2').innerHTML += article; }
            }
        }
        else {
            // On supprime la key du LocalStorage
            // clearStorage();
            //Et on redirige vers la page index
            // window.location.assign('../index.html');
        }
    }     
    catch (error) {
        console.log('error', error);
    }
};
getMessages();
//Affichage du message du titre cliqué
function oneMessage(messageId) {
    const urlMessage = `http://localhost:3000/api/messages/${messageId}`;
    // const urlMessage = `http://localhost:3000/api/messages/${tokenStorage}/${messageId}`;
    //console.log('urlMessage', urlMessage);
    getOneMessage = async function () {
        try {
            let response = await fetch(urlMessage,
                {method: 'GET',
                    headers: {
                        'Authorization': `Token ${tokenStorage}`
                    }
                });
            //  console.log('response', response);
            if(response.ok) {
                let message = await response.json();
                // console.log(message);
                const titre = document.querySelector(`#message_${messageId} .article-titre`);
                const ellipsis = titre.classList.contains('article--titre--ellipsis');
                //console.log('ellipsis', ellipsis);
                if(ellipsis === true) { titre.classList.remove('article--titre--ellipsis'); }
                titre.classList.add('article--titre');
                document.querySelector(`#message_${messageId} .informations`).innerHTML =
                ` 
                <div class="author">${message.lastnameDecrypt} ${message.firstnameDecrypt}</div>
                <div id="createdate_${messageId}" class="time"></div>
                `;
                let publishedTime = '';
                let updatedTime = '';
                // S'il y a une mise à jour
                if(message.updated_at !== null) {
                    let updatedAt = message.updated_at;
                    const dateTimeNow = new Date();
                    var diffTime = dateTimeNow.getTime() - new Date(updatedAt).getTime(); 
                    var days = diffTime / (1000 * 3600 * 24); 
                    var hours = diffTime / (1000 * 3600); 
                    var minutes = diffTime / (1000 * 60);
                    if(Math.trunc(days) > 0){ 
                        if (Math.trunc(days) === 1){
                            updatedTime = `Mis à jour, il y a ${Math.trunc(days)} jour`;}
                        else{ updatedTime = `Mis à jour, il y a ${Math.trunc(days)} jours`; }
                    }
                    else {
                        if(Math.trunc(hours) > 0) {
                            if (Math.trunc(hours) === 1){
                                updatedTime = `Mis à jour, il y a ${Math.trunc(hours)} heure`;}
                            else{ updatedTime = `Mis à jour, il y a ${Math.trunc(hours)} heures`; }
                        }
                        else{                  
                            if(Math.trunc(minutes) > 0) {
                                if (Math.trunc(minutes) === 1){
                                    updatedTime = `Mis à jour, il y a ${Math.trunc(minutes)} minute`;}
                                else if(Math.trunc(minutes) > 1){ updatedTime = `Mis à jour, il y a ${Math.trunc(minutes)} minutes`; }
                            }
                            else{updatedTime = 'Mis à jour';}
    
                        }
                    }
                    document.getElementById(`createdate_${messageId}`).innerHTML= updatedTime;
                }
                // Si aucune mise à jour
                else {
                    let createAt = message.created_at;
                    const dateTimeNow = new Date();
                    let diffTime = dateTimeNow.getTime() - new Date(createAt).getTime(); 
                    let days = diffTime / (1000 * 3600 * 24); 
                    let hours = diffTime / (1000 * 3600); 
                    let minutes = diffTime / (1000 * 60);
                    if(Math.trunc(days) > 0){ 
                        if (Math.trunc(days) === 1){
                            publishedTime = `${Math.trunc(days)} jour`;}
                        else{ publishedTime = `${Math.trunc(days)} jours`; }
                    }
                    else {
                        if(Math.trunc(hours) > 0) {
                            if (Math.trunc(hours) === 1){
                                publishedTime = `${Math.trunc(hours)} heure`;}
                            else{ publishedTime = `${Math.trunc(hours)} heures`; }
                        }
                        else{                  
                            if(Math.trunc(minutes) > 0) {
                                if (Math.trunc(minutes) === 1){
                                    publishedTime = `${Math.trunc(minutes)} minute`;}
                                else{ publishedTime = `${Math.trunc(minutes)} minutes`; }
                            }
                        }
                    }
                    document.getElementById(`createdate_${messageId}`).innerHTML= publishedTime;
                }
                // Lien vers le profil de l'auteur
                let linkAuthor = document.querySelector(`#message_${messageId} .circles a`);
                linkAuthor.addEventListener('click', () => {
                    linkAuthor.href = `./profil.html?id_profil=${message.idAuthor}`;
                });
                // Si l'auteur a un avatar 
                const avatar = document.querySelector(`#message_${messageId} .avatar`); 
                avatar.classList.remove('hidden');
                // console.log('message.imgUser', message.imgUser); 
                if(message.imgUser !== null){ 
                    //   console.log('message.image_user', message.image_user);
                    avatar.innerHTML = `<img id="image-author_${messageId}" class="" 
              src="${message.imgUser}" 
              aria-label="Avatar de l'auteur du message" 
              alt="Avatar de l'auteur du message" />`;
                }
                else{
                    //Sinon, on récupère L'initiale de son nom
                    let author = message.firstnameDecrypt;
                    // console.log('author', author);
                    let authorInitial = author.substring(0,1).toUpperCase();
                    avatar.innerHTML = `<span id="initial-author_${messageId}" class="">
                ${authorInitial}</span>`;
                }              
                let body = message.body;
                let bodyParagraph = body.replace(/\n/g,'</p><p class="mt-2">"');
                // console.log(`<p>${bodyParagraph}</p>`);
                document.querySelector(`#message_${messageId} .article--body`).innerHTML = `<p>${bodyParagraph}</p>`;
                //Si le message comporte un fichier
                //console.log('message.media', message.media);
                if(message.media !== null) {  
                    //  console.log('message.media', message.media);
                    document.querySelector(`#message_${messageId} .file`).setAttribute('id', `file_${messageId}`);
                    document.querySelector(`#message_${messageId} .file`).classList.remove('hidden');
                    document.querySelector(`#message_${messageId} .file`).innerHTML = `
                  <img class="file--message" src="${message.media}" 
                  alt="${message.caption}" 
                  aria-label="${message.caption}" />
                  `;
                    let firstParagraph = document.querySelector(`#message_${messageId} .article--body`).firstElementChild;
                    firstParagraph.classList.add('first--p');
                }
                // Si l'auteur est l'utilisateur ou s'il a un statut de modérateur
                //   console.log('message.hasAdminRights', message.hasAdminRights);
                if(message.hasAdminRights === true) {
                    let actionMessage = document.querySelectorAll(`#message_${messageId} .action`);
                    for (let i = 0; i < actionMessage.length; i++) {
                        // console.log('i', i, 'actionMessage[i]', actionMessage[i]);
                        actionMessage[i].classList.remove('hidden');
                    }           
                }
            }
        }
        catch(error) {
            console.log('error', error);
        }
    };
    getOneMessage();
}
function updateMessage(messageId) {
    document.querySelector(`#message_${messageId} .article-titre`).onclick = () => { return false; };
    //On crée un textarea avec le titre actuel
    const oldTitle = document.querySelector(`#message_${messageId} .article--titre`).innerHTML;
    const textareaTitle = `<textarea id="title--update_${messageId}" class="txtweight no--empty" required>${oldTitle}</textarea>`;
    document.querySelector(`#message_${messageId} .article--titre`).innerHTML=textareaTitle;
    
    // On affiche l'input file
    document.querySelector(`#message_${messageId} .download--file`).classList.remove('hidden');
    document.querySelector(`#message_${messageId} .buttons--update`).classList.remove('hidden');
    //On crée un textarea avec le texte actuel
    const oldTextWhitP = document.querySelector(`#message_${messageId} .article--body`).innerHTML;
    //  console.log('oldText', oldText);
    const oldTex = oldTextWhitP.replace('<p class="first--p">', '').replace('<p></p>', '\n').replace('</p>', '').replace('<p>', '');
    const textareaText = `<textarea id="editpr--update_${messageId}" class="no--empty" required>${oldTex}</textarea>`;
    document.querySelector(`#message_${messageId} .article--body`).innerHTML=textareaText;
    // Si on change ou ajoute un fichier le fichier
    document.querySelector(`#message_${messageId} .download--file`).addEventListener('click', () => {
        document.querySelector(`#message_${messageId} #caption_${messageId}`).classList.remove('hidden');
    });
    // On valide les modifications
    document.querySelector(`#message_${messageId} .button--update`).addEventListener('click', () => {
        // console.log('Validation update');
        let noEmpty = document.getElementsByClassName('no--empty');
        let valid = true;
        for (let numberOfFields = 0; numberOfFields < noEmpty.length; numberOfFields++) {
        //console.log(noEmpty[numberOfFields].reportValidity());
            if (!noEmpty[numberOfFields].reportValidity()) {
                valid = false;
            }
        }
        if (valid) {
            const urlPutMessage = `http://localhost:3000/api/messages/${messageId}`;
            putMessage = async function (data) {
                let reponse = await fetch(urlPutMessage, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Token ${tokenStorage}`
                    },
                    body:data
                });
                try {
                    let result = await reponse.json();
                    if(reponse.ok) {
                        window.location.assign('./messages.html');
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
            let titleValue = document.querySelector(`#message_${messageId} .article--titre`).firstElementChild.value;
            let bodyValue = document.querySelector(`#message_${messageId} .article--body`).firstElementChild.value;
            //console.log('captionValue', captionValue);
            let dataUpdateMessage = {  
                title: titleValue,
                body: bodyValue
            };
            let formData = new FormData();
            let JsonDataMessage = JSON.stringify(dataUpdateMessage);
            formData.append('message', JsonDataMessage);
            let fileValue = document.querySelector(`#message_${messageId} .input-file`).files[0];          
            if(fileValue !== undefined) {
                let captionValue = document.querySelector(`#message_${messageId} .caption`).value;
                formData.append('caption', captionValue);
                formData.append('media', fileValue);
            }
            putMessage(formData);
            
        }
        else {
            console.error('erreur :', response.status);
        }
    });
}
function cancel() {
    document.location.reload();
}
function deleteMessage(messageId) {
    console.log('messageId', messageId);
    const urlMessage = `http://localhost:3000/api/messages/${messageId}`;
    deleteOneMessage = async function () {
        try {
            //  console.log('deleteId', deleteId);
            let response = await fetch(urlMessage,
                {method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${tokenStorage}`
                    },
                });
                //   console.log('response', response);
            if(response.ok) {
                let message = await response.json();
                // console.log(message);
                window.location.assign('./messages.html');
            }
        }
        catch (error) {
            console.log(message);
        }
    };
    deleteOneMessage();
    
}