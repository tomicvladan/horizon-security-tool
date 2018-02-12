import * as React from 'react';
import { Accordion, Table, Tab, Icon } from 'semantic-ui-react';

import { Captured } from './captured';
import { Json } from '../json/json';

export class Request extends React.Component<any, any> {

    private selectedCaptured = null;

    constructor(props) {
        super(props);
        this.state = { opened: !!this.props.opened };

        this.selectedCaptured = this.props.opened || 1;

        this.switchRequest = this.switchRequest.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onCapturedRequestSelect = this.onCapturedRequestSelect.bind(this);
    }

    switchRequest() {
        const opened = !this.state.opened;
        this.setState({ opened });

        this.props.onSwitch(this.props.method + this.props.url, opened ? 1 : null);
    }

    onAction(action, args) {
        this.props.onAction(action, [this.props.url, this.props.method].concat(args));
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.shouldUpdate) {
            return nextProps.shouldUpdate.url === nextProps.url;
        }
        return true;
    }

    onCapturedRequestSelect(event, data) {
        this.selectedCaptured = data.activeIndex + 1;
        this.props.onSwitch(this.props.method + this.props.url, this.selectedCaptured);
    }

    render() {
        const request = this.props.request || {};

        const capturedItems = request.captured.map((captured, i) => {
            return {
                menuItem: (i + 1) + '.',
                render: () => (
                    <Tab.Pane key={captured.requestId} className='no-border captured' attached={false}>
                        <Captured
                            url={this.props.server + this.props.url}
                            captured={captured}
                            onAction={this.onAction}>
                        </Captured>
                    </Tab.Pane>
                )
            }
        });

        return (
            <div>
                <Accordion.Title active={this.state.opened} onClick={this.switchRequest}>
                    <Icon name='dropdown' />
                    {this.props.method} {this.props.url}
                </Accordion.Title>
                <Accordion.Content active={this.state.opened}>
                    <Table selectable compact='very' basic='very'>
                        <Table.Body>
                            <Table.Row key='1'>
                                <Table.Cell width={4} textAlign='center'>
                                    Request Definition:
                                </Table.Cell>
                                <Table.Cell width={12}>
                                    <Json data={this.props.request.parameters}></Json>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='2'>
                                <Table.Cell width={4} textAlign='center'>
                                    Captured Requests:
                                </Table.Cell>
                                <Table.Cell width={12}>
                                {capturedItems.length ? (
                                    <Tab menu={{ pointing: true }}
                                        className='captured-menu'
                                        panes={capturedItems}
                                        defaultActiveIndex={this.selectedCaptured ? this.selectedCaptured - 1 : 0}
                                        onTabChange={this.onCapturedRequestSelect} />
                                ) : null}  
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </div>
        )
    }
}