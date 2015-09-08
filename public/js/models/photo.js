var Photo = function(pinId, photoId){
  var self = this;
  $.getJSON("/pins/"+pinId+"/photos/"+photoId)
  .done(function(response){
    self.photoUrl = response.photoUrl;
    self.pinId = response.pinId;
  })
};

Photo.savePhotos = function(listView, pinId){
  console.log(listView.views)
  listView.views.pop()
  if(listView.views.length == 0){
    console.log("nothing to do")
  }
  else{
    listView.views.forEach(function(photoView){
      $.ajax({
        url: "/pins/"+pinId+"/photos",
        type: "POST",
        dataType: "json",
        data: {
          photoUrl: photoView.photoUrl,
          pinId: pinId
        }
      }).done(function(response){
        console.log(response)
      })
    })
  }
}
