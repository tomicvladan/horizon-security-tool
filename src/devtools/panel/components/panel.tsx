import * as React from 'react';
import { Tab } from 'semantic-ui-react';
import { Libraries } from './libraries/libraries';
import { Links } from './links/links';
import { Forms } from './forms/forms';
import { Requests } from './requests/requests';
import { Responses } from './responses/repsponses';
import { Actions } from '../../../common/constants';
import { Message } from './message';

export class Panel extends React.Component<any, any> {

    private port;

    private updatedSite = null;
    private openedSites = [{}, {}, {}, {}];

    constructor(props) {
        super(props);

        this.state = { message: null };

        this.port = (window as any).browser.runtime
            .connect({ name: (window as any).browser.devtools.inspectedWindow.tabId.toString() });

        this.update = this.update.bind(this);
        this.onAction = this.onAction.bind(this);
        this.updateOpened = this.updateOpened.bind(this);

        this.port.onMessage.addListener(this.update);
    }

    onAction(action, args) {
        this.port.postMessage({ action, args });
    }

    updateOpened(tab, site, opened) {
        if (opened) {
            this.openedSites[tab][site] = opened;
        } else {
            delete this.openedSites[tab][site];
        }
    }

    private panes = [
        {
            menuItem: 'Links',
            render: () => (
                <Tab.Pane className="main-tab no-border">
                    <Links links={this.state.links}
                        onAction={this.onAction}
                        opened={this.openedSites[0]}
                        onSwitch={this.updateOpened}>
                    </Links>
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Forms',
            render: () => (
                <Tab.Pane className="main-tab no-border">
                    <Forms forms={this.state.forms}
                        onAction={this.onAction}
                        opened={this.openedSites[1]}
                        onSwitch={this.updateOpened}>
                    </Forms>
                </Tab.Pane>
            )
        },
        {
            menuItem: 'HTTP Requests',
            render: () => (
                <Tab.Pane className="main-tab no-border">
                    <Requests requests={this.state.requests}
                        shouldUpdate={this.updatedSite}
                        opened={this.openedSites[2]}
                        onSwitch={this.updateOpened}
                        onAction={this.onAction}>
                    </Requests>
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Libraries',
            render: () => (
                <Tab.Pane className="no-border">
                    <Libraries libraries={this.state.libraries}>
                    </Libraries>
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Responses',
            render: () => (
                <Tab.Pane className="no-border">
                    <Responses responses={this.state.responses}
                        opened={this.openedSites[3]}
                        onSwitch={this.updateOpened}>
                    </Responses>
                </Tab.Pane>
            )
        }
    ];

    public update(data) {
        if (!data.state) {
            return;
        }
        
        this.updatedSite = data.update;
        if (data.state.responses && data.state.responses.length &&
            !(this.state.responses && this.state.responses.length && this.state.responses[0].id === data.state.responses[0].id)) {
            data.state.message = 'New response has arrived.';

            setTimeout(() => {
                this.setState({ message: null });
            }, 3000);
        }

        this.setState(data.state);
    }

    render() {
        return (
            <div>
                <Tab panes={this.panes}></Tab>
                <Message message={this.state.message}></Message>
            </div>
        )
    }
}