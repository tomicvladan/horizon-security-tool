import * as React from 'react';
import { Accordion } from 'semantic-ui-react';
import { Response } from './response';

export class Responses extends React.Component<any, any> {

    render() {
        const items = this.props.responses || [];

        const responses = items.map((response, i) => {
            return (
                <Response key={response.id}
                    response={response}
                    ordinal={response.id}
                    onSwitch={this.props.onSwitch}
                    opened={this.props.opened[response.id]}>
                </Response>
            )
        });

        if (responses.length) {
            return <Accordion fluid styled className='requests'>{responses}</Accordion>
        } else {
            return <span>Here are listed responses, received when requests are resent.</span>
        }

        
    }
}