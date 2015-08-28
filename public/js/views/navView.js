/////////// nav bar clickdown //////////
$(".dropdown-toggle").on("click", function(){
  console.log("menu bar clicked")
  $(".dropdown-menu").toggle();
});

// $(".navbar-toggle collapsed").on("click", function(){
//   console.log("hamburger is clicked")
//   $("#bs-example-navbar-collapse-1").toggle();
// });


//my account
$(".my-account").on("click", function(){
  console.log("my acount clicked")
  $(".account-information").toggle();
});
//exiting account information
$("#exit-button").on("click", function(){
  console.log("exit button clicked")
  $(".account-information").toggle();
});
//editing account information
$("#edit-button").on("click", function(){
  console.log("exit button clicked")
  $(".account-information").toggle();
  alert("Your changes have been saved!")
});

//help
$("#helpdesk").on("click", function(){
  console.log("help clicked")
  $(".help-message").toggle();
});
// $("#exithelp-button").on("click", function(){
//   console.log("exit button clicked")
//   $(".help-message").toggle();
// });
//sign out
$(".sign-out").on("click", function(){
  console.log("sign out clicked")
});
//share link
$(".share-link").on("click", function(){
  console.log("share clicked")
  alert("your link is www.wanderlistforever.com/OG")
});
