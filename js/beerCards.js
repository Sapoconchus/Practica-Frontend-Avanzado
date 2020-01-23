import { getBeers } from "./api.js";
import storage from './storage.js';

const { setItem, getItem } = storage();

const container = document.querySelector(".card-container")

const cardTemplate = beer => {
    return `
    <div class="beer-card" id="${beer.beerId}">
        <div class="beer-pic">
            <a href="/beers/${beer.beerId}"><img src="${beer.image}"></a>
        </div>
            <div class="info-container">
                <div class = "beer-info">
                   <a href="/beers/${beer.beerId}"> <h1>${beer.name}</h1></a>
                    <article class="first-rendered">${beer.description.length < 180 ? beer.description : beer.description.slice(0, 165) + ' [...]'}.</br><span class="brew-year"> First brewed on ${beer.firstBrewed}.</span></article>
                </div>
                <div class ="card-pills">
                    <div>
                        <i class="pill icofont-like"></i>
                        <p id="likes-num" class ="pill">${beer.likes}</p>
                        <i class="pill icofont-speech-comments"></i>
                        <p id="comments-num" class ="pill">${beer.comments.length}</p>
                    </div>
                    <div>
                    <a href="/beers/${beer.beerId}" class="pill"><p> Go to details </p></a>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}


const renderBeers = async input => {
    try {
        const beers = await getBeers(input);

        const main = document.querySelector("main");
        const dates = []
        const htmlBeers = beers.map(beer => {
            dates.push(beer.firstBrewed);
            return cardTemplate(beer);
        }).join("");

        const cardContainer = document.createElement("section")
        cardContainer.classList.add("card-container");

        cardContainer.innerHTML = `${htmlBeers}`;
       main.appendChild(cardContainer);
        // main.innerHTML = `${cardContainer}`;
        renderFilter(dates);

        // filter by date
   
        const checkbox = document.querySelectorAll("input[type=checkbox]");
        const beerCard = document.querySelectorAll(".beer-card");
        const checkAll = document.querySelector(".check-all");
        const uncheckAll = document.querySelector(".uncheck-all");

        checkbox.forEach((item, index) => item.addEventListener("click", evt => beerCard[index].classList.toggle("no-display")));
        
        console.log(checkbox);

        checkAll.addEventListener("click", evt =>{
            checkbox.forEach((item, index) => {
                if(!item.checked) { item.checked = true;};
                beerCard[index].classList.remove("no-display");
                });
        });
        uncheckAll.addEventListener("click", evt =>{
            checkbox.forEach((item, index) => {
                if(item.checked) { item.checked = false;};
                beerCard[index].classList.add("no-display");
                });
        });


    } catch (err) {
        console.log(err);
    }
};

const filterTemplate = (input, index) => {
    return `
    <li><label><input class ="${index}" type="checkbox" name=${input} value=${input} checked> ${input}</label></li></br>`
}

const renderFilter = array => {
    
    const container = document.querySelector("#date-filter-list");
    const checkBoxes = array.map((item, index) => filterTemplate(item, index)).join("");
    const list = document.createElement("ul");
    list.innerHTML = `${checkBoxes} <button class="close-filter no-display"> close </button>`;
    container.appendChild(list);
};

export default renderBeers;

