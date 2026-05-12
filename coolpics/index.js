const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('nav');
const smallScreen = window.matchMedia('(max-width: 1000px)');

btn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (smallScreen.matches) {
        menu.classList.toggle('hide');
    }
}

const photos = document.querySelector('.photos');
const modal = document.querySelector('dialog');
const modalImage = modal.querySelector('img');
const closeButton = modal.querySelector('.close-viewer');

// Event listener for opening the modal
photos.addEventListener('click', openModal);

function openModal(e) {
    console.log(e.target);   
    
    const img = e.target;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const full = src.replace('sm', 'full');

    modalImage.src = full;
    modalImage.alt = alt;

    modal.showModal();
    
}
// Close modal on button click
closeButton.addEventListener('click', () => {
    modal.close();
});

// Close modal if clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});
     