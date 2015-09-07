$(document).ready(function(){
  //hide sidebar and save
  $(".leaflet-tile-pane").on("click", savePinAndHide)
  function savePinAndHide() {
    if($(".editTitle").val() == ""){
      return
    }
    if($(".popup_bar").css("display") == "none"){
      return
    }
    var data = {}
    var checkId = $("#pinId").html()
    var notes = $(".editbox").val();
    $.ajax({
      url: "/pins/"+checkId,
      type: "PATCH",
      dataType: "json",
      data: {"description": notes}
    }).done(function(response){
    })
    var temp = event.target.title.split(" id")
    pinId = temp[1]
    var pict = $(".changeUrl").val();
    if(pict){
      postNewPhoto(pinId, pict)
    }
    $(".popup_bar").hide();
  }

  //show sidebar
  function showAndRenderSidebar(){
    whichPin = $(event.target);
    var temp = event.target.title.split(" id")
    var pinId = temp[1]
    console.log(event.target.title)
    var sidebarView = new SidebarView(pinId)
    sidebarView.render()
    // new PhotoView(pinId, 1)
  }
  // function showAndRenderSidebar(){
  //   $(".popup_bar").show();
  //
  //   //parse information built into marker and put in hidden div
  //   whichPin = $(event.target);
  //   var temp = event.target.title.split(" id")
  //   $(".hiddenInfo").html("<span id='pinId'>"+temp[1]+"</span><span id='pinTitle'>"+temp[0]+"</span>")
  //   pinId = temp[1]
  //   if(pinId != "undefined"){
  //     whichPhoto = 0;
  //     photos = []
  //     // fetch photos, store IDs, and show photos
  //     Pin.getPhotos(pinId).then(function(response){
  //       response.forEach(function(photo){
  //         photos.push(photo.id)
  //       })
  //     }).done(function(response){
  //       if (photos.length == 0) {
  //         $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>'")
  //       }
  //       else {
  //         if(photos[whichPhoto]){
  //           new PhotoView(pinId, photos[whichPhoto]);
  //         }
  //         $(".next_arrow").on("click", function(){
  //           whichPhoto++;
  //           if(!photos[whichPhoto]){
  //             whichPhoto = 0;
  //           }
  //           new PhotoView(pinId, photos[whichPhoto]);
  //         })
  //         $(".previous_arrow").on("click", function(){
  //           whichPhoto--;
  //           if(!photos[whichPhoto]){
  //             whichPhoto = photos.length;
  //           }
  //           new PhotoView(pinId, photos[whichPhoto]);
  //         })
  //       }
  //
  //       // add event listener to delete button
  //       $(".deletePhotoButton").on("click", function() {
  //         photoId = photos[whichPhoto].id
  //         $.ajax({
  //           url: "/pins/" + pinId + "/photos/" + photoId,
  //           type: "DELETE",
  //           dataType: "json",
  //         }).done(function(response){
  //           // placeholder $(".photos").html("<img src='"+ response.photoUrl +"' >")
  //         })
  //       })
  //     })
  //
  //     //show pin and make title editable
  //
  //     Pin.getInfo(pinId).then(function(response){
  //       $(".title").html("<span class='clickable_title'>"+response.title+"</span>");
  //       $(".description").val(response.description);
  //       $(".clickable_title").one("click", function() {
  //         var value = $(".clickable_title").html();
  //         $(".clickable_title").html("<input class='editTitle' type='text' value='"+value+"'>")
  //         $(".editTitle").on("keypress", function(e){
  //           if(e.which == 13){
  //             var value = $(".editTitle").val();
  //             $.ajax({
  //               url: "/pins/"+pinId,
  //               type: "PATCH",
  //               dataType: "json",
  //               data: {"title": value}
  //             }).done(function(response){
  //               $(".clickable_title").html(response.title)
  //             })
  //           }
  //         })
  //       })
  //     })
  //
  //     // delete on trash click
  //
  //     $(".glyphicon-trash").on("click", function(){
  //       $.ajax({
  //         url: "/pins/" + pinId,
  //         type: "DELETE",
  //         dataType: "json"
  //         // success: function(data){
  //         //   $(this).remove();
  //         // }
  //       }).done(function(response){
  //         whichPin.hide();
  //         $(".popup_bar").hide();
  //       })
  //     })
  //   }
  //   else if(pinId == "undefined"){
  //     $(".saveButton").show()
  //     $(".photos").html("<img class='changePhotoToOpaque' src='http://www.backpaco.com/wp-content/uploads/2015/04/yosemite-park.jpg'><div class='changeUrlBar'><input type='text' placeholder='Enter Photo URL' class='changeUrl'></div>'")
  //     $(".title").html("<input type='text' placeholder='New Pin'>");
  //     $(".description").val("What is on the agenda?")
  //   }
  // }

  //run function on marker click
  $(".leaflet-marker-pane").on("click", showAndRenderSidebar);

  //editable title
  function switchTitle(){
    var value = $(".clickable_title").html();
    $(".clickable_title").html("<input class='editTitle' type='text' value='"+value+"'>")
    $(".editTitle").on("keypress", function(e){
      if(e.which == 13){
        console.log("enter pressed")
        var value = $(".editTitle").val();
        $(".clickable_title").html(value)
      }
    })
    $(".popup_bar").mouseup(function(e) {
      var value = $(".editTitle").val();
      var title = $(".title")
      if(!title.is(e.target) && title.has(e.target).length === 0){
        $(".clickable_title").html(value);
        $(".clickable_title").one("click", switchTitle)
      }
    })
  }
  
  $(".clickable_title").one("click", switchTitle);

  //save new pin
  $(".saveButton").on("click", function() {
    var title = $(".title").children().eq(0).val()
    var latitude = current_latitude;
    var longitude = current_longitude;
    var isRed = pinIsRed;
    var description = $(".description").val()
    $.ajax({
      url: "/users/"+current_user+"/pins",
      type: "POST",
      dataType: "json",
      data: {"title": title, "latitude": latitude, "longitude": longitude, "userId": current_user, "isRed": isRed, "description": description}
    }).done(function(response){
      $(".saveButton").hide;
      $(".title").html(response.title);
      $(".description").html(response.description);
      whichPin[0].title = response.title + " id"+response.id
      var pinId = response.id;
      var pict = $(".changeUrl").val();
      if (pict != ""){
        postNewPhoto(pinId, pict)
      }
    })
  })

  //save new photo function
  function postNewPhoto(pinId, pict) {
    $.ajax({
      url: "/pins/" + pinId + "/photos",
      type: "POST",
      dataType: "json",
      data: {"photoUrl": pict, "pinId": pinId}
    }).done(function(response){
      $(".photos").html("<img src='"+ response.photoUrl +"' >")
    }).fail(function(response){
      console.log("post to pin failed");
    })
  }

})
