/* eslint-disable  max-lines */

'use strict';

const flows = [
    {
        "id": "62c2e51b.c3e4dc",
        "type": "tab",
        "label": "Flow 1"
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
    },
    {
        "id": "20262a17.04fc86",
        "type": "mqtt out",
        "z": "62c2e51b.c3e4dc",
        "name": "Publish IP Address",
        "topic": "{topic_placeholder}/status/ip_address",
        "qos": "1",
        "retain": "true",
        "broker": "b56f6d3d.b7373",
        "x": 650,
        "y": 185,
        "wires": []
    },
    {
        "id": "6c1e51c1.f39f8",
        "type": "inject",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "",
        "crontab": "",
        "once": false,
        "x": 327,
        "y": 102,
        "wires": [
            [
                "4be250f0.a27cc"
            ]
        ]
    },
    {
        "id": "4be250f0.a27cc",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "hostname -I",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "get IP address",
        "x": 278.5,
        "y": 185.5,
        "wires": [
            [
                "f28e519f.1714"
            ],
            [],
            []
        ]
    },
    {
        "id": "ac4b0a0.2d27cf8",
        "type": "debug",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "payload",
        "x": 661.5,
        "y": 444,
        "wires": []
    },
    {
        "id": "f28e519f.1714",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "transform",
        "func": "var newmsg = {\"payload\": msg.payload.replace(\"'C\\n\",\"\")};\nreturn newmsg;",
        "outputs": 1,
        "noerr": 0,
        "x": 454,
        "y": 185,
        "wires": [
            [
                "20262a17.04fc86",
                "ac4b0a0.2d27cf8"
            ]
        ]
    },
    {
        "id": "f7863907.d264a8",
        "type": "mqtt in",
        "z": "62c2e51b.c3e4dc",
        "name": "Receives command",
        "topic": "{topic_placeholder}/command",
        "qos": "1",
        "broker": "b56f6d3d.b7373",
        "x": 102,
        "y": 105,
        "wires": [
            [
                "88af6278.d3bb"
            ]
        ]
    },
    {
        "id": "88af6278.d3bb",
        "type": "switch",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "kickoff",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "tv status",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "tv on",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "tv off",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "reboot",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "halt",
                "vt": "str"
            }
        ],
        "checkall": "false",
        "outputs": 6,
        "x": 96,
        "y": 254,
        "wires": [
            [
                "4be250f0.a27cc"
            ],
            [
                "321feb8d.9e6304"
            ],
            [
                "b6c6f67b.cdf578"
            ],
            [
                "d907d538.8dee98"
            ],
            [
                "cb17555f.9ff9d8"
            ],
            [
                "63663f65.2e26e"
            ]
        ]
    },
    {
        "id": "321feb8d.9e6304",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "echo pow 0 | cec-client -s -d 1",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "get TV status",
        "x": 271,
        "y": 250.5,
        "wires": [
            [
                "3e1b6376.521c5c"
            ],
            [],
            []
        ]
    },
    {
        "id": "3e1b6376.521c5c",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "transform",
        "func": "var newmsg = {\"payload\": msg.payload.replace(\"'C\\n\",\"\")};\nreturn newmsg;",
        "outputs": 1,
        "noerr": 0,
        "x": 446,
        "y": 250,
        "wires": [
            [
                "ac4b0a0.2d27cf8",
                "2005837.fbbc47c"
            ]
        ]
    },
    {
        "id": "2005837.fbbc47c",
        "type": "mqtt out",
        "z": "62c2e51b.c3e4dc",
        "name": "publish TV status",
        "topic": "{topic_placeholder}/status/tv",
        "qos": "1",
        "retain": "true",
        "broker": "b56f6d3d.b7373",
        "x": 691,
        "y": 290,
        "wires": []
    },
    {
        "id": "b6c6f67b.cdf578",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "echo on 0 | cec-client -s -d 1",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "Turn on TV",
        "x": 271,
        "y": 311,
        "wires": [
            [
                "1384de6e.7fe372"
            ],
            [],
            []
        ]
    },
    {
        "id": "d907d538.8dee98",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "echo standby 0 | cec-client -s -d 1",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "Turn off TV",
        "x": 269,
        "y": 371,
        "wires": [
            [
                "4b1c34a8.5e937c"
            ],
            [],
            []
        ]
    },
    {
        "id": "1384de6e.7fe372",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "var msg = {\"payload\": \"TV is on\"}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 453,
        "y": 311,
        "wires": [
            [
                "ac4b0a0.2d27cf8",
                "2005837.fbbc47c"
            ]
        ]
    },
    {
        "id": "4b1c34a8.5e937c",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "var msg = {\"payload\": \"TV is off\"}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 454,
        "y": 371,
        "wires": [
            [
                "ac4b0a0.2d27cf8",
                "2005837.fbbc47c"
            ]
        ]
    },
    {
        "id": "7d397361.61ba3c",
        "type": "http request",
        "z": "62c2e51b.c3e4dc",
        "name": "Play video",
        "method": "GET",
        "ret": "txt",
        "url": "http://localhost:2020/stream?url=https://www.youtube.com/watch?v={{{videoId}}}",
        "tls": "",
        "x": 454,
        "y": 494,
        "wires": [
            []
        ]
    },
    {
        "id": "b9523ab5.0a3ea8",
        "type": "function",
        "z": "62c2e51b.c3e4dc",
        "name": "set payload",
        "func": "var newmsg = {\"videoId\": msg.payload, \"payload\": msg.payload };\nreturn newmsg;",
        "outputs": 1,
        "noerr": 0,
        "x": 284,
        "y": 442,
        "wires": [
            [
                "7d397361.61ba3c",
                "ac4b0a0.2d27cf8",
                "2005837.fbbc47c"
            ]
        ]
    },
    {
        "id": "a0641337.f1cf1",
        "type": "mqtt in",
        "z": "62c2e51b.c3e4dc",
        "name": "Receives video ID",
        "topic": "{topic_placeholder}/command/play",
        "qos": "1",
        "broker": "b56f6d3d.b7373",
        "x": 102,
        "y": 442,
        "wires": [
            [
                "b9523ab5.0a3ea8"
            ]
        ]
    },
    {
        "id": "63663f65.2e26e",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "halt",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "Halt Pi",
        "x": 251,
        "y": 569,
        "wires": [
            [],
            [],
            []
        ]
    },
    {
        "id": "cb17555f.9ff9d8",
        "type": "exec",
        "z": "62c2e51b.c3e4dc",
        "command": "reboot now",
        "addpay": false,
        "append": "",
        "useSpawn": "",
        "timer": "",
        "name": "Reboot Pi",
        "x": 262,
        "y": 511,
        "wires": [
            [],
            [],
            []
        ]
    },
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
        "id": "4c872ebd.cdc97",
        "type": "inject",
        "z": "62c2e51b.c3e4dc",
        "name": "",
        "topic": "",
        "payload": "",
        "payloadType": "str",
        "repeat": "",
        "crontab": "",
        "once": false,
        "x": 419,
        "y": 581,
        "wires": [
            [
                "39a01ee2.7e2ca2"
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
    }
]

module.exports = flows;
