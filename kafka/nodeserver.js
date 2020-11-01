"use strict";
const port = process.env.PORT || 3000;
const server = require("http").createServer();
const express = require("express");
const fs = require('fs');
const url = require('url');
const bodyParser = require("body-parser");


const {
    Kafka
} = require('kafkajs')
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})
const producer = kafka.producer()
const consumer = kafka.consumer({
    groupId: 'test-group'
})
const topic = 'SACTopic';
var sockett;

var app = express();
app.use(bodyParser.json());


//Start the Server 
server.on("request", app);

// use socket.io
var io = require('socket.io').listen(server);

// define interactions with client
io.on('connection', function(socket) {
    sockett = socket;

    socket.on('fr_sac', function(data) {
        console.log('--from SAC: ' + data);

	    var sendMessage = async () => {
		  await producer.connect()
		  await producer.send({
		    topic: topic,
		    messages: [
		      { key: 'key1', value: data }
		    ],
		  })
		  await producer.disconnect()
		}

		sendMessage().catch(console.error);        
    });
});


//Start the Server 
//server.on("request", app);
server.listen(port, function() {
    console.info(`HTTP Server: ${server.address().port}`);
});

/*
const listenMessage = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({
        topic: topic,
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message
        }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
                key: message.key.toString()
            })

            if(message.key.toString() === "key2") {
            	sockett.emit("client_data", message.value.toString());
        	}
        },
    })
}

listenMessage().catch(console.error)
*/
