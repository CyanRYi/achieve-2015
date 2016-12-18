import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

export default class ChatHeader extends React.Component {
  constructor(props) {
    super(props);

    this.getConnectState = this.getConnectState.bind(this);
  }

  getConnectState() {
		switch (this.props.state) {
			case 1: return 'green';
			case 3: return 'red';
			default: return 'yellow';
		}
	}

  render() {
    let memberNames = [];
    this.props.members.map((obj) => {memberNames.push(obj.name);});
    return (
      <div style={{height:"40px", backgroundColor:"#4ABFD3"}}>
        <span className="pull-left"
          style={{fontSize: '200%', color : this.getConnectState(), height:'40px'}}>●</span>
        <span className="pull-left" style={{fontSize:'150%'}}>
          <strong>{memberNames.toString()}</strong>
        </span>
        <Button className="pull-right" style={{height:'40px', width:'40px'}} onClick={this.props.handleClose}>
          <Glyphicon glyph="remove" />
        </Button>
      </div>
    );
  }
}
