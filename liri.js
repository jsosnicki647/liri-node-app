
require("dotenv").config()
var moment = require("moment")
var axios = require("axios")
var keys = require("./keys.js")
var Spotify = require('node-spotify-api')
var fs = require("fs")
var spotify = new Spotify(keys.spotify)
var arg = process.argv
var func = arg[2]
var params = ""

for(t=3; t<arg.length; t++){
    if(t == 3){
        params = params + arg[3]
    }
    else{
        params = params + " " + arg[t]
    }
}

if(func == "concert-this"){
    concertThis(params)
}
else if(func == "spotify-this-song"){
    spotifyThis(params)
}
else if(func == "movie-this"){
    movieThis(params)
}
else if (func == "do-what-it-says"){
    doWhatItSays()
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
        return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    if(dataArr[0] == "concert-this"){
        concertThis()
    }
    else if(dataArr[0] == "spotify-this-song"){
        spotifyThis()
    }
    else if(dataArr[0] == "movie-this"){
        movieThis()
    }

    })
}


function movieThis(movie){
    if(arg.length == 3){
        movie = "Mr. Nobody"
    }

    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie)
    .then(
        function(response) {
            var title = response.data.Title
            var year = response.data.Year
            var imdbRating = response.data.imdbRating
            var country = response.data.Country
            var lang = response.data.Language
            var plot = response.data.Plot
            var actors = response.data.Actors

            for(s=0; s<response.data.Ratings.length; s++){
                if(response.data.Ratings[s].Source == "Rotten Tomatoes"){
                    var rtRating = response.data.Ratings[s].Value
                }
                else if(s == response.data.Ratings.length){
                    var rtRating = "N/A"
                }
            }

            console.log("---------------")
            console.log("Title: " + title)
            console.log("Year: " + year)
            console.log("IMDB Rating: " + imdbRating)
            console.log("Rotten Tomatoes Rating: " + rtRating)
            console.log("Country: " + country)
            console.log("Language: " + lang)
            console.log("Plot: " + plot)
            console.log("Actors: " + actors)
            console.log("---------------")
        }
    )
}

function spotifyThis(song){

    spotify.search({type: "track", query: song})
    .then(function(response){
        if(response.tracks.items.length == 0){
            console.log("---------------")
            console.log("Artist: Ace of Base")
            console.log("Song Title: The sign")
            console.log("Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=7373e40052d6425eac5ae5d83381a438")
            console.log("Album: The Sign (US Album) [Remastered]")
            console.log("---------------")
        }
        else{
            for(p=0; p<response.tracks.items.length; p++){
                for(q=0; q< response.tracks.items[p].album.artists.length; q++){
                    var artist = response.tracks.items[p].album.artists[q].name
                    var name = response.tracks.items[p].name
                    var album = response.tracks.items[p].album.name
                    var previewURL = response.tracks.items[p].preview_url
                    console.log("---------------")
                    console.log("Artist: " + artist)
                    console.log("Song Title: " + name)
                    console.log("Preview: " + previewURL)
                    console.log("Album: " + album)
                    console.log("---------------")
                }
            }
        }
    })
}

function concertThis(artist){
    var artist = artist.split(" ").join("")

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(
        function(response) {
            var venueArr = []
            var loc, name, ven
            for(j=0; j<response.data.length; j++){
                var venObj ={}
                var m = moment(response.data[j].datetime).format("L")
                ven = response.data[j].venue
                name = ven.name
                
                if(ven.region == ""){
                    loc = ven.city + ", " + ven.country
                }
                else{
                    loc = ven.city + ", " + ven.region + ", " + ven.country
                }
                
                venObj["name"] = name
                venObj["location"] = loc
                venObj["date"] = m
                venueArr.push(venObj)
            }

            for(k=0; k<venueArr.length; k++){
                console.log("---------------")
                console.log("Date: " + venueArr[k].date)
                console.log("Venue: " + venueArr[k].name)
                console.log("Location: " + venueArr[k].location)
                console.log("---------------")
            }
        })
}