/* eslint-disable no-undef */
document.querySelector('#fleche_footer').addEventListener('click', function(){
    if(mobile.matches) {
        let arrow = document.getElementById('fleche_footer');
        let styleArrow = window.getComputedStyle(arrow).getPropertyValue('transform');
        // console.log('style', styleArrow);
        if(styleArrow === 'matrix(1, 0, 0, 1, 0, 0)') {
            document.querySelector('#fleche_footer').style.transform = 'matrix(-1, 0, 0, -1, 0, 0)';
            document.getElementsByTagName('footer')[0].style.bottom = -6+'vh';
        // document.getElementsByTagName('footer')[0].style.bottom = 17.5+'vh';
        }
        else {
            document.querySelector('#fleche_footer').style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
            document.getElementsByTagName('footer')[0].style.bottom = -16+'vh';
        }
    }
    if(desktop.matches) {
        let footerBarre = document.getElementById('footer_barre').style.marginLeft;
        if(footerBarre === -20.5+'vw'){
            document.getElementById('footer_barre').style.marginLeft = 0+'vw';
            document.getElementById('footer_rond').style.marginLeft = 20.5+'vw';
        }
        else {      
            document.getElementById('footer_barre').style.marginLeft = -20.5+'vw';
            document.getElementById('footer_rond').style.marginLeft = 0+'vw';
        }
    }
});