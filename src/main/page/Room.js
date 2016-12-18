import React from 'react';
import Ajax from '../component/Ajax.js';
import Chat from './Chat.js';

import { Table, Modal, ButtonGroup, Button, Glyphicon, Badge } from 'react-bootstrap';

export default class Room extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data : [],
			maxpage : 1,
			activePage : 1,
			mask : false,
			editMode : false,
			roomId : this.props.params.childrenData
		};

		this.bindData = this.bindData.bind(this);
		this.retrieveData = this.retrieveData.bind(this);
		this.openRoom = this.openRoom.bind(this);
		this.closeChat = this.closeChat.bind(this);
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
		let url = "./rooms";
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

	bindData(response) {
		let result = JSON.parse(response);

		let newData = this.state.data.slice(0).concat(result.content);

		this.setState({
			data : newData,
			maxpage : result.totalPages,
			activePage : result.number+1,
			mask : false
		});
	}

	closeChat() {
		this.setState({
			roomId : null,
			data : []
		});
		this.retrieveData();
	}

	sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

	openRoom(event) {
		this.setState({
			roomId : event._dispatchInstances._currentElement.key
		});
	}

	render() {
		if (this.state.roomId) {
			return (
				<Chat
					roomId={this.state.roomId}
					closeChat={this.closeChat} />
			);
		}
		else {
			return (
				<div>
					<Table condensed responsive hover>
						<thead>
							<tr>
								<th colSpan="2">
									<ButtonGroup className="pull-right">
										<Button bsSize="xsmall"  bsStyle="warning" onClick={() => this.setState({editMode : !this.state.editMode})}>편집</Button>
									</ButtonGroup>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.map((obj, i) => {
								return (
									<tr key={obj.id} onDoubleClick={this.openRoom} value={obj.id}>
										<td style={{width:'100%', height:'50px'}}>
											<strong>{obj['memberNames']}</strong><br/>
											{obj['lastMessage']}
											{obj.unreadMessages > 0 ? <Badge>{obj.unreadMessages}</Badge> : null }
										</td>
										<td>
											{this.state.editMode === true ?
												<Button bsSize="xsmall" bsStyle="danger" onClick={this.quitRoom} value={obj['id']}>
													나가기
												</Button> : null
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
}
