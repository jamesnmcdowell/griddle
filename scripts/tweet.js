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
      currentCard.style.backgroundColor = '#00aced';
    })
    postPromise.catch(function(value) {
      currentCard.style.backgroundColor = '#ed002a';
    })
}
