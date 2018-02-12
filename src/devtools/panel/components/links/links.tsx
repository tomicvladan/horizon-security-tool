import * as React from 'react';
import { Accordion, Button} from 'semantic-ui-react';
import { Site } from './site';
import { Actions } from '../../../../common/constants';

export class Links extends React.Component<any, any> {

    render() {
        const links = this.props.links || [], self = this;

        const sites = links.map((site, i) => {
            return (
                <Site site={site}
                    onAction={this.props.onAction}
                    key={site.url}
                    onSwitch={this.props.onSwitch}
                    opened={this.props.opened[site.url]}>
                </Site>
            )
        });

        return (
            <div>
                <Accordion fluid styled>
                    {sites}
                </Accordion>
                <br/>
                &ensp;&ensp;<Button circular icon='refresh' onClick={function() { self.props.onAction(Actions.REFRESH, [])} } />
                <br/><br/>
            </div>
        )
    }
}