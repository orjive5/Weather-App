//SELECT ELEMENTS

//Select separate content divs
const weatherInfo = document.querySelector('.weather-info');
const searchDiv = document.querySelector('.search-div');
const mainWeatherInfo = document.querySelector('.main-weather-info');
const otherWeatherInfo = document.querySelector('.other-weather-info');
const errorDiv = document.querySelector('.error-div');

//Select search elements
const searchInput = document.querySelector('.search-city');
const searchButton = document.querySelector('.search-button');

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
searchButton.addEventListener('click', getWeatherData);

//ASYNC/AWAIT FUNCTION TO GET THE WEATHER DATA FROM SEARCHED LOCATION AND STORE THE REQUIRED INFO IN AN OBJECT
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
        time: weatherDataJson.dt};

    //Clear the search bar
    searchInput.value = '';

    //Add Local Time with Google Time Zone API
    let googleAPIKey = 'AIzaSyAKYWlmUmj3lRs_DhyyJnhUrQpfm29tzvk';
    let latitude = weatherDataJson.coord.lat;
    let longitude = weatherDataJson.coord.lon;
    let location = `${latitude}, ${longitude}`;
    let getTimezone = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1478880000&key=${googleAPIKey}`, {mode: 'cors'});
    let timezoneJson = await getTimezone.json();
    timeZoneId = timezoneJson.timeZoneId;
    let timeDate;
    function timeRunning(){
        timeDate = new Date().toLocaleTimeString('en-US', {timeZone: timeZoneId, hour12: false});
        localTime.innerHTML = `Local time ${timeDate}`;
    }
    timeRunning();
    let timeRunningInterval = setInterval(timeRunning, 1000);

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
    currentTemperature.innerHTML = `Current temperature ${displayWeatherObject.main.temp} &#8451;`;

    //Feels like
    feelsLike.innerHTML = `Feels like ${displayWeatherObject.main.feels_like}&#8451;`;

    //Humidity
    humidity.innerHTML = `Humidity ${displayWeatherObject.main.humidity} %`;

    //Pressure
    pressure.innerHTML = `Pressure ${displayWeatherObject.main.pressure} mbar`

    //Wind speed
    windSpeed.innerHTML = `Wind speed ${displayWeatherObject.wind} m/s`

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
        //TODO
        //FIND A BETTER WAY TO STOP TIME/CLEAR INTERVAL
        timeZoneId = '';

        //Display error message
        displayError.innerHTML = 'City not found, please, try again!';
        console.log(error);
    }
}