'use strict';

const flows = [
    {
        "id": "39a01ee2.7e2ca2",
        "type": "template",
        "z": "62c2e51b.c3e4dc",
        "name": "sed template",
        "field": "payload",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "'s/{topic_placeholder}/{{payload}}/g'",
        "x": 537,
        "y": 655,
        "wires": [
            [
                "61bd4f98.67796"
            ]
        ]
    },
    {
        "id": "61bd4f98.67796",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "sed -i",
        "addpay": true,
        "append": "/home/pi/.node-red/flows_*.json",
        "useSpawn": "",
        "timer": "",
        "name": "sed file",
        "x": 219,
        "y": 763,
        "wires": [
            [
                "ac4b0a0.2d27cf8",
                "4511038e.373c1c",
                "d31ad477.1bf9e8"
            ],
            [],
            []
        ]
    },
    {
        "id": "152be400.c0bc8c",
        "type": "tail",
        "z": "62c2e51b.c3e4dc",
        "name": "monitor log",
        "filetype": "text",
        "split": true,
        "filename": "/var/log/daemon.log",
        "x": 82,
        "y": 658,
        "wires": [
            [
                "a99fa5f2.a5c388"
            ]
        ]
    },
    {
        "id": "a99fa5f2.a5c388",
        "type": "switch",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "cont",
                "v": "amzn1.ask.device",
                "vt": "str"
            }
        ],
        "checkall": "false",
        "outputs": 1,
        "x": 225,
        "y": 657,
        "wires": [
            [
                "a696d434.5c1ea8"
            ]
        ]
    },
    {
        "id": "a696d434.5c1ea8",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "get deviceId",
        "func": "var payload = msg.payload;\nvar idx = payload.lastIndexOf(\":\");\nvar deviceId = payload.slice(idx+3, -2);\nmsg.payload = deviceId;\nmsg.payload.lastIndexOf(\":\")\n//var newmsg = {\"payload\": msg.payload.replace('\"textField\": /\"',\"\")};\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 368,
        "y": 655,
        "wires": [
            [
                "39a01ee2.7e2ca2"
            ]
        ]
    },
    {
        "id": "2d3828d.c662ad8",
        "type": "http request",
        "z": "62c2e51b.c3e4dc",
        "name": "reload flow config",
        "method": "POST",
        "ret": "txt",
        "url": "http://localhost:1880/flows",
        "tls": "",
        "x": 661,
        "y": 819,
        "wires": [
            []
        ]
    },
    {
        "id": "d31ad477.1bf9e8",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "msg.payload = '';\nmsg.headers = {\n    \"Content-type\": \"application/json\",\n    \"Node-RED-Deployment-Type\": \"reload\"\n};\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 387,
        "y": 767,
        "wires": [
            [
                "ac4b0a0.2d27cf8",
                "3ccf1a62.7dfcd6"
            ]
        ]
    },
    {
        "id": "4511038e.373c1c",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "var msg = {\"payload\": \"Setup is completed.\"}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 426,
        "y": 888,
        "wires": [
            [
                "712477c3.9512e8"
            ]
        ]
    },
    {
        "id": "712477c3.9512e8",
        "type": "mqtt out",
        "z": "62c2e51b.c3e4dc",
        "name": "publish setup status",
        "topic": "{topic_placeholder}/status/setup",
        "qos": "1",
        "retain": "true",
        "broker": "b56f6d3d.b7373",
        "x": 634,
        "y": 888,
        "wires": []
    },
    {
        "id": "eadffa8c.fd8c98",
        "type": "mqtt in",
        "z": "62c2e51b.c3e4dc",
        "name": "Receives new flow",
        "topic": "{topic_placeholder}/command/flows",
        "qos": "1",
        "broker": "b56f6d3d.b7373",
        "x": 95,
        "y": 831,
        "wires": [
            [
                "78301ac9.c11cc4",
                "4511038e.373c1c"
            ]
        ]
    },
    {
        "id": "78301ac9.c11cc4",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "msg.headers = {\n    \"Content-type\": \"application/json\",\n    \"Node-RED-Deployment-Type\": \"full\"\n};\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 284,
        "y": 831,
        "wires": [
            [
                "3ccf1a62.7dfcd6"
            ]
        ]
    },
    {
        "id": "3ccf1a62.7dfcd6",
        "type": "delay",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "pauseType": "delay",
        "timeout": "2",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "x": 575.5,
        "y": 766,
        "wires": [
            [
                "2d3828d.c662ad8"
            ]
        ]
    },
    {
        "id": "b56f6d3d.b7373",
        "type": "mqtt-broker",
        "z": "",
        "broker": "broker.mqttdashboard.com",
        "port": "1883",
        "clientid": "",
        "usetls": false,
        "compatmode": false,
        "keepalive": "60",
        "cleansession": true,
        "willTopic": "",
        "willQos": "0",
        "willPayload": "",
        "birthTopic": "",
        "birthQos": "0",
        "birthPayload": ""
    }
]

module.exports = flows;
