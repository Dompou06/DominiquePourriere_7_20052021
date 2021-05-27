/* eslint-disable no-undef */
document.querySelector('#dropdown--profil p').addEventListener('click', dropdownProfile, true);

function dropdownProfile () {
    document.getElementById('items_profil').classList.toggle('hidden');
    /* document.getElementById('profil').addEventListener('click', () => {
        console.log('ok');
        // window.location('./profil.html');
    /*    const urlUser = 'http://localhost:3000/api/user/profil';
        reqUser = async function () {
            let gertUser = await fetch(urlUser, {
                method: 'GET',                           
                headers: {
                    'Authorization': `Token ${tokenStorage}`
                },
            });
            try {
                let result = await gertUser.json();
                console.log('result', result);
            }
            catch(error) {
                console.log(result);

            }
        };
    });*/
}
