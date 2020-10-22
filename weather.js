let map;
let searchCache;

initMap();
getWeather("Paris");

function getWeatherFromText() {
    let text = document.querySelector("#search-text").value
    if (!isNaN(text))
        getWeatherFromPostCode(text)
    else
        getWeather(text);


}

function getWeatherFromPosition(latitude, longitude){
    if(latitude && longitude) {
        getWeather("lat=" + latitude + "lng=" + longitude);
        fetch("https://geo.api.gouv.fr/communes?lat=" + latitude + "&lon=" + longitude)
            .then(resp => resp.json())
            .then(data => {
                document.querySelector("#name").innerHTML = data[0]?.nom;
            });
    }
    else
        console.error("Wrong position");
}

function getWeatherFromPostCode(postCode){
    if(!isNaN(postCode)){
        console.log("Post code");
        fetch("https://geo.api.gouv.fr/communes?fields=centre&codePostal=" + postCode)
            .then(resp => resp.json())
            .then(data => {
                getWeatherFromPosition(data[0].centre.coordinates[1], data[0].centre.coordinates[0]);
            })
            .catch(() => alert("can't find the city related to this post code"));

    }
}

function getWeather(str){
    fetch("https://www.prevision-meteo.ch/services/json/" + str)
        .then(resp => resp.json())
        .then(json => {
             setWeatherWidget(json);
             setWeekWeatherWidget(json);
             setMap(json);
        })
        .catch(() => alert("Can't find the city"));
}

function initMap() {
    map = L.map('mapId').setView([46.7111, 1.7191], 5);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGFwaWV1dnJlIiwiYSI6ImNrZzBqNTRtbDBzNzkzMW9iYzdnbDA1djkifQ.ABLWgOwEaXK9-lUsgqXWLQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);
}

function setMap(data) {
    map.setView([data.city_info.latitude, data.city_info.longitude], 13);
}

function getGeolocation(){
    navigator.geolocation.getCurrentPosition(
        ({coords: {latitude, longitude}}) =>
            getWeatherFromPosition(latitude, longitude),
        () => {},
        {enableHighAccuracy: true});
}

