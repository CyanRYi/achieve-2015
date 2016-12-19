class WebSocketClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.messageCallback = [];
  }

  send(message) {
    this.ws.send(message);
  }

  close() {
    this.ws.close();
  }

  get readyState() {
    return this.ws.readyState;
  }

  set onOpen(callback) {
    this.ws.onopen = callback;
  }

  set onClose(callback) {
    this.ws.onclose = callback;
  }

  get onMessage() {
    return this.ws.onmessage;
  }

  addMessageCallback(order, callback) {
    if (this.messageCallback.includes(callback)) {return;}

    if (!Number.isInteger(order)) {
      this.messageCallback.push(callback);
    }
    else {
      this.messageCallback.splice(order, 0, callback);
    }

    let callbacks = this.messageCallback;

    this.ws.onmessage = function(message) {
      callbacks.map((callback) => callback(message));
    };
  }

  removeMessageCallback(val) {
    let index;
    if (Number.isInteger(val)) {
      index = val;
    }
    else if (val && {}.toString.call(val) === '[object Function]') {
      index = this.messageCallback.indexOf(val);
    }

    this.messageCallback.splice(index, 1);

    let callbacks = this.messageCallback;

    this.ws.onmessage = function(message) {
      callbacks.map((callback) => callback(message));
    };
  }

  set onError(callback) {
    this.ws.onerror = callback;
  }
}

export default WebSocketClient;
