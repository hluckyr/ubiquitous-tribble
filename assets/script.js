var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var todaycontainer = document.querySelector("#weather-container");
var cityButtonsEl = document.querySelector("#history-buttons");
var buttons = [];
var saveButtons = function () {
    localStorage.setItem("buttons", JSON.stringify(buttons));
};

//local storage
var loadButtons = function () {
    var savedButtons = localStorage.getItem("buttons");
   
    if (!savedButtons) {
        return false;
    };

    savedButtons = JSON.parse(savedButtons);

    for (var i = 0; i < savedButtons.length; i++) {
      
        createButton(savedButtons[i]);
    }
};

// takes info put into submit form and passes it to create button and getWeather
var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityname = cityInputEl.value.trim();
    if (cityname) {
        createButton(cityname);
        getWeather(cityname);
        cityInputEl.value = "";
    } else {
        alert("search city");
    }
};

//button formSubmitHandler
var createButton = function (cityObj) {
    
    var cityEl = document.createElement("button");
    cityEl.id = "searched"
    var buttonHolder = document.querySelector("#history-buttons");
    cityEl.className = "btn btn-secondary mb-1";
    cityEl.innerHTML = cityObj;

 
    if (!buttons.includes(cityEl.innerHTML)) {
        buttonHolder.appendChild(cityEl);
        buttons.push(cityObj);
        saveButtons();
    } else {
        return;
    }
}

//display the current and five-day forecast for city 
var displayWeather = function (weather, city) {
    
    if (weather.length === 0) {
        todaycontainer.textContent = "not found";
        return;
    }
    var degreeF = function (K) {
        return (K - 273.15) * (9 / 5) + 32;
    }
    var icon = function (day) {
        return $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weather.list[day].weather[0].icon + ".png");
    };


    // current forcast
    var citySearched = $("#city-search-term")
    citySearched.text(city + " (" + weather.list[0].dt_txt.split(" ")[0] + ") ");
    citySearched.append(icon(0));
    var todaysWeather = $("#today-weather-container");
    var todaysTemp = $("<p>").text("Temp: " + degreeF(weather.list[0].main.temp).toPrecision(2) + "\u00b0 F");
    var todaysWind = $("<p>").text("Wind: " + weather.list[0].wind.speed + " MPH");
    var uvValue = $("<span>").css("background-color", "yellow").text("0.47");
    var todaysHumidity = $("<p>").text("Humidity: " + weather.list[0].main.humidity + "%");
    var uvIndex = $("<p>").text("UV Index: ").append(uvValue);
    todaysWeather.empty();
    todaysWeather.append(todaysTemp).append(todaysWind).append(todaysHumidity).append(uvIndex);

    //five-day forcast
    var forcast = $("#forcast-weather");
    forcast.empty();
    for (var i = 1; i < 6; i++) {
        var listEl = $("<div>").css({ "background-color": "pink", "margin-right": "5px" }).addClass("col");
        var date = weather.list[i].dt_txt.split(" ")[0]
        var forcastIcon = icon(i);
        var forcastWind = $("<p>").text("Wind: " + weather.list[i].wind.speed + " MPH");
        var forcastTemp = $("<p>").text("Temp: " + degreeF(weather.list[i].main.temp).toPrecision(2) + "\u00b0 F");
        listEl.append(date).append(forcastIcon).append(forcastWind).append(forcastTemp)
        forcast.append(listEl)
    }
}

//fetch weather data
var getWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c624b9226c870cd6a1de5f15aee31aae";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    displayWeather(data, city);
                });
            } else {
                alert('Error: City Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to get weather.");
        });
};

var buttonClickHandler = function (event) {
    id = event.target.getAttribute("id")
    city = event.target.innerHTML;
    if (id = searched) {
        getWeather(city);
    }
}

//event listener
cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);
loadButtons();