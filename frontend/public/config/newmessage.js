/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Si on clique sur l'ajout du message
function newMessage() {
    //console.log('newMessage');
    document.querySelector('.add-article').classList.remove('bgsecondary');
    document.querySelector('.add-article').classList.add('bgprimary');
    document.querySelector('#new-article').classList.remove('hidden');
    document.querySelector('#new-article').innerHTML = `
        <div class="row message">
          <div class="col-2 message--label">
            <label for="newtitle" class="bgsecondary text-center" aria-label="Espace titre">
            <i class="fas fa-heading"></i></label>
          </div>
          <textarea id="newtitle" class="col-10 col-sm-10 col-lg-11 message--textarea--title no--empty" placeholder="Titre du message" required></textarea>
        </div>
        <div class="row message">
            <div class="col-3"></div>
            <div class="col-2 message--label">
              <div class="bgsecondary text-center message--label--image" aria-label="Espace fichier">
                <i class="fas fa-file-image"></i></div>
            </div>
            <label for="newmessage--file" class="cursor label-file col-2"><i class="fas fa-upload"></i></label>
            <input id="newmessage--file" class="input-file" type="file">
        </div>
          <div class="row message">
            <div class="col-2 message--label">
              <label for="caption" class="bgsecondary text-center" aria-label="Espace description du fichier">
                <i class="fas fa-comment-dots"></i>
              </label>
            </div>
            <textarea id="caption" class="col-10 col-sm-10 col-lg-11 message--textarea--title" placeholder="Description, si fichier"></textarea>
        </div>
        <div class="row message">
            <div class="col-2 message--label">
              <label for="neweditor" class="bgsecondary text-center" aria-label="Espace texte">
                <i class="fas fa-keyboard"></i></label>
            </div>
            <textarea id="neweditor" class="col-10 col-sm-10 col-lg-11 no--empty" rows="6" placeholder="Texte du message" required></textarea>
        </div>
        <div class="buttons--post row">
              <div class="col-2"></div>
              <div class="button--cancel cursor" aria-label="Annulez les modifications">X</div>
              <div class="post_reponse col-6"><!-- Réponse backend si erreur --></div>
              <div class="button--post cursor" aria-label="Validez votre message"><i class="fas fa-check"></i></div>
              <div class="col-1"></div>
        </div>
    `;
    document.querySelector('.button--post').addEventListener('click', () => {
        let titleValue = document.querySelector('#newtitle').value;
        let textValue = document.querySelector('#neweditor').value;
        // console.log('textValue', textValue);
        // On récupère le département de l'utilisateur
        //console.log('userId', userId);
        let formData = new FormData();
        // On envoie le message
        const urlPostMessage = 'http://localhost:3000/api/messages';
        insertMessage = async function (data) {
            let postData = await fetch(urlPostMessage, {
                method: 'POST',                           
                headers: {
                    'Authorization': `Token ${tokenStorage}`
                },
                body:data
            });
            try {
                let result = await postData.json();
                if(postData.ok) {
                    //  console.log(result);
                    window.location.assign('./messages.html');
                } 
                else {
                    console.log(result);
                    document.getElementsByClassName('post_reponse').innerHTML = result.message;
                }
            }
            catch(error) { console.log(error); }
        };
        let file = document.getElementById('newmessage--file').files[0];
        let caption = document.getElementById('caption').value;
        let dataNewMessage = '';
        if(file !== undefined) {
            dataNewMessage = {  
                title: titleValue,
                body: textValue,
                caption: caption
            };
            let JsonDataMessage = JSON.stringify(dataNewMessage);
            formData.append('message', JsonDataMessage);
            formData.append('media', file);
        }
        else {
            dataNewMessage = {  
                title: titleValue,
                body: textValue
            }; 
            let JsonDataMessage = JSON.stringify(dataNewMessage);
            formData.append('message', JsonDataMessage);
        }
        insertMessage(formData);
    });
    document.querySelector('.button--cancel').addEventListener('click', () => {
        document.location.reload();
    });
}