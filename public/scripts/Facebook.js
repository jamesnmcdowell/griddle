// facebook post

window.fbAsyncInit = function() {
    FB.init({
        appId            : '2026578154331822',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.12'
    });
  };
  
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  var login = function() {
    FB.login( function(response) {
        if (response.status === 'connected') {
            console.log("you're logged in to Facebook!");
        } else if (response.status === 'not_authorized') {
            console.log('FB: not authorized');
        } else { console.log("you're not logged in to FB"); }
    }, {scope: 'publish_actions'});
  }
  
  var post = function() {
    FB.api('me/feed', 'post', {message: 'testing post feature on FB...2'}, function(response) {
        console.log(response);
        console.log('you posted something. ?');
    })
  }

  var email = 'kulpkdejda_1520943728@tfbnw.net';
  var password = '1qaz3edc';