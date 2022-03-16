const searchInput = document.querySelector('.search-city');
const searchButton = document.querySelector('.search-button');
let cityName = document.querySelector('.city-name');
let localTime = document.querySelector('.local-time');
let weatherDescription = document.querySelector('.weather-description');
let currentTemperature = document.querySelector('.current-temperature');
let feelsLike = document.querySelector('.feels-like');
let humidity = document.querySelector('.humidity');
let pressure = document.querySelector('.pressure');
let windSpeed = document.querySelector('.wind-speed');
let url;
let displayWeatherObject = {};
searchInput.addEventListener('input', () => {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&APPID=7bede0872db1abee3b064a02835ffb0b`
})
searchButton.addEventListener('click', getWeatherData);
async function getWeatherData() {
    try {
    let weatherData = await fetch(url, {mode: 'cors'});
    let weatherDataJson = await weatherData.json();
    console.log(weatherDataJson);
    displayWeatherObject = {
        clouds: weatherDataJson.clouds,
        main: weatherDataJson.main,
        weather: [weatherDataJson.weather[0].description, weatherDataJson.weather[0].main],
        wind: weatherDataJson.wind.speed,
        city: weatherDataJson.name,
        time: weatherDataJson.dt};
    console.log(displayWeatherObject);
    //Clear the search bar
    searchInput.value = '';
    //Add Local Time with Google Time Zone API
    // let googleAPIKey = 'AIzaSyAKYWlmUmj3lRs_DhyyJnhUrQpfm29tzvk';
    let latitude = weatherDataJson.coord.lat;
    let longitude = weatherDataJson.coord.lon;
    console.log(latitude);
    console.log(longitude);
    let location = `${latitude}, ${longitude}`;
    let getTimezone = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1478880000&key=AIzaSyAKYWlmUmj3lRs_DhyyJnhUrQpfm29tzvk`, {mode: 'cors'});
    let timezoneJson = await getTimezone.json();
    timeZoneId = timezoneJson.timeZoneId;
    console.log(timezoneJson);
    console.log(timeZoneId);
    let timeDate = new Date().toLocaleString('en-US', {timeZone: timeZoneId});
    localTime.innerHTML = `Local time ${timeDate}`;
    function timeRunning(){
        let timeDate = new Date().toLocaleString('en-US', {timeZone: timeZoneId});
        localTime.innerHTML = `Local time ${timeDate}`;
    }
    setInterval(timeRunning, 1000);
    console.log(timeDate);
    //Add weather information to the DOM
    weatherDescription.innerHTML = displayWeatherObject.weather[0];
    cityName.innerHTML = displayWeatherObject.city;
    // localTime.innerHTML = timeDate;
    currentTemperature.innerHTML = `Current temperature ${displayWeatherObject.main.temp} &#8451;`;
    feelsLike.innerHTML = `Feels like ${displayWeatherObject.main.feels_like}&#8451;`;
    humidity.innerHTML = `Humidity ${displayWeatherObject.main.humidity} %`;
    pressure.innerHTML = `Pressure ${displayWeatherObject.main.pressure} mbar`
    windSpeed.innerHTML = `Wind speed ${displayWeatherObject.wind} m/s`
    //Return 
    return displayWeatherObject;
    }
    //Deal with errors
    catch(error) {
        console.log('Please, try again!');
    }
}