$(document).ready(function(){

  //this page deals with the loading and total functionality
  //that is included in the popup sidebar

  //hide sidebar and save
  $(".leaflet-tile-pane").on("click", savePinAndHide)

  function savePinAndHide() {
    //prevent doubling of next arrow and trash event listeners
    $(".glyphicon-trash").unbind()
    $(".next_arrow").unbind();
    $(".previous_arrow").unbind();
    //prevent blank title saves
    if($(".editTitle").val() == ""){
      return
    }
    //in case sidebar actually wasn't showing
    if($(".popup_bar").css("display") == "none"){
      return
    }

    var data = {}
    var pinId = $("#pinId").html()
    // when new pin, don't send ajax call without save
    if (!pinId) {
      // look here if old pins stop rendering right
      // $(".popup_bar").hide();
      return
    }
    Pin.getLatLong(pinId)
    data["latitude"] = App.current_latitude
    data["longitude"] = App.current_longitude

    var description = $(".editbox").val();
    data["description"] = description;
    //find data whether title is being edited or not
    if($(".editTitle").length > 0){
      var title = $(".editTitle").val();
    }
    else{
      var title = $(".clickable_title").html();
    }
    data["title"] = title
    Pin.savePin(pinId, data)
    $(".popup_bar").hide();
  }

  //show sidebar
  $(".leaflet-marker-pane").on("click", showAndRenderSidebar);

  function showAndRenderSidebar(event){
    //prevent doubling of next arrow and trash event listeners
    $(".next_arrow").unbind();
    $(".previous_arrow").unbind();
    $(".glyphicon-trash").unbind()
    whichPin = $(event.target);
    var temp = event.target.title.split(" id")
    var pinId = temp[1]

    var sidebarView = new SidebarView(pinId)
    sidebarView.render()


    //for non-new pins, add trash and render photos
    if(pinId != "?"){
      $(".glyphicon-trash").one("click", function(){
        Pin.deletePin(pinId, whichPin)
        $(".popup_bar").hide();
      })
    }
    else {
      $(".glyphicon-trash").one("click", function(){
        whichPin.hide();
        $(".popup_bar").hide();
      })
    }
    showAndRenderPhotos(pinId)

  }

  function showAndRenderPhotos(pinId){
    App.photoListView = new PhotoListView()
    App.photoListView.renderAll(pinId).done(function(response){
      // next and prev index of array of photos stored in hidden div
      $(".next_arrow").on("click", renderNextPhoto)
      $(".previous_arrow").on("click", renderPreviousPhoto)
      //make title editable -- placing here because it needed to come after all ajax calls for title and photos
      $(".clickable_title").one("click", switchTitle);
      function renderNextPhoto(){
        var nextNumber = parseInt($("#nextNumber").html())
        App.photoListView.renderOne(nextNumber)
        $(".next_arrow").off("click", renderNextPhoto)
        $(".next_arrow").on("click", renderNextPhoto)
      }
      function renderPreviousPhoto(){
        var previousNumber = parseInt($("#previousNumber").html())
        App.photoListView.renderOne(previousNumber)
        $(".previous_arrow").off("click", renderPreviousPhoto)
        $(".previous_arrow").on("click", renderPreviousPhoto)
      }
    })

  }

  //editable title
  function switchTitle(){
    var value = $(".clickable_title").html();
    $(".clickable_title").html("<input class='editTitle' type='text' value='"+value+"'>")
    $(".editTitle").on("keypress", function(e){
      if(e.which == 13){
        var value = $(".editTitle").val();
        $(".clickable_title").html(value)
      }
    })
    $(".popup_bar").mouseup(function(e) {
      var value = $(".editTitle").val();
      var title = $(".title")
      if(!title.is(e.target) && title.has(e.target).length === 0){
        $(".clickable_title").html(value);
        $(".clickable_title").off("click", switchTitle)
        $(".clickable_title").one("click", switchTitle)
      }
    })
  }


  //save new pin
  $(".saveButton").on("click", function() {
    Pin.newPin().then(function(response){
      $("#pinId").html(response.id)
      Photo.savePhotos(App.photoListView, response.id)
      showAndRenderPhotos(response.id)
    })
  })

})
