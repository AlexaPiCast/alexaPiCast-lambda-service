# alexaPiCast-lambda-service
AlexaPiCast service endpoint

Change these lines in index.js before deployed to lambda.

<code>

const APP_ID = '';  // TODO replace with your app ID.

const iotTopicPrefix = ''; //TODO replace with your own topic

const iotBrokerURL = 'mqtt://iot.eclipse.org'; // TODO replace with your MQTT broker

const connectOptions = {}; // TODO provide options specific to your MQTT broker (optional)

</code>
