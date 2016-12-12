// 'use strict'

// const express = require('express')
// const Slapp = require('slapp')
// const ConvoStore = require('slapp-convo-beepboop')
// const Context = require('slapp-context-beepboop')

// // use `PORT` env var on Beep Boop - default to 3000 locally
// var port = process.env.PORT || 3000

// var slapp = Slapp({
//   // Beep Boop sets the SLACK_VERIFY_TOKEN env var
//   verify_token: process.env.SLACK_VERIFY_TOKEN,
//   convo_store: ConvoStore(),
//   context: Context()
// })


// var HELP_TEXT = `
// I will respond to the following messages:
// \`help\` - to see this message.
// \`hi\` - to demonstrate a conversation that tracks state.
// \`thanks\` - to demonstrate a simple response.
// \`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
// \`attachment\` - to see a Slack attachment message.
// `

// //*********************************************
// // Setup different handlers for messages
// //*********************************************

// // response to the user typing "help"
// slapp.message('help', ['mention', 'direct_message'], (msg) => {
//   msg.say(HELP_TEXT)
// })

// // "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
// slapp
//   .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
//     msg
//       .say(`${text}, how are you?`)
//       // sends next event from user to this route, passing along state
//       .route('how-are-you', { greeting: text })
//   })
//   .route('how-are-you', (msg, state) => {
//     var text = (msg.body.event && msg.body.event.text) || ''

//     // user may not have typed text as their next action, ask again and re-route
//     if (!text) {
//       return msg
//         .say("Whoops, I'm still waiting to hear how you're doing.")
//         .say('How are you?')
//         .route('how-are-you', state)
//     }

//     // add their response to state
//     state.status = text

//     msg
//       .say(`Ok then. What's your favorite color?`)
//       .route('color', state)
//   })
//   .route('color', (msg, state) => {
//     var text = (msg.body.event && msg.body.event.text) || ''

//     // user may not have typed text as their next action, ask again and re-route
//     if (!text) {
//       return msg
//         .say("I'm eagerly awaiting to hear your favorite color.")
//         .route('color', state)
//     }

//     // add their response to state
//     state.color = text

//     msg
//       .say('Thanks for sharing.')
//       .say(`Here's what you've told me so far: \`\`\`${JSON.stringify(state)}\`\`\``)
//     // At this point, since we don't route anywhere, the "conversation" is over
//   })

// // Can use a regex as well
// slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
//   // You can provide a list of responses, and a random one will be chosen
//   // You can also include slack emoji in your responses
//   msg.say([
//     "You're welcome :smile:",
//     'You bet',
//     ':+1: Of course',
//     'Anytime :sun_with_face: :full_moon_with_face:'
//   ])
// })

// // demonstrate returning an attachment...
// slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
//   msg.say({
//     text: 'Check out this amazing attachment! :confetti_ball: ',
//     attachments: [{
//       text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
//       title: 'Slapp Library - Open Source',
//       image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
//       title_link: 'https://beepboophq.com/',
//       color: '#7CD197'
//     }]
//   })
// })

// // Catch-all for any other responses not handled above
// slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
//   // respond only 40% of the time
//   if (Math.random() < 0.4) {
//     msg.say([':wave:', ':pray:', ':raised_hands:'])
//   }
// })

// // attach Slapp to express server
// var server = slapp.attachToExpress(express())

// // start http server
// server.listen(port, (err) => {
//   if (err) {
//     return console.error(err)
//   }

//   console.log(`Listening on port ${port}`)
// })


'use strict'
const express = require('express');
const http = require('http');
const request = require('request');
const Slapp = require('slapp');
const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');
const bodyParser = require('body-parser');
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

var slapp = Slapp({
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
});

var app = slapp.attachToExpress(express());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("http://lb-internal-int:5080/latestrates?indexids=12")

slapp.message('hi (.*)', ['direct_message'], (msg, text, match1) => {
  msg.say('How are you?').route('handleHi', { what: match1 })
});

slapp.route('handleHi', (msg, state) => {
  msg.say(':smile:' + state.what)
});

slapp.message('rates (.*)', ['direct_message'], (msg, text, match1) => {
  if (Number.isInteger(parseInt(match1))) {
    console.log("handling rates call");
    msg.say('Retrieving rates for indexId: '+match1);
    var baseRatesUrl = "http://lb-internal-int:5080/latestrates?indexids=";
    var index = parseInt(match1);
    request(baseRatesUrl+index, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          console.log(data[0]);
          console.log(data[0].IndexId);
          msg.say('IndexId: '+data[0].IndexId);
          msg.say('Bid: '+data[0].Bid);
          msg.say('Mid: '+data[0].Mid);
          msg.say('Ask: '+data[0].Ask);
          msg.say('Source: '+data[0].Source);
          msg.say('End Of Day: '+data[0].EndOfDayBit);
          var date = new Date(data[0].UtcTimestamp);
          msg.say('Timestamp: '+formatDate(date));
        }
    });
  } else {
    msg.say('Invalid Input: must enter an integer index id instead of: '+match1);
  }
});



var formatDate = function(date){
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  var hour = date.getHours().toString();
  var min = date.getMinutes().toString();
  var second = date.getSeconds().toString();
  return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second;
}

var helpInputHanlder = function(){
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
  { inputStrings: [{value: "ust", "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "index", "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swap", "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "swapspread", "help"}], group: MESSAGETYPES.DATABUTTONS },
  { inputStrings: [{value: "fx", "help"}], group: MESSAGETYPES.DATABUTTONS, inputSlots: 1 },
  { inputStrings: [{value: "ust"}, {match: true}] group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "index"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "swap"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "swapspread"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 },
  { inputStrings: [{value: "fx"}, {match: true}], group: MESSAGETYPES.DATACOMMANDS, inputSlots: 1 }
];

app.post('/', function(req, res){
  console.log("in here");
  console.log(req.body);
  var responseObj = {
    response_type: "in_channel",
    text: "It's 80 degrees right now.",
    attachments: [
      {
        text: "Partly cloudy today and tomorrow"
      }
    ]
  }
  res.send(test_availableOptions1);
});

app.get('/', function(req, res){
  res.send('Hello')
});

console.log('Listening on :' + 8081);
app.listen(8081);
// console.log('Listening on :' + process.env.PORT);
// app.listen(process.env.PORT);