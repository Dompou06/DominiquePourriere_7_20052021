/* eslint-disable no-undef */
//window.onload = () => {
// Ajout des liens vers les autres pages avec le userId
const params = (new URL(document.location)).searchParams;
const idArticle =  params.get('id_article');
const userId = params.get('id');
document.getElementById('messages').href = `./messages.html?id=${userId}`;
document.getElementById('profil').href = `./profil.html?id=${userId}`;

document.getElementById('cancel').href = `./message.html?id_article=${idArticle}&id=${userId}`; 
const urlMessage = `http://localhost:3000/api/messages/${idArticle}`;
// On récupère les données actuelles du message
// eslint-disable-next-line no-undef
getMessage = async function () {
    try {
        let response = await fetch(urlMessage);
        if(response.ok) {
            let message = await response.json();
            //  console.log(message);
            document.getElementById('title').value = message.title;
            document.getElementById('editor').value = message.body;
            if(message.media !== null) {
                document.getElementById('media').innerHTML = `<img src="${message.media}"
                     id="eximage"
                     alt="${message.caption}" 
                     aria-label="${message.caption}" />`;
                document.getElementById('caption').innerHTML = message.caption;
            }
        }
        else {console.error('erreur :', response.status);}
    }
    catch (error) {
        console.log(error);
    }
};
getMessage();
// Si l'auteur valide la modification du message
document.getElementById('update--profil').addEventListener('click', updateMessage, true);
function updateMessage() {
    const noEmpty = document.getElementsByClassName('no--empty');
    let valid = true;
    for (let numberOfFields = 0; numberOfFields < noEmpty.length; numberOfFields++) {
        //console.log(noEmpty[numberOfFields].reportValidity());
        if (!noEmpty[numberOfFields].reportValidity()) {
            valid = false;
        }
    }
    if (valid) {
        const urlPutMessage = `http://localhost:3000/api/messages/${idArticle}`;
        putMessage = async function (data) {
            let reponse = await fetch(urlPutMessage, {
                method: 'PUT',
                body:data
            });
            try {
                let result = await reponse.json();
                if(reponse.ok) {
                    window.location.assign(`./message.html?id_article=${idArticle}&id=${userId}`);
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
        let titleValue = document.getElementById('title').value;
        let textValue = document.getElementById('editor').value;
        let captionValue = document.getElementById('caption').value;
        let dataUpdateMessage = {  
            title: titleValue,
            body: textValue,
            caption: captionValue
        };
        
        let formData = new FormData();
        // console.log(dataUpdateMessage);
        let JsonDataMessage = JSON.stringify(dataUpdateMessage);
        formData.append('message', JsonDataMessage);
        let file = document.getElementById('image').files[0];
        if(file !== undefined) {
            formData.append('media', file);
        }       
        putMessage(formData);

    }
    else {
        console.error('erreur :', response.status);
    }
}
