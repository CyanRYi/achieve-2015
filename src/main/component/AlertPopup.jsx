import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class AlertPopup extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<Modal show={this.props.open} onHide={this.props.hide}>
				<Modal.Header closeButton>
					<Modal.Title id="container-alert-popup-title">{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5><strong>{this.props.bodyContent}</strong></h5>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.hide}>{this.props.cancleButton}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

AlertPopup.defaultProps = {
	open: false,
	title: '알림',
	cancleButton : '확인'
}

AlertPopup.propTypes = {
	open: React.PropTypes.bool,
	hide: React.PropTypes.func.isRequired,
	title: React.PropTypes.string,
	bodyContent : React.PropTypes.string.isRequired,
	cancleButton : React.PropTypes.string,
}
export default AlertPopup;