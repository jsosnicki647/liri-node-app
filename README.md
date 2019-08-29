# liri-node-app

The liri-node-app takes the following commands:
* concert-this
* movie-this
* spotify-this-song
* do-what-it-says

## concert-this

*$ node liri.js concert-this [artist name]*

output: concert-this will return the following information about upcoming tour dates for the artist:
* Date
* Venue
* Location

## movie-this

*$ node liri.js concert-this [movie title]*

output: movie-this will return the following for the movie:
* Title
* Year
* IMDB Rating
* Rotten Tomatoes Rating
* Country
* Language
* Plot
* Actors

## spotify-this-song

*$ node liri.js spotify-this-song [song title]*

output: spotify-this-song will return the following information about the song:
* Artist
* Song Title
* Preview Link
* Album

## spotify-this-song

*$ node liri.js spotify-this-song [song title]*

output: spotify-this-song will return the following information about the song:
* Artist
* Song Title
* Preview Link
* Album

## do-what-it-says

*$ node liri.js do-what-it-says*

output: do-what-it-says runs all commands listed in random.txt stored in the same directory. Run Multiple commands by saving command and input separated by a comma.

random.txt: *command, input, command, input,...*
e.g.: *movie-this, The Matrix, spotify-this-song, I Want It That Way, concert-this, Bruce Springsteen*