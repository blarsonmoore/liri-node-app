var dotenv = require("dotenv").config();
var inquirer = require("inquirer");
var request = require("request");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs-extra");
var omdb = require("omdb");

var keys = require("./keys");

var spot = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

console.log("See attached ReadMe File for instructions.");
console.log("=====================");
console.log("");

switch (command) {
  case "my-tweets":
    tweet();
    break;

  case "spotify-this-song":
    song();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    says();
    break;
}

// Twitter Function

function tweet(params) {
  var params = {
    screen_name: "Liri Javascript",
    count: 20
  };
  client.get("statuses/user_timeline", params, function(err, tweets, response) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("My Most Recent Tweets");
      console.log("======================");

      for (var i = 0; i < tweets.length; i++) {
        console.log("Tweet: " + tweets[i].text);
        console.log("Created:  " + tweets[i].created_at);
      }
    }
  });
}

// Spotify Function

function song(query) {
  if (!query) {
    query = "the sign ace of base";
  }
  params = query;
  spot.search({ type: "track", query: params }, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    for (var i = 0; i < 1; i++) {
      var songInfo = data.tracks.items;
      if (songInfo[i] != undefined) {
        console.log("Artist: " + songInfo[i].artists[0].name);
        console.log("Song: " + songInfo[i].name);
        console.log("Album the song is from: " + songInfo[i].album.name);
        console.log("Preview Url: " + songInfo[i].preview_url);
      }
    }
  });
}

// OMDB Function

function movie(query) {
  if (!query) {
    query = "Mr. Nobody";
  }
  request(
    "https://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=a59e0e91",
    function(err, data, body) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log(
        "Rotton Tomotos Ratind: " + JSON.parse(body).Ratings[1].Value
      );
      console.log("Filmed In: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  );
}

// Do what is says function

function says() {
  fs.readFile("random.txt", "utf-8", function(err, data) {
    if (err) {
      console.log(err);
      return;
    } else if (data.indexOf(",") !== -1) {
      var dataArr = data.split(",");
      command = dataArr[0];
      query = dataArr[1];
      console.log(data);
    } else {
      command = data;
    }
    if (command === "my-tweets") {
      tweet();
    } else if (command === "spotify-this-song") {
      song(query);
    } else if (command === "movie-this") {
      movie(query);
    } else {
      console.log("Command not working as designed. Please try again.");
    }
  });
}
