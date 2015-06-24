import BaseAction from './BaseAction';

class MessageAction extends BaseAction {
	constructor(socket) {
		super(arguments);

		socket.on('city:messages', (values) => {
			this.emit('messages:prepare', values);
		});
	}
}

export default MessageAction;