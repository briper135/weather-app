function formatDate(timestamp){
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours <10){
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes <10){
        minutes = `0${minutes}`;
    }
    let days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}


function formatDay(timestamp){
    let date = new Date (timestamp*1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];

}

function getForecast(coordinates){
    let apiKey = "d1bbd379750cfbcbbe5aa91d99dcdec2";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response){
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    celsiusTemperature = response.data.main.temp;

    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formatDate(response.data.dt*1000);
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`); 
    iconElement.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord);
}

function search(city) {
let apiKey = "d1bbd379750cfbcbbe5aa91d99dcdec2";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}


function displayFahrenheitTemperature(event){
    event.preventDefault();
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemperature = (celsiusTemperature*9/5)+32;
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayForecast(response){
    let forecast = response.data.daily;

    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    
    
    forecast.forEach(function(forecastDay, index){
        if(index < 6){
        forecastHTML = forecastHTML + `
            <div class="col-2">
                <div class="weather-forecast-date">
            ${formatDay(forecastDay.dt)}
                </div>
                <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="42"/>
                <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temperatures-max">
                ${Math.round(forecastDay.temp.max)}°C</span> <span class="weather-forecast-temperatures-min"> ${Math.round(forecastDay.temp.min)}°C </span>
                </div>
            </div>
        `;
    }});

    
    
        forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;

}


function searchLocation(position){
    let apiKey = "d1bbd379750cfbcbbe5aa91d99dcdec2";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let apiUnits = "metric";
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=${apiUnits}&appid=${apiKey}`;
    axios.get(apiUrl).then(displayTemperature);
}


function getCurrentLocation(event){
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchLocation);
}



let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#here");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("New York");