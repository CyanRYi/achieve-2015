import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { DropdownList, Combobox, NumberPicker, Multiselect, SelectList, DateTimePicker } from 'react-widgets';
import { FormControl, Checkbox } from 'react-bootstrap';
import Widget from './WidgetRenderer.jsx';

class EditableGrid extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			data : this.props.data,
			sort : {
				key : 'id',
				direction : 'desc'
			},
			rowData : null
		};
		
		this._addRow = this._addRow.bind(this);
		this._removeRow = this._removeRow.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this._bindData = this._bindData.bind(this);
		this._resolveEditType = this._resolveEditType.bind(this);
	}
	
	componentWillMount() {
		this._bindData();
	}
	
	_resolveEditType(model, value) {
		var widget;
		
		if (this.props.formtype === 'view' || model.editable === false ||
				this.props.formtype === 'modify' && model.editOptions.updatable === false) {
			widget = <FormControl.Static id={model.id}>
						{value}
					</FormControl.Static>;
		}
		else {
			switch (model.editOptions.editType) {
				case 'text' : 
					widget = <FormControl
									bsClass="rw-input"
									key={this.props.id}
									id={this.props.id}
									type="text"
									value={value}
									onChange={this._handleChange}>
								 </FormControl>;
					break;
				case 'number' :
					widget = <NumberPicker
								readOnly={this.props.readOnly}
								defaultValue={this.props.defaultValue}
								value={value || 0}
								min={model.editOptions.validator.min}
								max={model.editOptions.validator.max}
								step={model.editOptions.step}
								onChange={this._handleChange}></NumberPicker>;
				 	break;
				case 'time' :
					widget = <DateTimePicker
								readOnly={this.props.readOnly}
								calendar={false}
								defaultValue={this.props.defaultValue}
								value={value}
								step={model.editOptions.step}
								format={model.formatter.displayFormat}
								onChange={this._handleChange}></DateTimePicker>;
					break;
				case 'date' : 
					widget = <DateTimePicker
								readOnly={this.props.readOnly}
								time={false}
								defaultValue={this.props.defaultValue}
								value={value}
								min={this.props.min}
								max={this.props.max}
								format={model.formatter.displayFormat}
								onChange={this._handleChange}></DateTimePicker>;
				 	break;
				case 'textarea' : 
					widget = <FormControl
								key={this.props.id}
								id={this.props.id}
								type="textarea"
								value={value || ''}
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
								checked={value}
								onChange={this._handleChange}></Checkbox>;
					break;
				default : console.error('Invalid EditType : ' + model.editOptions.editType);
			}
		}
		
		return widget;
	}
	
	_bindData() {
		if (!this.state.data) {
			return (<tr>
						<td sm={12}> 데이터가 없습니다. </td>
					</tr>
			);
		}
		
		var data = typeof this.state.data === 'object' ? [this.state.data] : this.state.data;
		
		
		
		let rowData = this.state.data.sort((a, b) => {
								if (this.state.sort.direction == 'asc') {
									return a[this.state.sort.key]-b[this.state.sort.key];
								}  else {
									return b[this.state.sort.key]-a[this.state.sort.key];
								}
							}
						).map((obj, i) => {
							return (
								<tr>
									{this.props.formtype !== 'view' ?
										<td>
											<Button bsSize="xsmall" onClick={this._removeRow} value={obj.id}>
												<img src={'/images/magnifying-glass-306231_640.png'} width="20"></img>
											</Button>
										</td> : null
									}
									{this.props.model.editOptions.listModel.filter(m => m.hidden !== true).map((col, j) => {
										return (
											<td sm={col.flex}>
												{this.props.formtype === 'view' || col.editable !== true ?
													obj[col.id] :
													this._resolveEditType(col, obj[col.id])
												}
											</td>
										);
									})
										
									}
								</tr>	
							);
						})
		this.setState({rowData : rowData});
	}
	
	_addRow(obj) {
		console.log(this.state.rowData);
		return (
				<tr>
					<td>
						<Button bsSize="xsmall" onClick={this._removeRow} value={obj.id}>
							<img src={'/images/magnifying-glass-306231_640.png'} width="20"></img>
						</Button>
					</td>
				{this.props.model.editOptions.listModel.filter(m => m.hidden !== true).map((col, j) => {
					return (
						<td sm={col.flex} key={col.id + '_' + j}>
							{this.props.formtype === 'view' || col.editable !== true ?
								obj[col.id] || col.defaultValue || '' :
								<Widget
									formtype={this.props.formtype}
									key={j}
									model={col}
									value={obj[col.id]}
									handleChange={this._handleChange}></Widget>
							}
						</td>
					);
				})
					
				}
			</tr>	
		);
	}
	
	_removeRow() {
		
	}
	
	_handleChange() {
		
	}
	
	render() {
		let listModel = this.props.model.editOptions.listModel;
		return (
			<div>
				<Button bsSize="small" className="pull-right" onClick={this._addRow}>추가</Button>
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							{this.props.formtype !== 'view' ?
								<th width="20"></th> : null
							}
							{listModel.filter(m => m.hidden !== true).map((column, i) => {
								return (
									<th sm={column.flex} className={column.id} key={i}>
										{this.props.formtype !== 'view' && column.editOptions && column.editOptions.required ?
												'* ' + column.name : column.name
										}
									</th>	
								);
							})}
						</tr>
					</thead>
					<tbody>
						{this.state.rowData}
					</tbody>
				</Table>
			</div>
		);
	}
	
}

export default EditableGrid;
