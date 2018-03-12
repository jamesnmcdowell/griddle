var tweet = function(event) {
    var target = event.target;
    var currentCard = target.closest('.card')
    var status = currentCard.querySelector('p').textContent;
    var postPromise = new Promise (function(resolve, reject) {
      cb.__call(
        "statuses_update",
        {"status": status},
        function (reply) {
          resolve(reply);
          console.log(reply);
        }
      );
    })
    postPromise.then(function(value) {
      currentCard.classList.replace('blue-grey','twitter-blue');
    })
    postPromise.catch(function(value) {
      currentCard.classList.replace('blue-grey','failure-call');
    })
}
