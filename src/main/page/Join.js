import React from 'react';
import Ajax from '../component/Ajax.js';
import { LinkContainer } from 'react-router-bootstrap';

import { Panel, Form, ButtonGroup, FormControl, Button, Col } from 'react-bootstrap';

export default class Join extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email : '',
			name : '',
			password : '',
			passwordRepeat : ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	handleChange(event) {
		if (event.target.id === 'email') {
			if (event.target.value.length > 50) return;
		}
		else if (event.target.id === 'name') {
			if (event.target.value.length > 20) return;
		}
		else if (event.target.id === 'comment') {
			if (event.target.value.length > 50) return;
		}

		this.setState({
			[event.target.id] : event.target.value
		});
	}

	handleSubmit() {
		let params = {
			email : this.state.email,
			name : this.state.name,
			password : this.state.password,
			passwordRepeat : this.state.passwordRepeat
		}

		this.sendProxyRequest('/users', 'POST', function() {location.href='/';}, console.log, params);
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	render() {
		return (
			<Col smOffset={3} sm={6}>
				<Panel header="Sign On" style={{marginTop: '50px'}}>
					<Form>
							<FormControl autoFocus
								id="email" placeholder="E-mail" type="text"
								value={this.state.email} onChange={this.handleChange} />
							<FormControl
								id="name" placeholder="Name" type="text"
								value={this.state.name} onChange={this.handleChange} />
							<FormControl
								id="password" type="password" placeholder="Password"
								value={this.state.password} onChange={this.handleChange} />
							<FormControl
								id="passwordRepeat" type="password" placeholder="Password Repeat"
								value={this.state.passwordRepeat} onChange={this.handleChange} />
					</Form>
					<Button bsStyle="primary" bsSize="large" block onClick={this.handleSubmit}>Sign On</Button>
					<ButtonGroup justified>
				    <LinkContainer to="/signin"><Button bsSize="small">Sign In</Button></LinkContainer>
				    <Button href="#" bsSize="small" onClick={() => console.log("join")}>Forgot Password?</Button>
				  </ButtonGroup>
				</Panel>
			</Col>
		);
	}
}
