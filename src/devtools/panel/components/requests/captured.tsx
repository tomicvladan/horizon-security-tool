import * as React from 'react';
import { Icon, Popup, Button } from 'semantic-ui-react';
import { Json } from '../json/json';
import { Property } from '../json/property';
import { NewProperty } from '../json/new-property';
import { PropertyEditing } from '../json/property-editing';
import { Actions } from '../../../../common/constants';
import { DosDialog } from './dos-dialog';


export class Captured extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            cloneWindowOpen: false,
            dosWindowOpen: false
        }

        this.switchCloneWindow = this.switchCloneWindow.bind(this);
        this.onAction = this.onAction.bind(this);
    }

    switchCloneWindow(open) {
        this.setState({
            cloneWindowOpen: open
        })
    }

    switchDosWindow(open) {
        this.setState({
            dosWindowOpen: open
        })
    }

    onAction(action, args) {
        this.props.onAction(action, [this.props.captured.requestId]
            .concat(Array.prototype.slice.call(args)));
    }

    render() {
        let headers = [];
        let self = this;

        if (this.props.captured.headers) {
            headers = this.props.captured.headers.map((header, i) => {
                return (
                    <div key={i}>
                        <Property
                            name={header.name}
                            value={header.value}
                            path={header.name}
                            editable={true}
                            onValueChange={function() { self.onAction(Actions.UPDATE_REQUEST_HEADER, arguments) }}
                            onPropertyDelete={function() { self.onAction(Actions.DELETE_REQUEST_HEADER, arguments)}}>
                        </Property>
                    </div>
                )
            })
        }

        headers.push((
            <NewProperty key={headers.length}
                        onNewProperty={function() { self.onAction(Actions.NEW_REQUEST_HEADER, arguments)}}
                        option='value'
                        nameEditable='true'>
            </NewProperty>
        ))


        return (
            <div className='captured'>
                <div>
                    <h4>Headers</h4>
                    {headers}
                </div>
                <div className='section'>
                    <h4>Parameters</h4>
                    <Json
                        data={this.props.captured.parameters}
                        editable='true'
                        onValueChange={function() { self.onAction(Actions.UPDATE_REQUEST_VALUE, arguments)}}
                        onPropertyDelete={function() { self.onAction(Actions.DELETE_REQUEST_PROPERTY, arguments)}}
                        onNewProperty={function() { self.onAction(Actions.NEW_REQUEST_PROPERTY, arguments)}}>
                    </Json>
                </div>
                <div className='section'>
                    <Button basic onClick={function() { self.onAction(Actions.RESEND_CAPTURED_REQUEST, [])}}>
                        <Icon name='repeat'></Icon> Resend
                    </Button>
                    &ensp;&ensp;
                    <Button basic onClick={function() { self.onAction(Actions.DELETE_CAPTURED_REQUEST, [])}}>
                        <Icon name='erase'></Icon> Delete
                    </Button>
                    &ensp;&ensp;
                    <Popup
                        className='clone-window'
                        trigger={<Button basic><Icon name='clone' /> Copy</Button>}
                        content={
                            <div>
                                <PropertyEditing
                                    name='URL'
                                    value={this.props.url}
                                    valueEditable='true'
                                    onSave={function(name, value) {
                                        self.onAction(Actions.COPY_CAPTURED_REQUEST, [value]);
                                        self.switchCloneWindow(false);
                                    }}
                                    onCancel={() => this.switchCloneWindow(false)}>
                                </PropertyEditing>
                            </div>
                        }
                        open={this.state.cloneWindowOpen}
                        on='click'
                        onOpen={() => this.switchCloneWindow(true)}
                        position='top right' />
                    &ensp;&ensp;
                    <Popup
                        className=''
                        trigger={<Button basic><Icon name='bomb' /> DoS Attack</Button>}
                        content={<DosDialog
                                    onAttack={(count, throttle) => {
                                        self.onAction(Actions.DOS_ATTACK, [count, throttle]);
                                        self.switchDosWindow(false);
                                    }}
                                    onCancel={() => this.switchDosWindow(false)}></DosDialog>}
                        open={this.state.dosWindowOpen}
                        on='click'
                        onOpen={() => this.switchDosWindow(true)}
                        position='top right' />
                </div>
            </div>
        )
    }
}