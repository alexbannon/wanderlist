$(document).ready(function() {
//define current_user variable through ajax
Pin.whichUser().then(function(userId){
  current_user = userId;
})


  $(".popup_bar").hide();
  $(".saveButton").hide();
  $(".deletePhotoButton").hide();

  var pinId;

  //load map
  var WorldMap = new MapView();

  $("body").click(function(){
    $(".overlay").hide();
    $(".help_window").hide();
  });

  //fetch pins from user defined by session with default of 1 if no session

  Pin.fetch().then(function(pins){
    pins.forEach(function(pin){
      var marker = new MarkerView(pin);
      //WorldMap.renderMarker(marker)
      // WorldMap.renderMarker(view.marker)
    })
  })

  // fix mapbox's glitchy height property - can't set 100% for some reason in css

  $('#map').css("height", ($(window).height() - 50));
  $(window).on("resize", resize);
  resize();
  function resize(){
    $('#map').css("height", ($(window).height()) - 50);
  }

  //  add search bar functionality to add red pin

  $(".search_bar").on("keypress", function(e){
    if(e.which == 13){
      e.preventDefault();
      var user_search = $(".form-control").val()
      var request = $.getJSON("https://api.mapbox.com/v4/geocode/mapbox.places/"+user_search+".json?access_token=pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog")
      .then(function(response){
        if(response.features.length == 0){
          $(".search_bar").val("Location Not Found");
        }
        else {
          var search_location = response.features[0].geometry.coordinates
          var lat = search_location[1];
          var long = search_location[0];
          var pin = new Pin({
            "latitude": lat,
            "longitude": long,
          })
          current_latitude = lat;
          current_longitude = long;

          var marker = new MarkerView(pin);
          WorldMap.renderMarker(marker)
          WorldMap.map.setView([current_latitude, current_longitude], 6)
        }
      }).fail(function(response){
        console.log("failed to load coordinates from search");
      })
      $(".search_bar").val("")
      pinIsRed = "t";
      // showAndRenderSidebar()
    }
  })

  $("#redPinBtn").click(function(){
    var pin = new Pin({})
    var marker = new MarkerView(pin);
    pinIsRed = "t";
    WorldMap.renderMarker(marker);
    current_latitude = 13.5333;
    current_longitude = 2.0833;
    WorldMap.map.setView([current_latitude, 50], 2)
    var sidebar = new SidebarView(pin.id)
    sidebar.render();
  });
  $("#greenPinBtn").click(function() {
    var pin = new Pin({"isRed": "false"})
    var marker = new MarkerView(pin);
    WorldMap.renderGreenMarker(marker);
    pinIsRed = "f";
    current_latitude = 13.5333;
    current_longitude = 2.0833;
    WorldMap.map.setView([current_latitude, 50], 2)
    var sidebar = new SidebarView(pin.id)
    sidebar.render();
  });

})
