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

// getWeather does two things when fed a city: it gets the weather, and stores the latitude and longitude in variables
function getWeather(city) {
    // create request URL with city and APIKey 
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    
    // fetch weather data
    fetch(weatherURL)
        .then(function (response) {
        // get JSON format response
        return response.json();
        })
        // get weather data
        .then(function (weatherData) {
        console.log('Current Weather in ' + city);
        console.log(weatherData);

        // store latitude and longitude values for getForecast
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;
        
        getForecast(lat, lon, city);

        displayWeather(weatherData);
        });
}

// getForecast takes in latitude and longitude (and city simply for console log) to return 5-day forecast data
function getForecast(lat, lon, city) {
    // create request URL with lat, lon, and APIKey 
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";

    // fetch forecast data
    fetch(forecastURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (forecastData) {
        console.log('Five Day Forecast in ' + city);
        console.log(forecastData);

        // pass returned forecastData into displayForecast
        displayForecast(forecastData);
        });
}

