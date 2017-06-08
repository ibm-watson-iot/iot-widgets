var express = require('express');
var router = express.Router();
var path = require('path'), fs=require('fs');
var fileList=[];
var disDir='./dist/samples';
function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("[Index] : no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        }
        else if (filter.test(filename)) callback(filename);
    };
};

fromDir(disDir,/\.html$/,function(filename){
    //console.log('-- found: ',filename);
    var name = filename.replace(/\\/g,"/").replace("dist","");
    fileList.push(name);
    //console.log(fileList);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IoT Widget Sample' ,samples:fileList});
});

module.exports = router;
