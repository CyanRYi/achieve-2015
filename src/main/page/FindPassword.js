import React from 'react';
import Ajax from '../component/Ajax.js';
import { LinkContainer } from 'react-router-bootstrap';

import { Panel, Form, ButtonGroup, FormControl, Button, Col, HelpBlock } from 'react-bootstrap';

export default class FindPassword extends React.Component {

	constructor(props) {
		super(props);
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	render() {
		return (
			<Col smOffset={3} sm={6}>
				<Panel header="Find Password" style={{marginTop: '50px'}}>
					Sorry, Not Supported Yet.
					<ButtonGroup justified>
				    <LinkContainer to="/signin"><Button bsSize="small">Sign In</Button></LinkContainer>
				    <LinkContainer to="/join"><Button bsSize="small">Sign up</Button></LinkContainer>
				  </ButtonGroup>
				</Panel>
			</Col>
		);
	}
}
