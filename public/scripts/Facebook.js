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

var post = function(content, event) {
    var target = event.target;
    var currentCard = target.closest('.card')
    FB.api('me/feed', 'post', {message: content}, function(response) {
        // console.log(response);
        if (response.id) {
            console.log("posted to FB");
            currentCard.style.backgroundColor = 'white'
            currentCard.style.backgroundImage = 'url("https://www.shareicon.net/data/128x128/2015/09/14/100981_stamp_256x256.png")';
            currentCard.style.backgroundRepeat = 'no-repeat';
            currentCard.style.backgroundSize = 'contain';
        } else {
            console.log('FAILED to post to FB');
            currentCard.style.backgroundColor = '#ed002a';
        }
        
    })
}

var postOnFB = function(content, event) {
    if (!loggedIn) {
        login().then(function() {
            post(content, event)
        });
    } else { post(content, event) }
}

var email1 = 'kulpkdejda_1520943728@tfbnw.net';
var password1 = '1qaz3edc';

var email2 = 'maria_wsudsbl_two@tfbnw.net';
var password2 = '1qaz4rfv';