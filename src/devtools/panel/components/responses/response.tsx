import * as React from 'react';
import { Table, Accordion, Icon } from 'semantic-ui-react';

export class Response extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = { opened: !!this.props.opened };

        this.switchSite = this.switchSite.bind(this);
    }

    switchSite() {
        const opened = !this.state.opened;

        this.setState({ opened });

        this.props.onSwitch(3, this.props.response.id, opened);
    }

    render() {
        const response = this.props.response;
        let headers = [];

        if (headers) {
            headers = response.headers.map((header, i) => {
                return <div key={i}>{header}</div>
            })
        }

        return (
            <div>
                <Accordion.Title active={this.state.opened} onClick={this.switchSite} className='no-border'>
                    {this.props.ordinal + 1}. <Icon name='dropdown' />
                    {response.method} {response.url}
                </Accordion.Title>
                <Accordion.Content active={this.state.opened}>
                    <Table selectable compact='very' basic='very'>
                        <Table.Body>
                            <Table.Row key='1'>
                                <Table.Cell width={4}>
                                    Response Status:
                                </Table.Cell>
                                <Table.Cell width={12} className="request-data">
                                    {response.status.code} {response.status.text}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='2'>
                                <Table.Cell width={4}>
                                    Request Parameters:
                                </Table.Cell>
                                <Table.Cell width={12} className="request-data">
                                    <pre>{JSON.stringify(response.params, null, 2)}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='3'>
                                <Table.Cell width={4}>
                                    Response Headers:
                                </Table.Cell>
                                <Table.Cell width={12} className="request-data">
                                    {headers}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='4'>
                                <Table.Cell width={4}>
                                    Response:
                                </Table.Cell>
                                <Table.Cell width={12} className="request-data">
                                    <pre>{JSON.stringify(response.result, null, 2)}</pre>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </div>
        );
    }
}