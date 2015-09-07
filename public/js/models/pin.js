var Pin = function(info){
  this.id = info.id || "?";
  this.title = info.title || "New Pin!";
  this.latitude = info.latitude || 13.5333;
  this.longitude = info.longitude || 2.0833;
  this.userId = info.userId || current_user;
  this.isRed = info.isRed || "t";
  this.description = info.description || "What is on the agenda...";
};


Pin.whichUser = function(){
  var request = $.getJSON("/auth/twitter/show")
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
  var request = $.getJSON("/auth/twitter/show")
  .then(function(response){
    if(response.userId){
      var userId = response.userId
    }
    else {
      // a non logged in user gets to see the seed pins and play
      // with the map before signing up
      var userId = 1;
    }
    return userId;
  }).then(function(userId){
    var request = $.getJSON("/users/"+userId+"/pins/")
    .then(function(response) {
      var pins = [];
      for(var i = 0; i < response.length; i++){
        pins.push(new Pin(response[i]));
      }
      return pins;
    })
    .fail(function(response){
      console.log("failed to fetch pins from user with id: "+userId);
    });
    return request;
  })
  return request;
}

Pin.getInfo = function(pinId){
  var request = $.getJSON("/pins/"+pinId)
  .then(function(response) {
    return response
  }).fail(function(response){
    console.log("failed to fetch pins with id: "+pinId);
  })
  return request;
}

Pin.getPhotos = function(pinId){
  var request = $.getJSON("/pins/"+pinId+"/photos/")
  .then(function(response) {
    return response
  }).fail(function(response){
    console.log("failed to fetch photos from pin with id: "+pinId);
  })
  return request;
}

Pin.savePin = function(pinId, data){
  var request = "/pins/"+pinId
  $.ajax({
    url: request,
    type: "PATCH",
    dataType: "json",
    data: data
  }).done(function(response){
    return response
  });
  return request;
}

Pin.newPin = function(){
  var data = {};
  data["title"] = $(".title").children().eq(0).val()
  data["latitude"] = current_latitude;
  data["longitude"] = current_longitude;
  data["isRed"] = pinIsRed;
  data["description"] = $(".description").val()
  data["userId"] = current_user
  console.log(data)
  $.ajax({
    //current user defined on page load off oauth
    url: "/users/"+current_user+"/pins",
    type: "POST",
    dataType: "json",
    data: data
  }).done(function(response){
    $(".saveButton").hide();
    $(".title").html(response.title);
    $(".description").html(response.description);
    //save popup information for newly created pin
    whichPin[0].title = response.title + " id"+response.id
    var pinId = response.id;
    var pict = $(".changeUrl").val();
    if (pict != ""){
      //post new photo
    }
  })
}

Pin.deletePin = function(pinId){
  var request = "/pins/"+pinId
  $.ajax({
    url: request,
    type: "DELETE",
    dataType: "json"
  }).done(function(response){
    $(".popup_bar").hide();
    whichPin.hide();
    return response;
  })
  return request;
}
