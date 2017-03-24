// to include
var express = require('express')
var https = require('https')
var request = require('request')
var port = Number(process.env.PORT || 8080)
var app = express()
var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({
extended:true
}))
app.use(bodyparser.json())
     var cart = []
     var json = JSON.stringify(
     {
          "elements":
  [
   
    {
    "img_url": "https://s-media-cache-ak0.pinimg.com/originals/33/d1/4c/33d14cb737e5b4658e6914621625f545.jpg",
      "title": "Burger and Fries",
      "price":
        {
          "small": "100",
          "regular": "150",
          "large": " 200"
         }
    },
    
       {
    "img_url":"https://img.clipartfox.com/7865a54005ecf2a13f26251af9a1a1ca_chinese-food-clipart-image-chinese-food-clipart-noodles_1600-941.jpeg",
      "title":"Chinese Noodles",
      "price":
        {
          "small": "150",
          "regular": " 200",
          "large": " 250"
         }
    },
    
       {
    "img_url":"http://fml-pr.co.uk/assets/uploads/Turkey%20with%20Soba%20Noodles1.png",
      "title":"Mixed Salad",
      "price":
        {
          "small": " 175",
          "regular": " 250",
          "large": " 300"
         }
    },
    
       {
    "img_url":"http://a1.ro/uploads/modules/news/0/2016/7/20/507491/14690185242e12c66f.jpg",
      "title":"Pizza",
      "price":
        {
          "small": " 200",
          "regular": " 275",
          "large": " 350"
         }
    },
    
       {
    "img_url": "https://media.timeout.com/images/102186171/image.jpg",
      "title":"Waffle Ice cream",
      "price":
        {
          "small": " 153",
          "regular": " 274",
          "large": " 352"
         }
    }
   ]
     }
)
json = JSON.parse(json)
//start
app.post('/webhook', function(request, response)
{
  console.log("Entry into app.post successful......")
  audio_query = request.body.result
  console.log(audio_query)
  if(request.body.result.action=="weather")
  {
  sendWeather(request,response);
  }
  else if(request.body.result.action=="books")
  {
  sendBooks(request,response);
  }
  else if(request.body.result.action=="words")
    {
  sendWords(request,response);
  }
  else if(request.body.result.action=="audio")
    {
      console.log("AUDIOOOOOO")
  sendAudio(request,response);
  }
   else if(request.body.result.action=="video")
    {
  sendVideo(request,response);
  }
   else if(request.body.result.action=="news")
    {
  
        sendNews(request,response);
  }
  else if(request.body.result.action=="receipt")
    {
  sendReceipt(cart, request,response);
  }
}

) //app.post
function sendReceipt(cart, request,response)
{
  var r_query 

r_query = request.body.result.resolvedQuery

 r_query = r_query.replace("#receipt ","")
 
// if(cart[r_query]==null)
// {
// cart[r_query][0] = 1
// cart[r_query][1] = r_query
// }
//   else
//  cart[r_query][0]+=1
  
  sendConfirmationMessage(request, response)
     
  sendReceiptMessage(r_query, json, request, response)
}
function sendConfirmationMessage(request, response)
{

}
function sendReceiptMessage(r_query, json, request, response)
{
  var inko = []
  console.log(json)
     console.log(json.elements[0].title)
      n = parseInt(r_query)
     i= parseInt(n/10)-1
     
          quant = "regular"
          if(n%10==1)
          quant = "small"
          if(n%10 == 3)
          quant = "large"
     console.log(r_query+"    "+ i+"    "+quant)
       inko.push(
            {
            "title":json.elements[i].title,
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":2,
            "price":parseInt(json.elements[i].price[quant]),
            "currency":"INR",
            "image_url":json.elements[i].img_url
          }
  )

       console.log(inko)
response.writeHead(200, {"Content-Type":"application/json"})
  var json = JSON.stringify({
   data:{
   
  "facebook": {
   "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":"Stephane Crozatier",
        "order_number":"12345678902",
        "currency":"USD",
        "payment_method":"Visa 2345",        
        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
        "timestamp":"1428444852", 
        "elements": inko,
//            [
//           {
//             "title":"Classic White T-Shirt",
//             "subtitle":"100% Soft and Luxurious Cotton",
//             "quantity":2,
//             "price":50,
//             "currency":"USD",
//             "image_url":"https://s-media-cache-ak0.pinimg.com/originals/33/d1/4c/33d14cb737e5b4658e6914621625f545.jpg"
//           }
//           {
//             "title":"Classic Gray T-Shirt",
//             "subtitle":"100% Soft and Luxurious Cotton",
//             "quantity":1,
//             "price":25,
//             "currency":"USD",
//             "image_url":"https://img.clipartfox.com/7865a54005ecf2a13f26251af9a1a1ca_chinese-food-clipart-image-chinese-food-clipart-noodles_1600-941.jpeg"
//           }
//         ]
        "address":{
          "street_1":"1 Hacker Way",
          "street_2":"",
          "city":"Menlo Park",
          "postal_code":"94025",
          "state":"CA",
          "country":"US"
        },
        "summary":{
          "subtotal":75.00,
          "shipping_cost":4.95,
          "total_tax":6.19,
          "total_cost":56.14
        },
        "adjustments":[
          {
            "name":"New Customer Discount",
            "amount":20
          },
          {
            "name":"$10 Off Coupon",
            "amount":10
          }
        ]//ads
      }
    }
  }
   },//data
    source : "text"
  })//json

  response.end(json)
}

function sendNews(req, response)
{
  news_query = req.body.result.resolvedQuery

 news_query = news_query.replace("#news","")
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+news_query)
  if(news_query=="")
  {
  sendNewsQuickReplies(req, response)
  }
  else
  {
    var source = "bbc-news"
    if(news_query==" general")
      source = "the-hindu"
    
    if(news_query==" business")
      source = "business-insider"
    
        if(news_query==" sport")
      source = "espn"
    
        if(news_query==" technology")
      source = "techcrunch"
    
       if(news_query==" entertainment")
      source = "mashable" 
  request({
    url:"https://newsapi.org/v1/articles?source="+source+"&sortBy=top&apiKey=c0f1536a991945e8b0b19908517d7c72",
    json:true
  }, function(error, res, body)
          {
           if(!error)
           {
    if(body!= null)
    {
    sendNewsMessage(body, req, response)
    }
           }//error
           else
           console.log(error)
  }
         )
  }
}

function sendNewsQuickReplies(request, response)
{
  response.writeHead(200, {"Content-Type":"application/json"})
 var json = JSON.stringify({
    data:{
//          "speech":"hi ",
//          "displayText":"there is good news",
  "facebook": {
    "text":"Select a category",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"General",
        "payload":"#news general"
      },
        {
        "content_type":"text",
        "title":"Business",
        "payload":"#news business"
      },
       {
        "content_type":"text",
        "title":"Sport",
        "payload":"#news sport"
      },
              {
        "content_type":"text",
        "title":"Technology",
        "payload":"#news technology"
      },
              {
        "content_type":"text",
        "title":"Entertainment",
        "payload":"#news entertainment"
      }
      
    ]
  }
},
    source : "text"
  })
  response.end(json)
}
function sendNewsMessage(body, request, response)
{
//var img="http://www.omgubuntu.co.uk/wp-content/uploads/2013/12/Flat-Weather-Icon-Set.png"
 console.log("NEWS MODULE ")
response.writeHead(200, {"Content-Type":"application/json"})
  var inko = []
  console.log(body)
  var i=0;
    body.articles.forEach ( function(ink) {
      if(i<10)
      {
  inko.push({
            "title":ink.title,
            "image_url":ink.urlToImage,
             "subtitle":ink.description,
           "default_action": {
              "type": "web_url",
              "url":ink.url,
               }
  })
      i++
    }
  }
  )
  
  var json = JSON.stringify({
   data:{
   "facebook": {
    "attachment": {
      "type": "template",
      "payload": {
      "template_type":"generic",
        "elements":inko
      }
      }
    }
   },//data
    source : "text"
  })//json
  console.log(json)
  console.log(inko)
  response.end(json)
}

function sendAudio(request, response)
{
  audio_query = request.body.result.resolvedQuery
  console.log(audio_query)
 audio_query = audio_query.replace("#audio ","")
  response.writeHead(200, {"Content-Type":"application/json"})
  var json = JSON.stringify({
   data:{
   "facebook": {
    "attachment": {
      "type": "audio",
      "payload": {
      "url":audio_query
      }//payload
      }//attachment
    }//facebook
   },//data
    source : "text"
  })//json
  response.end(json)
  }

function sendVideo(req, response)
{
video_query = req.body.result.resolvedQuery
  if(video_query.includes("#video "))
  {
  video_query = video_query.replace("#video ","")
  }
  console.log(video_query)
  request({
    url:"https://www.googleapis.com/youtube/v3/search?key=AIzaSyCsojMsfWiHhc4RwlXmfGBbNy747m5oAk9&part=snippet&q="+video_query,
    json:true
  }, function(error, res, body)
          {
           if(!error)
           {
    if(body!= null)
    {
    sendVideoMessage(body, req, response)
    }
           }//error
           else
           console.log(error)
  }
         )
}

function sendVideoMessage(body, req, response)
{
//var img="http://www.omgubuntu.co.uk/wp-content/uploads/2013/12/Flat-Weather-Icon-Set.png"
 console.log("VIDEO MODULE ")
response.writeHead(200, {"Content-Type":"application/json"})
  var inko = []
  console.log(body)
  var i=0;
    body.items.forEach ( function(ink) {
      if(i<8)
      {
        if(ink.id.kind == "youtube#channel")
          id = "channel/"+ink.id.channelId
        else
          id = "watch?v="+ink.id.videoId
  //console.log(ink.items.title+" "+ ink.volumeInfo.authors)
  inko.push({
            "title":ink.snippet.title,
            "image_url":ink.snippet.thumbnails.high.url,
             "subtitle":ink.snippet.description,
           "default_action": {
              "type": "web_url",
              "url":"https://www.youtube.com/"+id,
               }
  })
      i++
    }
  }
  )
  var json = JSON.stringify({
   data:{
   "facebook": {
    "attachment": {
      "type": "template",
      "payload": {
      "template_type":"generic",
        "elements":inko
      }
      }
    }
   },//data
    source : "text"
  })//json
  console.log(json)

  console.log(inko)
  response.end(json)
}


function sendMessage(text, response)
{
response.writeHead(200, {"Content-Type":"application/json"})
  var json = JSON.stringify({
    speech:text,
    source : "text"
  })
  response.end(json)
}

function sendGenericMessage(body,response,weather)
{
 var img="ENTRY INTO GENERIC MESSAGE SUCCESSFUL..."
 console.log(img)
response.writeHead(200, {"Content-Type":"application/json"})
  var json = JSON.stringify({
   data:{
   "facebook": {
    "attachment": {
      "type": "template",
      "payload": {
      "template_type":"generic",
        "elements":[
           {
            "title":"Weather in "+body.name,
            "image_url":"http://www.omgubuntu.co.uk/wp-content/uploads/2013/12/Flat-Weather-Icon-Set.png",
            "subtitle":weather
           }//element
           ]//element
      }//payload
      }//attachment
    }//facebook
   },//data
    source : "text"
  })//json
  response.end(json)
}//function

function sendWeather(req, response)
{
  console.log("WEATHER OCCHINDHI")
city= req.body.result.parameters["geo-city"]
  request({
    url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=93e0f7faf62f96d54eb1d5caa28ed417",
    json:true
  }, function(error, res, body)
          {console.log(city)
           if(!error)
           {
    if(body!= null)
    {console.log("Into body")
    if(body.weather !=null)
    {console.log("Into body.weather")
    if(body.weather[0].description!=null)
    {console.log("into desc too")
    var weather= "Today, in " +body.name+ " the weather is " +body.weather[0].description+ " and the temperature is " +body.main.temp
    sendGenericMessage(body, response, weather)
    }
    }
    }
           }//error
           else
           console.log(error)
  }
         )
}

function sendBooks(req, response)
{
  console.log("Book OCCHINDHI")
book_query = req.body.result.resolvedQuery
  if(book_query.includes("#books "))
  {
  book_query = book_query.replace("#books ","")
  }
  else if(book_query.includes("Tell me about the book named"))
  {
  book_query = book_query.replace("Tell me about the book named","")
  }



  request({
    url:"https://www.googleapis.com/books/v1/volumes?q="+book_query,
    json:true
  }, function(error, res, body)
          {
           if(!error)
           {
    if(body!= null)
    {
    sendListMessage(body, req, response)
    }
           }//error
           else
           console.log(error)
  }
         )
}
//lasigd9efg
function sendWords(req, response)
{
  console.log("ENTERED INTO WORDS MODULE.....")
word_query = req.body.result.resolvedQuery
  if(word_query.includes("#words "))
  {
  word_query = word_query.replace("#words ","")
  }
  else if(word_query.includes("#word "))
  {
  word_query = word_query.replace("#word ","")
  }



  request({
    headers: {
  "app_id": "c8d9fc8b",
  "app_key": "4362b8401628e2f5e9cc9740610711d1"
    },
    uri: 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/'+word_query,
    //body: formData,
    //method: 'POST'
  }, function (err, res, body) {
    console.log(JSON.parse(res.body).results[0].lexicalEntries);
    var wdata = JSON.parse(res.body);
    var word_description = "Word: "+wdata.results[0].id+" "+"( "+wdata.results[0].lexicalEntries[0].lexicalCategory+" )\r\n"
                            +wdata.results[0].lexicalEntries[0].pronunciations[0].phoneticSpelling+"\r\n"+
                             "Meaning: "+wdata.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]+"\r\n"+
                             "Example: " +wdata.results[0].lexicalEntries[0].entries[0].senses[0].examples[0].text
                             console.log(word_description)
    link = wdata.results[0].lexicalEntries[0].pronunciations[0].audioFile;
                            // sendMessage(word_description, response)
                             sendQuick(word_description, response, link)

  });
}

function sendQuick(text, response, link)
{
  response.writeHead(200, {"Content-Type":"application/json"})
 var json = JSON.stringify({
    data:{
  "facebook": {
    "text":text,
    "quick_replies":[
      {
        "content_type":"text",
        "title":"audio",
        "payload":"#audio "+  link
      }
    ]
  }
},
    source : "text"
  })
 console.log(link)
  response.end(json)
}


function sendListMessage(body, req, response)
{
//var img="http://www.omgubuntu.co.uk/wp-content/uploads/2013/12/Flat-Weather-Icon-Set.png"
 console.log("Entry into list message succesfull...")
response.writeHead(200, {"Content-Type":"application/json"})
  var inko = [{
            "title":"Books",
            "image_url":"https://ploum.net/images/livres.jpg",
            "subtitle":"We have them for you"
           }]
  console.log(inko)
  var i=0;
    body.items.forEach ( function(ink) {

    if(ink.volumeInfo.authors!= null && i< 8 )
    {
  console.log(ink.volumeInfo.title+" "+ ink.volumeInfo.authors)
  inko.push({
            "title":ink.volumeInfo.title,
            "image_url":ink.volumeInfo.imageLinks.thumbnail,
             "subtitle":"author: " + ink.volumeInfo.authors+ ", Category: "  + ink.volumeInfo.categories +", Rating: " + ink.volumeInfo.averageRating,
           "default_action": {
              "type": "web_url",
              "url": ink.volumeInfo.infoLink,
               }
  })
   }
    i++
  }
  )
  var json = JSON.stringify({
   data:{
   "facebook": {
    "attachment": {
      "type": "template",
      "payload": {
      "template_type":"generic",
        "elements":inko
      }
      }
    }
   },//data
    source : "text"
  })//json
  console.log(json)

  console.log(inko)
  response.end(json)
}

app.listen(port)
