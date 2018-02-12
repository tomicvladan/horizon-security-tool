import * as React from 'react';
import { Accordion } from 'semantic-ui-react';
import { Server } from './server';
import { NewProperty } from '../json/new-property';
import { Actions } from '../../../../common/constants';

export class Requests extends React.Component<any, any> {

    render() {
        const requests = this.props.requests || [];
        let servers = [];
        const self = this;

        servers = requests.map(server => {
            return (
                <Server server={server}
                    key={server.url}
                    shouldUpdate={this.props.shouldUpdate}
                    opened={this.props.opened[server.url]}
                    onSwitch={this.props.onSwitch}
                    onAction={this.props.onAction}>
                </Server>
            )
        });

        return (
            <div>
                {servers.length ?
                    <Accordion fluid styled>{servers}</Accordion> : null
                }
                <div className='new-request'>
                    <span>New Request&ensp;&ensp;</span>
                    <NewProperty
                            onNewProperty={function(path, name, value) {
                                self.props.onAction(Actions.NEW_REQUEST, [name, value])
                            }}
                            option='value'
                            nameEditable='true'
                            namePlaceholder='Method'
                            valuePlaceholder='URL (example: http://domain.com/path)'>
                    </NewProperty>
                </div>
            </div>
        )
    }
}