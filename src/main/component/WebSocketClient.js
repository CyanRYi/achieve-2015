class WebSocketClient {
  constructor(url) {
    this.ws = new WebSocket(url);
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
  
  set onMessage(callback) {
    this.ws.onmessage = callback;
  }

  set onError(callback) {
    this.ws.onerror = callback;
  }
}

export default WebSocketClient;
