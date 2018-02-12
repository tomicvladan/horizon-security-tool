import * as React from 'react';
import { Table, Accordion, Icon, Input } from 'semantic-ui-react';
import { PropertyReadonly } from './property-readonly';
import { PropertyEditing } from './property-editing';
import { PropertyEditable } from './property-editable';

export class Property extends React.Component<any, any> {

    private value;

    constructor(props) {
        super(props);

        this.state = { editing: false };

        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    edit() {
        this.setState({ editing: true });
    }

    delete(name) {
        this.props.onPropertyDelete(this.props.path, name);
    }

    save(name, value) {
        if (value !== this.props.value) {
            this.props.onValueChange(this.props.path, value);
        }
        
        this.setState({ editing: false });
    }

    cancel() {
        this.setState({ editing: false });
    }


    render() {
        const name = this.props.name;
        const value = this.props.value;
        const hideName = this.props.hideName;
        

        if (!this.props.editable) {
            return (
                <PropertyReadonly
                    name={name}
                    value={value}
                    hideName={hideName}>
                </PropertyReadonly>
            )
        } else {
            if (this.state.editing) {
                return (
                    <PropertyEditing
                        name={name}
                        value={value}
                        hideName={hideName}
                        valueEditable={true}
                        onSave={this.save}
                        onCancel={this.cancel}>
                    </PropertyEditing>
                )
            } else {
                return (
                    <PropertyEditable
                        name={name}
                        value={value}
                        hideName={hideName}
                        onEdit={this.edit}
                        onDelete={this.delete}>
                    </PropertyEditable>
                )
            }
        }

    }
}