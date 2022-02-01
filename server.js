require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const urlparser=require('url')
const dns=require('dns')
app.use(express.json())
// Basic Configuration
// bodyparser
const bodyparser=require('body-parser')
//connecting database
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect(process.env.db,{
useNewUrlParser: true, useUnifiedTopology: true})
//making schema
const schema=mongoose.Schema({
  url:String
})
const Url=mongoose.model('Url',schema)

//port
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
  
});
//using bodyparser
app.use(bodyParser.urlencoded({extended:true}))


// Your first API endpoint

app.post('/api/shorturl',(req,res)=>{

  const bodyurl=req.body.url
  console.log(bodyurl)
  const something =dns.lookup(urlparser.parse(bodyurl).hostname,
  (err,address)=>{
    if (!address) {
      res.json({error:'Invalid URL'})
    }
    else{
      const url=new Url({url:bodyurl})
      url.save((err,data)=>{
        res.json({
          original_url:data.url,
          short_url:data.id
        })
      })
    }
  })
  
})
app.get('/api/shorturl/:id', function(req, res) {
  const id=req.params.id
  Url.findById(id,(err,data)=>{
    if (!data) {
      res.json({error:'Invalid URL'})
    }
    else{
      res.redirect(data.url)
    }
  })
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
