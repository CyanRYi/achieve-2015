import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Header extends React.Component {

	constructor(props) {
		super(props);
	}

	getConnectState() {
		switch (this.props.state) {
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
						<NavDropdown title={username} id="personal-nav-menu-dropdown">
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
