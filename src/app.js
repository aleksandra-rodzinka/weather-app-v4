function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${day}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/broken-clouds-night.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> 18° </span>
          <span class="weather-forecast-temperature-min"> 12° </span>
        </div>
      </div>
  `;
  });
  forecastHTML = forecastHTML + `<div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let conditionsElement = document.querySelector("#conditions");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(response.data.temperature.current);

  cityElement.innerHTML = `${response.data.city}, ${response.data.country}`;
  conditionsElement.innerHTML = response.data.condition.description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.temperature.humidity;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);

  getForecast();
}

function getForecast() {
  let city = document.querySelector("#city-input");
  let ApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=f0c81td68bc7aeb6ae5b7113o45714af&units=metric`;
  console.log(ApiUrl);
}

function search(city) {
  let ApiKey = "f0c81td68bc7aeb6ae5b7113o45714af";
  let ApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${ApiKey}&units=metric`;
  axios.get(ApiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

displayForecast();

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let FahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(FahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function showCurrentLocation(position) {
  let ApiKey = "f0c81td68bc7aeb6ae5b7113o45714af";
  let ApiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${ApiKey}&units=metric`;
  axios.get(ApiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function applyTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(`theme-${theme}`);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#selTheme").addEventListener("change", function () {
    applyTheme(this.value);
  });
});

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let locateButton = document.querySelector("#locate-button");
locateButton.addEventListener("click", getCurrentLocation);

search("Varazdin");
