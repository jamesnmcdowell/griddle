var tweet = function(event) {
    var target = event.target;
    var currentCard = target.closest('.card')
    var status = currentCard.querySelector('ul').textContent;

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
      currentCard.classList.remove('blue-grey');
      currentCard.classList.add('twitter-blue');
    })
}
