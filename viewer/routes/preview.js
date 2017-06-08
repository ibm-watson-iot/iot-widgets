var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var fs = require('fs');
var archiver = require('archiver');

var obj = null
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("printing template");

  res.render('preview',{ template:obj.template || '<h1> Preview not available </h1>',data:obj.data} );
});

router.post('/data', function(req, res, next) {
  console.log(req.body);
  obj = req.body
  res.send("sucess");
});
router.get('/data', function(req, res, next) {
  res.send(obj);
});

router.get('/download',function (req, res, next) {
  var ejstemplate = ejs.compile(fs.readFileSync('./viewer/views/preview.ejs', 'utf8'));
  var html = ejstemplate( { template:obj.template || '<h1> Preview not available </h1>',data:obj.data});
  //var output = fs.createWriteStream(__dirname + '/example.zip');
  var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
  });

  // listen for all archive data to be written
  // output.on('close', function() {
  //   console.log(archive.pointer() + ' total bytes');
  //   console.log('archiver has been finalized and the output file descriptor has closed.');
  // });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(res);
  archive.directory('dist/lib','lib').file('dist/wiotpwidgets.min.js', { name: 'wiotpwidgets.min.js' }).append(html, { name: 'index.html' }).finalize();

});

module.exports = router;
