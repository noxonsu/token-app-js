const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

var rp = require('request-promise-native');
let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  welcome(session)
}

function onCommand(session, command) {
  if (command.content.value.match(/set=/)) {
    var set = command.content.value.split('=');
     session.reply(SOFA.Message({
                body: "Saved, you will notified with result",
                showKeyboard: false,
         })); 
  }
  
  if (command.content.value.match(/match=/)) {
    //console.log(command.content.value);
    var match = command.content.value.replace('match=','');
    var url = 'http://noxonfund.com/tokenbrowser/p.php?match='+match;
      console.log(url);
      rp(url)
      .then((body) => {
         
         let controls2 = new Array();
         let freshRates = JSON.parse(body);//.data.rates
         console.log(freshRates);
         
         controls2.push({type: 'button', label: 'Second team win = (x'+freshRates[923]+")", value: 'set='+freshRates.id+'=923'});
         controls2.push({type: 'button', label: 'Draw (x'+freshRates[922]+")", value: 'set='+freshRates.id+'=922'});
         controls2.push({type: 'button', label: 'First team win = (x'+freshRates[921]+")", value: 'set='+freshRates.id+'=921'});


         console.log(controls2);
         
          session.reply(SOFA.Message({
                body: "Your prediction?",
                controls: controls2,
                showKeyboard: false,
         }));   

        });
  }
  if (command.content.value.match(/liga=/)) {
<<<<<<< HEAD
      var url = 'http://noxonfund.com/tokenbrowser/p.php?l='+command.content.value.replace('liga=','');
      console.log(url);
      rp(url)
      .then((body) => {
         
         let controls2 = new Array();
         let freshRates = JSON.parse(body);//.data.rates
          console.log(freshRates);
          freshRates.forEach(function(item, i, arr) {
            controls2.push({type: 'button', label: item.match, value: 'match='+item.id});
          });
         
          session.reply(SOFA.Message({
            body: 'Select Match',
            controls: controls2,
            showKeyboard: true,
          }));  
        });
=======
    session.reply(SOFA.Message({
            body: "liga",
            showKeyboard: false,
          }));    
>>>>>>> parent of 2ea065e... Update bot.js
  }
  switch (command.content.value) {
    case 'ping':
        
       rp('http://noxonfund.com/tokenbrowser/p.php')
      .then((body) => {
         
         let controls2 = new Array();
         let freshRates = JSON.parse(body);//.data.rates
          
          freshRates.forEach(function(item, i, arr) {
           // alert( i + ": " + item + " (массив:" + arr + ")" );
            controls2.push({type: 'button', label: item, value: 'liga='+item});
            
          });
         
          session.reply(SOFA.Message({
            body: "yep",
            controls: controls2,
            showKeyboard: false,
          }));
      });
      

      
      break
    case 'count':
      count(session)
      break
    case 'donate':
      donate(session)
      break
    
    case 'info': 
      sendMessage(session, `1. Use intuition. \n 2. Use data mining. \n 3. Take more risk for fast growing (1.2*2.1*2.1=5.292 vs. 2.5x9.2=23)`)
      break;
    
    case 'top': 
      sendMessage(session, `Take more risk for fast growing (1.2*2.1*2.1=5.292 vs. 2.5x9.2=23)`)
      break;
  }
}

function onPayment(session) {
  sendMessage(session, `Thanks for the payment! 🙏`)
}

// STATES

function welcome(session) {
  console.log(session);
  sendMessage(session, `Make prediction on ⚽️ match! Each win increases your points.`)
}

function pong(session) {
  sendMessage(session, `Pong`)
}

// example of how to store state on each user
function count(session) {
  let count = (session.get('count') || 0) + 1
  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}

// HELPERS

function sendMessage(session, message) {
  //console.log("bot send",bot.client.send('0x9a1aef1477ea6758f6c1e6549f38a58c0ab35197', "hi"));
  
  /* \m/ syle */
  
  /*
 rp('http://noxonfund.com/tokenbrowser/messagepull.php')
      .then((body) => {
         let controls2 = new Array();
         let msgpull = JSON.parse(body);//.data.rates 
        console.log(msgpull);
   
         if (msgpull!=null) { 
              msgpull.forEach(function(item, i, arr) {
                console.log(item);
              });
         }
   
  });
  */
  
  
  let controls = [
    {type: 'button', label: 'Make Prediction', value: 'ping'},
    {type: 'button', label: 'Top', value: 'top'},
    {type: 'button', label: 'Gow to', value: 'info'}
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
