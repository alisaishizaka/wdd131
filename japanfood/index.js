const storageKey = "japanfood-posts";
const grayPlaceholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#d9d9d9"/><rect x="90" y="90" width="620" height="620" rx="32" fill="#bdbdbd"/></svg>`)}`;
const cardPlaceholderImage = grayPlaceholderImage;
const initialPosts = [
    {
        id: 1,
        name: "Ichiran Ramen",
        category: "Ramen",
        rating: 4.5,
        address: "1-2-3 Sakura Street, Mitaka, Tokyo 181-0005, Japan",
        description: "A rich and silky bowl of ramen with customizable spice and warm toppings.",
        image: "images/ichiran-ramen.jpeg",
        likes: 2
    },
    {
        id: 2,
        name: "Sashimi Don",
        category: "Meal",
        rating: 4,
        address: "4-5-6 Ginza Avenue, Chuo, Tokyo 104-0061, Japan",
        description: "Fresh sliced sashimi over a bed of seasoned rice with a bright finish.",
        image: "images/sashimi-don.jpeg",
        likes: 3
    },
    {
        id: 3,
        name: "Shaved Ice",
        category: "Sweets",
        rating: 4.5,
        address: "8-9-10 Asakusa Road, Taito, Tokyo 111-0032, Japan",
        description: "A cool dessert with fruity syrup, sweet cream, and a playful crunch.",
        image: "images/shaved-ice.jpeg",
        likes: 5
    },
    {
        id: 4,
        name: "Takano Fruits Parfait",
        category: "Sweets",
        rating: 5,
        address: "11-12-13 Harajuku Street, Shibuya, Tokyo 150-0001, Japan",
        description: "Layers of whipped cream, seasonal fruit, and crunchy toppings for a cheerful treat.",
        image: "images/takano-fruits-parfait.jpeg",
        likes: 6
    },
    {
        id: 5,
        name: "Tempura Soba",
        category: "Meal",
        rating: 4,
        address: "14-15-16 Ueno Lane, Taito, Tokyo 110-0005, Japan",
        description: "Crisp tempura served with noodles and a light dipping broth.",
        image: "images/tempura-soba.jpeg",
        likes: 4
    },
    {
        id: 6,
        name: "Yoshinoya Gyudon",
        category: "Meal",
        rating: 3.5,
        address: "17-18-19 Shinjuku Plaza, Shinjuku, Tokyo 160-0022, Japan",
        description: "Steamed rice topped with savory beef and simmered onions in a comfort-food classic.",
        image: "images/yoshinoya-gyudon.jpeg",
        likes: 2
    }
];

const postsContainer = document.getElementById("postsContainer");
const loadMoreButton = document.getElementById("loadMoreButton");
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const postForm = document.getElementById("postForm");
const popupName = document.getElementById("popupName");
const popupCategory = document.getElementById("popupCategory");
const popupRating = document.getElementById("popupRating");
const popupAddress = document.getElementById("popupAddress");
const popupDescription = document.getElementById("popupDescription");
const popupImage = document.getElementById("popupImage");
const formMessage = document.getElementById("formMessage");

let posts = JSON.parse(localStorage.getItem(storageKey)) || initialPosts;
let activePostId = null;
let visibleCount = 6;
let isExpanded = false;
let imageObserver = null;

function initImageObserver() {
    if (!("IntersectionObserver" in window)) {
        return;
    }

    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const image = entry.target;
            const realSrc = image.dataset.src;
            if (realSrc) {
                image.src = realSrc;
                image.removeAttribute("data-src");
                observer.unobserve(image);
            }
        });
    }, { rootMargin: "200px 0px" });
}

function observeCardImage(image) {
    if (!image) return;

    if (imageObserver) {
        imageObserver.observe(image);
        return;
    }

    const realSrc = image.dataset.src;
    if (realSrc) {
        image.src = realSrc;
    }
}

function getVisiblePosts(filteredPosts) {
    return filteredPosts.slice(0, visibleCount);
}

function savePosts() {
    localStorage.setItem(storageKey, JSON.stringify(posts));
}

function renderStars(rating) {
    const fullStars = Math.round(rating);
    return "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);
}

function renderStarButtons(post) {
    return Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const activeClass = value <= Math.round(post.rating) ? "active" : "";
        return `<button class="star-button ${activeClass}" type="button" data-id="${post.id}" data-rating="${value}" aria-label="Rate ${post.name} ${value} out of 5">★</button>`;
    }).join("");
}

function renderPosts(filter = "") {
    const query = filter.trim().toLowerCase();
    const filteredPosts = posts.filter(post => {
        return [post.name, post.category, post.description].some(value => value.toLowerCase().includes(query));
    });

    postsContainer.innerHTML = "";

    if (!filteredPosts.length) {
        postsContainer.innerHTML = '<div class="empty-state">No dishes match your search yet. Try another keyword.</div>';
        loadMoreButton.style.display = "none";
        return;
    }

    const visiblePosts = getVisiblePosts(filteredPosts);
    visiblePosts.forEach(post => {
        const card = document.createElement("article");
        card.className = "food-post";
        card.innerHTML = `
            <img src="${cardPlaceholderImage}" data-src="${post.image}" alt="${post.name}" width="600" height="600" loading="lazy" decoding="async">
            <div class="food-post-info">
                <h3>${post.name}</h3>
                <p>${post.category}</p>
                <div class="card-actions">
                    <div class="star-rating" aria-label="Rating ${post.rating} out of 5">${renderStarButtons(post)}</div>
                    <button class="like-btn" type="button" data-id="${post.id}">
                        <span class="heart-icon">♥</span>
                        <span>${post.likes}</span>
                    </button>
                </div>
            </div>
        `;

        card.addEventListener("click", event => {
            if (event.target.closest("button")) return;
            openPopup(post.id);
        });

        const cardImage = card.querySelector("img");
        observeCardImage(cardImage);
        postsContainer.appendChild(card);
    });

    const hasMorePosts = filteredPosts.length > 6;
    loadMoreButton.style.display = hasMorePosts ? "block" : "none";
    loadMoreButton.textContent = isExpanded ? "Close" : "Load more";
    loadMoreButton.setAttribute("aria-expanded", String(isExpanded));
}

function openPopup(postId) {
    const post = posts.find(item => item.id === postId);
    if (!post) return;

    activePostId = post.id;
    popupName.textContent = post.name;
    popupCategory.textContent = `Category: ${post.category}`;
    popupRating.textContent = `Rating: ${renderStars(post.rating)}`;
    popupAddress.textContent = `Address: ${post.address}`;
    popupDescription.textContent = post.description;
    popupImage.src = post.image;
    popupImage.alt = post.name;
    popupOverlay.style.display = "flex";
    popupOverlay.setAttribute("aria-hidden", "false");
}

function closePopupWindow() {
    popupOverlay.style.display = "none";
    popupOverlay.setAttribute("aria-hidden", "true");
}

postsContainer.addEventListener("click", event => {
    const likeButton = event.target.closest(".like-btn");
    if (likeButton) {
        const postId = Number(likeButton.dataset.id);
        posts = posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post);
        savePosts();
        renderPosts(searchInput.value);
        return;
    }

    const starButton = event.target.closest(".star-button");
    if (starButton) {
        const postId = Number(starButton.dataset.id);
        const ratingValue = Number(starButton.dataset.rating);
        posts = posts.map(post => post.id === postId ? { ...post, rating: ratingValue } : post);
        savePosts();
        renderPosts(searchInput.value);
    }
});

searchButton.addEventListener("click", () => {
    visibleCount = 6;
    isExpanded = false;
    renderPosts(searchInput.value);
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        visibleCount = 6;
        isExpanded = false;
        renderPosts(searchInput.value);
    }
});

loadMoreButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredPosts = posts.filter(post => {
        return [post.name, post.category, post.description].some(value => value.toLowerCase().includes(query));
    });

    if (isExpanded) {
        visibleCount = 6;
        isExpanded = false;
    } else {
        visibleCount = filteredPosts.length;
        isExpanded = true;
    }

    renderPosts(searchInput.value);
});

postForm.addEventListener("submit", event => {
    event.preventDefault();

    const newPost = {
        id: Date.now(),
        name: document.getElementById("foodName").value.trim(),
        category: document.getElementById("foodCategory").value.trim(),
        rating: Number(document.getElementById("foodRating").value),
        address: document.getElementById("foodAddress").value.trim(),
        description: document.getElementById("foodDescription").value.trim(),
        image: grayPlaceholderImage,
        likes: 0
    };

    if (!newPost.name || !newPost.category || !newPost.rating) {
        formMessage.textContent = "Please add a name, category, and rating before submitting.";
        return;
    }

    posts = [newPost, ...posts];
    visibleCount = 6;
    isExpanded = false;
    savePosts();
    postForm.reset();
    formMessage.textContent = "Your post was added successfully!";
    renderPosts(searchInput.value);
});

closePopup.addEventListener("click", closePopupWindow);
popupOverlay.addEventListener("click", event => {
    if (event.target === popupOverlay) {
        closePopupWindow();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closePopupWindow();
    }
});

renderPosts();
