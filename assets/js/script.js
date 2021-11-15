$(document).ready(function () {

    //serach
    
    $("button").on("click", function () {
        var searchEl = $("#search-value").val();
        $("#search-value").val("");
        weatherFunction(searchEl);
        weatherForecast(searchEl);
    });

    // search history 

    var history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }

    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item list-group-item-dark text-center border rounded-lg mt-3").text(text);
        $(".history").append(listItem);
    }
    
    
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });

    function weatherFunction(searchEl) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchEl + "&appid=ca64c0b6157c2aa6f2ade4e3a0caa5db&units=imperial",


        }).then(function (data) {
            if (history.indexOf(searchEl) === -1) {
                history.push(searchEl);
                localStorage.setItem("history", JSON.stringify(history));
                createRow(searchEl);
            }
            $("#today").empty();

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=18fa991e794f8f3facf1ebdc81a0ad08&lat=" + lat + "&lon=" + lon,


            }).then(function (response) {

                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));

            });

            
            title.append(img);
            cardBody.append(title, temp, wind, humid);
            card.append(cardBody);
            $("#today").append(card);
        });
    }

    function weatherForecast(searchEl) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchEl + "&appid=18fa991e794f8f3facf1ebdc81a0ad08&units=imperial",

        }).then(function (data) {
    
            $("#forecast").html("<h3 class=\"mr-3  col-md-12\">5-Day Forecast:</h3> ").append(" <div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var colFive = $("<div>").addClass("col");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var windFive = $("<p>").addClass("card-text").text("Wind : " + data.list[i].wind.speed + " MPH")
                    var tempFive = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");

                    
                    
                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, windFive, humidFive)));
                   
                    
                    $("#forecast .row").append(colFive);

                }
            }
        });
    }

});