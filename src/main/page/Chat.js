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
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
		this.state.client.close();
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
	}

	retrieveData(page, params) {
		var me = this;
		var roomId = this.props.roomId;
		const AJAX = new Ajax();

		var promiseMember = new Promise(function (resolve, reject) {
			AJAX.call('./rooms/members/' + roomId, 'GET', resolve, reject);
		});

		if (roomId) {
			promiseMember.then(
				function(response) {
					let result = JSON.parse(response);
					me	.setState({
						members : result
					});
				}, function(error) {
					console.log(error);
				}
			).then(AJAX.call('./messages?page=0&size=10&roomId=' + roomId, 'GET', this.bindData, console.log));
		}
		else {
			AJAX.call('./messages?page=0&size=10&roomId=' + roomId, 'GET', this.bindData, reject);
		}
	}


	bindData(response) {
		let result = JSON.parse(response);

		this.setState({
			data : result.content
		});
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
				<div style={{height:"90%", overflow:"auto"}}>
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
