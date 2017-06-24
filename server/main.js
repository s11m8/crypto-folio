//import XMLHttpRequest from 'xmlhttprequest';
//import '../imports/api/rai/rai.extended.js';
//import '../imports/api/rai/rai.community.js';
import '../imports/api/tasks.js';
import { Currency } from '../imports/api/tasks.js';
import { Session } from 'meteor/session'
import Enumerable from 'linq';

Meteor.startup(function() {});



Meteor.methods({

  'getCoinMarketCapTicker': function() {


    result = HTTP.call("GET", "https://api.coinmarketcap.com/v1/ticker?limit=500", {}) 
    return JSON.parse(result.content)


    // return HTTP.call("GET", "https://api.coinmarketcap.com/v1/ticker?limit=3", {}, (error, result) => {
    //   if (!error) {
    //     console.log(result.content)
    //     return JSON.parse(result.content)
    //   } else {
    //     throw "Coinmarketcap down! No Prices available"
    //   }
    // });



    //
    //  var json = JSON.parse(result.content)
    //  //var query = Enumerable.from(json).select(function(x) {return x.id}).toArray();
    //
    //  //console.log(json);
    //  ////console.log(json.items[0].statistics.viewCount);
    //  return json ;

    //return 2720667887
  },


  'addCurrency': function(currency, amount, uId, uName) {


    Currency.insert({
      currency,
      amount,
      createdAt: new Date(), // current time
      owner: uId,
      username: uName,
      active: true
    });

  },
  'removeCurrency': function(_id) {

    Currency.remove({ _id });

  },

  'changeAmount': function(_id, amount) {
    console.log(_id);
    Currency.update({ _id }, { $set: { amount } });

  },

  'pressBuzzer': function(uAnswer, uId, uName, uTeam) {

    // Get value from form element

    var currentRound = Rounds.find().count();
    var roundType = Rounds.findOne({ value: { $eq: currentRound } }).type;
    // Insert a task into the collection

    Answers.insert({
      answer: uAnswer,
      round: currentRound,
      roundType,
      createdAt: new Date(), // current time
      owner: uId,
      username: uName,
      team: uTeam,
    });
  },


});
