var express = require("express");
var router = express.Router();
var Photo = require("../db/connection").models.Photo;
var Pin = require("../db/connection").models.Pin;


function error(response, message){
  response.status(500);
  response.json({error: message})
}

router.post("/pins/:id/photos", function(req, res){
  Photo.create(req.body).then(function(photo){
    res.json(photo);
  });
});

router.get("/pins/:id/photos", function(req, res){
  Pin.findById(req.params.id).then(function(pin){
    if(!pin) return error(res, "pin not found")
    pin.getPhotos().then(function(photos){
      res.send(photos)
    })
  });
});

router.patch("/pins/:pinId/photos/:id", function(req, res){
  Photo.findById(req.params.id).then(function(photo){
    photo.updateAttributes(req.body).then(function(updatedPhoto){
      res.json(updatedPhoto);
    });
  });
});

router.get("/pins/:pinId/photos/:id", function(req,res){
  Photo.findById(req.params.id).then(function(photo){
    res.json(photo);
  })
})

router.delete("/pins/:pinId/photos/:id", function(req, res){
  Photo.findById(req.params.id).then(function(photo){
    photo.destroy().then(function(){
      res.json({success: true});
    });
  });
});

router.get("/photos/:id", function(req, res){
  Photo.findById(req.params.id).then(function(photo){
    res.json(photo);
  })
})

module.exports = router;
