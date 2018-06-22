var dotenv = require("dotenv").config();
var inquirer = require("inquirer");
var request = require("request");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs-extra");

var keys = require("./keys");

var spot = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

var paramsTwitter = {
  screen_name: "Liri Javascript",
  count: 20
};

// var songName = process.argv[3];

var songName = process.argv.slice(2);
songName.sort((a, b) => a > b);
for (value of songName) {
  console.log(value);
}

var command = process.argv[2];
console.log(command);

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

function tweet() {
  client.get("statuses/user_timeline", paramsTwitter, function(
    err,
    tweets,
    response
  ) {
    if (err) {
      return console.log("Error: " + err);
    } else {
      console.log("My Recent Tweets");
      console.log("");

      for (var i = 0; i < tweets.length; i++) {
        console.log("( #" + (i + 1) + " )  " + tweets[i].text);
        console.log("Created:  " + tweets[i].created_at);
        console.log("");
      }
    }
  });
}

// Spotify Function

function song() {
  spot.search({ type: "track", query: "'" + songName + "'" }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(songName);
    // console.log(JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data.tracks.items[0].artists, null, 2));
  });
}
