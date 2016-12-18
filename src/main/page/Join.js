import React from 'react';
import Ajax from '../component/Ajax.js';
import { LinkContainer } from 'react-router-bootstrap';

import { Panel, Form, ButtonGroup, FormControl, Button, Col, HelpBlock } from 'react-bootstrap';

export default class Join extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email : '',
			name : '',
			password : '',
			passwordRepeat : '',
      validationMessage : ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleError = this.handleError.bind(this);
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
		this.setState({
			[event.target.id] : event.target.value
		});
	}

	validate() {
		if (!this.state.email) {
			this.setState({validationMessage : '이메일은 필수 항목입니다.'});
			return false;
		}
		else if (!this.state.name) {
			this.setState({validationMessage : '이름은 필수 항목입니다.'});
			return false;
		}
		else {
			if (this.state.password.length < 8 || this.state.passwordRepeat.length < 8) {
				this.setState({validationMessage : '비밀번호는 8자 이상이어야 합니다.'});
				return false;
			}
			else {
				if (this.state.passwordRepeat !== this.state.password) {
					this.setState({validationMessage : '비밀번호가 일치하지 않습니다.'});
					return false;
				}
			}
		}
		var emailRegex = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/gi;

		if (!emailRegex.test(this.state.email)) {
			this.setState({validationMessage : '잘못된 이메일 양식입니다.'});
			return false;
		}
		return true;
	}

	handleSubmit() {
		console.log(this.state);
		if (!this.validate()) {
			return;
		}

		let params = {
			email : this.state.email,
			name : this.state.name,
			password : this.state.password,
			passwordRepeat : this.state.passwordRepeat
		}

		new Ajax().call('/users', 'POST', function() {location.href='/';}, this.handleError, params);
	}

	handleError(response) {
		var result = JSON.parse(response);

		switch(result.message) {
			case 'Already Joined' : this.setState({validationMessage : '이미 가입된 이메일입니다.'});break;
			case 'Invalid Password' : this.setState({validationMessage : '비밀번호가 잘못되었습니다.'});break;
			case 'Email Not Valid' : this.setState({validationMessage : '잘못된 이메일 양식입니다.'});break;
			default : this.setState({validationMessage : '알수 없는 에러가 발생하였습니다.'});
		}
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
					<HelpBlock>{this.state.validationMessage}</HelpBlock>
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
