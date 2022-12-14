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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img referrerpolicy="no-referrer"
          src=${forecastDay.condition.icon_url}
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temperature.maximum
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temperature.minimum
          )}° </span>
        </div>
      </div>
  `;
    }
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
  let city = document.querySelector("#city-input").value;
  let ApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=f0c81td68bc7aeb6ae5b7113o45714af&units=metric`;
  axios.get(ApiUrl).then(displayForecast);
}

function search(city) {
  let ApiKey = "f0c81td68bc7aeb6ae5b7113o45714af";
  let ApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${ApiKey}&units=metric`;
  axios.get(ApiUrl).then(function (response) {
    displayTemperature(response);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

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

let locateButton = document.querySelector("#locate-button");
locateButton.addEventListener("click", getCurrentLocation);

search("Nielepkowice");
document.querySelector("#city-input").value = "Nielepkowice";
