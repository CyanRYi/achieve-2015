import React from 'react';

import { Well } from 'react-bootstrap';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let pullClass = this.props.isMine ? 'pull-right' : 'pull-left'
    return (
      <div style={{width:"100%"}}>
        <div style={{width:"51%"}} className={pullClass}>
          <span className={pullClass}><strong>{this.props.name}</strong></span><br/>
          <Well style={{width:"80%"}} className={pullClass}>
            {this.props.content}
          </Well>
        </div>
      </div>
    );
  }

}
