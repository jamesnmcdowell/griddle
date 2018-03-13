FB.init({
    appId            : '2026578154331822',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v2.12'
});

var loggedIn = false;

var login = function() {
    return new Promise(function(resolve, reject) {
        FB.login( function(response) {
            if (response.status === 'connected') {
                console.log("you're logged in to Facebook!");
                loggedIn = true;
                resolve();
            } else if (response.status === 'not_authorized') {
                console.log('FB: not authorized');
                reject();
            } 
            else {
                console.log("you're not logged in to FB");
                reject(); }
        }, {scope: 'publish_actions'});
    })
}

var post = function(content) {
    FB.api('me/feed', 'post', {message: content}, function(response) {
        console.log(response);
        console.log('you posted something. ?');
    })
}

var postOnFB = function(content) {
    if (!loggedIn) {
        login().then(function() {
            console.log("i'm inside")
            console.log(content)
            post(content)
        });
    } else { post(content) }
}

var email1 = 'kulpkdejda_1520943728@tfbnw.net';
var password1 = '1qaz3edc';

var email2 = 'maria_wsudsbl_two@tfbnw.net';
var password2 = '1qaz4rfv';