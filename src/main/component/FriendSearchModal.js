import React from 'react';
import Ajax from './Ajax.js';

import {Table, Modal, FormControl, Button} from 'react-bootstrap';


export default class FriendSearchModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data : [],
      maxpage : 1,
			activePage : 1,
			mask : false,
      searchParam : ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.bindData = this.bindData.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

  handleChange(event) {
    this.setState({searchParam : event.target.value});

    if (this.state.searchParam.length < 2) return;

    let activePage = this.state.activePage;
		let pageSize = 20;
		let url = "./friends/search";
		let method = 'POST';

		let searchParams = {
				["page"] : activePage-1,
				["size"] : pageSize,
				["params"] : this.state.searchParam
		};

		this.setState({mask : true});

		this.sendProxyRequest(url, method, this.bindData, null, searchParams);
  }

  addFriend(event) {
		let url = "./friends";
		let method = 'POST';

    this.sendProxyRequest(url, method, null, null, {id : event.target.value});
  }

  sendProxyRequest(url, method, success, error, requestParam) {
		const AJAX = new Ajax();

		AJAX.call(url, method, success, error, requestParam);
	}

  bindData(response) {
		let result = JSON.parse(response);

		this.setState({
      data : result.content,
			maxpage : result.totalPages,
			activePage : result.number+1,
			mask : false
		});
	}

  render() {
    return (
      <Modal
        show={this.props.open}
        onHide={this.props.hide}
        dialogClassName="friendSearch">
          <Modal.Header closeButton>
            <FormControl
              type="text"
              value={this.state.searchParam}
              placeholder="이름 혹은 이메일"
              onChange={this.handleChange}
            />
          </Modal.Header>
          <Modal.Body>
          <Table condensed responsive hover>
            <thead>
              <tr>
                <th md={2}></th>
                <th md={3}></th>
                <th md={5}></th>
                <th md={2}></th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((obj, i) => {
                return (
                  <tr key={obj.id}>
                    <td>{obj['image']}</td>
                    <td><strong>{obj['name']}</strong></td>
                    <td>{obj['comment']}</td>
                    <td>
                      <Button bsSize="xsmall" onClick={this.addFriend} value={obj.id}>추가</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          </Modal.Body>
      </Modal>
    );
  }
}
