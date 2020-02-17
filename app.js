const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const jsonapi = require('jsonapi-parse');
const Kitsu = require('kitsu');
const token = process.env.TOKEN || 5;
const PORT = process.env.PORT || 5000
const OMDBAPI = process.env.OMDBAPI || 5;
const htmlToText = require('html-to-text');
const bot = new TelegramBot(token, {
  polling: true
});
const kitsu = new Kitsu();


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

bot.onText(/\/start/, function(msg, match) {
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello! this is a fun bot that is currently being developed by @Merycc...");
})

bot.onText(/\/help/, function(msg, match) {
  var chatId = msg.chat.id;
  var message;
  message = "Currently available commands\necho: Echoes the message you sent back.\nmovie: Searches for a movie by title. Search in the following format to specifcy year\n\"Rush (1991)\"";
  bot.sendMessage(chatId, message);
});

bot.onText(/\/settings/, function(msg, match) {
  var chatId = msg.chat.id;
  var message;
  message = "No settings available at this point in time";
  bot.sendMessage(chatId, message);
});

bot.onText(/\/echo(.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var echo = match[1];
  bot.sendMessage(chatId, echo);
});

bot.onText(/\/god/, function(msg, match) {
  var chatId = msg.chat.id;
  var echo = "يا إلهي";
  bot.sendMessage(chatId, echo);
});

bot.onText(/\/movie (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var movie = match[1];
  var byYear = match[1].search(/\(\d{4}\)/);
  var fullRequest = movie;
  if (byYear != -1) {
    var year = movie.substring(byYear + 1, byYear + 5);
    movie = movie.substring(0, byYear);
    fullRequest = movie + `&y=${year}`;
  }
  request(`http://www.omdbapi.com/?apikey=${OMDBAPI}&t=${fullRequest}`, function(error, response, body) {
    var deets = JSON.parse(body);
    if (deets.Response === "True" && response.statusCode == 200) {
      bot.sendMessage(chatId, "_Looking for _" + movie + "...", {
          parse_mode: 'Markdown'
        })
        .then(function(msg) {
          bot.sendPhoto(chatId, deets.Poster, {
            caption: "Title: " + deets.Title + "\n\nYear: " + deets.Year + "\n\nGenre: " + deets.Genre + "\n\nPlot: " + deets.Plot + "\n\nIMDB URL: " +
              `https://www.imdb.com/title/${deets.imdbID}`
          });
        })


    } else {
      bot.sendMessage(chatId, "ERROR: Movie not found.");
    }
  });

});

bot.onText(/\/anime (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var anime = match[1];
  var url = `anime?filter[text]=${anime}&page[limit]=5&page[offset]=0`;
  kitsu.get(url)
    .then(deets => {
      var data = deets.data[0];
      bot.sendPhoto(chatId, data.posterImage.medium, {
        caption: "Title: " + data.canonicalTitle + "\n\nDate of Airing: " + data.startDate + "\n\nEpisode count: " + data.episodeCount +
          `\n\nKitsu URL: https://kitsu.io/anime/${data.id}`
      });
    })
    .catch(err => {
      bot.sendMessage(chatId, "ERROR: anime not found.");
    })
});


bot.onText(/دبب/,function (msg, match){
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, "دبب");
});
