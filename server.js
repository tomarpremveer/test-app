let express = require("express")
let mongodb=require('mongodb')

let db
let connectionString="mongodb+srv://todoapp:8268@cluster0-ygbdi.mongodb.net/todoapp?retryWrites=true&w=majority"
mongodb.connect(connectionString,{useUnifiedTopology:true},function(err,client){
  db=client.db()
  ourApp.listen(3000)
})
let sanitizeHTML=require('sanitize-html')
let ourApp=express()
ourApp.use(express.static("public"))
ourApp.use(express.urlencoded({extended:false}))
ourApp.use(express.json())
ourApp.use(passwordProtected)
function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic realm="Simple ToDo App"')
  if (req.headers.authorization=="Basic bW9udHk6aGZnYmhkYmdmZg=="){
    next()
  }
  else{
    res.status(401).send("Authenciation required")
  }
}
ourApp.get("/",function(req,res){
  db.collection('items').find().toArray(function(err,items){
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>

    <div class="jumbotron p-3 shadow-sm">
      <form  id="create-form" action="/create-item" method="Post">
        <div class="d-flex align-items-center">
          <input name="item" id="create-field" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>

    <ul id="item-list" class="list-group pb-5">
    </ul>

  </div>
  <script>
  let items=${JSON.stringify(items)}</script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/browser.js"></script>
</body>
</html>`)
})
})
ourApp.post('/create-item',function(req,res){
  let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:[]})
  db.collection('items').insertOne({text: safeText},function(err,info){
  res.json(info.ops[0])
  })
})

ourApp.post('/update-item',function(req,res){
  let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:[]})
  db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:sa
  }},function(){
    res.send("Success")
  })
})

ourApp.post('/delete-item',function(req,res){
  db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
res.send("Delete succes")
  })
})
