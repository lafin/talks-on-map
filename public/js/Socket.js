export default () => {
	return io.connect(window.location.protocol + '//' + window.location.host, {
		'transports': [
			'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling',
			'polling'
		]
	});
};