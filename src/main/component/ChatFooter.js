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

  render() {
    return (
      <FormGroup>
        <InputGroup style={{width:"100%"}}>
          <FormControl value={this.state.value} onChange={this.handleChange}/>
          <InputGroup.Button>
            <Button onClick={this.handleSubmit}>전송</Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}
