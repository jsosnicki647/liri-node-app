
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



for(var i=3; i<arg.length; i++){
    if(i == 3){
        params = arg[3]
    }
    else{
        params = params + " " + arg[i]
    }
}

switch(func){
    case "concert-this":
        concertThis(params)
        break
    case "movie-this":
        movieThis(params)
        break
    case "spotify-this-song":
        spotifyThis(params)
        break
    case "do-what-it-says":
        doWhatItSays()
        break
    default:
        console.log("Invalid command.")
        console.log("valid commands:")
        console.log("concert-this")
        console.log("movie-this")
        console.log("spotify-this-song")
        console.log("do-what-it-says")
}

function writeToLog(data){
    fs.appendFile('log.txt', data, (err) => {
        if (err) throw err
    })
}


function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        
        if(dataArr[0] == "concert-this"){
            concertThis(dataArr[1])
        }
        else if(dataArr[0] == "spotify-this-song"){
            spotifyThis(dataArr[1])
        }
        else if(dataArr[0] == "movie-this"){
            movieThis(dataArr[1])
        }
    })
}


function movieThis(movie){
    if(arg.length == 2){
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

            for(var i=0; i<response.data.Ratings.length; i++){
                if(response.data.Ratings[i].Source == "Rotten Tomatoes"){
                    var rtRating = response.data.Ratings[i].Value
                }
                else if(i == response.data.Ratings.length){
                    var rtRating = "N/A"
                }
            }

            var output = {
                top: "---------------",
                title: "Title: " + title,
                year: "Year: " + year,
                imdb: "IMDB Rating: " + imdbRating,
                rt: "Rotten Tomatoes Rating: " + rtRating,
                country: "Country: " + country,
                lang: "Language: " + lang,
                plot: "Plot: " + plot,
                actors: "Actors: " + actors,
                bottom:"---------------",
            }

            writeToLog("\n\n" + getCurrentTime() + "; movie-this: " + movie) 
            iterateOutput(output)
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
            for(var i=0; i<response.tracks.items.length; i++){
                for(var q=0; q< response.tracks.items[i].album.artists.length; q++){
                    var artist = response.tracks.items[i].album.artists[q].name
                    var name = response.tracks.items[i].name
                    var album = response.tracks.items[i].album.name
                    var previewURL = response.tracks.items[i].preview_url

                    var output = {
                        top: "---------------",
                        artist: "Artist: " + artist,
                        songTitle: "Song Title: " + name,
                        preview: "Preview: " + previewURL,
                        album: "Album: " + album,
                        bottom:"---------------",
                    }
                    
                    writeToLog("\n\n" + getCurrentTime() + "; spotify-this-song: " + song) 
                    iterateOutput(output)
                }
            }
        }
    })
}

function getCurrentTime(){
    var today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    return (date + " @ " + time)
}

function iterateOutput(output){
    var values = Object.values(output)
    for(var i=0; i<values.length; i++){
        console.log(values[i])
        if(i != 0 && i != values.length-1){
            writeToLog("\n" + values[i])
        }
    }
}



function concertThis(artist){
    var artist = artist.split(" ").join("")
    console.log(artist)
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(
        function(response) {
            var venueArr = []
            var loc, name, ven
            for(var i=0; i<response.data.length; i++){
                var venObj ={}
                var m = moment(response.data[i].datetime).format("L")
                ven = response.data[i].venue
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

            for(var i=0; i<venueArr.length; i++){
                console.log("---------------")
                console.log("Date: " + venueArr[i].date)
                console.log("Venue: " + venueArr[i].name)
                console.log("Location: " + venueArr[i].location)
                console.log("---------------")
            }
        })
}


