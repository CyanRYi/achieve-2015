import React from 'react';
import Ajax from '../component/Ajax.js';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

export default class ChatFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value : ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }

  handleChange(event) {
    let value = event.target.value;

    if (value.length <= 150) {
      this.setState({
        value : value
      })
    }
  }

  handleSubmit() {
    this.props.onSubmit(this.state.value);
    this.setState({
      value : ''
    })
  }

  handleKeyEvent(event) {
    if (event.key === "Enter") {
        this.handleSubmit();
    }
  }

  render() {
    return (
      <FormGroup>
        <InputGroup style={{width:"100%"}}>
          <FormControl autoFocus
            value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyEvent}/>
          <InputGroup.Button>
            <Button onClick={this.handleSubmit}>전송</Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}
