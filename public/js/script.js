$(document).ready(function() {
  //fix bootstrap glitch
  $(".navbar-toggle").on("click", function(){
    $("#dropdown_hidden").toggle();
  })

//this page loads pins, the functionality for the nav bar pins, and search bar

//declutter global namespace with App object
App = {
  Markers: [],
  current_latitude: null,
  current_longitude: null,
  current_user: null,
  photoListView: null
}

//define current_user variable through ajax
Pin.whichUser().then(function(userId){
  App.current_user = userId;
})


  $(".popup_bar").hide();
  $(".saveButton").hide();

  //temporarily hiding overlay on load
  $(".overlay").hide();
  $(".help_window").hide();


  var pinId;

  //load map
  var WorldMap = new MapView();

  $("body").click(function(){
    $(".overlay").hide();
    $(".help_window").hide();
  });

  $(".map_container").click(function(){
    $(".help-message").hide();
  })

  //fetch pins from user defined by session with default of 1 if no session

  Pin.fetch().then(function(pins){
    pins.forEach(function(pin){
      var markerView = new MarkerView(pin);
      if( markerView.pin.isRed == "t"){
        WorldMap.renderMarker(markerView)
      }
      else{
        WorldMap.renderGreenMarker(markerView)
      }
      //WorldMap.renderMarker(marker)
      // WorldMap.renderMarker(view.marker)
    })
  })

  //  add search bar functionality to add red pin
  // bootstrap has uglified this all major time -
  // Next step would be to remove bootstrap altogether from site.

  $(".search_bar").on("keypress", function(e){
    if(e.which == 13){
      var user_search = $(".form-control").val()
      e.preventDefault();
      searchAndAddPin(user_search);
    }
  })
  $(".another_search_bar").on("keypress", function(e){
    if(e.which == 13){
      var user_search = $(".another_search_bar").val()
      e.preventDefault();
      searchAndAddPin(user_search);
    }
  })
  $(".submit_button").on("click", function(e){
    var user_search = $(".form-control").val()
    e.preventDefault();
    searchAndAddPin(user_search);
  })

  function searchAndAddPin(user_search){
    if(!user_search || user_search == ""){
      return
    }
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
        App.current_latitude = lat;
        App.current_longitude = long;

        var marker = new MarkerView(pin);
        WorldMap.renderMarker(marker)
        WorldMap.map.setView([App.current_latitude, App.current_longitude], 6)
      }
    }).fail(function(response){
      console.log("failed to load coordinates from search");
    })
    $(".search_bar").val("")
    pinIsRed = "t";

    // showAndRenderSidebar()
  }

  $("#redPinBtn").click(function(){
    var pin = new Pin({})
    var markerView = new MarkerView(pin);
    pinIsRed = "t";
    WorldMap.renderMarker(markerView);
    App.current_latitude = 13.5333;
    App.current_longitude = 2.0833;
    WorldMap.map.setView([App.current_latitude, 50], 2)
  });
  $("#greenPinBtn").click(function() {
    var pin = new Pin({"isRed": "false"})
    var markerView = new MarkerView(pin);
    WorldMap.renderGreenMarker(markerView);
    pinIsRed = "f";
    App.current_latitude = 13.5333;
    App.current_longitude = 2.0833;
    WorldMap.map.setView([App.current_latitude, 50], 2)
  });
  $(".anotherRedPinBtn").click(function(){
    var pin = new Pin({})
    var markerView = new MarkerView(pin);
    pinIsRed = "t";
    WorldMap.renderMarker(markerView);
    App.current_latitude = 13.5333;
    App.current_longitude = 2.0833;
    WorldMap.map.setView([App.current_latitude, 50], 2)
  })
  $(".anotherGreenPinBtn").click(function(){
    var pin = new Pin({"isRed": "false"})
    var markerView = new MarkerView(pin);
    WorldMap.renderGreenMarker(markerView);
    pinIsRed = "f";
    App.current_latitude = 13.5333;
    App.current_longitude = 2.0833;
    WorldMap.map.setView([App.current_latitude, 50], 2)
  })

})
