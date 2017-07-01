/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
* Author: Alfvin Ridwanto
* Lambda service for Raspberry Pi Alexa Skill
**/

'use strict';

const Alexa = require('alexa-sdk');
const mqtt = require('mqtt');
const request = require('request');

var deviceId, iotBrokerURL, iotTopicPrefix, youtubeApiKey;
const connectOptions = {}; // TODO provide options specific to your MQTT broker (optional)
const languageStrings = require('resource.js');
var ip, tvStatus;
const Topic = {
  "tv": "/tv",
  "ip": "/ip_address"
};

var connectToIot = function(topic, callback) {
  var client  = mqtt.connect(iotBrokerURL, connectOptions);
  client.on('connect', function () {
    console.log('mqtt connected');
    client.subscribe(iotTopicPrefix + '/status' + topic, {"qos": 1});
    return callback(client);
  });
};

var mqttPublish = function(client, topic, payload) {
  client.publish(iotTopicPrefix + topic, payload);
};

var searchVideoOnYoutube = function(keyword, callback) {
  var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=' + youtubeApiKey;
  url += '&q=' + keyword;
  request(url, function (error, response, body) {

    var jsonBody = JSON.parse(body);
    var videoIds = [];
    if (body.items !== null) {
      jsonBody.items.forEach(function(item) {
         videoIds.push(item.id.videoId);
       });
    }
    return callback(videoIds);
  });
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('doGreetings');
  },
  'getInfoIntent' : function () {
    this.emit('getInfo');
  },
  'playVideoIntent': function() {
    const handler = this;
    const dialogState = this.event.request.dialogState;
    if (dialogState === 'STARTED' || dialogState === 'IN_PROGRESS') {
      this.emit(':delegate');
    } else {
      var infoSlot = this.event.request.intent.slots['songTitle'];
      var slotValue;
      if (infoSlot && infoSlot.value) {
        slotValue = infoSlot.value.toLowerCase();
      }
      console.log(slotValue);

      searchVideoOnYoutube(slotValue, function(videoIds) {
        connectToIot(Topic.tv, function(client) {
          videoIds.forEach(function(videoId) {
            mqttPublish(client, '/command/play', videoId);
          });
          const speechOutput = 'The video you requested will be played in a moment';
          handler.emit(':tell', speechOutput);
        });
      });
    }

  },
  'turnOnTvIntent': function() {
    const handler = this;
    connectToIot(Topic.tv, function(client) {
      mqttPublish(client, '/command', 'tv on');
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
    connectToIot(Topic.tv, function(client) {
      mqttPublish(client, '/command', 'tv off');
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

    connectToIot(Topic.tv, function(client) {
      mqttPublish(client, '/command', 'tv status');
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
      this.emit('doGreetings');
    }
  },
  'getIP': function(slotValue) {
    console.log(slotValue);
    const infoArr = this.t('INFO');
    const infoAnswer = infoArr[slotValue];
    const getIPHandler = this;
    connectToIot(Topic.ip, function(client) {
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
    const speechOutput = this.t('COMMANDS_MESSAGE');
    this.emit(':tell', speechOutput);
  },
  'doGreetings' : function() {
    const speechOutput = this.t('GREETING_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.emit(':ask', speechOutput, reprompt);
  },
  'setupflowIntent' : function() {
    this.emit(':tellWithCard', 'setup is completed. please restart your node-red', this.t('SKILL_NAME'), deviceId);
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

var checkDeviceId = function(event) {
  if (typeof event.context !== "undefined") {
    deviceId = event.context.System.device.deviceId;
  }
  if (typeof deviceId === "undefined") {
    iotTopicPrefix = process.env.TOPIC_PREFIX;
  } else {
    iotTopicPrefix = deviceId;
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = process.env.APP_ID;

  checkDeviceId(event);

  iotBrokerURL = process.env.BROKER_URL;
  youtubeApiKey = process.env.YOUTUBE_API_KEY;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
