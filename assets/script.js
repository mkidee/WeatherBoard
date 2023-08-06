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
// $("#city-input").keydown(function(event) {
//     if (event.keyCode === 13) {
//         // prevent default is needed because the save button will otherwise try to take in "city" as an object
//         event.preventDefault();
//         // if keydown detected, click save button
//         $("#save-button").click();
//     }
// });

// this listens for a click on the Get Weather! button 
$("#save-button").on("click", function (event) {
    console.log('clicking');
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
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    
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
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&units=imperial";

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

// template literals to insert data:
// displayWeather deconstructs the weatherData fetch return then creates a template literal with the data inside and pushes it into the weatherContainer
function displayWeather(weatherData){
    // deconstruct all necessary weather data
    let searchedCity = weatherData.name;
    let weatherUNIX = weatherData.dt; 
    let weatherTemp= weatherData.main.temp;
    let weatherWind = weatherData.wind.speed;
    let weatherHumidity = weatherData.main.humidity;
    let weatherIcon = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    let weatherDateTime = dayjs.unix(weatherUNIX).format('MMM D, YYYY, hh:mm a');
    let weatherDescription = toTitleCase(weatherData.weather[0].description);
   
    // create a template literal i can push over to the HTML later
    let weatherTemplate = `
    <div class = "m-2 p-1">
        <h3>${searchedCity} </h3>
        <h4>${weatherDateTime}</h4>
        <h5><img src = "${weatherIcon}"> ${weatherDescription}</h5>
        <ul id = "weatherList">
            <li>Temperature: ${weatherTemp}&#8457;</li>
            <li>Wind: ${weatherWind} mph</li> 
            <li>Humidity: ${weatherHumidity}%</li>  
        </ul>
    </div>`;
    
    // set the HTML inside weatherContainer to the template literal i created
    weatherContainer.innerHTML = weatherTemplate;    
}

// displayForecast deconstructs the forecastData fetch return then creates a template literal with the data inside and pushes it into the forecastContainer
// this one differs from displayWeather in that we need to loop through the array of weather data first
function displayForecast(forecastData){
    // initialize forecastTemplate template literal here so that it exists in entire functions scope
    let forecastTemplate = ``;

    // loop through forecastData array
    for (let i= 0; i < forecastData.list.length; i++){
        // deconstruct all necessary forecast data
        let forecastUNIX = forecastData.list[i].dt;
        let forecastDate = dayjs.unix(forecastUNIX).format('MMM D, YYYY');
        let checkDate = dayjs.unix(forecastUNIX).format('HH');
        let forecastIcon = "https://openweathermap.org/img/wn/" + forecastData.list[i].weather[0].icon + "@2x.png";
        let forecastDescription = toTitleCase(forecastData.list[i].weather[0].description);
        let forecastTemp = forecastData.list[i].main.temp;
        let forecastWind = forecastData.list[i].wind.speed;
        let forecastHumidity = forecastData.list[i].main.humidity;
        
        // because this API returns weather data every 3 hours throughout the day, i am showing only the mid-day temperatures by using the below if statement
        // i noticed that some city locations were offset by 1 hour, thus 11am is the closest time to mid-day
        // only display forecast information if the time associated with the data is either 11 or 12
        if (checkDate === '11' || checkDate === '12'){
            // add to the template literal all the data we want to show the user, grouped by individual divs since we want to separate the five individual days and data
            forecastTemplate += `
            <div class = "m-2 forecastBlock">
                <h4> ${forecastDate} </h4>
                <h5><img src = "${forecastIcon}"> ${forecastDescription}</h5>
                <ul class = "forecastList p-2">
                    <li>Temperature: ${forecastTemp}&#8457;</li>
                    <li>Wind: ${forecastWind} mph</li> 
                    <li>Humidity: ${forecastHumidity}%</li>  
                </ul>
            </div>`;
        }
    }
    // set HTML inside forecastContainer to forecastTemplate literal
    forecastContainer.innerHTML = forecastTemplate;
}

// saveCity saves the city to local storage if it is not already there
function saveCity () {
    // get the current list of cities from local storage
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    // get the city name the user submitted in the input field + convert to title case for *aesthetics*
    const cityName = toTitleCase(input.value.trim());
    // check if the city name already exists in the stored list of cities
    const cityExists = cities.includes(cityName);
    // if the city doesn't exist, add it to the list and save it to local storage
    if (!cityExists) {
      cities.push(cityName);
      // remove cities beyond cityDisplayMax value
      if (cities.length >= cityDisplayMax) {
        cities.shift();
        }
      localStorage.setItem('cities', JSON.stringify(cities));
    }
    // reset the input field to an empty string
    input.value = '';
    // display the updated list of cities as clickable buttons
    displayCities(cities);
};

// display the list of cities as clickable search buttons
function displayCities(cities) {
    // reverse cityList so that most recent searches are at the top
  cities = cities.reverse();  
  cityList.innerHTML = '';
  // for each city, create a button with class "city-button" and an event listener to run getWeather for that city
  cities.forEach(cityName => {
    const button = document.createElement('button');
    button.classList.add("city-button");
    // create a var cityName out of the buttons text content
    button.textContent = cityName;
    button.addEventListener('click', () => {
        // give getWeather the city name as an argument 
        getWeather(cityName);
    });
    cityList.appendChild(button);
  });
}

// display saved city searches at all times
const cities = JSON.parse(localStorage.getItem('cities')) || [];
displayCities(cities);

// allows user clear local storage, removing all saved city searches
$("#clear-cities").on("click", function() {
    localStorage.clear();
    location.reload();
})

// this function just changes whatever the user's input was to title case so it looks nicer when stored
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}