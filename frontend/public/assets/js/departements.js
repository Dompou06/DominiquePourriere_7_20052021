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