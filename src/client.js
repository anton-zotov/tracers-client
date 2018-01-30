import io from 'socket.io-client';

let Client = function(address) {

	let socket = io.connect(address, function (socket) {
		console.log('Connected!');
	});

	socket.on('connect', function () {
		socket.on('news', function (msg) {
			console.log("message", msg);
		});
	});

	return {
		sendData(event, data) {
			if (!data.isEmpty())
				socket.emit(event, data);
		},
		bind(event, func) {
			socket.on(event, func);
		}
	}
}

export default Client;