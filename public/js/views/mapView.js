var MapView = function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGJhbm5vbiIsImEiOiIzM2I3MWU4NjhlNjc5ODYzN2NjMWFhYzU4OWIzOGYzYiJ9.zVY-I01f5Pie1XCaA0Laog';
  // Create a map in the div #map

  var southWest = L.latLng(-90, -180);
  var northEast = L.latLng(90, 180);
  var bounds = L.latLngBounds(southWest, northEast);

  this.map = L.mapbox.map('map', 'mapbox.streets', {
    maxBounds: bounds
  })
  this.map.scrollWheelZoom.disable();
  this.map.fitBounds(bounds);
  this.map.setView([13.5333, 2.0833], 2);


}

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
