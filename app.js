const searchInput = document.querySelector('.search-city');
const searchButton = document.querySelector('.search-button');
let url;
searchInput.addEventListener('input', () => {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&APPID=7bede0872db1abee3b064a02835ffb0b`
})
searchButton.addEventListener('click', getWeatherData);
async function getWeatherData() {
    try {
    let weatherData = await fetch(url, {mode: 'cors'});
    console.log(weatherData);
    let weatherDataJson = await weatherData.json();
    console.log(weatherDataJson);
    let displayWeatherObject = {clouds: weatherDataJson.clouds, main: weatherDataJson.main, weather: weatherDataJson.weather, wind: weatherDataJson.wind};
    console.log(displayWeatherObject);
    }
    catch(error) {
        console.log('Please, try again!');
    }
}