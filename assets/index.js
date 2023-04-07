var baseURL_weather = "https://api.openweathermap.org/data/2.5/";
var baseURL_geo ="http://api.openweathermap.org/geo/1.0/direct?";
var apiKey = "d06ddbdb382e974460b03c357ca41e3e";
var baseURL_icn = "http://openweathermap.org/img/w/";
var city_name = "";

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
    console.log("geo", data);
    var queryParams_weather = {
        appid: apiKey
    };
    queryParams_weather.lat=data[0].lat;
    queryParams_weather.lon=data[0].lon;
    queryParams_weather.units="metric";
    var queryURL_currentWeather = baseURL_weather+"weather?"+$.param(queryParams_weather);
    currentWeatherInfo(queryURL_currentWeather);
}

function currentWeatherInfo(q_url){
    $.ajax({
        url: q_url,
        method: "GET"
    }).then(displayCurrentWeather);
}


// Display current weather of the city
function displayCurrentWeather(data){
    var city = city_name;
    var today = moment().format("D/M/YYYY");
    var icn = data.weather[0].icon;
    var icn_path = baseURL_icn+icn+".png";
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var wind = data.wind.speed;
    wind = (wind*3.6).toFixed(1);// convert from m/s to km/h and round to 1 decimal place
    // Append info to HTML
    var info = "";
    info += "<h2><span class=\"city\">"+city+"</span> ("+today+") <img src=\""+icn_path+"\"/></h2>";
    info += "<p>Temp: "+temp+"°C</p>";
    info += "<p>Wind: "+wind+" KPH</p>";
    info += "<p>Humidity: "+humidity+"%</p>";
    $("#today").html(info);
}