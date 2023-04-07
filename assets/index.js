var baseURL_weather = "https://api.openweathermap.org/data/2.5/";
var baseURL_geo ="http://api.openweathermap.org/geo/1.0/direct?";
var apiKey = "d06ddbdb382e974460b03c357ca41e3e";
var baseURL_icn = "http://openweathermap.org/img/w/";
var city_name = "";

// Weather search
function weatherSearch(event){
    event.preventDefault();
    city_name = $("#search-input").val().trim().toLowerCase();
    if(city_name==""){
        alert("please enter a city name");
    }else{
        geoInfo(city_name);
    }
}

// Get the geographical coordinates of the input city
function geoInfo(city) {
    var queryParams_geo = {
        appid: apiKey
    };
    queryParams_geo.q=city;
    var queryURL = baseURL_geo+$.param(queryParams_geo);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(getWeatherData);
}

// Get weather data
function getWeatherData(data){
    var queryParams_weather = {
        appid: apiKey
    };
    queryParams_weather.lat=data[0].lat;
    queryParams_weather.lon=data[0].lon;
    queryParams_weather.units="metric";

    var queryURL_currentWeather = baseURL_weather+"weather?"+$.param(queryParams_weather);
    var queryURL_forecast = baseURL_weather+"forecast?"+$.param(queryParams_weather);
    currentWeatherInfo(queryURL_currentWeather);
    weatherForecastInfo(queryURL_forecast);
}

// Grab current weather data from server
function currentWeatherInfo(q_url){
    $.ajax({
        url: q_url,
        method: "GET"
    }).then(currentWeather);
}

// Grab weather forecast data from server
function weatherForecastInfo(q_url){
    $.ajax({
        url: q_url,
        method: "GET"
    }).then(weatherForecast);
}


// Display current weather of the city
function currentWeather(data){
    var city = city_name;
    var today = moment().format("D/M/YYYY");
    var icn = data.weather[0].icon;
    var icn_path = baseURL_icn+icn+".png";
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var wind = data.wind.speed;
    wind = (wind*3.6).toFixed(2);// convert from m/s to km/h and round to 2 decimal place
    // Display info in HTML
    displayCurrentWeather(city, today, icn_path, temp, wind, humidity);
}

// Layout to display current weather
function displayCurrentWeather(city, date, icn_path, temp, wind, humidity){
    var info = "";
    info += "<h2><span class=\"city\">"+city+"</span> ("+date+") <img src=\""+icn_path+"\"/></h2>";
    info += "<p>Temp: "+temp+"°C</p>";
    info += "<p>Wind: "+wind+" KPH</p>";
    info += "<p>Humidity: "+humidity+"%</p>";
    $("#today").html(info);
}

// Display 5-day forecast 
function weatherForecast(data){
    var weatherInfoList = data.list;// list of 5-day weather info with 3-hr steps
    // Create a grid layout for the weather forecast
    var container = $("<div class=\"container\">");
    var row = $("<div class=\"row row-cols-5\" id=\"row_cards\">");
    container.append(row);
    $("#forecast").html(container);
    
    // To filter daily weather info, as  the data is taking in every 3 hrs, we only pick the weather info at the time 00:00:00
    for (var i = 0; i < 5; i++) {
        var filteredDate_weatherInfo = [];
        var date = moment().add(i+1, 'days').format("YYYY-MM-DD");
        filteredDate_weatherInfo = weatherInfoList.filter(function (wi) {
            return wi.dt_txt.includes(date);    
        });
        var temp = filteredDate_weatherInfo[0].main.temp;
        var humidity = filteredDate_weatherInfo[0].main.humidity;
        var wind = filteredDate_weatherInfo[0].wind.speed;
        wind = (wind*3.6).toFixed(2);// convert from m/s to km/h and round to 2 decimal place
        var icn = filteredDate_weatherInfo[0].weather[0].icon;
        var icn_path = baseURL_icn+icn+".png";

        // Display info in HTML
        displayWeatherForecast(date, icn_path, temp, wind, humidity);
    }
}

// Layout to display 5-day weather forecast
function displayWeatherForecast(date, icn_path, temp, wind, humidity) {
    var dt = moment(date, "YYYY-MM-DD").format("D/M/YYYY");
    var info = "";
    info += "<div class=\"col\">";
    info += "<div class=\"card mb-3\">";
    info += "<div class=\"card-body\>";
    info += "<h5 class=\"card-title\">"+dt+"</h5>";
    info += "<p><img src=\""+icn_path+"\"/></p>";
    info += "<p>Temp: "+temp+" °C</p>";
    info += "<p>Wind: "+wind+" KPH</p>";
    info += "<p>Humidity: "+humidity+" %</p>";
    info += "</div>";
    info += "</div>";
    info += "</div>";
    $("#row_cards").append(info);
}
