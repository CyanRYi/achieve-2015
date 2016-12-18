import React from 'react';
import ReactDOM from 'react-dom';

import Ajax from '../component/Ajax.js';
import WebSocketClient from '../component/WebSocketClient.js';

import ChatHeader from '../component/ChatHeader.js';
import ChatFooter from '../component/ChatFooter.js';
import Message from '../component/Message.js';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			client : null,
			readyState : 3,
			data : [],
			members : []
		};

		this.bindData = this.bindData.bind(this);
		this.retrieveData = this.retrieveData.bind(this);
		this.onReceiveMessage = this.onReceiveMessage.bind(this);
		this.closeChat = this.closeChat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.connectStateChange = this.connectStateChange.bind(this);
	}

	componentWillMount() {
		this.retrieveData();
	}

	componentWillUnmount() {

		let client = this.state.client;
		let request = this.serverRequest;

		var _promiseClientClose = new Promise(function(resolve, reject) {
			client.onClose = console.log;
			client.close();
		});

		var _promiseRequestAbort = new Promise(function(resolve, reject) {
			if (request) {
				request.abort();
			}
		});

		Promise.all([
			_promiseClientClose,
			_promiseRequestAbort
		]).then(this.props.closeChat, function(error) {console.log(error)});
	}

	componentDidMount() {
		var ws;

		if (this.state.client) {
			ws = this.state.client;
		}
		else {
			ws = new WebSocketClient("ws://localhost:9000/room");
		}

		let stateChangeFunc = this.connectStateChange;

		ws.onOpen = function(event) {
			stateChangeFunc(ws.readyState);
		};

		ws.onClose = function(event) {
			stateChangeFunc(ws.readyState);
		};

		ws.onError = function(event) {
			stateChangeFunc(ws.readyState);
		};

		ws.onMessage = this.onReceiveMessage;

		this.setState({
			client : ws
		});
	}

	connectStateChange(state) {
		this.setState({
			readyState : state
		});
	}

	onReceiveMessage(response) {
		let message = JSON.parse(response.data);
		this.setState({
			data : this.state.data.slice(0).concat(message)
		});

		this.focusToNewMessage();
	}

	focusToNewMessage() {
		var element = document.getElementById("messages")	;
		element.scrollTop = element.scrollHeight - element.clientHeight;
	}

	retrieveData(page, params) {
		var me = this;
		var roomId = this.props.roomId;
		const AJAX = new Ajax();

		var promiseMember = new Promise(function (resolve, reject) {
			if (roomId) {
					AJAX.call('./rooms/members/' + roomId, 'GET', resolve, reject);
			}
		});

		var promiseMessage = new Promise(function (resolve, reject) {
			AJAX.call('./messages?page=0&size=10&roomId=' + roomId, 'GET', resolve, reject);
		});

		promiseMember.then(
			function(response) {
				let result = JSON.parse(response);
				me.setState({
					members : result
				});
				return promiseMessage;
			}, function(error) {
				console.log(error);
			}
		).then(
			function(response) {
				me.bindData(response);
			}, function(error) {
				console.log(error);
			}
		);
	}


	bindData(response) {
		let result = JSON.parse(response);

		this.setState({
			data : result.content
		});

		this.focusToNewMessage();
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	handleSubmit(value) {
		this.state.client.send(JSON.stringify({
			roomId : this.props.roomId,
			content : value
		}));
	}

	closeChat() {
		this.state.client.close();
		this.props.closeChat();
	}

	render() {
		return (
			<div style={{height:"85%"}}>
				<div container={this}>
					<ChatHeader state={this.state.readyState} handleClose={this.closeChat} />
				</div>
				<div id="messages" style={{height:"90%", overflow:"auto"}}>
					{this.state.data.map((obj, i) => {
						let myMessage = obj.sendedBy == userId;
						return (<Message isMine={myMessage} content={obj.content} key={i}
							name={this.state.members.filter(m => m.id == obj.sendedBy)[0].name} />);
					})}
				</div>
				<div container={this}>
					<ChatFooter onSubmit={this.handleSubmit} />
				</div>
			</div>
		);
	}
}
