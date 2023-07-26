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