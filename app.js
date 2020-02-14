
const TelegramBot = require("node-telegram-bot-api");
const token = "807981736:AAFC0uLt9T6BHH1GiaLjOVqx3d2nQ30bt7A";
const bot = new TelegramBot(token, { polling: true });
const request = require("request");

bot.onText(/\/start/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! this is a fun bot that is currently being developed by @Merycc...");
})

bot.onText(/\/help/, function (msg, match) {
    var chatId = msg.chat.id;
    var message;
    message = "Currently available commands\necho: Echoes the message you sent back.\nmovie: Searches for a movie by title. Search in the following format to specifcy year\n\"Rush (1991)\"";
    bot.sendMessage(chatId, message);
});

bot.onText(/\/settings/, function (msg, match) {
    var chatId = msg.chat.id;
    var message;
    message = "No settings available at this point in time";
    bot.sendMessage(chatId, message);
});

bot.onText(/\/echo(.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId, echo);
});

bot.onText(/\/god/, function (msg, match) {
    var chatId = msg.chat.id;
    var echo = "يا إلهي";
    bot.sendMessage(chatId, echo);
});

bot.onText(/\/movie (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var movie = match[1];
    var byYear = match[1].search(/\(\d{4}\)/);
    var fullRequest = movie;
    if (byYear != -1) {
        var year = movie.substring(byYear + 1, byYear + 5);
        movie = movie.substring(0, byYear);
        fullRequest = movie + `&y=${year}`;
    }
    request(`http://www.omdbapi.com/?apikey=ec8294aa&t=${fullRequest}`, function (error, response, body) {
        var deets = JSON.parse(body);
        if (deets.Response === "True" && response.statusCode == 200) {
            bot.sendMessage(chatId, "_Looking for _" + movie + "...", { parse_mode: 'Markdown' })
                .then(function (msg) {
                    bot.sendPhoto(chatId, deets.Poster, {
                        caption: "Title: " + deets.Title + "\nYear: " + deets.Year + "\nGenre: " + deets.Genre + "\nPlot: " + deets.Plot + "\nIMDB URL: "
                            + `https://www.imdb.com/title/${deets.imdbID}`});
                })


        } else {
            bot.sendMessage(chatId, "ERROR: Movie not found.");
        }
    });

});
