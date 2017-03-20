var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();


 // DB setting
mongoose.connect("mongodb://user:111111@ds131890.mlab.com:31890/contact_book");
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR: ",err);
});

 // Other setting
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); // form에 입력한 data가 req.body에 object로 생성된다.
app.use(methodOverride("_method"));

// DB schema
var contactSchema = mongoose.Schema({   // 몽구스 스키마 함수로 스키마 오브젝트를 생성합니다.
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});
var Contact = mongoose.model("contact", contactSchema);
//아까 정의한 스키마로 모델을 생성한다. 몽고 디비와 프로그램을 연결해줌. 첫번째 파라미타는 몽고디비에서 사용 될 document 이름/ 얘가 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다


app.get("/",function(req, res){   // "/"에 get 요청이 오는 경우: /contacts로 리다이렉트
  res.redirect("/contacts");
});

// Index
app.get("/contacts",function(req,res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render("contacts/index", {contacts:contacts});
  });
});

// New
app.get("/contacts/new", function(req, res){
  res.render("contacts/new");
});

// Create
app.post("/contacts", function(req,res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Show
app.get("/contacts/:id",function(req,res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render("contacts/show", {contact:contact});
  });
});

// Edit
app.get("/contacts/:id/edit", function(req,res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render("contacts/edit",{contact:contact});
  });
});

// Update
app.put("/contacts/:id", function(req, res){
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect("/contacts/"+req.params.id);
  });
});

// destroy
app.delete("/contacts/:id", function(req, res){
  Contact.remove({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.redirect("/contacts");
  });
});



app.listen(3000,function(){
  console.log("server on!");
});
