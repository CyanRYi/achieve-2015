import React from 'react';
import Ajax from '../component/Ajax.js';

import { Modal, FormGroup, FormControl, Col, HelpBlock, Form, ControlLabel } from 'react-bootstrap';
import { ButtonGroup, Button } from 'react-bootstrap';

export default class EditPassword extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
      newPassword : '',
      passwordRepeat : '',
      validationMessage : '　',
      validationState : {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
	}

  handleChange(event) {
    let validationState = Object.assign({}, this.state.validationState);
    validationState[event.target.id] = 'success';

    let validationMessage = '　'
    let repeated;

    let anotherValue;
    if (event.target.id === 'newPassword') {
      anotherValue = this.state.passwordRepeat;
    }
    else if (event.target.id === 'passwordRepeat') {
      anotherValue = this.state.newPassword;
    }

    if (anotherValue && event.target.value !== anotherValue) {
      repeated = false;
    }
    else if (anotherValue === event.target.value){
      repeated = true;
    }


    if (event.target.value.length < 8)     {
      validationState[event.target.id] = 'error';
      validationMessage = '비밀번호는 8자 이상이어야 합니다.';
    }
    else {
      if (repeated === true) {
        validationState.newPassword = 'success';
        validationState.passwordRepeat = 'success';
      }
      else if (repeated === false) {
        validationState.newPassword = 'error';
        validationState.passwordRepeat = 'error';
        validationMessage = '비밀번호가 일치하지 않습니다.';
      }
    }

    this.setState({
      [event.target.id] : event.target.value,
      validationState : validationState,
      validationMessage : validationMessage
    });
  }

  closeModal() {
    this.setState({
      newPassword : '',
      passwordRepeat : '',
      validationMessage : '　',
      validationState : {}
    });

    this.props.onHide();
  }

  handleSubmit() {
		if (this.state.validationMessage.length > 1) return;

    const AJAX = new Ajax();

    let params = {
				oldPassword : this.state.oldPassword,
				password : this.state.newPassword,
				passwordRepeat : this.state.passwordRepeat
		};

		AJAX.call('/users/password', 'PUT', this.closeModal, console.log, params);
  }

	handleKeyEvent(event) {
    if (event.key === "Enter") {
        this.handleSubmit();
    }
  }

	render() {
		return (
      <Modal
        show={this.props.show}
        onHide={this.closeModal}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.state.validationState["oldPassword"]}>
              <Col componentClass={ControlLabel} sm={4}>
                기존 비밀번호
              </Col>
              <Col sm={8}>
                <FormControl autoFocus
									id="oldPassword" type="password" placeholder="기존 비밀번호" value={this.state.oldPassword}
									onChange={(event) => this.setState({oldPassword:event.target.value})} />
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.validationState["newPassword"]}>
              <Col componentClass={ControlLabel} sm={4}>
                새 비밀번호
              </Col>
              <Col sm={8}>
                <FormControl id="newPassword" type="password" placeholder="새 비밀번호"  value={this.state.newPassword}
									onChange={this.handleChange} />
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.validationState["passwordRepeat"]}>
              <Col componentClass={ControlLabel} sm={4}>
                비밀번호 확인
              </Col>
              <Col sm={8}>
                <FormControl id="passwordRepeat" type="password" placeholder="비밀번호 확인" value={this.state.passwordRepeat}
									onChange={this.handleChange}  onKeyPress={this.handleKeyEvent.bind(this)} />
              </Col>
            </FormGroup>
            <Col smOffset={2} sm={10}>
              <HelpBlock>{this.state.validationMessage}</HelpBlock>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup bsSize="small" className="pull-right">
            <Button bsStyle="primary" onClick={this.handleSubmit}>저장</Button>
            <Button bsStyle="danger" onClick={this.closeModal}>닫기</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
		);
	}
}
