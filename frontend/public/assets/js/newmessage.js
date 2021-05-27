let params = (new URL(document.location)).searchParams;
let userId = params.get('id');
document.getElementById('profil').href = `./profil.html?id=${userId}`;
document.getElementById('messages').href = `./messages.html?id=${userId}`;