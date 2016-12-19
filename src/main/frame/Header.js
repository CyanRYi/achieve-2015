import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import WebSocketClient from '../component/WebSocketClient.js'

export default class Header extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			readyState : 3
		};

		this.connectStateChange = this.connectStateChange.bind(this);
	}

	componentWillUnmount() {
		this.props.onClose();
	}

	connectStateChange(state) {
		this.setState({
			readyState : state
		});
	}

	componentDidMount() {
		var ws = new WebSocketClient('ws://' + window.location.host + '/connect');

		let me = this;

		ws.onOpen = function(event) {
			me.props.onOpen(ws);
			me.connectStateChange(ws.readyState);
		};

		ws.onClose = function(event) {
			me.connectStateChange(ws.readyState);
		};

		ws.onError = function(event) {
			me.connectStateChange(ws.readyState);
		};

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
			<Navbar collapseOnSelect fluid>
				<Navbar.Header>
					<LinkContainer to="/">
						<Navbar.Brand>
							<div>
								<span style={{color : this.getConnectState()}}>●</span>
								<span>Logo</span>
							</div>
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle />
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
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
