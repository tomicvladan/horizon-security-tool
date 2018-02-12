import * as React from 'react';
import { Accordion, Icon, Table, Popup, Button } from 'semantic-ui-react';
import { Property } from '../json/property';
import { NewProperty } from '../json/new-property';
import { Actions } from '../../../../common/constants';

export class Form extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = { opened: !!this.props.opened };

        this.switchSite = this.switchSite.bind(this);
        this.onAction = this.onAction.bind(this);
    }

    switchSite() {
        const opened = !this.state.opened;

        this.setState({ opened });

        this.props.onSwitch(1, this.props.method + this.props.action, opened);
    }

    onAction(action, args) {
        this.props.onAction(action, [this.props.action, this.props.method]
            .concat(Array.prototype.slice.call(args)));
    }

    render() {
        const params = this.props.params;
        const items = [], self = this;

        if (params) {
            for (let param in params) {
                if (params.hasOwnProperty(param)) {
                    const paramData = params[param];

                    items.push((
                        <div key={param}>
                            <Popup
                                trigger={<a><Icon name='info' /></a>}
                                content={
                                    <div>
                                        <span>Type: <b>{paramData.type}</b></span>
                                        <br/>
                                        <span>
                                            {paramData.options ? 'Options: ' : null }
                                            {paramData.options ? (
                                                paramData.options.map((option, i) => {
                                                    return <span key={i}>{option}{i !== paramData.options.length - 1 ? ', ' : ''}</span>
                                                })
                                            ) : null}
                                        </span>
                                    </div>
                                }
                                position='top right' />
                            &ensp;&ensp;
                            <Property
                                name={param}
                                value={paramData.value}
                                path={param}
                                editable={true}
                                onValueChange={function() { self.onAction(Actions.UPDATE_FORM_PARAMETER, arguments) }}
                                onPropertyDelete={function() { self.onAction(Actions.DELETE_FORM_PARAMETER, arguments) }}>
                            </Property>                            
                        </div>
                    ))
                }
            }
        }

        return (
            <div>
                <Accordion.Title active={this.state.opened} onClick={this.switchSite}>
                    <Icon name='dropdown' />
                    {this.props.method} {this.props.action}
                </Accordion.Title>
                <Accordion.Content active={this.state.opened}>
                    <Table selectable unstackable compact='very' basic='very'>
                        <Table.Body>
                            <Table.Row key='1'>
                                <Table.Cell width={4} textAlign='center'>
                                    Form Parameters:
                                </Table.Cell>
                                <Table.Cell width={12}>
                                    {items}
                                    <NewProperty
                                                onNewProperty={function(path, name, value) { self.onAction(Actions.NEW_FORM_PARAMETER, [name, value]) }}
                                                option='value'
                                                nameEditable='true'>
                                    </NewProperty>
                                    <br/><br/>
                                    <Button basic size='small' onClick={function() { self.onAction(Actions.SUBMIT_FORM, [self.props.params])}}>
                                        <Icon name='send'></Icon> Submit
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </div>
        );
    }
}