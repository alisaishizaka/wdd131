const title = document.querySelector('h1');

console.log(title);

let topics = document.querySelector('#topics');

//topics.style.color = 'red'

document.getElementById('topics').style.color = 'purple';

let list = document.querySelector('.list');

list.style.border = '3px solid black';

let para = document.querySelector('p');

//para.style.backgroundColor = 'Rightblue'

para.classList.add('background');

//document.querySelector('body').classList.add('background');

const image = document.querySelector('img');
image.setAttribute('src', 'images/web.webp');


let selectElem = document.getElementById('webdevlist');
selectElem.addEventListener('change', function(){
    let codeValue = selectElem.value;
    console.log(codeValue);
    document.getElementById(codeValue).style.color = 'red';
})
                


