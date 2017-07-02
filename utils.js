/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const flowPayload = require('./flows.js');
const request = require('request');

const handlers = {
  'personaliseFlowConfig': function (deviceId) {
    var flowStr = JSON.stringify(flowPayload);
    var newFlowStr = flowStr.replace(/{topic_placeholder}/gi, deviceId);
    return newFlowStr;
  },
  'searchVideoOnYoutube' : function (keyword, youtubeApiKey, callback) {
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
  }
};

module.exports = handlers;
