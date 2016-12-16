import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class ConfirmPopup extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<Modal show={this.props.open} onHide={this.props.hide}>
				<Modal.Header closeButton>
					<Modal.Title id="container-confirm-popup-title">{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5><strong>{this.props.bodyContent}</strong></h5>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.hide}>{this.props.cancleButton}</Button>
					<Button onClick={this.props.confirmCallback}>{this.props.confirmButton}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

ConfirmPopup.defaultProps = {
	open: false,
	title: '확인',
	confirmButton : '확인',
	cancleButton : '취소'
}

ConfirmPopup.propTypes = {
	open: React.PropTypes.bool,
	hide: React.PropTypes.func.isRequired,
	title: React.PropTypes.string,
	bodyContent : React.PropTypes.string.isRequired,
	confirmButton : React.PropTypes.string,
	cancleButton : React.PropTypes.string,
	confirmCallback : React.PropTypes.func.isRequired,
}
export default ConfirmPopup;