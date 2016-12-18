import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import WebSocketClient from '../component/WebSocketClient.js'

export default class Header extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			client : null,
			readtState : 3,
			hasNewMessage : false,
			message : []
		};

		this.connectStateChange = this.connectStateChange.bind(this);
		this.onReceiveMessage = this.onReceiveMessage.bind(this);
	}

	componentWillUnmount() {
		this.state.client.close();
	}

	connectStateChange(state) {
		this.setState({
			readtState : state
		});
	}

	onReceiveMessage(message) {
		this.setState({
			hasNewMessage : true
		});
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

	getConnectState() {
		switch (this.state.readyState) {
			case 1: return 'green';
			case 3: return 'red';
			default: return 'yellow';
		}
	}


	render() {
		return (
			<Navbar inverse>
				<Navbar.Header>
					<LinkContainer to="/">
						<Navbar.Brand>
							<span>Logo Here</span>
						</Navbar.Brand>
					</LinkContainer>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<LinkContainer to="/users"><NavItem>친구</NavItem></LinkContainer>
						<LinkContainer to="/rooms">
							<NavItem>대화</NavItem>
						</LinkContainer>
					</Nav>
					<Nav pullRight>
						<NavDropdown title={auth.userName} id="personal-nav-menu-dropdown">
							<LinkContainer to="/myInfo"><MenuItem>개인정보수정</MenuItem></LinkContainer>
				      <MenuItem href="/signout">로그아웃</MenuItem>
						</NavDropdown>
					</Nav>
					<Navbar.Text pullRight style={{color : this.getConnectState()}}>
		        ●
		      </Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
