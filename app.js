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
    console.log(weatherDataJson);

    //Store the required data in an object
    displayWeatherObject = {
        clouds: weatherDataJson.clouds,
        main: weatherDataJson.main,
        weather: [weatherDataJson.weather[0].description, weatherDataJson.weather[0].main],
        wind: weatherDataJson.wind.speed,
        city: weatherDataJson.name,
        country: weatherDataJson.sys.country,
        time: weatherDataJson.dt};
    console.log(displayWeatherObject);

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

    //Clear error message
    displayError.innerHTML = '';

    // Change background image
    const docBody = document.querySelector('body');
    function changeBackground() {
        if (displayWeatherObject.weather[1] === 'Thunderstorm') {
            docBody.style.backgroundImage = `url('images/thunderstorm.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Drizzle') {
            docBody.style.backgroundImage = `url('images/drizzle.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Rain') {
            docBody.style.backgroundImage = `url('images/rain.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Snow') {
            docBody.style.backgroundImage = `url('images/snow.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Atmosphere') {
            docBody.style.backgroundImage = `url('images/atmosphere.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Clear') {
            docBody.style.backgroundImage = `url('images/clear.jpg')`;
        }
        else if (displayWeatherObject.weather[1] === 'Clouds') {
            docBody.style.backgroundImage = `url('images/clouds.jpg')`;
        }
    }
    changeBackground();

    //GET BACKGROUND GIFS
    // const docBody = document.querySelector('body');
    // const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=lOvBxxU64fiAuk0MtXSBCUyb9RMd9Ofa&s=${displayWeatherObject.weather[1]}`, {mode: 'cors'});
    // const gifData = await response.json();
    // docBody.style.backgroundImage = `url('${gifData.data.images.original.url}')`;
    // console.log(gifData.data.images.original.url);
    
    // const docBody = document.querySelector('body');
    // async function getBackgroundGif() {
    //     try {
    //     const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=lOvBxxU64fiAuk0MtXSBCUyb9RMd9Ofa&s=${displayWeatherObject.weather[1]}`, {mode: 'cors'});
    //     const gifData = await response.json();
    //     docBody.backgroundImage = `url(${gifData.data.images.original.url})`;
    //     } catch (error) {
    //         docBody.backgroundImage = `#`
    //     }
    // }
    // getBackgroundGif();
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