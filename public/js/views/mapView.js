var MapView = function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog';
  // Create a map in the div #map
  this.map = L.mapbox.map('map', 'mapbox.streets').setView([13.5333, 2.0833], 3);
  this.map.scrollWheelZoom.disable();
}

// AM: Very into this map prototyping. +1.
// AM: Might be worth looking into Leaflet / Maxbox + plug-ins to see if there's a way to attach a pin to the cursor when the user selects the red/green pins in the upper right of the screen.

MapView.prototype = {
  renderMarker: function(marker) {
    var self = this;
    marker.marker.addTo(self.map)
    marker.marker.on('dragend', function(){
      var temp = marker.marker.getLatLng();
      current_latitude = temp.lat;
      current_longitude = temp.lng;
    });
  }
}
