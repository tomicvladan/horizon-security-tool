import * as React from 'react';
import { JsonLevel } from './json-level';
import { Property } from './property';
import { NewProperty } from './new-property';

export class Json extends React.Component<any, any> {

    render() {
        const data = this.props.data;

        if (data !== null && typeof(data) === 'object' || typeof(data) === 'function') {
            return (
                <JsonLevel
                    data={this.props.data}
                    level={0}
                    path={[]}
                    editable={this.props.editable}
                    onValueChange={this.props.onValueChange}
                    onPropertyDelete={this.props.onPropertyDelete}
                    onNewProperty={this.props.onNewProperty}>
                </JsonLevel>
            )
        } else {
            if (data) {
                return (
                    <Property
                        name={null}
                        value={data}
                        path={[]}
                        editable={this.props.editable}
                        hideName='true'
                        onValueChange={this.props.onValueChange}
                        onPropertyDelete={this.props.onPropertyDelete}>
                    </Property>
                )
            } else {
                return (
                    <NewProperty nameEditable='false'
                                path={[]}
                                hideName='true'
                                onNewProperty={this.props.onNewProperty}>
                    </NewProperty>
                )
            }
        }
    }
}