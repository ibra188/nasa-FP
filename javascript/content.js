// some of the things in this project could've been done better, but for the sake of finishing sooner because my shcedule is aleady full, and I have other projects to work on, I didnt implement everyhing in the most efficient way possible, thank you for the understanding :)
const role = sessionStorage.getItem('role');
const content = document.getElementById('content');
const contentContainer = document.getElementById('contentContainer');
let favorites = {};
let isDisplayingOnlyFavorites = false;
let data;
let isFetchingData = false;


// check to see if user's role is valid and returns him to login if it isnt
(function() {
    if(!role) {
        alert('role wasnt found, you will be redirected back to login!');
        window.location.href = "http://127.0.0.1:5500/real%20programming/JS/projects%20to%20show%20off/FP/index.html";
    } else {
        if(role !== 'User' && role !== 'Admin') {
            alert('invalid role, you will be redirected back to login!');
            window.location.href = "http://127.0.0.1:5500/real%20programming/JS/projects%20to%20show%20off/FP/index.html";
        };
    };
})();

async function getDataAndDisplayIt() {
    // checks if data is already being fetched
    if(!isFetchingData) {
        isFetchingData = true;
        
        // fetches new data, then adds it to data array and displays it
        const newData = await getServerData();
        const validNewData = checkForSameData(newData);
        if(!data) {
            data = validNewData;
        } else {
            data = [...data, ...validNewData];
        }
        await displayData(data);

        isFetchingData = false;
    }
}

getDataAndDisplayIt();

async function getServerData() {
    const apiKey = 'api_key=VGvReHv4hFXCJodYUjJFiAxPR3qamK5kWiVf4OdX';
    const count = 10;

    try {
        const data = await fetch(`https://api.nasa.gov/planetary/apod?${apiKey}&count=${count}`);
        const responseData = await data.json();
        return responseData;
    } catch(err) {
        console.log(err);
    }
    
}

function displayData(data) {
    const loadingScreen = document.getElementById('loadingContainerParent');
    let card;

    // removes all previous data
    content.innerHTML = '';

    // create each new element from data recieved from NASA API
    data.forEach(element => {
        card = `<div class="card">
            <img class="nasaContentImg" src="${element.url}" alt="nasa image">
            <div class="textContent">
            <h1>${element.title}</h1>
            ${element.explanation}
            <div class="iconsContainer">`

                if(favorites[element.url]) {
                    card += '<div class="addToFavoritesBtn"><i class="fa-solid fa-heart favoritesIcon"  onclick="onFavoritesIconClick(this);"></i></div>'
                } else {
                    card += '<div class="addToFavoritesBtn"><i class="fa-regular fa-heart favoritesIcon"  onclick="onFavoritesIconClick(this);"></i></div>'
                }
            
                if(role === 'Admin') {
                    card += '<button class="deletePost" onclick="deletePost(this)">Delete Post</button>';
                }

                card += '</div></div></div>';

    content.innerHTML += card;
    });

    // hiding the loading screen
    loadingScreen.style.display = "none";
}

// gets the url of the image of the post
function getImageUrl(clickedElement) {
    const cardParent = clickedElement.closest('.card');
    const contentImageUrl = cardParent.querySelector('.nasaContentImg').getAttribute('src');
    return contentImageUrl;
}

function onFavoritesIconClick (clickedElement) {
    toggleFavoriteIconClasses(clickedElement);
    const imageUrl = getImageUrl(clickedElement);
    toggleFavorite(imageUrl);
    
}

function toggleFavoriteIconClasses(clickedElement) {
    clickedElement.classList.toggle('fa-regular');
    clickedElement.classList.toggle('fa-solid');
}

// checks to see if the data has alredy been saved to favorites, and if it has, deletes it from favorites, and if it hasnt, adds it to favorites
function toggleFavorite(itemUrl) {
    data.forEach(item => {
        if(item.url === itemUrl) {
            if(favorites[itemUrl]) {
                delete favorites[itemUrl];
            } else {
                favorites[itemUrl] = item;
            }
        }
    });
}

function toggleDisplayFavorites() {
    isDisplayingOnlyFavorites = !isDisplayingOnlyFavorites;

    if(isDisplayingOnlyFavorites) {
        
        const favoritesArray = Object.values(favorites);    
        displayData(favoritesArray);
    
    } else {
        displayData(data);
    }
}

// makes sure we dont display a duplicate of the same data in case we recieve it from the API
function checkForSameData(newData) {
    const newValidDataArray = []
    
    if(!data) {
        return newData;
    }
    
    newData.forEach(item => {
        if(!data.includes(item)) {
            newValidDataArray.push(item);
        }
    });

    return newValidDataArray;
}

function deletePost(clickedElement) {
    if(role === 'Admin') {
        // remove the element from user's view
        const cardParent = clickedElement.closest('.card');
        cardParent.style.display = 'none';

        const postUrl = cardParent.querySelector('.nasaContentImg').getAttribute('src');
        // remove the element from data so it doesnt get rendered again
        removePostFromData(postUrl);
    }
}

function removePostFromData(postUrl) {
    const dataLength = data.length;
    
    for(i = 0; i < dataLength; i++) {
        if(data[i].url === postUrl) {
           data.splice(i, 1);
        }
    }
}

contentContainer.addEventListener('scroll', () => {
    if(!isDisplayingOnlyFavorites) {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = contentContainer;

        if(clientHeight * 2 > scrollHeight - scrollTop) {
            getDataAndDisplayIt();
        }
    }
})