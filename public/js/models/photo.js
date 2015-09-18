var Photo = function(pinId, photoId){
  var self = this;
  $.getJSON("/pins/"+pinId+"/photos/"+photoId)
  .done(function(response){
    self.photoUrl = response.photoUrl;
    self.pinId = response.pinId;
  })
};

Photo.savePhotos = function(listView, pinId){
  var views = listView.views
  views.pop()
  if(views.length != 0){
    var counter = 0;
    views.forEach(function(photoView){
      $.ajax({
        url: "/pins/"+pinId+"/photos",
        type: "POST",
        dataType: "json",
        data: {
          photoUrl: photoView.photoUrl,
          pinId: pinId
        }
      }).done(function(response){
        counter++
        if(counter == views.length){
          App.showAndRenderPhotos(pinId)
        }
        return
        // if counter == views.length
        //render photoListView
      })
    })
  }
}
