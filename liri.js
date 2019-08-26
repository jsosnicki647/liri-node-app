
require("dotenv").config()
var moment = require("moment")
var axios = require("axios")
var keys = require("./keys.js")
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify)
var arg = process.argv
var func = arg[2]

// function Spotify(id, secret){
//     this.id = id
//     this.secret = secret
// }

if(func == "concert-this"){
    concertThis()
}
else if(func == "spotify-this-song"){
    spotifyThis()
}

function spotifyThis(){
    var song = ""

    for(n=3; n<arg.length; n++){
        if(n == 3){
            song = song + arg[3]
        }
        else{
            song = song + " " + arg[n]
        }
    }

    spotify.search({type: "track", query: song})
    .then(function(response){
        if(response.tracks.items.length == 0){
            console.log("---------------")
            console.log("Ace of Base")
            console.log("The sign")
            console.log("https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=7373e40052d6425eac5ae5d83381a438")
            console.log("The Sign (US Album) [Remastered]")
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
                    console.log(artist)
                    console.log(name)
                    console.log(previewURL)
                    console.log(album)
                    console.log("---------------")
                }
            }
        }
    })
}

function concertThis(){
    var artist = ""

    for(i=3; i<arg.length; i++){
        artist = artist + arg[i]
    }

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
                console.log("\nDate: " + venueArr[k].date)
                console.log("Venue: " + venueArr[k].name)
                console.log("Location: " + venueArr[k].location)
                console.log("---------------")
            }
        })
}