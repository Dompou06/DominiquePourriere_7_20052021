document.querySelector('#fleche_footer').addEventListener('click', function(){
    if(window.matchMedia('(max-width: 767px)').matches) {
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
    else {
        const footerBarre = document.getElementById('footer_barre');
        let style = footerBarre.currentStyle || window.getComputedStyle(footerBarre);
        let marginLeft = style.marginLeft;
        // console.log('margin-left', marginLeft);
        if(marginLeft === -393.6+'px'){
            document.getElementById('footer_barre').style.marginLeft = 0+'vw';
            document.getElementById('footer_rond').style.marginLeft = 20.5+'vw';
        }
        else {      
            document.getElementById('footer_barre').style.marginLeft = -20.5+'vw';
            document.getElementById('footer_rond').style.marginLeft = 0+'vw';
        }
    }
});