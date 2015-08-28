var Pin = function(info){
  this.id = info.id
  this.title = info.title;
  this.latitude = info.latitude;
  this.longitude = info.longitude;
  this.userId = info.userId;
  this.isRed = info.isRed;
  this.description = info.description;
};
Pin.whichUser = function(){
  var request = $.getJSON("http://localhost:3000/auth/twitter/show")
  .then(function(response){
    if(response.userId){
      var userId = response.userId
    }
    else {
      var userId = 1;
    }
    return userId;
  })
  return request
}
Pin.fetch = function(userId){
  var request = $.getJSON("http://localhost:3000/auth/twitter/show")
  .then(function(response){
    if(response.userId){
      var userId = response.userId
    }
    else {
      var userId = 1;
    }
    return userId;
  }).then(function(userId){
    var request = $.getJSON("http://localhost:3000/users/"+userId+"/pins/")
    .then(function(response) {
      var pins = [];
      for(var i = 0; i < response.length; i++){
        pins.push(new Pin(response[i]));
      }
      console.log("pins in second json are "+pins)
      return pins;
    })
    .fail(function(response){
      console.log("failed to fetch pins from user with id: "+userId);
    });
    return request;
  })
  return request;
  console.log(pins)
}
Pin.show = function(pinId){
  var request = $.getJSON("http://localhost:3000/pins/"+pinId)
  .then(function(response) {
    return response
  }).fail(function(response){
    console.log("failed to fetch pins with id: "+pinId);
  })
  return request;
}
Pin.getPhotos = function(pinId){
  var request = $.getJSON("http://localhost:3000/pins/"+pinId+"/photos/")
  .then(function(response) {
    return response
  }).fail(function(response){
    console.log("failed to fetch photos from pin with id: "+pinId);
  })
  return request;
}
