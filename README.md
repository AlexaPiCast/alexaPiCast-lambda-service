# alexaPiCast-lambda-service
AlexaPiCast service endpoint

Set Lambda environment variables (process.env) to your own values for:
* APP_ID
* BROKER_URL
* YOUTUBE_API_KEY

## Search & play video from Youtube
It uses Google Youtube API to search video by the keyword. Get your API key from Google developer console.

## Node-RED flows
In order for the skill to be able to perform first-time setup & OTA upgrade, node-RED in your Raspberry Pi should be running flow defined in basicflow.js
