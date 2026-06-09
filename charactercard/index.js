const character = {
  title: "Snortleblat",
  class: "Swamp Beast Diplomat",
  level: 5,
  health: 100,
  imgSrc: "images/snortleblat.webp",
  imgAlt: "Snortleblat standing in a swamp",

  attacked() {
        this.health -= 20;

  if (this.health <= 0) {
    this.health = 0;
    renderCharacter();

    setTimeout(() => {
      alert(`${this.title} has died.`);
    }, 50);

    return;
  }

  renderCharacter();
  },

  levelUp() {
    this.level += 1;
    renderCharacter();
  }
};

function renderCharacter() {
  const card = document.querySelector('#character-card');

  const html = `
    <article class="character">
      <img src="${character.imgSrc}" alt="${character.imgAlt}">
      <div class="name">${character.title}</div>
      <p><strong>Class:</strong> ${character.class}</p>
      <p><strong>Level:</strong> ${character.level}</p>
      <p><strong>Health:</strong> ${character.health}</p>

      <div class="buttons">
        <button onclick="character.attacked()">Attacked</button>
        <button onclick="character.levelUp()">Level Up</button>
      </div>
    </article>
  `;

  card.innerHTML = html;
}

renderCharacter();

