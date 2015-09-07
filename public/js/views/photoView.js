var PhotoView = function(data){
  var self = this;
  this.photoUrl = data.photoUrl;
  this.html = "<img id='one_photo' src='"+this.photoUrl+"'>";
  this.photoId = data.id;
}
