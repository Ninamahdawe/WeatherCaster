// This function  is to ensures that the code inside it executes when the document is fully loaded and ready.
$(document).ready(function () {
    //  The variable declarations to store jQuery objects for various elements in the index.HTML.

    var cityInput = $("#cityinput");
    var searchButton = $("#search");
    var clearButton = $("#clear-button");
    var pastCitiesButtons = $("#cities-list button");
    var pastCitiesContainer = $("#cities-list")




    // To get the current date using dayjs library and display it in a Month/Day format.
    var currentHeaderDate = dayjs().format("dddd, MMMM DD  ");
    $("#currentDay").text(currentHeaderDate);

    //   The "Search City" button click.

    searchButton.click(function () {
        console.log("search button clicked");
        // city = "Dubai"
        const city = cityInput.val().trim();
        if (city) {
            getWeatherData(city);
        }
    });
    // For the "Clear Search" button click.
    // Clear the input field value when "Clear Search" button is clicked.
    clearButton.click(function () {
        cityInput.val("");
    });
    // For past city buttons click.
    pastCitiesButtons.click(function (event) {
        console.log("past city button clicked");
        var city = $(this).data("city");
        getWeatherData(city);

    });

    // To access (fetch) weather data for a given city.

    function getWeatherData(city) {
        console.log(city);

        // API key for accessing OpenWeatherMap API.
        var apiKey = "77feac88a34506150cb0d11370b373a7";

        // URL to get latitude and longitude for the selected city from OpenWeatherMap API.

        var apiUrl =
            "https://api.openweathermap.org/geo/1.0/direct?" +
            "q=" +
            city +
            "&limit=5&appid=" +
            apiKey;

        // Request to get the latitude and longitude of the city.
        fetch(apiUrl)
            .then(function (res) {
                if (!res.ok) {
                    console.error("No results found! Try again");
                }
                return res.json();
            })
            .then(function (data) {
                console.log(data);
                // If the data is empty or undefined, do no change.
                if (!data || data.length === 0) {
                    alert("city not found")
                    return;
                }
                const cityName = data[0].name
                saveCityLocal(cityName)
                // Get the latitude and longitude from the data.
                var lat = data[0].lat;
                var lon = data[0].lon;
                renderPastCityButtons()
                var weatherUrl =
                    "https://api.openweathermap.org/data/2.5/forecast?" +
                    "lat=" +
                    lat +
                    "&lon=" +
                    lon +
                    "&units=imperial&appid=" +
                    apiKey;

                fetch(weatherUrl)
                    .then(function (res) {
                        if (!res.ok) {
                            console.error("No results found! Try again");
                        }
                        return res.json();
                    })

                    .then(function (weatherData) {
                        console.log(weatherData);
                        if (
                            !weatherData ||
                            !weatherData.list ||
                            weatherData.list.length === 0
                        ) {
                        }

                        var forecastData = weatherData.list;
                        for (var i = 0, j = 1; i < forecastData.length; i += 8, j++) {
                            var forecast = forecastData[i];
                            var futureDate = dayjs(forecast.dt_txt).format("dddd");
                            var iconUrl =
                                "https://openweathermap.org/img/wn/" +
                                forecast.weather[0].icon +
                                ".png";
                            $("#city-date" + j).text(futureDate);
                            //*

                            var futureContainer = $(".future").eq(j - 1);
                            //  futureContainer.find("#city-date" + j).text(futureDate);
                            futureContainer.find(".weather-icon").attr("src", iconUrl);
                            futureContainer
                                .find(".city-temp")
                                .text(`${forecast.main.temp}°F`);
                            futureContainer
                                .find(".city-wind")
                                .text(`Wind: ${forecast.wind.speed} Mph`);
                            futureContainer
                                .find(".city-humidity")
                                .text(`Humidity: ${forecast.main.humidity}%`);
                            // */
                        }

                        var currentWeather = forecastData[0];
                        $("#cityname").text(weatherData.city.name);
                        $("#currentDay").text(new Date().toDateString());
                        $("#city-temp").text(`${currentWeather.main.temp}°C`);
                        $("#city-wind").text(`Wind: ${currentWeather.wind.speed} Km/h`);
                        $("#city-humidity").text(
                            `Humidity: ${currentWeather.main.humidity}%`
                        );
                    })
                    .catch(function (error) {
                        console.error("Error fetching weather data:", error);
                        alert("Please try again later.");
                    });
            });
    }
    function renderPastCityButtons() {
        var pastCities = JSON.parse(localStorage.getItem("city")) || [];
        pastCitiesContainer.empty();
        for (let i = 0; i < pastCities.length; i++) {
            const newCity = pastCities[i];

            var newButton = $('<button>').attr('data-city', newCity).text(newCity);
            newButton.on("click", function () {
                var city = $(this).data("city");
                getWeatherData(city);
            })
            pastCitiesContainer.append(newButton)
        }

    }
    renderPastCityButtons();
    function saveCityLocal(city) {
        var pastCities = JSON.parse(localStorage.getItem("city")) || [];
        console.log("Past cities retrieved from local storage:", pastCities);
        if (!pastCities.includes(city)) {
            pastCities.push(city);
            localStorage.setItem("city", JSON.stringify(pastCities));
            console.log("Past cities saved to local storage:", pastCities);


        }
        // Save the city name in local storage .

    }

});

// this is the data that should contain lat and lon
// use the data to make another fetch request to a different endpoint for the actuall weather data.
// follow the fetch().then() syntax above again
