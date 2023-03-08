var weatherApiRoot = 'https://api.openweathermap.org';
var weatherApiKey = '81e95fc2830a91e1d5ed3a2803de3454';
var searchForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#site-search");
var todayForecast = document.querySelector("#today");
var fiveDayForecast = document.querySelector("#fiveDay");
var searchHistory = [];
var searchHistoryEl = document.querySelector("#history");


function currentWeather(city, weather) {
    var date = dayjs().format("M/D/YYYY");
    var tempF = weather.main.temp;
    var windMPH = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    var heading = document.createElement("h2");
    heading.setAttribute("class", "h3 card-title");
    heading.textContent = `${city} (${date})`;

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    weatherIcon.setAttribute("class", "weather-img");
    heading.append(weatherIcon);

    var tempEl = document.createElement("p");
    tempEl.setAttribute("class", "card-text");
    tempEl.textContent = `Temp: ${tempF} F`;

    var windEl = document.createElement("p");
    windEl.setAttribute("class", "card-text");
    windEl.textContent = `Wind ${windMPH} MPH`;

    var humidityEl = document.createElement("p");
    humidityEl.setAttribute("class", "card-text");
    humidityEl.textContent = `Humidity: ${humidity}`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayForecast.innerHTML = "";
    todayForecast.append(card);
}

function fiveDaysOut(forecast){
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description
    var tempF = forecast.main.temp;
    var wingMPH = forecast.wind.speed;
    var humidity = forecast.main.humidity;

    var col = document.createElement("div");
    col.setAttribute("class", "col-md");
    col.classList.add("five-day");

    var card = document.createElement("div");
    card.setAttribute("class", "card bg-info h-250 text-sliver");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body p-2");

    var cardTitle = document.createElement("h4");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.textContent = dayjs(forecast.dt_txt).format("MM/DD/YYYY");

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", iconUrl);

    var tempEl = document.createElement("p");
    tempEl.setAttribute("class", "card-text");
    tempEl.textContent = `Temp: ${tempF} F`;

    var windEl = document.createElement("p");
    windEl.setAttribute("class", "card-text");
    windEl.textContent = `Wind: ${windMPH} Mph`;

    var humidityEl = document.createElement("p");
    humidityEl.setAttribute("class", "card-text");
    humidityEl.textContent = `humidity: ${humidity} `;

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    fiveDayForecast.append(col);
}

function showFiveDay(fiveDay){
var dayOne = dayjs().add(1, "day").startof("day").unix();
var dayFive = dayjs().add(6, "day").startof("day").unix();

var headingCol = document.createElement("div")
headingCol.setAttribute("class", "col-12");
var heading = document.createElement("h4");
heading.textContent = "5 Day forecast";
headingCol.append(heading);
fiveDayForecast.innerHTML = "";
fiveDayForecast.append(headingCol);


for (var i = 0; i < fiveDay.length; i++){
    if (fiveDay[i].dt>= dayOne && fiveDay[i].dt < dayFive) {
        fiveDaysOut(fiveDay[i]);
    }
}
};


function fetchWeather(location) {
    const { lat, lon, name } = location;
    const weatherApiRoot = 'https://api.openweathermap.org';
    const weatherApiKey = "81e95fc2830a91e1d5ed3a2803de3454";
    const currentWeatherEndpoint = `${weatherApiRoot}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;
    const fiveDayForecastEndpoint = `${weatherApiRoot}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

    fetch(currentWeatherEndpoint)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error retrieving current weather.");
            }
        })
        .then(function (currentWeatherData) {
            currentWeather(name, currentWeatherData);
        })
        .catch(function (error) {
            console.log(error);
        });

    fetch(fiveDayForecastEndpoint)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error retrieving five day forecast.");
            }
        })
        .then(function (forecastData) {
            showFiveDay(forecastData.list);
        })
        .catch(function (error) {
            console.log(error);
        });
}
  
    fetch(weatherApiRoot)
      .then(function (response) {
        return response.json();
      })
      .then(function (current) {
        currentWeather(city, current);
        const apiUrlFiveDay = `${weatherApiRoot}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
        return fetch(apiUrlFiveDay);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (forecast) {
        showFiveDay(forecast.list);
      })
      .catch(function (error) {
        console.log(error);
      });
  
    function fetchLocation(search){
        var geoApi = weatherApiRoot + "/geo/1.0/direct?q={search}&limit=5&appid=" + weatherApiKey

        fetch(geoApi)
        .then(function(res){
        return res.json();
        })
        .then(function(data){
            if (!data[0]) {
            alert("not found");
        }
        else {
            appendToHistory(search);
            fetchWeather(data[0]);
        }
        })
        .catch(function (error){
            console.error(error);
        });
}

function searchCity(loc){
    if (!searchInput.value){
        return;
    }

loc.preventDefult();
var search = searchInput.value.trim();
fetchLocation(search);
searchInput.value = "";
}

function previousCities(loc) {
    if (loc.target.matches(".history-btn")){
        return
    }

var btn = loc.target;
var search = btn.getAttribute("data-search");
fetchLocation(search);
}

function renederSearchHistory(){
    searchHistory.innerHTML = "";
}
function previousCities() {
    var previousCities = [""];
    var citiesList = document.getElementById("history");
    
    
    citiesList.innerHTML = "";
    
   
    for (var i = 0; i < previousCities.length; i++) {
      var city = previousCities[i];
      var button = document.createElement("button");
      button.textContent = city;
      
      button.addEventListener("click", function() {
        var searchInput = this.textContent;
        searchWeather(searchInput);
      });
      
      citiesList.appendChild(button);
    }
  }
  
  function searchWeather(searchInput) {
    
  }
  
 
  previousCities();
