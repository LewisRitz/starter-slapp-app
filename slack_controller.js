var processSlack = function(req, res){

    var errorMsg = "";

    // var e = new Error("You did the wrong thing");
    // e.name = "UserInputError";

    try {
    var ric = translator.getRic(req.body.text);
    console.log("RIC", ric);
    } catch (error) {
      handleError(response_builder.buildError(error));
      return;
    }

    var baseRatesUrl = "http://lb-internal-int.chathamfinancial.com:5128/tick?Ric=" + ric;
    request(baseRatesUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.log("data", data);
            //console.log("data.DataFields.ASK", data.DataFields.ASK);

            var response;

            try {
              response = response_builder.buildMessage("Test Rate", data.DataFields.SEC_ACT_1, data.DataFields.SEC_ACT_1);     
            } catch (error) {
              errorMsg = error;
            }

            if (errorMsg != ""){
              console.log("found an error : " + errorMsg);
              response = errorMsg;
            }

            res.send(response);
        } else {
            //respond_with_error(error);
        }
    });
}

module.exports = {
	processSlack: processSlack
}