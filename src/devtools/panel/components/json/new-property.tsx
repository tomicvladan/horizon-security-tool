import * as React from 'react';
import { Table, Accordion, Icon, Input, Dropdown } from 'semantic-ui-react';
import { PropertyReadonly } from './property-readonly';
import { PropertyEditing } from './property-editing';
import { PropertyEditable } from './property-editable';

export class NewProperty extends React.Component<any, any> {

    
    
    private options = [
        {
            text: 'Value',
            value: 'value'
        }, {
            text: 'Object',
            value: 'object'
        }, {
            text: 'Array',
            value: 'array'
        }
    ]


    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            value: null,
            option: this.props.option ? this.props.option : this.options[0].value,
            editing: false
        }

        this.onAdd = this.onAdd.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
    }

    onAdd() {
        this.setState({ editing: true });
    }

    onOptionChange(e, data) {
        let value = '';

        if (data.value === 'object') {
            value = '{ }';
        } else if (data.value === 'array') {
            value = '[ ]'
        }
        this.setState({ option: data.value, value });
    }

    onSave(name, value) {
        if (this.state.option === 'object') {
            value = {};
        } else if (this.state.option === 'array') {
            value = []
        }

        this.props.onNewProperty(this.props.path, name, value);
        this.setState({ editing: false });
    }

    onCancel() {
        this.setState({ editing: false });
    }


    render() {

        if (!this.state.editing) {
            return (
                <span className='new-property'>
                    <a  onClick={this.onAdd} title='Add'>
                        <Icon name='plus' />
                    </a>
                    {!this.props.option ? (
                        <Dropdown inline options={this.options}
                            defaultValue={this.state.option}
                            onChange={this.onOptionChange} />
                    ) : ''}
                </span>
            )
        } else {
            return (
                <span>
                    <PropertyEditing
                        name={this.state.name}
                        value={this.state.value}
                        hideName={this.props.hideName}
                        valueEditable={this.state.option === 'value'}
                        onSave={this.onSave}
                        onCancel={this.onCancel}
                        nameEditable={this.props.nameEditable}
                        namePlaceholder={this.props.namePlaceholder}
                        valuePlaceholder={this.props.valuePlaceholder}>
                    </PropertyEditing>
                </span>
            )
        }
    }
}