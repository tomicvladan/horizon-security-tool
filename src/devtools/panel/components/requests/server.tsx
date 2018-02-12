import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { Request } from './request';

export class Server extends React.Component<any, any> {

    private openedRequests = {};

    constructor(props) {
        super(props);
        this.state = { opened: !!this.props.opened };
        this.openedRequests = this.props.opened || {};

        this.switchServer = this.switchServer.bind(this);
        this.onAction = this.onAction.bind(this);
        this.updateOpened = this.updateOpened.bind(this);
    }

    switchServer() {
        const opened = !this.state.opened;
        this.setState({ opened });

        this.props.onSwitch(1, this.props.server.url, opened ? this.openedRequests : false);
    }

    onAction(action, args) {
        this.props.onAction(action, [this.props.server.url].concat(args));
    }
    
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.shouldUpdate) {
            return nextProps.shouldUpdate.site === nextProps.server.url;
        }
        return true;
    }

    updateOpened(request, opened) {
        if (opened) {
            this.openedRequests[request] = opened;
        } else {
            delete this.openedRequests[request];
        }
        this.props.onSwitch(2, this.props.server.url, this.openedRequests);
    }

    render() {
        const server = this.props.server || { links: [] };

        const linkItems = [];

        let i = 0;

        server.links.forEach(request => {
            if (request.methods) {
                for (let method in request.methods) {
                    if (request.methods.hasOwnProperty(method)) {
                        linkItems.push((
                            <Request
                                    server={server.url}
                                    url={request.url}
                                    method={method}
                                    request={request.methods[method]}
                                    onAction={this.onAction}
                                    opened={this.openedRequests[method + request.url]}
                                    onSwitch={this.updateOpened}
                                    shouldUpdate={this.props.shouldUpdate}
                                    key={method + request.url}>
                            </Request>
                        ));
                    }
                }
            }
        });

        return (
            <div>
                <Accordion.Title active={this.state.opened} onClick={this.switchServer}>
                    <Icon name='dropdown' />
                    {server.url}
                </Accordion.Title>
                <Accordion.Content active={this.state.opened}>
                    <Accordion fluid styled className='requests'>
                        {linkItems}
                    </Accordion>
                </Accordion.Content>
            </div>
        );
    }
}