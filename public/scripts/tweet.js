var tweet = function(event) {
    var target = event.target;
    var currentCard = target.closest('.card')
    var status = currentCard.querySelector('p').textContent;
    var postPromise = new Promise (function(resolve, reject) {
      cb.__call(
        "statuses_update",
        {"status": status},
        function (reply) {
          if (reply.httpstatus >= 300) {
            reject(reply);
            console.log(reply);
          } else {
            resolve(reply);
            console.log(reply);
          }
        }
      );
    })
    postPromise.then(function(value) {
      currentCard.style.backgroundColor = 'gray'
      currentCard.style.backgroundImage = 'url("https://www.mutesix.com/hs-fs/hubfs/Twitter%20Ads.png?width=128&name=Twitter%20Ads.png")';
      currentCard.style.backgroundRepeat = 'no-repeat';
      currentCard.style.backgroundSize = 'contain';
    })
    postPromise.catch(function(value) {
      currentCard.style.backgroundColor = '#ed002a';
    })
}
