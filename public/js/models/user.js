var User = function(user_info){
  this.username = user_info.username;
  this.password_digest = user_info.password_digest;
};

User.fetch = function(){
  var request = $.getJSON("/users")
  .then(function(response) {
    var users = [];
    for(var i = 0; i < response.length; i++){
      users.push(new User(response[i]));
    }
    return users;
  })
  .fail(function(response){
    console.log("failed to fetch users");
  });
  return request;
}
