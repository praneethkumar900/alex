// to include
var express = require('express')
var https = require('https')
var request = require('request')
var port = Number(process.env.PORT || 8080)
var app = express()

//start
app.post('/webhook', function(request, response)
{
  response.writeHead(200, {"Content-Type":"application.json"})
  var json = JSON.stringify({
  speech:"yolo",
    displayText: "erri"
  })
console.log("yedava")
}
) 
app.listen(port)
