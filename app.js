var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var SerialPort = require('serialport').SerialPort;

var ReadlineParser = require('@serialport/parser-readline').ReadlineParser;

var parsers = SerialPort.parsers;
var sp = new SerialPort(
	{

		path: 'COM6',

		baudRate: 9600,
	});
var tx_str = "pw";
var doorStatus = 0;

const parser = sp.pipe(new ReadlineParser({ delimiter: '\r\n' }));



//sp.pipe(parser);

sp.on('open', () => console.log('Port open'));

parser.on('data', function (data) {
	if (data.substring(0, 4) == "TEMP") {
		var temperature = data.substring(4);
		io.emit('temp', temperature);
		console.log('temperature: ' + temperature + '℃');
	}
	else if (data.substring(0, 4) == "HUMI") {
		var humidity = data.substring(4);
		io.emit('humi', humidity);
		console.log('humidity: ' + humidity + '%');
	}
	else if (data.substring(0, 4) == "MOIS") {
		var moisture = data.substring(4);
		io.emit('mois', moisture);
		console.log('moisture: ' + moisture);
	}
	else if (data.substring(0, 5) == "SERVO") {
		if (data.substring(5) == "0") ventState = "Vent-shutter is Closed";
		else if (data.substring(5) == "1") ventState = "Vent-shutter is Opened to position1";
		else if (data.substring(5) == "2") ventState = "Vent-shutter is opened to position2";
		io.emit('vent', ventState);
		console.log(ventState);
	}
	else if (data.substring(0, 5) == "DCFAN") {
		if (data.substring(5) == "0") fanState = "Fan is turned Off";
		else if (data.substring(5) == "1") fanState = "Fan is turned On";
		io.emit('fan', fanState);
		console.log(fanState);
	}
	else if (data.substring(0, 5) == "VALVE") {
		if (data.substring(5) == "0") valveState = "Water-valve is Closed";
		else if (data.substring(5) == "1") valveState = "Water-valve is Opened";
		io.emit('valve', valveState);
		console.log(valveState);
	}
	else;
});

app.get('/gasfan_on', function (req, res) {
	console.log('send: Gasfan On');
	sp.write('gasfan_on\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/gasfan_off', function (req, res) {
	console.log('send: Gasfan Off');
	sp.write('gasfan_off\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/light_on', function (req, res) {
	console.log('send: light On');
	sp.write('light_on\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/light_off', function (req, res) {
	console.log('send: light Off');
	sp.write('light_off\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/window_open', function (req, res) {
	console.log('send: Window open');
	sp.write('window_open\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/window_close', function (req, res) {
	console.log('send: Window close');
	sp.write('window_close\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});
app.get('/fan_on', function (req, res) {
	console.log('send: fan On');
	sp.write('ceilingfan_on\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/fan_off', function (req, res) {
	console.log('send: fan Off');
	sp.write('ceilingfan_off\n', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/vent_pos0', function (req, res) {
	console.log('send: Vent shutter close');
	sp.write('SERVO0\n\r', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

/*app.get('/vent_pos1', function (req, res) {
	console.log('send: Vent shutter open untill position1');
	sp.write('SERVO1\n\r', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});

app.get('/vent_pos2', function (req, res) {
	console.log('send: Vent shutter open untill position2');
	sp.write('SERVO2\n\r', function (err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('\r');
	});
});*/

app.get('/btn0', function (req, res) {
	tx_str = tx_str + '0';
	console.log("btn0");
});
app.get('/btn1', function (req, res) {
	tx_str = tx_str + '1';
	console.log("btn1");
});
app.get('/btn2', function (req, res) {
	tx_str = tx_str + '2';
	console.log("btn2");
});
app.get('/btn3', function (req, res) {
	tx_str = tx_str + '3';
	console.log("btn3");
});
app.get('/btn4', function (req, res) {
	tx_str = tx_str + '4';
	console.log("btn4");
});
app.get('/btn5', function (req, res) {
	tx_str = tx_str + '5';
	console.log("btn5");
});
app.get('/btn6', function (req, res) {
	tx_str = tx_str + '6';
	console.log("btn6");
});
app.get('/btn7', function (req, res) {
	tx_str = tx_str + '7';
	console.log("btn7");
});
app.get('/btn8', function (req, res) {
	tx_str = tx_str + '8';
	console.log("btn8");
});
app.get('/btn9', function (req, res) {
	tx_str = tx_str + '9';
	console.log("btn9");
});
app.get('/reset', function (req, res) {
	console.log("reset");
	tx_str = "pw";
});
app.get('/openDoor', function (req, res) {
	console.log("open");
	console.log(tx_str);
	tx_str = tx_str + '\n';
	sp.write(tx_str, function (err) {

		if (err) {

			return console.log('Error on write: ', err.message);

		}

		console.log('pw = ' + tx_str);

		res.writeHead(200, { 'Content-Type': 'text/plain' });

		res.end(tx_str);

	});


});

app.use(express.static(__dirname + '/public'));

http.listen(3000, function () {
	console.log('listening on *:3000');
});