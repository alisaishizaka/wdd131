let selectElem = document.querySelector('select');  
let logo = document.querySelector('img')     

selectElem.addEventListener('change', changeTheme);

function changeTheme() {
    let current = selectElem.value;
    if (current === 'dark') {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        let content = document.querySelector('.content');
        content.style.backgroundColor = 'black';
        content.style.border = '1px solid white';
        logo.setAttribute('src', 'images/byui-logo-white.png');
    } else {
       document.body.style.backgroundColor = 'rgb(70, 70, 148)';
       document.body.style.color = 'black';
       let content = document.querySelector('.content');
       content.style.backgroundColor = 'white';
       content.style.border = '1px solid black';
       logo.setAttribute('src', 'images/byui-logo-blue.webp');
    }
}
                    