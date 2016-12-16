import React from 'react';
import ReactDOM from 'react-dom';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Form, Modal, ButtonGroup, Button } from 'react-bootstrap';
import Confirm from './ConfirmPopup.jsx';
import Widget from './WidgetRenderer.jsx';

class Editform extends React.Component {
	constructor(props) {
		super(props);
		
		this._handleReset = this._handleReset.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this._handleCancle = this._handleCancle.bind(this);
		this._hasChange = this._hasChange.bind(this);
		this._setResetHandlers = this._setResetHandlers.bind(this);
		
		this.state = {
			formtype : this.props.formtype,
			resetconfirm : false,
			cancleconfirm : false,
			changedvalue : [],
			resethandlers : []
		};
	}
		
	_hasChange() {
		return this.state.changedvalue.length > 0; 
	}
	
	_setResetHandlers(keyValue) {
		let keyFunc = Object.assign({}, keyValue);
		
		let newHandlers = this.state.resethandlers.slice();
		let oldHandlers = newHandlers.filter(m => m.key == keyValue.key);

		delete keyFunc.value;
		
		if (oldHandlers.length == 0) {
			newHandlers.push(keyFunc);
			
			this.setState({
				resethandlers : newHandlers
			});
		}
	}
	
	_handleSubmit(event) {
		event.preventDefault();
		
		if (this._hasChange()) {
			var submitParam = {};
			
			this.state.changedvalue.map(obj => {submitParam[obj.key] = obj.value});
			
			if (this.state.formtype === 'create') {
				submitParam.operation = 'C';
			}
			else if (this.state.formtype === 'modify') {
				submitParam.operation = 'U';
				submitParam.id = this.props.data.id;
			}
			this.props.action(submitParam);
		}
		return;
	}
	
	_handleReset() {
		for(var i=0;i<this.state.resethandlers.length;i++) {
			this.state.resethandlers[i].resetFunction();
		}
		
		this.setState({
			resetconfirm : false,
			cancleconfirm : false,
			changedvalue : [],
			resethandlers : []
		});
	}
	
	_handleCancle(event) {
		event.preventDefault();
		
		if (this.state.formtype === 'modify') {
			this._handleReset();
			
			this.setState({
				formtype : 'view'
			});
		}
		else {
			this.props.onHide();
		}
	}
	
	_handleChange(keyValue) {
		console.log(keyValue);
		
		let newDatas = this.state.changedvalue.slice();
		let oldData = newDatas.filter(m => m.key == keyValue.key);
		
		if (oldData.length > 0) {
			newDatas.splice(newDatas.indexOf(oldData[0]), 1);
		}
		
		this._setResetHandlers(keyValue);
		
		delete keyValue.resetFunction;
		
		if (keyValue.value != this.props.data[keyValue.key]) {
			newDatas.push(keyValue);
			
			this.setState({
				changedvalue : newDatas
			});
		}
	}
	
	render() {
		return (
			<Modal 
				show={this.props.show} 
				onHide={this.props.onHide} 
				container={this.props.container} 
				onEnter={() => this.setState({formtype : this.props.formtype, resetconfirm : false, cancleconfirm : false})} 
				onExited={this.props.onHide}>
				<Confirm 
					open={this.state.resetconfirm && this._hasChange()} 
					hide={() => this.setState({resetconfirm : false})}
					title="초기화"
					bodyContent="입력한 값을 무시하고 기존 값으로 복구하시겠습니까?"
					cancleButton="취소"
					confirmButton="확인"
					confirmCallback={this._handleReset}></Confirm>
				<Confirm 
					open={this.state.cancleconfirm} 
					hide={() => this.setState({cancleconfirm : false})}
					title="입력 취소"
					bodyContent="입력을 취소하시곘습니까?"
					cancleButton="취소"
					confirmButton="확인"
					confirmCallback={this._handleCancle}></Confirm>
				<Modal.Header closeButton></Modal.Header>
				<Modal.Body style={{width:'800px'}}>
					<Form horizontal>
						{this.props.model.filter(v => (v.viewable === true || v.editable === true)).map((column, i) => {
							if (this.state.view || column.editable === true) {
								return <Widget
											formtype={this.state.formtype}
											key={i}
											model={column}
											value={this.props.data[column.id]}
											handleChange={this._handleChange}></Widget>;
							}
						})}
					</Form>
				</Modal.Body>
				{this.state.formtype === 'view' ?
					<Modal.Footer>
						<ButtonGroup bsSize="small" className="pull-right">
							<Button bsStyle="warning" onClick={() => this.setState({ formtype : 'modify'})}>
				        		수정
		        			</Button>
			        		<Button bsStyle="danger" onClick={this._handleCancle}> 
				        		닫기
							</Button>
		        		</ButtonGroup>
	        		</Modal.Footer> 	:
        			<Modal.Footer>
	        			<span className="pull-left">* 필수 입력 항목입니다.</span>
	        			<ButtonGroup bsSize="small" className="pull-right">
							<Button bsStyle="success" type="submit" onClick={this._handleSubmit} 
								disabled={!this._hasChange()}>
				        		저장
							</Button>
			        		<Button bsStyle="warning" type="reset" onClick={() => this.setState({ resetconfirm : true})}
			        			disabled={!this._hasChange()}>
				        		초기화
							</Button>
			        		<Button bsStyle="danger" onClick={() => this.setState({cancleconfirm : true})}> 
				        		취소
							</Button>
		        		</ButtonGroup>
		        	</Modal.Footer>
				}
			</Modal>
		);
	}
}

Editform.propTypes = {
}

Editform.defaultProps = {
}

export default Editform;