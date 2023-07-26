// API Key:
const APIkey = "8d964863fc8c92fe7049a5f9808fd5e8";

// Global Selectors
const input = document.querySelector('#city-input');
const button = document.querySelector('#save-button');
const cityList = document.querySelector('#city-list');
const weatherContainer = document.querySelector("#weather-container");
const forecastContainer = document.querySelector("#forecast-container");
const weatherUL = document.querySelector("#weather-ul");

// max number of cities to save & display
const cityDisplayMax = 15;

// this listens for the enter key rather than a click because its more intuitive
$("#city-input").keydown(function(event) {
    if (event.keyCode === 13) {
        // prevent default is needed because the save button will otherwise try to take in "city" as an object
        event.preventDefault();
        // if keydown detected, click save button
        $("#save-button").click();
    }
});

// this listens for a click on the Get Weather! button 
$("#save-button").on("click", function (event) {
    event.preventDefault();
    // set city to the value entered into the input
    const city = $("#city-input").val();
    // get the weather, feed it city
    getWeather(city);
    // save the city to local storage
    saveCity();
})