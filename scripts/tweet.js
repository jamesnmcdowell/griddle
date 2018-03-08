var tweet = function(event) {
    var target = event.target;
    var status = target.closest('.card').querySelector('ul').textContent;
    cb.__call(
      "statuses_update",
      {"status": status},
      function (reply) {
        console.log(reply);
      }
    );
}
