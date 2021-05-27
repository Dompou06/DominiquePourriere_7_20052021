/* eslint-disable no-undef */
const params = (new URL(document.location)).searchParams;
const messageId = params.get('id_article');
//console.log('messageId', messageId);
// On récupère le message
const urlMessage = `http://localhost:3000/api/messages/${messageId}`;
getMessage = async function () {
    try {
        let response = await fetch(urlMessage,
            {method: 'GET',
                headers: {
                    'Authorization': `Token ${tokenStorage}`
                }
            });
        if(response.ok) {
            let message = await response.json();
            //Si l'utilisateur et aussi l'auteur, il peut modifier ou supprimer le message
            if(userId === message.idAuthor) {
                document.getElementById('select-options').innerHTML= `
                <div id="select" class="nav--circle bgprimary txtwhite footer_fontsize text-center">
                <img id="nav--fleche" src="../img/fleche_footer.svg" aria-label="Modifiez ou supprimez votre message" alt="Modifiez ou supprimez votre message" />
              </div>
                `;
                // Fonction affichant ou masquant les options de message.html
                document.querySelector('#select').addEventListener('click', () => {
                    // console.log('click');
                    let options = document.getElementById('options');
                    if(options.classList.contains('hidden') == true) {
                        options.classList.remove('hidden');
                    }
                    else {
                        options.classList.add('hidden');
                    }
                });
            }
            else {
                document.getElementById('select-options').innerHTML= `
                <div id="noselect" class="nav--circle bgprimary txtwhite footer_fontsize text-center hidden">
                <i class="fas fa-file-alt"></i>
              </div>`;
            }
            //  console.log(message);
            let Likes = message.userslike;
            // Si l'article n'a pas encore été liké
            let numberLikes = '';
            if (Likes !== null) { numberLikes = Likes.length; }
            // On intègre le message
            document.getElementById('article').innerHTML =
            `<section id="section--article_${message.id_message}" class="message">
            <article class="row">
                  <div class="info--message col-1">
                    <div class="circle-moyen bgsecondary text-center">${message.initial}</div>
                    <a href="profil.html?id_profil=${message.idAuthor}" aria-label="Voir le profil de l'auteur" alt="Voir le profil de l'auteur">
                    <div id="author" class="circle-moyen bgprimary text-center">
                    </div>
                    </a>
                  </div>
                  <div class="article--text">
                    <h2>${message.title}</h2>
                    <div class="author">${message.lastnameDecrypt} ${message.firstnameDecrypt}</div>
                    <div id="createdat" class="time"></div>
                    <div id="file"></div>
                    <div id="body" class="text"></div>
                </div>
                </article>
                <aside>
                  <div class="circle-like">
                    <i class="fas fa-thumbs-up"></i><br />
                    <span class="number-like">
                    ${numberLikes}
                    </span>
                  </div>
                  <div class="liked hidden"></div>
                </aside>
                <hr />
                </section>
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
                document.getElementById('createdat').innerHTML= updatedTime;
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
                document.getElementById('createdat').innerHTML=publishedTime;
            } 
            // Si l'auteur a un avatar   
            let imageAuthor = message.image_user;
            if(imageAuthor !== null){ 
                document.getElementById('author').innerHTML = `<img id="image-author" class="" 
              src="${message.image_user}" 
              aria-label="Avatar de l'auteur du message" 
              alt="Avatar de l'auteur du message" />`;
            }
            else{
            //Sinon, on récupère L'initiale de son nom
                let author = message.firstnameDecrypt;
                let authorInitial = author.substring(0,1).toUpperCase();
                document.getElementById('author').innerHTML = `<span id="initial-author" class="">
                ${authorInitial}</span>`;
            }
            // Si pas de like, on ajoute le class no--like
            if(Likes === null) {
                document.querySelector('#article .fa-thumbs-up').classList.add('no--like') ; 
            }
            let body = message.body;
            let bodyParagraph = body.replace(/\n/g,'</p><p class="mt-2">"');
            // console.log(`<p>${bodyParagraph}</p>`);
            document.getElementById('body').innerHTML = `<p>${bodyParagraph}</p>`;            
            //console.log(message.media);
            //Si le message comporte un fichier
            if(message.media !== null) {
                document.getElementById('file').innerHTML = `
                <img id="file" class="" src="${message.media}" 
                alt="${message.caption}" 
                aria-label="${message.caption}" />
                `;
            }
            else{ document.getElementById('file').classList.add('hidden');}
        }
        else {console.error('erreur :', response.status);}
    }
    catch (error) {
        console.log(error);
    }
};
getMessage();