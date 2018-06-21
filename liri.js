var dotenv = require("dotenv").config();
var inquirer = require("inquirer");
var request = require("request");
var twitter = require("twitter");
var spot = require("spotify");

var keys = require("./keys");
var arg = process.argv;

console.log(keys.spotify);
console.log(keys.twitter);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
