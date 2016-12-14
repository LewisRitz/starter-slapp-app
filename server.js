
'use strict'
const express = require('express');
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser');
var response_builder = require('./slack_response_builder');
var slack_controller = require('./slack_controller');
var error_handler = require('./error_handler.js');
var translator = require('./translator');

//if (!process.env.PORT) throw Error('PORT missing but requried');

var options = {
  host: "http://lb-internal-int:5080",
  path: "/latestrates?indexids=12"
};

var test_availableOptions1 = {
    text: "Commands List",
    attachments: [
        {
            text: "Click to get further help",
      fallback: "You are unable to choose a command",
      callback_id: "help_commands",
      color : "#3AA3E3",
      attachment_type: "default",
      actions: [
        {
          name:"treasuries",
          text:"treasuries",
          type:"button",
          value:"treasuries"
        },{
          name:"ir",
          text:"ir",
          type:"button",
          value:"ir"
        },{
          name:"swapRate",
          text:"swapRate",
          type:"button",
          value:"swapRate"
        },{
          name:"swapSpread",
          text:"swapSpread",
          type:"button",
          value:"swapSpread"
        },{
          name:"fx",
          text:"fx",
          type:"button",
          value:"fx"
        }
      ]
        }
    ]
}


var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

//app.get("http://lb-internal-int:5080/latestrates?indexids=12")


// slapp.message('rates (.*)', ['direct_message'], (msg, text, match1) => {
//   if (Number.isInteger(parseInt(match1))) {
//     console.log("handling rates call");
//     msg.say('Retrieving rates for indexId: '+match1);
//     var baseRatesUrl = "http://lb-internal-int:5080/latestrates?indexids=";
//     var index = parseInt(match1);
//     request(baseRatesUrl+index, function(error, response, body) {
//       if (!error && response.statusCode == 200) {
//           var data = JSON.parse(body);
//           console.log(data[0]);
//           console.log(data[0].IndexId);
//           msg.say('IndexId: '+data[0].IndexId);
//           msg.say('Bid: '+data[0].Bid);
//           msg.say('Mid: '+data[0].Mid);
//           msg.say('Ask: '+data[0].Ask);
//           msg.say('Source: '+data[0].Source);
//           msg.say('End Of Day: '+data[0].EndOfDayBit);
//           var date = new Date(data[0].UtcTimestamp);
//           msg.say('Timestamp: '+formatDate(date));
//         }
//     });
//   } else {
//     msg.say('Invalid Input: must enter an integer index id instead of: '+match1);
//   }
// });



var formatDate = function(date){
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  var hour = date.getHours().toString();
  var min = date.getMinutes().toString();
  var second = date.getSeconds().toString();
  return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second;
}

var helpInputHandler = function(){
  console.log("halp input handler");
};
var dataCommandsHanlder = function(){
  console.log("data commands handler");
};
var dataButtonsHanlder = function(){
  console.log("data buttons handler");
};

var MESSAGETYPES = {
  HELPINPUTS: { name: "helpInputS", handler: helpInputHandler },
  DATACOMMANDS: { name: "dataCommands", handler: dataCommandsHanlder },
  DATABUTTONS: { name: "dataButtons", handler: dataButtonsHanlder }
};
var possibleCommands = [
  { inputStrings: [{value: ""}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "ust"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "index"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swap"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swapspread"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "fx"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "ust"}, {value: "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "index"},{value: "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swap"}, {value: "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swapspread"}, {value: "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "fx"}, {value: "help"}], group: MESSAGETYPES.DATABUTTONS, inputSlots: 1 },
  { inputStrings: [{value: "ust"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "index"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "swap"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "swapspread"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "fx"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 }
];

app.post('/', function(req, res){
  console.log("in here");
  console.log(req.body);

    try {
      slack_controller.processSlack(req, res);
    } catch (error) {
      handleError(response_builder.buildError(error));
    }
    

});



app.get('/', function(req, res){
  res.send('Hello')
});

console.log('Listening on :' + 8081);
app.listen(8081);
// console.log('Listening on :' + process.env.PORT);
// app.listen(process.env.PORT);