require("dotenv").config();

var keys = require("./keys.js");


var request = require('request');
var fs = require('fs');
var moment = require('moment');
var Spotify = require('node-spotify-html');
var getInputAPI = process.argv[2];

var getInputSearch = process.argv[3];

var isInputSearch = getInputSearch === undefined;


var movieDef = "Mr. Nobody,";

var songDef = "The Sign";

var bandDef = "Electric Wizard";

var spotify = new Spotify(keys.spotify);



function resInput (userInput, getInputSearch) {

  switch (userInput) {

    case 'concert-this':
      // isInputSearch ? getInputSearch = songDef : concert();
      if (getInputSearch === undefined) {
        getInputSearch = bandDef;
      }
      getConcert(getInputSearch);
      break;

    case 'spotify-this-song':
      //if input undefined use default song
      if (getInputSearch === undefined) {
        getInputSearch = songDef;
      }
      getSpotify(getInputSearch);
      break;

    case 'movie-this':
      //if input undefined use default movie
      if (getInputSearch === undefined) {
        getInputSearch = movieDef;
      }
      getMovie(getInputSearch);
      break;

    case 'do-what-it-says':
      justDoIt();
      break;
    default:
      console.log("========================================\nYour command is unrecognized, human.\nPlease type one of the following options\n*concert-this 'band name'\n*spotify-this-song 'song name'\n or *movie-this 'movie name'\n========================================\n");
  }
}

function getConcert(artist) {

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  request(queryUrl, function(err, res, body) {


    if (!err && res.statusCode === 200) {

      console.log(JSON.parse(body));



        var artistData = JSON.parse(body);

        console.log("Venue Name:");
        console.log(artistData.venue.name);


        for(i=0, j = artistData.venue.length; i<j; i++){

          console.log("Venue Name:");
          console.log(artistData.venue[i].name);

          console.log("Venue Location:");
          console.log(artistData.venue[i].city + ", " + artistData.venue[i].region);

          console.log("Event Date:");
          console.log(artistData.datetime);


        }


    }else{

      console.log(err);
    }

  });

}
function getSpotify(inputSong) {



  spotify.search({ type: 'track', query: inputSong, limit: 10}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(data);
  });

  var songData = data.tracks.items[0];

  console.log("Artist Names:");
  for(i=0; i<songData.artists.length; i++){
    console.log(songData.artists[i].name);
  }

  console.log("Song Name:");
  console.log(songData.name);

  console.log("Preview URL:");
  console.log(songData.preview_url);

  console.log("Album:");
  console.log(songData.album.name);

  //show artist name
  //song name
  //preview of song link
  //album song is from

}

function getMovie(inputMovie) {

  var queryUrl = "http://www.omdbapi.com/?t=" + inputMovie + "&y=&plot=short&apikey=trilogy";


  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {

      //console.log(JSON.parse(body));

    }else{
      console.log(error);
    }

  });

}

function justDoIt() {

}


resInput(getInputAPI, getInputSearch);