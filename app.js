var express = require('express'); 
var cors = require('cors'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
app.use(cors());
// app.use(function(req, res, next) { //allow cross origin requests
//     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//     res.header("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

/** Serving from the same express Server
No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());  

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        console.log(req.body);
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + req.body.FormDataKey + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
});

app.get('/getFile/:id', function(req,res){
    res.sendFile(__dirname +'/uploads/file-' + req.params.id);
})

app.listen('3000', function(){
    console.log('running on 3000...');
});