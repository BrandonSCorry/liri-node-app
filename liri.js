require("dotenv").config();


var request = require('request');
var moment = require('moment');
var fs = require('fs');

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var getInputAPI = process.argv[2];

var getInputSearch = process.argv[3];

var isInputSearch = getInputSearch === undefined;


var movieDef = "Mr. Nobody,";

var songDef = "The Sign";

var bandDef = "Electric Wizard";




//main function to run user input
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

//concert-this case
function getConcert(artist) {

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  request(queryUrl, function(err, res, body) {


    if (!err && res.statusCode === 200) {

      // console.log(JSON.parse(body));



        var artistData = JSON.parse(body);

      for (var i=0; artistData.length > i; i++) {

        if (i < 4) {

          console.log("\nVenue Name: " + artistData[i].venue.name);
          console.log("=============");

          console.log("\nVenue Location: " + artistData[i].venue.city + ", " + artistData[i].venue.region);
          console.log("=============");

          console.log("\nEvent Date: " + moment(artistData[i].datetime).format('MM/DD/YYYY'));
          console.log("=============");
          console.log("\n");
        }
        else {break;}
      }
    }else{
      console.log(err);
    }
  });
}

//spotify-this-song case
function getSpotify(inputSong) {



  spotify.search({ type: 'track', query: inputSong, limit: 5}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  var songData = data.tracks.items;
  for(i=0; i<songData.length; i++){

    if (i < 4) {
      j = i + 1;
      console.log("\nResult " + j);
      console.log("\nArtist Name");
      console.log("=============");
      console.log(songData[i].artists[0].name + "\n");

      console.log("Song Name");
      console.log("=============");
      console.log(songData[i].name + "\n");

      console.log("Preview URL");
      console.log("=============");

      console.log(songData[i].preview_url + "\n");

      console.log("Album");
      console.log("=============");
      console.log(songData[i].album.name + "\n");
    }
    else{
      break;
    }
  }
  });
}
//movie-this case

function getMovie(inputMovie) {

  var inputMovie = inputMovie.replace(/\s/g, '-');

  var queryUrl = "http://www.omdbapi.com/?t=" + inputMovie + "&y=&plot=short&apikey=trilogy";


  request(queryUrl, function(err, res, body) {



      if (!err && res.statusCode === 200) {

      //console.log(JSON.parse(body));

        var movieData = JSON.parse(body);



        console.log("Title: " + movieData.Title);
        console.log("=============");

        console.log("Year: " + movieData.Year);
        console.log("=============");

        console.log("IMDB: " + movieData.imdbRating);
        console.log("=============");

        console.log("Rotten Tomatoes: " + movieData.Ratings[1].Value);
        console.log("=============");

        console.log("Country: " + movieData.Country);
        console.log("=============");

        console.log("Language: " + movieData.Language);
        console.log("=============");

        console.log("Plot: " + movieData.Plot);
        console.log("=============");

        console.log("Actors: " + movieData.Actors);

    }else{
      console.log(err);
    }

  });

}

//do-what-it-says case
function justDoIt() {
  fs.readFile('random.txt', 'utf8', function(err, data){
    if (err){
      return console.log(err);
    } else {


      var justDoItArr = data.split(',');

      resInput(justDoItArr[0], justDoItArr[1]);
    }
  });
}

//exec function with input process.argv's
resInput(getInputAPI, getInputSearch);