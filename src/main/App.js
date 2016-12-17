import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import WebSocketClient from './component/WebSocketClient.js'
import Header from './frame/Header.js';

import Friend from './page/Friend.js';
import Room from './page/Room.js';
import MyInfo from './page/MyInfo.js';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			client : null,
			connectState : 3,
			hasNewMessage : false,
			message : [],
			childrenData : null
		};

		this.connectStateChange = this.connectStateChange.bind(this);
		this.onReceiveMessage = this.onReceiveMessage.bind(this);
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
			ws = new WebSocketClient("ws://localhost:9000/connect");
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
			connectState : state
		});
	}

	onReceiveMessage(message) {
		this.setState({
			hasNewMessage : true
		});
	}

	render() {
		return (
			<div>
				<Header
					state={this.state.connectState}
					new={this.state.hasNewMessage}></Header>
				{React.cloneElement(this.props.children, {childrenData: this.state.childrenData})}
			</div>
		);
	}
}

ReactDOM.render((
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Friend}></IndexRoute>
				<Route path="/myInfo" component={MyInfo}></Route>
				<Route path="/users" component={Friend}></Route>
				<Route path="/rooms(/:childrenData)" component={Room}></Route>
			</Route>
		</Router>
), document.getElementById('app'));
