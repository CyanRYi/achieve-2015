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
    return (
      <div style={{height:"30px"}}>
        <span className={"pull-left"} style={{color : this.getConnectState()}}>●</span>
        <Button className="pull-right" bsSize="xsmall" onClick={this.props.handleClose}>
          <Glyphicon glyph="remove" />
        </Button>
      </div>
    );
  }
}
