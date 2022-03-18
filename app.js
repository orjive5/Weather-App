//SELECT ELEMENTS

//Select separate content divs
const weatherInfo = document.querySelector('.weather-info');
const searchDiv = document.querySelector('.search-div');
const mainWeatherInfo = document.querySelector('.main-weather-info');
const otherWeatherInfo = document.querySelector('.other-weather-info');
const errorDiv = document.querySelector('.error-div');

//Select search elements
const searchInput = document.querySelector('.search-city');
const searchIcon = document.querySelector('.search-icon');

//Select main weather info
let cityName = document.querySelector('.city-name');
let localTime = document.querySelector('.local-time');
let weatherDescription = document.querySelector('.weather-description');
let currentTemperature = document.querySelector('.current-temperature');

//Select other weather info
let feelsLike = document.querySelector('.feels-like');
let humidity = document.querySelector('.humidity');
let pressure = document.querySelector('.pressure');
let windSpeed = document.querySelector('.wind-speed');

//Select error paragraph
let displayError = document.querySelector('.display-error');

//GET THE DATA FROM THE OPEN WEATHER API

//Search for weather data for the specific location
let url;
let displayWeatherObject = {};
searchInput.addEventListener('input', () => {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&APPID=7bede0872db1abee3b064a02835ffb0b`
})
//Click search button
searchIcon.addEventListener('click', getRequiredData);

//ASYNC FUNCTION TO GET THE WEATHER DATA FROM SEARCHED LOCATION AND STORE THE REQUIRED INFO IN AN OBJECT
async function getWeatherData() {
    try {

    //Get the raw data and process JSON
    let weatherData = await fetch(url, {mode: 'cors'});
    let weatherDataJson = await weatherData.json();

    //Store the required data in an object
    displayWeatherObject = {
        clouds: weatherDataJson.clouds,
        main: weatherDataJson.main,
        weather: [weatherDataJson.weather[0].description, weatherDataJson.weather[0].main],
        wind: weatherDataJson.wind.speed,
        city: weatherDataJson.name,
        country: weatherDataJson.sys.country,
        time: weatherDataJson.dt,
        latitude: weatherDataJson.coord.lat,
        longitude: weatherDataJson.coord.lon}

    //Clear the search bar
    searchInput.value = '';

    //ADD WEATHER DATA TO THE DOM

    //Add weather description but make first letter of each word capital
    const weatherDescriptionArray = displayWeatherObject.weather[0].split(" ");
    for (let i = 0; i < weatherDescriptionArray.length; i++) {
    weatherDescriptionArray[i] = weatherDescriptionArray[i].charAt(0).toUpperCase() + weatherDescriptionArray[i].slice(1);
    }
    weatherDescription.innerHTML = weatherDescriptionArray.join(" ");

    //City name
    cityName.innerHTML = `${displayWeatherObject.city}, ${displayWeatherObject.country}`;

    //Current temperature
    currentTemperature.innerHTML = `${displayWeatherObject.main.temp} &#8451;`;

    //Feels like
    feelsLike.innerHTML = `Feels like ${displayWeatherObject.main.feels_like} &#8451;`;

    //Humidity
    humidity.innerHTML = `Humidity ${displayWeatherObject.main.humidity} %`;

    //Pressure
    pressure.innerHTML = `Pressure ${displayWeatherObject.main.pressure} mbar`

    //Wind speed
    windSpeed.innerHTML = `Wind speed ${displayWeatherObject.wind} m/s`

    //Clear error message
    displayError.innerHTML = '';

    //RETURN WEATHER DATA OBJECT
    return displayWeatherObject;
    }

    //DEAL WITH ERRORS
    catch(error) {

        //Clear previous weather data
        weatherDescription.innerHTML = '';
        cityName.innerHTML = '';
        currentTemperature.innerHTML = '';
        feelsLike.innerHTML = '';
        humidity.innerHTML = '';
        pressure.innerHTML = '';
        windSpeed.innerHTML = '';
        localTime.innerHTML = '';
        displayWeatherObject = {};

        //Display error message
        displayError.innerHTML = 'City not found, please, try again!';
        console.log(error);
    }
}
    //FIND THE LOCAL TIME ZONE USING GOOGLE TIME ZONE API
    let timeRunningInterval;
    let timezoneJson;
    async function getLocalTime() {
        try {
    let googleAPIKey = 'AIzaSyAKYWlmUmj3lRs_DhyyJnhUrQpfm29tzvk';
    let location = `${displayWeatherObject.latitude}, ${displayWeatherObject.longitude}`;
    let getTimezone = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1478880000&key=${googleAPIKey}`, {mode: 'cors'});
    timezoneJson = await getTimezone.json();
    return timezoneJson;
        }
        catch(error) {
            console.log(error)
            console.log('Please, try again!')
            localTime.innerHTML = '';
        }
    }

    //DISPLAY LOCAL TIME
    async function timeRunning(){
        try {
            timeZoneId = await timezoneJson.timeZoneId;
            let timeDate;
                if (timezoneJson.timeZoneId !== undefined){
            timeDate = new Date().toLocaleTimeString('en-US', {timeZone: timeZoneId});
            localTime.innerHTML = `${timeDate}`
            }
                else {
            localTime.innerHTML = '';
            }
        }
        catch(error){
            console.log('timezoneJson.timeZoneId is undefined');
        }
    }
    async function setTimeRunningInterval() {
        try {
            if (timezoneJson.timeZoneId !== undefined){
        timeRunningInterval = setInterval(timeRunning, 1000);
            }
        }
        catch(error) {
            console.log(error)
            clearInterval(timeRunningInterval);
        }
    }

    //RUN ASYNC FUNCTIONS
    async function getRequiredData() {
        try {
        await getWeatherData();
        await getLocalTime();
        await timeRunning();
        await setTimeRunningInterval();
        }
        catch (error) {
            console.log('No required data try again!')
        }
    }
    //RUN ASYNC FUNCTIONS ONLOAD
    window.addEventListener('load', () => {
        searchInput.value = 'Belgrade'
        url = `http://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&APPID=7bede0872db1abee3b064a02835ffb0b`
        getRequiredData();
    });
    //RUN ASYNC FUNCTION WHEN ENTER IS PRESSED
    searchInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            getRequiredData();
        }
    })