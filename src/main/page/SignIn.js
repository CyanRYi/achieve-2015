import React from 'react';
import Ajax from '../component/Ajax.js';
import { LinkContainer } from 'react-router-bootstrap';

import { Panel, Form, ButtonGroup, FormControl, Button, Col } from 'react-bootstrap';

export default class SignIn extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email : '',
			password : ''
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
			if (event.target.value.length > 50) {
				return;
			}
		}
		this.setState({
			[event.target.id] : event.target.value
		});
	}

	handleSubmit() {
		var metaTags = document.getElementsByTagName("meta");

		var csrfToken;
		var csrfHeader;

		for (var counter = 0; counter < metaTags.length; counter++) {
        if (metaTags[counter].getAttribute('name') == '_csrf') {
        	csrfToken = metaTags[counter].content;
        }
        if (metaTags[counter].getAttribute('name') == '_csrf_header') {
        	csrfHeader = metaTags[counter].content;
        }
    }

		var xhr = new XMLHttpRequest();
    xhr.open('POST', '/sign-in-process');
    xhr.setRequestHeader(csrfHeader, csrfToken);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
							location.href="/";
            }
						else {
							console.log(xhr);
						}
        }
    };
		xhr.send("email=" + this.state.email + "&password=" + this.state.password);
	}

	render() {
		return (
			<Col smOffset={3} sm={6}>
				<Panel header="Please Sign In" style={{marginTop: '50px'}}>
					<Form>
							<FormControl autoFocus
								id="email" placeholder="E-mail" type="text"
								value={this.state.email} onChange={this.handleChange} />
							<FormControl
								id="password" type="password" placeholder="Password"
								value={this.state.password} onChange={this.handleChange} />
					</Form>
					<Button bsStyle="primary" bsSize="large" block onClick={this.handleSubmit}>Sign In</Button>
					<ButtonGroup justified>
				    <LinkContainer to="/join"><Button bsSize="small">Sign up</Button></LinkContainer>
				    <Button href="#" bsSize="small" onClick={() => console.log("join")}>Forgot Password?</Button>
				  </ButtonGroup>
				</Panel>
			</Col>
		);
	}
}
