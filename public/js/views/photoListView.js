var PhotoListView = function(){
  this.$el = $(".photos");
  this.views = [];
  this.blankImage = "<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>"
}

PhotoListView.prototype = {
  renderAll: function(pinId) {
    var self = this;
    $.getJSON("/pins/"+pinId+"/photos").then(function(response){
      response.forEach(function(photo){
        var view = new PhotoView(photo)
        self.views.push(view.html);
      })
      self.views.push(self.blankImage)
    }).then(function(){
      $(".photos").html(self.views[0])
    })
  }

}
