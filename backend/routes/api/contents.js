var express = require('express');
var router = express.Router();
var Contents = require('../../models/Contents.js');
var multer = require('multer');
var maxSize = 1024 * 1024;

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './coverimg/');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
        
    }
});
const upload = multer({ 
    storage: storage, 
    limits : { fileSize : maxSize },
    fileFilter : function (req, file, callback) {
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/bmp') {
          req.fileValidationError = 'wrong mimetype';
          return callback(null, false, new Error('wrong mimetype'));
      }
      callback(null, true);
    }
}).single('coverImg')

/* GET ALL Contents */
router.get('/', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    res.json(contents);
  });
});

/* SAVE Contents formData로 들어온 데이터 저장 + imageUrl스키마 필드에 파일 경로 저장*/
router.post('/', upload, (req, res, next) => {  
  Contents.create({...req.body, imageUrl: req.file.path}, (err, post) => {
    // console.log(req);
    if (err) return next(err);
    upload(req, res, () => {
      if(req.fileValidationError){
          return res.send(req.fileValidationError);
      }
      else
          return res.send('/coverimg/' + req.file.filename);
    });
  });
});

router.get('/r1', (req, res, next) => { 
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  }).sort({views : -1})
    .where('category').in(['면접'])
    .limit(4);
});

router.get('/r2', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({views : -1})
  .where('category').in(['영어 회화'])
  .limit(4);
});

router.get('/r3', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({id : -1})
  .limit(4);
});

router.get('/r4', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  // .sort({createdAt : 1})
  .limit(4);
});

router.get('/r5', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  // .sort({views : -1})
  // .where('category').in(['면접'])
  .limit(4);
});

router.get('/context/:id', (req, res, next) => { 
  Contents.findOne((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  });
});

router.get('/detail/:id', (req,res,next) => {
  Contents.findOneAndUpdate({ id: req.params.id },{ $inc: { views: 1 } }, (err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })});
  

module.exports = router;