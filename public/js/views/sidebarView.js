var SidebarView = function(pinId){
  this.pinId = pinId;
}

SidebarView.prototype = {
  render: function() {
    $(".popup_bar").show();

    if(this.pinId == "?"){
      $(".saveButton").show()
      $(".next_arrow").hide();
      $(".previous_arrow").hide();
      $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='To Add Photo: Paste URL, Hit Enter' class='changeUrl'></div>")
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
