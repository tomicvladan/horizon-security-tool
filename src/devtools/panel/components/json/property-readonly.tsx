import * as React from 'react';
import { Table, Accordion, Icon, Input } from 'semantic-ui-react';

export class PropertyReadonly extends React.Component<any, any> {

    render() {
        return (
            <span>
                {this.props.hideName ? null : <span>{this.props.name}:&ensp;</span>}{this.props.value}
            </span>
        )
    }
}