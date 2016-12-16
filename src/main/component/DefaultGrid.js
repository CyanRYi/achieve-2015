import React from 'react';
import { Panel, Table, ButtonGroup, Button, Modal, Checkbox } from 'react-bootstrap';
import Ajax from './Ajax.js';
import Pager from './DefaultPager.jsx';
import Searchform from './DefaultSearchform.jsx';
import DynamicGridSizer from './DynamicGridSizer.jsx';
import Confirm from './ConfirmPopup.jsx';
import Alert from './AlertPopup.jsx';

class DefaultGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data : [],
			maxpage : 1,
			activePage : 1,
			size : this.props.size,
			total : 0,
			sort : {
				key : 'id',
				direction : 'desc'
			},
			mask : false,
			editform : false,
			editData : {},
			alert : false,
			confirm : false,
			selected : []
		};

		this._retrieveData = this._retrieveData.bind(this);
		this._refreshGrid = this._refreshGrid.bind(this);
		this._removeItems = this._removeItems.bind(this);
		this._saveData = this._saveData.bind(this);
		this._viewData = this._viewData.bind(this);
		this._saveCallback = this._saveCallback.bind(this);
		this._changeGridSize = this._changeGridSize.bind(this);
		this._changePage = this._changePage.bind(this);
		this._bindData = this._bindData.bind(this);
		this._handleSelection = this._handleSelection.bind(this);
	}

	componentWillMount() {
		this._retrieveData();
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	render() {
		let col = this.props.model;
		return (
			<div>
				<Modal
					show={this.state.mask}
					onHide={() => this.setState({mask : false})}
					container={this}
					dialogClassName="loadingMask">
						<img src={'/images/loading.gif'} width="100" height="100" />
				</Modal>
				{this.props.gridActions.remove ?
					<div>
						<Alert
							open={this.state.alert}
							hide={this._refreshGrid}
							bodyContent="정상적으로 삭제되었습니다."></Alert>
						<Confirm
							open={this.state.confirm}
							hide={() => this.setState({confirm : false})}
							title="확인"
							bodyContent="정말로 삭제하시겠습니까?"
							cancleButton="취소"
							confirmButton="확인"
							confirmCallback={this._removeItems}></Confirm>
					</div> : null
				}
				{this.props.useSearchform === true ?
					<Panel>
						<Searchform
							action={this._retrieveData}
							model={this.props.model.filter(v => v.searchable == true)}>
						</Searchform>
					</Panel> : null
				}
				<Panel header={this.props.title} bsStyle="info" >
					{this.props.useDynamicsize === true ?
						<DynamicGridSizer
							size={this.props.size}
							sizeOptions={this.props.sizeOptions}
							action={this._changeGridSize}>
						</DynamicGridSizer> : null
				    }
					{this.props.useButtongroup !== false ?
						<ButtonGroup bsSize="small" className="pull-right">
							{this.props.gridActions.create ?
								<Button bsStyle="success" onClick={() => this.setState({editform : 'create'})}>
									{this.props.gridActions.create}
								</Button> : null
							}
							{this.props.gridActions.remove ?
								<Button bsStyle="danger" onClick={() => this.setState({confirm : true})}>
									{this.props.gridActions.remove}
								</Button> : null
							}
							{this.props.gridActions.refresh ?
								<Button bsStyle="warning" onClick={this._refreshGrid}>
									{this.props.gridActions.refresh}
								</Button> : null
							}
				        </ButtonGroup> : null
				    }
					<Table striped bordered condensed hover>
						<thead>
							<tr>
								{this.props.gridActions.remove && this.props.multipleSelection ?
									<th width="20">
										<input type="checkbox" className="in-grid-checkbox-header" value="all" onChange={this._handleSelection}></input>
									</th> : null
								}
								{this.props.useDetailView ?
									<th width="20"></th> : null
								}
								{col.filter(c => c.hidden !== true).map((column, i) => {
									return (
										<th sm={column.flex} className={column.id} key={i}>{column.name}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{this.state.data.map((obj, i) => {
								return (
									<tr key={obj.id} onClick={this._handleSelection}>
										{this.props.gridActions.remove && this.props.multipleSelection ?
											<td>
												<input type="checkbox" className="in-grid-checkbox" value={obj.id}></input>
											</td> : null
										}
										{this.props.useDetailView ?
											<td>
												<Button bsSize="xsmall" onClick={this._viewData} value={obj.id}>
													<img src={'/images/magnifying-glass-306231_640.png'} width="20"></img>
												</Button>
											</td> : null
										}
										{col.filter(c => c.hidden !== true).map((column, j) => {
											let key = '' + i + '-' + j;
											return (
												<td sm={column.flex} className={column.id} key={key}>
													{obj[column.id]}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</Table>
				{this.props.usePager !== false ?
					<div className="pager">
						<Pager
							activePage={this.state.activePage}
							lastPage={this.state.maxpage}
							action={this._changePage}></Pager>
					</div> : null
				}
		        </Panel>
			</div>
		);
	}

	// Common Request Sender
	_sendProxyRequest(url, method, callback, requestParam, isAsync) {
		const AJAX = new Ajax();

		var paramKeys = Object.keys(requestParam);

		let fileParams = []

		for (var i=0;i<paramKeys.length;i++) {
			let paramModel = this.props.model.filter(m => m.id == paramKeys[i]);

			if (paramModel.length > 0) {
				if (paramModel[0].editOptions && paramModel[0].editOptions.editType === 'file') {

					if (fileParams.length === 0) {
						fileParams.push({
							key : 'id',
							value : requestParam.id
						})
					}

					fileParams.push({
						key : [paramKeys[i]],
						value : requestParam[paramKeys[i]]
					});

					requestParam[paramKeys[i]] = requestParam[paramKeys[i]].name;
				}
			}
		}

		if (fileParams.length === 0) {
			AJAX.call(url, method, callback, requestParam, isAsync);
		}
		else {
			AJAX.call(url, method, null, requestParam, false);
			AJAX.sendFile(url, "POST", callback, fileParams, false);
		}
	}

	// Save Action. (include Create and Update)
	_saveData(submitParam) {
		this._sendProxyRequest(this.props.source, "PUT", this._saveCallback, submitParam);
	}

	// Open Editform for Update Data
	_viewData(event) {
		let targetData = this.state.data.filter(v => v.id == event.target.parentElement.value)[0];

		this.setState({
			editData : targetData,
			editform : 'view'
		});
	}

	// Retrieve Action
	_retrieveData(page, size, params) {
		let activePage = page ? page : 1;
		let pageSize = size ? size : this.state.size;
		let url = this.props.source;
		let method = params ? 'POST' : 'GET';

		let searchParams = {};

		if (params) {
			searchParams = {
					["page"] : activePage-1,
					["size"] : pageSize,
					["params"] : params
			};

			url = this.props.source + '/search';
		}
		else {
			url = this.props.source + '?page=' + (activePage-1) + '&size=' + pageSize;
		}

		this.setState({mask : true});

		this._sendProxyRequest(url, method, this._bindData, searchParams);
	}

	// Delete Action
	_removeItems() {
		this.setState({confirm : false});

		this._sendProxyRequest(this.props.source, "DELETE", () => this.setState({alert : true}), this.state.selected);
	}

	_saveCallback() {
		this.setState({
			editform : false,
			editData : {}
		});
		// 저장되었습니다 확인창?
		this._retrieveData();
	}

	// Callback after change data. bind data to grid
	_bindData(response) {
		let result = JSON.parse(response);

		result.content.sort((a, b) => {
				if (this.state.sort.direction == 'asc') {
					return a[this.state.sort.key]-b[this.state.sort.key];
				}  else {
					return b[this.state.sort.key]-a[this.state.sort.key];
				}
			}
		);

		this.setState({
			data : result.content,
			maxpage : result.totalPages,
			activePage : result.number+1,
			size : result.size,
			mask : false
		});
	}

	// Initialize Grid and data Refresh
	_refreshGrid() {
		this.setState({
			confirm : false,
			alert : false,
			mask : false
		});
		this._retrieveData();
	}

	// Event Callback for DynamicGridSizer
	_changeGridSize(size) {
		this._retrieveData(1, size);
	}

	// Event Callback for Pager
	_changePage(activePage) {
		this._retrieveData(activePage, this.state.size);
	}

	// Event Callback for ingrid-checkboxes
	_handleSelection(event) {
		if (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'IMG') {
			return;
		}

		// Selection에 대한 Callback이 존재할때
		if (this.props.selectionCallback) {
			let targetData;

			let eventTarget = event.target;

			for (var i = eventTarget.nodeName;eventTarget.nodeName === 'BODY' || eventTarget.nodeName === 'TR';eventTarget = eventTarget.parentElement) {
				if (event.target.nodeName === 'TR') {
					targetData = this.state.data.filter(v => v.id == event.target.key)[0];
				}
			}
			this.props.selectionCallback(targetData);
		}

		// 삭제 기능이 있고, Single Selection 모드일때
		if (this.props.gridActions.remove && !this.props.multipleSelection) {
		}

		// 삭제기능이 있고, multiple Selection 모드일때
		var checkbox;
		var eventKey;

		if (event.target.nodeName === 'INPUT' && event.target.type ==='checkbox') {
			checkbox = event.target;
			eventKey = checkbox.value;
		}
		else {
			checkbox = event.target.parentElement.children[0].children[0];
			eventKey = checkbox.value;
		}

		let selection = this.state.selected.slice();

		if (eventKey !== 'all') {
			let keyIdx = selection.indexOf(eventKey);

			if (keyIdx != -1 && checkbox.checked) {
				selection.splice(keyIdx, 1);
				checkbox.checked = false;
				if (document.getElementsByClassName('in-grid-checkbox-header')[0].checked) {
					document.getElementsByClassName('in-grid-checkbox-header')[0].checked = false;
				}
			}
			else if(keyIdx == -1 && !checkbox.checked) {
				selection.push(eventKey);
				checkbox.checked = true;
			}
		}
		else {
			var checkboxes = document.getElementsByClassName('in-grid-checkbox');

			selection = [];

			for (var i = 0;i<checkboxes.length;i++) {
				checkboxes[i].checked = checkbox.checked;

				if (checkbox.checked) {
					selection.push(checkboxes[i].value);
				}
			}
		}
		this.setState({selected : selection});
	}

}

DefaultGrid.defaultProps = {
	useSearchform: false,
	useButtongroup: false,
	usePager: true,
	useDynamicsize : false,
	multipleSelection : true,
	size : 10
}

DefaultGrid.propTypes = {
	useSearchform: React.PropTypes.bool,
	useButtongroup: React.PropTypes.bool,
	usePager: React.PropTypes.bool,
	useDynamicsize : React.PropTypes.bool,
	multipleSelection : React.PropTypes.bool,

	title : React.PropTypes.string,
	model : React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	size : React.PropTypes.number,
	sizeOptions : React.PropTypes.arrayOf(React.PropTypes.number)
}
export default DefaultGrid;
