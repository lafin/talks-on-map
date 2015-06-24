let EventEmitter = require('eventemitter3');

class BaseStore extends EventEmitter {
	constructor(values) {
        super();
		this.set(values);
	}

	get() {
		return this.values;
	}

	set(values) {
		if (values) {
			this.values = values;
			this.emit('update', values);
		}
	}

	append(value) {
		if (value) {
			let values = this.values;
			values = values || [];
			values.push(value);
			this.set(values);
		}
	}
}

export default BaseStore;