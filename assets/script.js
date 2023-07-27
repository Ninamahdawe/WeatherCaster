$(document).ready(function () {

    var cityInput = $("#cityinput");
    var searchButton = $("#search");
    var clearButton = $("#clear-button");
    var pastCitiesButtons = $("#cities-list button");

    var currentHeaderDate = dayjs().format('dddd, MMMM DD  ');
    $("#currentDay").text(currentHeaderDate);

    searchButton.click(function () {
        console.log("search button clicked")
        const city = cityInput.val().trim();
        // city = "Dubai"
        if (city) {
            getWeatherData(city);

        }
    });

    clearButton.click(function () {
        cityInput.val("");
    });

    pastCitiesButtons.click(function (event) {
        console.log("past city button clicked")
        var city = $(this).data("city");
        getWeatherData(city);
    });

    function getWeatherData(city) {
        console.log(city)

        var apiKey = "77feac88a34506150cb0d11370b373a7";
        var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?" + "q=" + city + "&limit=5&appid=" + apiKey;

        fetch(apiUrl)
            // make a reqest to get the lat and lon for the selected city
            .then(function (res) {
                if (!res.ok) {
                    console.error("No results found! Try again");

                }
                return res.json()
            })
            .then(function (data) {
                console.log(data)
                if (!data || data.length === 0) {
                }
                var lat = data[0].lat;
                var lon = data[0].lon;

                var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

                fetch(weatherUrl)
                    .then(function (res) {
                        if (!res.ok) {
                            console.error("No results found! Try again");
                        }
                        return res.json()

                    })

                    .then(function (weatherData) {
                        console.log(weatherData);
                        if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
                        }

                        var forecastData = weatherData.list;

                        for (var i = 0; i < forecastData.length; i++) {
                            var forecast = forecastData[i];
                            var futureDate = dayjs(forecast.dt_txt).format("dddd");
                            var iconUrl = "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png";

                            var futureContainer = $(".future").eq(i);
                            futureContainer.find(".city-date").text(futureDate);
                            futureContainer.find(".weather-icon").attr("src", iconUrl);
                            futureContainer.find(".city-temp").text(`${forecast.main.temp}°C`);
                            futureContainer.find(".city-wind").text(`Wind: ${forecast.wind.speed} Km/h`);
                            futureContainer.find(".city-humidity").text(`Humidity: ${forecast.main.humidity}%`);
                        }


                        var currentWeather = forecastData[0];
                        $("#cityname").text(weatherData.city.name);
                        $("#currentDay").text(new Date().toDateString());
                        $("#city-temp").text(`${currentWeather.main.temp}°C`);
                        $("#city-wind").text(`Wind: ${currentWeather.wind.speed} Km/h`);
                        $("#city-humidity").text(`Humidity: ${currentWeather.main.humidity}%`);

                    })
                    .catch(function (error) {
                        console.error("Error fetching weather data:", error);
                        alert("Please try again later.");
                    });
            })
    }
});








    // this is the data that should contain lat and lon
    // use the data to make another fetch request to a different endpoint for the actuall weather data.
    // follow the fetch().then() syntax above again
