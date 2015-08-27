$(document).ready(function() {

  $(".popup_bar").hide();
  $(".next_arrow").hide()
  $(".previous_arrow").hide()
  $(".saveButton").hide();


  var lat     = 13.5333;
  var long    = 2.0833;

  var pinLat = 13.5333;
  var pinLong = 2.0833;

  $(".dropdown-toggle").on("click", function() {
    console.log("click");
  })

  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog';
  // Create a map in the div #map
  var map = L.mapbox.map('map', 'mapbox.streets').setView([lat, long], 3);
  map.scrollWheelZoom.disable();
  //pan to location of current pin clicked - doesn't work yet
  map.featureLayer.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
  });

  $("body").click(function(){
    $(".overlay").hide();
    $(".help_window").hide();
  });

  /////////// nav bar clickdown //////////
  $(".dropdown-toggle").on("click", function(){
    console.log("menu bar clicked")
    $(".dropdown-menu").toggle();
  });

  // $(".navbar-toggle collapsed").on("click", function(){
  //   console.log("hamburger is clicked")
  //   $("#bs-example-navbar-collapse-1").toggle();
  // });


  //my account
  $(".my-account").on("click", function(){
    console.log("my acount clicked")
    $(".account-information").toggle();
  });
  //exiting account information
  $("#exit-button").on("click", function(){
    console.log("exit button clicked")
    $(".account-information").toggle();
  });
  //editing account information
  $("#edit-button").on("click", function(){
    console.log("exit button clicked")
    $(".account-information").toggle();
    alert("Your changes have been saved!")
  });

  //help
  $("#helpdesk").on("click", function(){
    console.log("help clicked")
    $(".help-message").toggle();
  });
  // $("#exithelp-button").on("click", function(){
  //   console.log("exit button clicked")
  //   $(".help-message").toggle();
  // });
  //sign out
  $(".sign-out").on("click", function(){
    console.log("sign out clicked")
  });
  //share link
  $(".share-link").on("click", function(){
    console.log("share clicked")
    alert("your link is www.wanderlistforever.com/OG")
  });

  // red and green pin variables

  var redPin = L.icon({
    iconUrl: '../public/images/PinDown1.png',
    iconSize: [22, 27],
    iconAnchor: [4, 25],
  });
  var greenPin = L.icon({
    iconUrl: '../public/images/PinDown1Green.png',
    iconSize: [22, 27],
    iconAnchor: [4, 25],
  })

  //fetch pins from user defined by session with default of 1 if no session

  Pin.fetch().then(function(pins){
    console.log("pins are "+pins)
    pins.forEach(function(pin){
      console.log(pin + " " + pin.title + " " + pin.latitude + " " + pin.longitude + " " + pin.id)
      if(pin.isRed == true){
        L.marker([pin.latitude, pin.longitude], {
          icon: redPin,
          draggable: true,
          clickable: true,
          title: pin.title + " id" + pin.id
        }).addTo(map);
      }
      else {
        L.marker([pin.latitude, pin.longitude], {
          icon: greenPin,
          clickable: true,
          title: pin.title + " id" + pin.id
        }).addTo(map);
      }
    })
  })

  // add search bar functionality to add red pin

  $(".form-control").on("keypress", function(e){
    if(e.which == 13){
      e.preventDefault();
      var user_search = $(".form-control").val()
      console.log("user_search is "+user_search)
      var request = $.getJSON("https://api.mapbox.com/v4/geocode/mapbox.places/"+user_search+".json?access_token=pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog")
      .then(function(response){
        console.log(response)
        var search_location = response.features[0].geometry.coordinates
        console.log(search_location)
        lat = search_location[1];
        pinLat = lat;
        long = search_location[0];
        pinLong = long;
        redMarker = L.marker([lat, long], {
          icon: redPin,
          draggable: true,
          clickable: true,
        })
        redMarker.addTo(map)
        redMarker.on('dragend', ondragend);
      }).fail(function(response){
        console.log("failed to load coordinates from search");
      })
      $(".form-control").val("")
    }
  })
  // users/1/pins gets a json list of that user's pins

  var myIcon = L.icon({
    iconUrl: '../public/images/PinDown1.png',
    // iconRetinaUrl: 'my-icon@2x.png',
    iconSize: [22, 27],
    iconAnchor: [4, 25],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowRetinaUrl: 'my-icon-shadow@2x.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  });

  // add green and red pin drop and drag

  var redMarker;

  // redMarker.on('click', function () {
  //   redMarker.bounce({duration: 500, height: 100});
  // });

  var greenMarker;

  $("#redPinBtn").click(function(){
    console.log("click")
    redMarker = L.marker([lat, long], {
      icon: redPin,
      draggable: true,
      clickable: true,
    });
    redMarker.addTo(map);
    redMarker.on('dragend', ondragend);
  });
  $("#greenPinBtn").click(function() {
    console.log("greenclick")
    greenMarker = L.marker([lat, long], {
      icon: greenPin,
      draggable: true,
      clickable: true,
    });
    greenMarker.addTo(map);
    greenMarker.on('dragend', ondragend);
  });

  // Set the initial marker coordinate on load.
  function ondragend() {
    if(redMarker){
      var rm = redMarker.getLatLng();
      console.log(rm.lat);
      console.log(rm.lng);
      pinLat = rm.lat;
      console.log("pinLat is currently "+pinLat)
      pinLong = rm.lng;
      newPinWindow();
    }
    if(greenMarker){
      var gm = greenMarker.getLatLng();
      console.log(gm.lat);
      console.log(gm.lng);
      pinLat = gm.lat;
      pinLong = gm.lng;
      newPinWindow();
    }

    //coordinates.innerHTML = 'Latitude: ' + m.lat + '<br />Longitude: ' + m.lng;
  }

  // every time the marker is dragged, update the coordinates container


  // add and remove sidebar on pin click

  $(".leaflet-tile-pane").on("click", function() {
    $(".popup_bar").hide();
    $(".saveButton").hide();
  })

  $(".leaflet-marker-pane").on("click", function() {
    var whichPin = $(event.target);
    if($(".popup_bar").css("display") == "none"){
      $(".popup_bar").toggle();
    }
    else {
      console.log("Already showing");
    }
    var temp = event.target.title.split(" id")
    var pinId = temp[1]
    var pinTitle = temp[0]
    var photoUrls = []
    var whichPhotoCounter = 0;
    if(pinId){
      Pin.show(1, pinId).then(function(response){
        $(".title").html("<span class='clickable_title'>"+response.title+"</span>");
        $(".description").html("<span class='clickable_description'>"+response.description+"</span>");
        // divCreator.html("<div>"+response.title+"</div>")
        // divCreator.html("<div>"+response.description+"</div>")
        $(".clickable_title").one("click", function() {
          var tempCounter = 0;
          var value = $(".clickable_title").html();
          $(".clickable_title").html("<input class='editTitle' type='text' value='"+value+"'>")
          $(".clickable_title").mouseup(function(){

          })
          $("body").on("click", function(){
            if($(event.target).attr("class") != "editTitle" && $(event.target).attr("class") != "clickable_title" && tempCounter == 0){
               tempCounter++
               value = $(".editTitle").val()
               console.log("Ajax patch fired");
               console.log("pinId: "+pinId+ " value: "+value)
               makeAjaxPatchRequest(pinId, value)
              //  makeAjaxPatchRequest(1, pinId, title, value);
            }
          })
        })
        function makeAjaxPatchRequest(pinId, value){
          $.ajax({
            url: "/pins/"+pinId,
            type: "PATCH",
            dataType: "json",
            data: {"title": value}
          }).done(function(response){
            $(".clickable_title").html(response.title)
            $("body").click(function(event){
              event.stopPropagation();
            })
          }).fail(function(response){
            console.log("patch to pin failed");
          })
        }
        function clickTitle(){};
        $(".clickable_word").on("click", function() {
          var self = this;
          var valueOfClick = $(self).html()
          $(self).html("<input class='editbox' type='text' value='"+valueOfClick+"'>")
          $("body").on("click", function() {
            if($(event.target).attr("class") != "clickable_word" && $(event.target).attr("class") != "editbox"){
              var edited_value = $(".editbox").val()
              var title_or_description = $(self).parent().attr("class");
              $.ajax({
                url: "/users/1/pins/"+pinId,
                type: "PATCH",
                dataType: "json",
                data: {title_or_description: edited_value}
              }).done(function(response){
                $(".temp").eq(0).attr("class", "title");
                $(".title").html(title)
              }).fail(function(response){
                console.log("patch to pin failed");
                console.log($(".editbox"))
                $(self).attr("class", "clickable_word");
                $(self).html("<span class='clickable_word'>"+edited_value+"</span>")
              })
            }
          })
        })
        $(".glyphicon-trash").on("click", function(){
          console.log("click")
          console.log(whichPin)
          $.ajax({
            url: "/pins/" + pinId,
            type: "DELETE",
            dataType: "json"
            // success: function(data){
            //   $(this).remove();
            // }
          }).done(function(response){
            whichPin.hide();
            console.log(response);
          }).fail(function(response){
            console.log("delete to pin failed");
          })
        })
      }) // pin.show

      // $(".title").on("click", function() {
      //   if($(event.target).attr("class") != "editbox"){
      //     console.log($(event.target).attr("class"))
      //     var self = this;
      //     var current_val = $(self).html();
      //     $(self).html("")
      //     $(self).html("<input class='editbox' type='text' value='"+current_val+"'>")
      //     $(".title").attr("class", "editbox")
      //     $("body").on("click", function() {
      //       console.log("this shouldn't run because event.target class is "+ $(event.target).attr("class"))
      //       if($(event.target).attr("class") != "editbox"){
      //         var title = $(".editbox").eq(1).val()
      //         $.ajax({
      //           url: "http://localhost:3000/users/1/pins/"+pinId,
      //           type: "PATCH",
      //           dataType: "json",
      //           data: {"title": title}
      //         }).done(function(response){
      //           $(".temp").eq(0).attr("class", "title");
      //           $(".title").html(title)
      //         }).fail(function(response){
      //           console.log("patch to pin failed");
      //           console.log($(".editbox"))
      //           $(".editbox").eq(0).attr("class", "title");
      //           $(".title").html(title)
      //
      //         })
      //       }
      //     })
      //   }
      // })
      // $(".description").on("click", function(){
      //   if($(event.target).attr("class") != "editbox"){
      //     var self = this;
      //     var current_val = $(self).html();
      //     $(self).html("")
      //     $(self).html("<input class='editbox' type='text' value='"+current_val+"'>")
      //     $(".title").attr("class", "editbox")
      //     $("body").on("click", function() {
      //       if($(event.target).attr("class") != "editbox"){
      //         console.log("done editing");
      //       }
      //     })
      //   }
      // })

      Pin.getPhotos(pinId).then(function(response){
        for(var i = 0; i < response.length; i++){
          photoUrls.push(response[i].photoUrl);
        }
      })
      .then(function(response){
        if (photoUrls.length == 0) {
          $(".next_arrow").hide()
          $(".previous_arrow").hide()

          $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' value='Enter Photo URL' class='changeUrl'></div>'")
        }
        else {
          $(".photos").html("<img src="+photoUrls[whichPhotoCounter]+">")
          $(".next_arrow").show()
          $(".next_arrow").on("click", function(){
            $(".previous_arrow").show()
            whichPhotoCounter++;
            if(photoUrls[whichPhotoCounter]){
              $(".photos").html("<img src="+photoUrls[whichPhotoCounter]+">")
            }
            else {
              $(".next_arrow").hide()
              $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' value='Enter Photo URL' class='changeUrl'></div>'")
            }
          })
          $(".previous_arrow").on("click", function() {
            $(".next_arrow").show()
            whichPhotoCounter--;
            if(whichPhotoCounter == 0){
              $(".previous_arrow").hide()
            }
            if(photoUrls[whichPhotoCounter]){
              $(".photos").html("<img src="+photoUrls[whichPhotoCounter]+">")
            }
            else {
              $(".previous_arrow").hide()
              $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' value='Enter Photo URL' class='changeUrl'></div>'")
            }

          })

        }
        // $(".popup_bar").html(divCreator)
      })
    }
    // if a new pin, then do the following////
    else {
      newPinWindow();
    }

  })
  function newPinWindow() {
    if($(".popup_bar").css("display") == "none"){
      $(".popup_bar").toggle();
    }
    $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' value='Enter Photo URL' class='changeUrl'></div>'")
    $(".title").html("<input type='text' placeholder='New Pin'>");
    $(".description").html("<input class='descrip' type='text' placeholder='What is on the agenda?'>")
    console.log("The window thinks the lat/long is "+pinLat + " " + pinLong)
    $(".saveButton").show()
  }
  $(".saveButton").on("click", function() {
    var title = $(".title").children().eq(0).val()
    // console.log(title)
    var latitude = pinLat;
    var longitude = pinLong;
    var isRed = true;
    var description = $(".description").children().eq(0).val()
    // console.log(description)
    Pin.whichUser().then(function(userId){
      $.ajax({
        url: "/users/"+userId+"/pins",
        type: "POST",
        dataType: "json",
        data: {"title": title, "latitude": latitude, "longitude": longitude, "userId": userId, "isRed": isRed, "description": description}
      }).done(function(response){
        var pict = $(".changeUrl").val();
        console.log(pict)
        $.ajax({
          url: "/pins/" + pinId + "/photos",
          type: "POST",
          dataType: "json",
          data: {"photoUrl": pict}
        })
        //console.log(pict);
      }).fail(function(response){
        console.log("post to pin failed");
      })
    })

  })
})
