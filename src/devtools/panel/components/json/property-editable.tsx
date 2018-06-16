import * as React from 'react';
import { Table, Accordion, Icon, Input } from 'semantic-ui-react';

export class PropertyEditable extends React.Component<any, any> {


    render() {
        const name = this.props.name;
        const value = this.props.value;


        return (
            <span>
                {this.props.hideName ? null : <span className='label'>{name}</span>}
                {this.props.hideName ? null : <span className='label'>:&ensp;</span>}
                <span className='label'>{value}</span>
                <a className='edit' onClick={this.props.onEdit} title='Edit value'>
                    <Icon name='write' />
                </a>
                <a className='edit' onClick={() => this.props.onDelete(this.props.name)} title='Remove'>
                    <Icon name='remove' />
                </a>
            </span>
        )

    }
}