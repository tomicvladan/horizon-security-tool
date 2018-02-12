import * as React from 'react';
import { Table, Accordion, Icon, Input } from 'semantic-ui-react';

export class PropertyEditing extends React.Component<any, any> {

    private value;

    constructor(props) {
        super(props);

        this.state = { name: this.props.name, value: this.props.value };

        this.onSave = this.onSave.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }

    onSave() {
        this.props.onSave(this.state.name, this.state.value);
    }


    onValueChange(e) {
        this.setState({ value: e.target.value });
    }

    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        const name = this.state.name;
        const value = this.state.value;
        const valueEditable = this.props.valueEditable;
        const nameEditable = this.props.nameEditable;
        let nameItem = null;

        if (!this.props.hideName) {
            nameItem = (
                <span>
                    {nameEditable ? (
                    <Input size='mini'
                        defaultValue={name}
                        placeholder={this.props.namePlaceholder || 'Name'}
                        onChange={e => this.onNameChange(e)} />
                    ) : name} :&ensp;
                </span>
            )
        }

        return (
            <span>
                {nameItem}
                {valueEditable ? (
                    <Input size='mini'
                        defaultValue={value}
                        placeholder={this.props.valuePlaceholder || 'Value'}
                        onChange={e => this.onValueChange(e)} />
                ) : value}
                
                <a className='edit' onClick={this.onSave} title='Save'>
                    <Icon name='checkmark' />
                </a>
                <a className='edit' onClick={this.props.onCancel} title='Cancel'>
                    <Icon name='remove' />
                </a>
            </span>
        )

    }
}