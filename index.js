/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
* Author: Alfvin Ridwanto
* Lambda service for Raspberry Pi Alexa Skill
**/

'use strict';

const Alexa = require('alexa-sdk');
const mqtt = require('mqtt');
// const http = require('http');
const request = require('request');

const APP_ID = '';  // TODO replace with your app ID.
const iotTopicPrefix = ''; //TODO replace with your own topic
const iotBrokerURL = 'mqtt://iot.eclipse.org'; // TODO replace with your MQTT broker
const connectOptions = {}; // TODO provide options specific to your MQTT broker (optional)
const languageStrings = require('resource.js');
var ip, tvStatus;

var connectToIot = function(topic, callback) {
  var client  = mqtt.connect(iotBrokerURL, connectOptions);
  client.on('connect', function () {
    console.log('mqtt connected');
    client.subscribe(iotTopicPrefix + topic, {"qos": 1});
    return callback(client);
  });
};

var mqttPublish = function(client, topic, payload) {
  client.publish(iotTopicPrefix + topic, payload);
};

var searchVideoOnYoutube = function(keyword, callback) {
  var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyCNxVsygViPBE4gGIiUJlDCgSu7MZ4K_a8';
  url += '&q=' + keyword;
  request(url, function (error, response, body) {

    var jsonBody = JSON.parse(body);
    var videoIds = [];
    if (body.items !== null) {
      // console.log(body.items[0].id.videoId);
      jsonBody.items.forEach(function(item) {
         videoIds.push(item.id.videoId);
       });
    }
    return callback(videoIds);
  });
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetCommands');
  },
  'getInfoIntent' : function () {
    this.emit('getInfo');
  },
  'playVideoIntent': function() {
    const handler = this;
    var infoSlot = this.event.request.intent.slots['songTitle'];
    var slotValue;
    if (infoSlot && infoSlot.value) {
      slotValue = infoSlot.value.toLowerCase();
    }
    console.log(slotValue);

    searchVideoOnYoutube(slotValue, function(videoIds) {
      connectToIot('/tv', function(client) {
        videoIds.forEach(function(videoId) {
          mqttPublish(client, '/command/play', videoId);
          // client.publish('alfvin_pi/command/play', videoId);
        });
        const speechOutput = 'Your request is my command';
        handler.emit(':tell', speechOutput);
      });
    });

  },
  'turnOnTvIntent': function() {
    const handler = this;
    connectToIot('/tv', function(client) {
      mqttPublish(client, '/command', 'tv on');
      // client.publish('alfvin_pi/command', 'tv on');
      client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString());
        tvStatus = message.toString();
        client.end();
        const speechOutput = "Response: " + tvStatus.replace("'C\n","");
        handler.emit(':tell', speechOutput);
      });
    });
  },
  'turnOffTvIntent': function() {
    const handler = this;
    connectToIot('/tv', function(client) {
      mqttPublish(client, '/command', 'tv off');
      // client.publish('alfvin_pi/command', 'tv off');
      client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString());
        tvStatus = message.toString();
        client.end();
        const speechOutput = "Response: " + tvStatus.replace("'C\n","");
        handler.emit(':tell', speechOutput);
      });
    });
  },
  'getTvStatus': function() {
    const handler = this;

    connectToIot('/tv', function(client) {
      mqttPublish(client, '/command', 'tv status');
      // client.publish('alfvin_pi/command', 'tv status');
      client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString());
        tvStatus = message.toString();
        client.end();
        const speechOutput = "The tv status is " + tvStatus.replace("'C\n","");
        handler.emit(':tell', speechOutput);
      });
    });
  },
  'getInfo' : function() {
    var infoSlot = this.event.request.intent.slots['officeInfo'];
    var slotValue;
    if (infoSlot && infoSlot.value) {
      slotValue = infoSlot.value.toLowerCase();
    }
    console.log('slotValue: ' + slotValue);

    switch (slotValue) {
      case "ip":
        this.emit('getIP', slotValue);
        break;
      case "ip address":
        this.emit('getIP', slotValue);
        break;
      case "tv":
        this.emit('getTvStatus', slotValue);
        break;
      case "tv status":
        this.emit('getTvStatus', slotValue);
        break;
      default:
      this.emit('GetCommands');
    }
  },
  'getIP': function(slotValue) {
    console.log(slotValue);
    const infoArr = this.t('INFO');
    const infoAnswer = infoArr[slotValue];
    const getIPHandler = this;
    connectToIot('/ip_address', function(client) {
      client.on('message', function (topic, message) {
        // message is Buffer
        ip = message.toString();
        client.end();
        const speechOutput = infoAnswer + ip.replace("'C\n","");
        getIPHandler.emit(':tell', speechOutput);
      });
    });
  },
  'getCommandsIntent' : function() {
    this.emit('GetCommands');
  },
  'GetCommands' : function() {

    const speechOutput = this.t('GET_COMMANDS_MESSAGE');
    this.emit(':ask', speechOutput, speechOutput);
    // this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  "Unhandled": function() {
    var intentName = this.event.request.intent.name
    console.log("Unhandled intent: "+ this.event.request.intent.name);
    this.emit(":tell", "Sorry, I don't know about " + intentName);
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
