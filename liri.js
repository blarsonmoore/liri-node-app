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

//

// var songName = process.argv.slice(2);
// songName.sort((a, b) => a > b);
// for (value of songName) {
//   console.log(value);
// }

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

function tweet(params) {
  var params = {
    screen_name: "Liri Javascript",
    count: 20
  };
  client.get("statuses/user_timeline", params, function(err, tweets, response) {
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

// function song() {
//   spot.search({ type: "track", query: "'" + songName + "'" }, function(
//     err,
//     data
//   ) {
//     if (err) {
//       return console.log("Error occurred: " + err);
//     }
//     console.log(songName);
//     // console.log(JSON.stringify(data, null, 2));
//     console.log(JSON.stringify(data.tracks.items[0].artists, null, 2));
//   });
// }

function song(songName) {
  var songName = process.argv[3];
  if (!songName) {
    songName = "The Sign";
  }
  params = songName;
  spot.search({ type: "track", query: params }, function(err, data) {
    if (!err) {
      var songInfo = data.tracks.items;
      for (var i = 0; i < 5; i++) {
        if (songInfo[i] != undefined) {
          var spotifyResults =
            "Artist: " +
            songInfo[i].artists[0].name +
            "\r\n" +
            "Song: " +
            songInfo[i].name +
            "\r\n" +
            "Album the song is from: " +
            songInfo[i].album.name +
            "\r\n" +
            "Preview Url: " +
            songInfo[i].preview_url +
            "\r\n" +
            "------------------------------ " +
            i +
            " ------------------------------" +
            "\r\n";
          console.log(spotifyResults);
        }
      }
    } else {
      console.log("Error :" + err);
      return;
    }
  });
}

function movie(movieName) {
  var movieName = process.argv[3];
  if (!movieName) {
    movieName = "Mr. Nobody";
  }
  request(
    "https://www.omdbapi.com/?t=" +
      movieName +
      "&y=&plot=short&apikey=a59e0e91",
    function(err, data, body) {
      if (err) {
        return console.log("Error" + err);
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
