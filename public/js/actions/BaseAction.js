let EventEmitter = require('eventemitter3');

class BaseAction extends EventEmitter {
  constructor() {
    super(arguments);
  }
}

export default BaseAction;
