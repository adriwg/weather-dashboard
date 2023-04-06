var baseURL_weather = "https://api.openweathermap.org/data/2.5/forecast?";
var baseURL_geo ="http://api.openweathermap.org/geo/1.0/direct?";
var queryParams = {
    appid: "d06ddbdb382e974460b03c357ca41e3e"
};

function weatherSearch(event){
    event.preventDefault();
    var search_input = $("#search-input").val().trim();
    if(search_input==""){
        alert("please enter a city name");
    }else{
        getGeoInfo(search_input);
        /* $.ajax({
            url: "url",
            method: "GET"
        }).then(function(response){
            console.log(response);
        }); */
    }

    

}

function getGeoInfo(searchInput) {
    queryParams.q=searchInput;
    var queryURL = baseURL_geo+$.param(queryParams);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var lat = response[0].lat;
        var lon = response[0].lon;
        console.log("lat: " + lat + " lon: " + lon);
    });
}