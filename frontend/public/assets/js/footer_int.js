document.querySelector('#fleche_footer').addEventListener('click', () => {
    let arrow = document.getElementById('fleche_footer');
    let styleArrow = window.getComputedStyle(arrow).getPropertyValue('transform');
    // console.log('style', styleArrow);
    if(styleArrow === 'matrix(1, 0, 0, 1, 0, 0)') {
        document.querySelector('#fleche_footer').style.transform = 'matrix(-1, 0, 0, -1, 0, 0)';
        document.getElementsByTagName('footer')[0].style.bottom = -7+'vh';
    }
    else {
        document.querySelector('#fleche_footer').style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
        document.getElementsByTagName('footer')[0].style.bottom = -15+'vh';
    }
});