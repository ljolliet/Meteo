/* inspired by https://www.w3schools.com/howto/howto_js_autocomplete.asp */

let currentFocus;
let searchValue;

document.querySelector("#search-text").addEventListener("keyup", (e) => {
    const items = document.querySelectorAll(".autocomplete-items div");
    if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(items);
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        validate(items[currentFocus]);
    }
});

document.addEventListener("click", () => closeList());

function addAutocomplete(){
    if ((searchValue = document.querySelector("#search-text").value) !== searchCache) {
        fetch("https://geo.api.gouv.fr/communes?nom=" + searchValue + "&fields=centre,codesPostaux&boost=population&limit=5")
            .then(resp => resp.json())
            .then(cities => {
                closeList();
                addItems(searchValue, cities);
            });
        searchCache = searchValue;
    }
}

function addItems(searchText, cities) {
    currentFocus = -1;
    const items = createElement("div", null, null, "autocomplete-items")
    document.querySelector(".searchbar").appendChild(items);
    for (let city of cities) {
        const item = document.createElement("div");
        item.addEventListener("click", () =>{
            validate(item);
        })
        item.innerHTML = "<strong>" + city.nom.substr(0, searchText.length) + "</strong>";
        item.innerHTML += city.nom.substr(searchText.length) + " (" + city.codesPostaux[0] + ")";
        item.appendChild(createElement("input", city.nom,"hidden", "cache-city-name"));
        item.appendChild(createElement("input", city.centre.coordinates[1],"hidden", "cache-city-lat"));
        item.appendChild(createElement("input", city.centre.coordinates[0],"hidden", "cache-city-long"));
        items.appendChild(item)
    }
}

function validate(item){
    if(item){
        const lat = item.querySelector(".cache-city-lat").value;
        const long = item.querySelector(".cache-city-long").value;
        getWeatherFromPosition(lat, long);
        document.querySelector("#search-text").value = item.querySelector(".cache-city-name").value;
        document.querySelector("#search-text").click();
    }
    else
        getWeatherFromText();
}
function closeList() {
    document.querySelector(".autocomplete-items")?.remove();
}

function addActive(items) {
    if (!items) {
        return false;
    }
    removeActive(items);
    if (currentFocus >= items.length) {
        currentFocus = 0;
    } else if (currentFocus < 0)
        currentFocus = items.length - 1;
    items[currentFocus].classList.add("autocomplete-active");
}

function removeActive(items) {
    for (let item of items)
        item.classList.remove("autocomplete-active");
}

function createElement(tag, value, type, ...clazz){
    const elem = document.createElement(tag);
    elem.type = type;
    for(let c of clazz)
        elem.classList.add(c);
    elem.value = value;
    return elem;
}
