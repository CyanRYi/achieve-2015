import React from 'react';
import Ajax from '../component/Ajax.js';
import { withRouter } from 'react-router';

import { Table, Modal, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import FriendSearch from '../component/FriendSearchModal.js';

class Friend extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data : [],
			maxpage : 1,
			activePage : 1,
			mask : false,
			search : false,
			editMode : false
		};

		this.retrieveData = this.retrieveData.bind(this);
		this.bindData = this.bindData.bind(this);
		this.getFriendInfoCallback = this.getFriendInfoCallback.bind(this);
		this.removeFriend = this.removeFriend.bind(this);
		this.openRoom = this.openRoom.bind(this);
	}

	componentWillMount() {
		this.retrieveData();
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	retrieveData(page, params) {
		let activePage = page ? page : 1;
		let pageSize = 20;
		let url = "./friends";
		let method = params ? 'POST' : 'GET';

		let searchParams = {};

		if (params) {
			searchParams = {
					["page"] : activePage-1,
					["size"] : pageSize,
					["params"] : params
			};

			url += '/search';
		}
		else {
			url += '?page=' + (activePage-1) + '&size=' + pageSize;
		}

		this.setState({mask : true});

		this.sendProxyRequest(url, method, this.bindData, null, searchParams);
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	removeFriend(event) {
		let url = "./friends";
		let method = 'DELETE';

		this.sendProxyRequest(url, method, null, null, {id : event.target.value});
	}

	bindData(response) {
		let result = JSON.parse(response);

		result.content.map((obj) => {
				this.sendProxyRequest("./users/" + obj.friendId, "GET", this.getFriendInfoCallback);
		});

		this.setState({
			maxpage : result.totalPages,
			activePage : result.number+1,
			mask : false
		});
	}

	getFriendInfoCallback(response) {
		let info = JSON.parse(response);

		let newData = this.state.data.slice(0);
		newData.push(info);

		this.setState({
			data : newData
		});
	}

	openRoom(event) {
		let url = "./rooms/" + event._dispatchInstances._currentElement.key;
		let method = 'GET';

		var _promise = new Promise(function (resolve, reject) {
			new Ajax().call(url, method, resolve, reject);
		});

		let router = this.props.router;
		_promise.then(
			function(response) {
				let roomId = JSON.parse(response).id;
				router.push("/rooms/" + roomId);
			}, function(error) {
				console.log(error);
			}
		)

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
				<FriendSearch
					open={this.state.search}
					hide={() => this.setState({search : false})} />
				<Table condensed responsive hover>
					<thead>
						<tr>
							<th></th>
							<th style={{width:'33%'}}></th>
							<th style={{width:'67%'}}>
								<ButtonGroup className="pull-right">
									<Button bsSize="xsmall"  onClick={() => this.setState({search : true})}>
										<Glyphicon glyph="search" />
										친구찾기
									</Button>
									<Button bsSize="xsmall"  bsStyle="warning" onClick={() => this.setState({editMode : !this.state.editMode})}>편집</Button>
								</ButtonGroup>
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this.state.data.map((obj, i) => {
							return (
								<tr key={obj.id} onDoubleClick={this.openRoom} value={obj.id}>
									<td>{obj['image']}</td>
									<td><strong>{obj['name']}</strong></td>
									<td>{obj['comment']}</td>
									<td>
										{this.state.editMode === true ?
											<ButtonGroup>
												<Button bsSize="xsmall" bsStyle="danger" onClick={this.removeFriend} value={obj['id']}>
													삭제
												</Button>
												<Button bsSize="xsmall" bsStyle="warning" value={obj['id']}>
													차단
												</Button>
											</ButtonGroup> : null
										}
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default withRouter(Friend);
