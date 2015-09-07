var PhotoListView = function(){
  this.$el = $(".photos");
  this.views = [];
  this.blankImage = "<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>"
  this.pinId;
  $(".hiddenInfo").append("<span id='nextNumber'></span>")
  $(".hiddenInfo").append("<span id='previousNumber'></span>")
}

PhotoListView.prototype = {
  renderAll: function(pinId) {
    var self = this;
    self.pinId = pinId;
    var request = $.getJSON("/pins/"+pinId+"/photos").then(function(response){
      response.forEach(function(photo){
        var view = new PhotoView(photo)
        self.views.push(view.html);
      })
      self.views.push(self.blankImage)
    }).then(function(response){
      var number = self.renderOne(0)
      return number
    })
    return request;
  },

  renderOne: function(number){
    var self = this;
    $(".photos").html(self.views[number])
    if (parseInt(number) == (self.views.length - 1)){
      $(".next_arrow").hide();
    }
    else {
      $(".next_arrow").show()
      $("#nextNumber").html((number+1));
    }
    if (number == 0) {
      $(".previous_arrow").hide();
    }
    else {
      $(".previous_arrow").show();
      $("#previousNumber").html((number-1));
    }
    return number
  }

}
