
import * as React from 'react';
import { Tab } from 'semantic-ui-react';


export class Libraries extends React.Component<any, any> {

    private LIBRARIES = ['JQuery', 'Angular', 'AngularJS', 'React'];

    createPanes(libs) {
        const panes = [];

        libs.forEach(lib => {
            panes.push({
                menuItem: lib.name,
                render: () => <Tab.Pane className="no-border">Version: {lib.version}</Tab.Pane>
            });
        });

        return panes;
    }

    render() {
        const libs = this.props.libraries;

        if (!libs) {
            return null;
        }
        else if (libs.length === 0) {
            return (
                <p>
                    Unable to recognize any of these libraries:&ensp;
                    {this.LIBRARIES.map((lib, i) => { return lib + (i !== this.LIBRARIES.length - 1 ? ', ' : '') })}.
                </p>
            );
        } else {
            const panes = this.createPanes(libs);

            return (
                <Tab panes={panes} className='libraries'
                    menu={{ fluid: true, vertical: true}} 
                    grid={{ tabWidth: 4, paneWidth: 8}}>
                </Tab>
            );
        }
    }
}