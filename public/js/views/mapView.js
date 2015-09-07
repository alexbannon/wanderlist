var MapView = function() {
  greenMarkers = new L.layerGroup();
  redMarkers = new L.layerGroup();
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog';
  // Create a map in the div #map
  this.map = L.mapbox.map('map', 'mapbox.streets').setView([13.5333, 2.0833], 3);
  this.map.scrollWheelZoom.disable();

  // Add the marker layer groups to a leaflet control, and add to map in a checked state
  L.control.layers(null, {
    'Green Pins': greenMarkers.addTo(this.map),
    'Red Pins': redMarkers.addTo(this.map),
  },{position:'bottomleft'}).addTo(this.map);
}

MapView.prototype = {
  // adds green makers to their layer group
  renderGreenMarker: function(marker) {
    var self = this;
    marker.marker.addTo(greenMarkers);
    marker.marker.on('dragend', function(){
      var temp = marker.marker.getLatLng();
      current_latitude = temp.lat;
      current_longitude = temp.lng;
    });
  },
  // adds red markers to their layer group
  renderMarker: function(marker) {
    var self = this;
    marker.marker.addTo(redMarkers);
    marker.marker.on('dragend', function(){
      var temp = marker.marker.getLatLng();
      current_latitude = temp.lat;
      current_longitude = temp.lng;
    });
  }
}
