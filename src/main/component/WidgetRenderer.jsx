import React from 'react';

import { DropdownList, Combobox, NumberPicker, Multiselect, SelectList, DateTimePicker } from 'react-widgets';
import { FormGroup, ControlLabel, FormControl, InputGroup, Col, Row, HelpBlock , Checkbox } from 'react-bootstrap';
import EditableGrid from './EditableGrid.jsx';
import Validator from './Validator.jsx';
import Formatter from './Formatter.jsx';

class WidgetRenderer extends React.Component {
	
	constructor(props) {
		super(props);
		
		this._resolveEditType = this._resolveEditType.bind(this);
		this._getValidationState = this._getValidationState.bind(this);
		this._validate = this._validate.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this._getInitState = this._getInitState.bind(this);
		this._resetField = this._resetField.bind(this);
		
		this.state = this._getInitState();
	}
	
	_getInitState() {
		var state = {
			value : this.props.value,
			validationMessage : '　',
			isValid : null
		}
		if (state.value === undefined) {
			state.value = null;
		}
		
		if (this.props.formtype === 'modify') {
			var validationResult = this._validate(this.props.model.id, this.props.value)
			
			state.validationMessage = validationResult.validationMessage;
			state.isValid = validationResult.isValid;
		}
		
		return state;
	}
	
	_resetField() {
		this.setState(this._getInitState());
	}
	
	_getValidationState(key) {
		
		let validation = this.state.isValid;
		if (validation === true) {
			return 'success';
		}
		else if (validation === false){
			return "error";
		}
		else {
			return null;
		}
	}
	
	_validate(key, value) {
		const VALIDATOR = new Validator();
		
		if (key === 'id') {
			return;
		}
		
		if (!('editOptions' in this.props.model)) {
			throw new Error(targetModel.id + " model has No editOption");
		}
		
		if (this.props.model.editOptions.required) {
			if (!value || value.toString().length <= 0) {
				return {
					value : value,
					isValid : false,
					validationMessage : '필수입력 항목입니다.'
				};
			}
		}
		
		if (!('validator' in this.props.model.editOptions)) {
			return {
				value : value,
				isValid : true,
				validationMessage : ''
			};
		}
		return VALIDATOR.validate(value, this.props.model.editOptions.validator);
	}
	
	_handleChange(event) {
		const fmt = new Formatter();
		
		var editType = this.props.model.editOptions.editType;
		
		var targetId = this.props.model.id;
		var targetValue, displayValue, submitValue;
		
		if (typeof event !== 'object') {
			targetValue = event;
			displayValue = event;
			submitValue = event;
		}
		else {
			targetValue = event.target.value;
			displayValue = event.target.value;
			submitValue = event.target.value;
			
			if (editType === 'file') {
				displayValue = event.target.files[0].name;
				targetValue = event.target.files[0];
				submitValue = event.target.files[0];
			}
			else if (editType === 'checkbox') {
				displayValue = event.target.checked;
				targetValue = event.target.checked;
				submitValue = event.target.checked;
			}
			else {
				if (this.props.model.formatter && this.props.model.formatter.displayFormat) {
					displayValue = fmt.apply(targetValue, this.props.model.formatter.displayFormat);
				}
			}
		}
		
		var validationResult = this._validate(targetId, targetValue);
		
		if (validationResult.isValid) {
			this.props.handleChange({
				key : targetId,
				value : submitValue,
				resetFunction : this._resetField
			});
		}
		
		this.setState({
			value : displayValue,
			validationMessage : validationResult.validationMessage,
			isValid : validationResult.isValid
		});
	}
	
	_resolveEditType() {
		var widget;
		
		if (this.props.formtype === 'view' || 
				this.props.model.editable === false ||
				this.props.formtype === 'modify' && this.props.model.editOptions.updatable === false) {
			widget = <FormControl.Static id={this.props.model.id}>
						{this.state.value}
					</FormControl.Static>;
		}
		else {
			switch (this.props.model.editOptions.editType) {
				case 'text' : 
					widget = <div className="rw-widget">
								<FormControl
									bsClass="rw-input"
									key={this.props.id}
									id={this.props.id}
									type="text"
									value={this.state.value}
									onChange={this._handleChange}>
								 </FormControl>
							</div>;
					break;
				case 'number' :
					widget = <NumberPicker
								readOnly={this.props.readOnly}
								defaultValue={this.props.defaultValue}
								value={this.state.value || 0}
								min={this.props.model.editOptions.validator.min}
								max={this.props.model.editOptions.validator.max}
								step={this.props.model.editOptions.step}
								onChange={this._handleChange}></NumberPicker>;
				 	break;
				case 'time' :
					widget = <DateTimePicker
								readOnly={this.props.readOnly}
								calendar={false}
								defaultValue={this.props.defaultValue}
								value={this.state.value}
								step={this.props.model.editOptions.step}
								format={this.props.model.formatter.displayFormat}
								onChange={this._handleChange}></DateTimePicker>;
					break;
				case 'date' : 
					widget = <DateTimePicker
								readOnly={this.props.readOnly}
								time={false}
								defaultValue={this.props.defaultValue}
								value={this.state.value}
								min={this.props.min}
								max={this.props.max}
								format={this.props.model.formatter.displayFormat}
								onChange={this._handleChange}></DateTimePicker>;
				 	break;
				case 'textarea' : 
					widget = <FormControl
								key={this.props.id}
								id={this.props.id}
								type="textarea"
								value={this.state.value || ''}
								onChange={this._handleChange}></FormControl>;
				 	break;
				case 'file' :
					widget = <FormControl
								key={this.props.id}
								id={this.props.id}
								type="file"
								data-allowed-file-extensions={'["csv", "zip", "xls"]'}
								onChange={this._handleChange}></FormControl>;
					break;
				case 'combo' : 
					widget = <Combobox
								key={this.props.id}
								id={this.props.id}
								filter={this.props.filter}
								displayField={this.props.displayField}
								valueField={this.props.valueField}
								onChange={this._handleChange}
								onSelect={this._handleChange}></Combobox>;
					break;
				case 'checkbox' : 
					widget = <Checkbox
								key={this.props.id}
								id={this.props.id}
								checked={this.state.value}
								onChange={this._handleChange}></Checkbox>;
					break;
				case 'grid' :
					return (
						<div>
							<Row componentClass={ControlLabel}>{this.props.model.name}</Row>
							<Row>
								<Col sm={12}>
									<EditableGrid
										key={this.props.id}
										id={this.props.id}
										data={this.props.value}
										model={this.props.model}
										formtype={this.props.formtype}></EditableGrid>
								</Col>
							</Row>
						</div>
					);
					break;
				default : console.error('Invalid EditType : ' + this.props.model.editOptions.editType);
			}
		}
		
		return (
			<FormGroup bsSize="small" key={this.props.model.id + '_formGroup'} validationState={this._getValidationState(this.props.model.id)}>
				<Row>
					{this.props.useLabel !== false ?
						<Col componentClass={ControlLabel} sm={2}>
							{(this.props.formtype === 'view' || !this.props.model.editOptions.required || 
								this.props.model.editable === false ||
								this.props.formtype === 'modify' && this.props.model.editOptions.updatable === false ?
									'* ' : '') + this.props.model.name
							}
						</Col> : ''
					}
					<Col sm={10}>
						<InputGroup>{widget}</InputGroup>
					</Col>
				</Row>
				<Row>
					<Col smOffset={2} sm={10}>
						<HelpBlock>{this.state.validationMessage}</HelpBlock>
					</Col>
				</Row>
			</FormGroup>
		);
	}
	
	render() {
		return this._resolveEditType();
	}
}

export default WidgetRenderer;