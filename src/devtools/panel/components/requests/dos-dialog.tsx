import * as React from 'react';
import { Table, Accordion, Icon, Input, Button } from 'semantic-ui-react';
import { PropertyEditing } from '../json/property-editing';

export class DosDialog extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.state = { count: '', throttle: '' };

}

  onAction(action, args) {
    this.props.onAction(action, [this.props.captured.requestId]
        .concat(Array.prototype.slice.call(args)));
  }

  onValueChange(e, field) {
    const state = {};
    state[field] =  e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div>
        <h3 className="text-danger">Warning! DoS Attack.</h3>
        <div>
          <label>Count: </label>
          <Input size='mini'
            placeholder={'Number of requests to send'}
            onChange={e => this.onValueChange(e, 'count')} />
          <br/><br/>
        </div>
        <div>
          <label>Throttle: </label>
          <Input size='mini'
            placeholder={'Interval, in ms, between each request'}
            onChange={e => this.onValueChange(e, 'throttle')} />
          <br/><br/><br/>
        </div>
        <div>
          <Button basic onClick={() => this.props.onAttack(this.state.count, this.state.throttle)}>
            <Icon name='fire'></Icon> Attack
          </Button>
          &ensp;&ensp;
          <Button basic onClick={this.props.onCancel}>Cancel
          </Button>
        </div>
      </div>
    )
  }
}