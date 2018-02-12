import * as React from 'react';
import { TransitionablePortal, Segment, Header } from 'semantic-ui-react';

export class Message extends React.Component<any, any> {

    render() {
        return (
            <TransitionablePortal open={this.props.message !== null}
                    transition={{ animation: 'scale', duration: 500 }}>
                <Segment style={{ left: '50%', position: 'fixed', top: '50%', zIndex: 1000 }}>
                    {this.props.message}
                </Segment>
            </TransitionablePortal>
        )
    }
}