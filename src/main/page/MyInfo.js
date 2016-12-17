import React from 'react';
import Ajax from '../component/Ajax.js';
import EditPassword from '../component/EditPassword.js';

import { Modal, Form, FormGroup, FormControl, ControlLabel, Button, Col } from 'react-bootstrap';

export default class MyInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editPassword : false,
			mask : false
		};

		this.retrieveData = this.retrieveData.bind(this);
		this.bindData = this.bindData.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		this.retrieveData();
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	retrieveData() {
		this.setState({mask : true});
		this.sendProxyRequest('/users', 'GET', this.bindData);
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	bindData(response) {
		let result = JSON.parse(response);

		this.setState({
			email : result.email,
			name : result.name,
			comment : result.comment,
			mask : false
		});
	}

	handleChange(event) {
		if (event.target.id === 'name') {
			if (event.target.value <= 20) {
				this.setState({name : event.target.value});
			}
		}
		else if (event.target.id === 'comment') {
			if (event.target.value <= 50) {
				this.setState({comment : event.target.value});
			}
		}
	}

	render() {
		return (
			<div>
				<Modal
					show={this.state.mask}
					onHide={() => this.setState({mask : false})}
					container={this}
					dialogClassName="loadingMask">
						<img src={'/images/loading.gif'} width="100" height="100" />
				</Modal>
				<EditPassword
					show={this.state.editPassword}
					onHide={() => this.setState({editPassword : false})} />
				<Form horizontal>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							E-mail
						</Col>
						<Col sm={10}>
							<FormControl.Static>{this.state.email}</FormControl.Static>
						</Col>
					</FormGroup>
					<FormGroup>
			      <Col componentClass={ControlLabel} sm={2}>
			        이름
			      </Col>
			      <Col sm={10}>
			        <FormControl id="name" type="text" placeholder="이름" onChange={this.handleChange} value={this.state.name} />
			      </Col>
			    </FormGroup>
					<FormGroup>
			      <Col componentClass={ControlLabel} sm={2}>
			        코멘트
			      </Col>
			      <Col sm={10}>
			        <FormControl id="comment" type="text" placeholder="코멘트" onChange={this.handleChange} value={this.state.comment} />
			      </Col>
			    </FormGroup>
					<FormGroup>
			      <Col smOffset={2} sm={5}>
							<Button bsStyle="warning" onClick={() => this.setState({editPassword : true})}>
								비밀번호 변경
							</Button>
						</Col>
						<Col sm={5}>
							<Button>
								저장
							</Button>
			      </Col>
			    </FormGroup>
				</Form>
			</div>
		);
	}
}
