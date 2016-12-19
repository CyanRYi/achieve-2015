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

		if (!this.props.ws) {
			location.href='/';
		}

		this.state = {
			data : [],
			members : []
		};

		this.bindData = this.bindData.bind(this);
		this.retrieveData = this.retrieveData.bind(this);
		this.onReceiveMessage = this.onReceiveMessage.bind(this);
		this.closeChat = this.closeChat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		this.retrieveData();
	}

	componentWillUnmount() {
		let me = this;

		var _promiseRollbackOnMessage = new Promise(function(resolve, reject) {
			me.props.ws.removeMessageCallback(me.onReceiveMessage);
		});

		var _promiseRequestAbort = new Promise(function(resolve, reject) {
			if (me.serverRequest) {
				me.serverRequest.abort();
			}
		});

		Promise.all([
			_promiseRollbackOnMessage,
			_promiseRequestAbort
		]).then(this.props.closeChat, function(error) {console.log(error)});
	}

	componentDidMount() {
		this.props.ws.addMessageCallback(null, this.onReceiveMessage);
	}

	onReceiveMessage(response) {
		let newMessage = JSON.parse(response.data);

		let messages = this.state.data.slice(0).concat(newMessage);
		this.setState({
			data : messages
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
					AJAX.call('/rooms/members/' + roomId, 'GET', resolve, reject);
			}
		});

		var promiseMessage = new Promise(function (resolve, reject) {
			AJAX.call('/messages/' + roomId + '?page=0&size=10&sort=sendedAt,desc', 'GET', resolve, reject);
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
			data : result.content.reverse()
		});

		this.focusToNewMessage();
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	handleSubmit(value) {
		this.props.ws.send(JSON.stringify({
			roomId : this.props.roomId,
			content : value
		}));
	}

	closeChat() {
		this.props.closeChat();
	}

	render() {
		return (
			<div style={{height:"85%"}}>
				<div>
					<ChatHeader
						state={this.state.readyState} handleClose={this.closeChat}
						members={this.state.members} />
				</div>
				<div id="messages" style={{height:"90%", overflow:"auto"}}>
					{this.state.data.map((obj, i) => {
						let myMessage = obj.sendedBy == auth.userId;
						return (
							<Message isMine={myMessage} content={obj.content} key={i} sendedAt={obj.sendedAt}
								name={this.state.members.filter(m => m.id == obj.sendedBy)[0].name} />
						);
					})}
				</div>
				<div>
					<ChatFooter onSubmit={this.handleSubmit} />
				</div>
			</div>
		);
	}
}
