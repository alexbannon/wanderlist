var PhotoListView = function(){
  this.$el = $(".photos");
  this.views = [];
  this.blankImage = {
    html: "<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>",
    photoId: null
  };
  this.pinId;
}

PhotoListView.prototype = {
  renderAll: function(pinId) {
    var self = this;
    if(pinId == "?"){
      self.views.push(self.blankImage)
      var number = self.renderOne(0)
      var request = $.getJSON("/pins")
    }
    else {
      self.pinId = pinId;
      var request = $.getJSON("/pins/"+pinId+"/photos").then(function(response){
        response.forEach(function(photo){
          var view = new PhotoView(photo)
          self.views.push(view);
        })
        self.views.push(self.blankImage)
      }).then(function(response){
        var number = self.renderOne(0)
        return number
      })
    }
    return request;
  },

  renderOne: function(number){
    var self = this;
    console.log(self.views)
    console.log(number)
    $(".photos").html(self.views[number].html)
    //for icebox: dropdown on each page to edit/delete photo
    $("#currentPhotoId").html(self.views[number].photoId)

    if (parseInt(number) == (self.views.length - 1)){
      $(".next_arrow").hide();
      $(".changeUrl").on("keypress", function(e){
        if(e.which == 13){
          var newPhotoUrl = $(".changeUrl").val();
          if(self.pinId){
            self.addPhoto(newPhotoUrl, number);
          }
          else{
            self.addPhotoToNewPin(newPhotoUrl, number);
          }
        }
      })
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
  },

  addPhoto: function(photoUrl, number){
    var self = this;
    console.log(photoUrl)
    $.ajax({
      url: "/pins/"+self.pinId+"/photos",
      type: "POST",
      dataType: "json",
      data: {
        photoUrl: photoUrl,
        pinId: self.pinId
      }
    }).done(function(response){
      var view = new PhotoView(response)
      self.views.pop()
      self.views.push(view)
      self.views.push(self.blankImage)
      $(".next_arrow").show()
      $("#nextNumber").html((number+1));
      $(".photos").html(view.html)
    })
  },

  addPhotoToNewPin: function(photoUrl, number){
    var self = this;
    var view = {
      html: "<img id='one_photo' src='"+photoUrl+"'>",
      photoUrl: photoUrl
    }
    self.views.pop()
    self.views.push(view)
    self.views.push(self.blankImage)
    $(".next_arrow").show()
    $("#nextNumber").html((number+1));
    $(".photos").html(view.html)
  }

}
