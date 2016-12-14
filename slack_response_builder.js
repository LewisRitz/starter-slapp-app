var buildMessage = function(title, bid, ask) {

  var json = {
        //"response_type": "in_channel",
        "attachments": [
             {
                 "color": "#36a64f ",
                 "title": title,
                 "title_link": "https://api.slack.com/",
                 "text": bid,
                 "ts": Date.now()
             }
         ]
   };

   return json;
}

var buildError = function(error){
  var json = {
        //"response_type": "in_channel",
        "attachments": [
             {
                 "color": "#36a64f ",
                 "title": error.name,
                 "title_link": "https://api.slack.com/",
                 "text": error.message,
                 "ts": Date.now()
             }
         ]
   };

   return json;
}


module.exports = {
  buildMessage: buildMessage,
  buildError: buildError
};