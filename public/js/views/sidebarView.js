var SidebarView = function(pinId){
  this.pinId = pinId;
}

SidebarView.prototype = {
  render: function() {
    $(".popup_bar").show();

    if(this.pinId == "?"){
      $(".hiddenInfo").empty();
      $(".saveButton").show()
      $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>")
      $(".title").html("<input type='text' placeholder='New Pin'>");
      $(".description").val("What is on the agenda?")
    }

    else{
      //add id to hidden div for later retrieval
      $("#pinId").html(this.pinId)

      //reset normal sidebar view
      $(".saveButton").hide()

      Pin.getInfo(this.pinId).then(function(response){
        //input title and description into sidebar
        $(".title").html("<span class='clickable_title'>"+response.title+"</span>")
        $(".description").val(response.description);

      })
    }
  }
}
