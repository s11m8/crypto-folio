import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import moment from 'moment';
import Enumerable from 'linq';
import c3 from 'd3';

//import { ReactiveDict } from 'meteor/reactive-dict';

import { Currency } from '../api/tasks.js';

//import './task.js';
import './body.html';

 cmc = undefined ;

 var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

Template.body.helpers({

  getCoinMarketCapTicker: function() {
    return Template.instance().getCoinMarketCapTicker.get();
  },

  getCurrency: function() {
    return Currency.find({owner : Meteor.userId()});
  },

  getValue: function(ticker, amount){
     //var query = Enumerable.from(json).select(function(x) {return x.id}).toArray();
     var cmc = Template.instance().getCoinMarketCapTicker.get();
     var query = Enumerable.from(cmc).where(function(x) {return x.id == ticker}).toArray() ;
    return  Math.round((query[0].price_usd * amount *100)/100)
   },

   getSum: function(){
     //var query = Enumerable.from(json).select(function(x) {return x.id}).toArray();
      var result = Currency.find({owner : Meteor.userId()}).fetch();
     // console.log(result);
      var cmc = Template.instance().getCoinMarketCapTicker.get();
     // console.log(cmc);
      tickers = Enumerable.from(result).select(function(x) {return x.currency}).toArray();
    //  console.log(tickers);
      // query = Enumerable.from(cmc).where(function(x) {
      //   return Enumerable.from(tickers).contains(x.id)})
      //   .select(function(x) {
      //     return parseFloat(x.price_usd) * parseFloat(Enumerable.from(tickers).where(function(y) {return y.currency = x.id}).toArray()[0].amount)
      //   })
      //   .sum();

        query = Enumerable.from(cmc).where(function(x) { return Enumerable.from(result).select(function(x) {return x.currency}).contains(x.id)})
                                   .select(function(x) { return parseFloat(x.price_usd) * parseFloat(Enumerable.from(result).where(function(y) {return y.currency  == x.id}).toArray()[0].amount) })
                                   .sum()
        ;
     // console.log(query);

      return Math.round(query);
    },

    myChartData: function() {

      $(function() {
          $("#js-example-basic-multiple").select2();
      });

      var result = null;
      var cmc = null;
      var tickers = null ;
      var query = null;

      result = Currency.find({owner : Meteor.userId()}).fetch();
     // console.log(result);
      cmc = Template.instance().getCoinMarketCapTicker.get();
     // console.log(cmc);
      tickers = Enumerable.from(result).select(function(x) {return x.currency}).toArray();

      query = Enumerable.from(cmc).where(function(x) { return Enumerable.from(result).select(function(x) {return x.currency}).contains(x.id)})
                                   .select(function(x) { return { 'key': x.id,
                                                                   'value': (parseFloat(x.price_usd) *
                                                                          parseFloat(Enumerable.from(result).where(function(y) {return y.currency  == x.id}).toArray()[0].amount) )
                                                                };
                                                        }).orderByDescending(function(x) {return x.value}).toArray();


      var data = {};
      var currencies = [];
      query.forEach(function(e) {
          currencies.push(e.key);
          data[e.key] = e.value;
      })


        return {
            data: {
                json: [ data ],
                keys: {
                    value: currencies,
                },
                type: 'donut'
            }


        };
    }

});


  Template.body.created = async function() {
    this.getCoinMarketCapTicker = new ReactiveVar([]);

    var self = this;
    Meteor.call('getCoinMarketCapTicker', function(error, result) {
      if (result)
        self.getCoinMarketCapTicker.set(result);
    });

    // let res = await Meteor.call('getCoinMarketCapTicker') ;
    // console.log(res)

    self.getCoinMarketCapTicker.set(res);


  };




Template.body.events({


   'touchstart .new-duell'() {
      event.preventDefault();
      var answer = 'buzzer';
      Meteor.call('pressBuzzer',answer, Meteor.userId(), Meteor.user().username, Meteor.user().profile.team);
   },

   'submit #addCurrency'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    var target = event.target;
    //var id = target.tId.value;
    var currency = target.currency.value;
    var amount = target.amount.value;
    Meteor.call('addCurrency', currency, amount, Meteor.userId(), Meteor.user().username );
    },

   'keyup .changeAmount'(event) {
      event.preventDefault();
      var target = event.target;
      var amount = target.value;
      var id = this._id

      return delay(function(){
        Meteor.call("changeAmount", id, amount);
      }, 500);
     },

     'submit .changeAmount'(event) {
      event.preventDefault();
      Meteor.call("removeCurrency", this._id)

     },
  });



 Template.registerHelper('equals', function (a, b) {
      return a === b;
    });

 Template.body.onRendered(function() {
  $(function() {
      $("#js-example-basic-multiple").select2();
  });
});
