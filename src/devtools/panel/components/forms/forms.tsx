import * as React from 'react';
import { Accordion, Button } from 'semantic-ui-react';
import { Form } from './form';
import { Actions } from '../../../../common/constants';

export class Forms extends React.Component<any, any> {

    render() {
        const forms = this.props.forms || [], self = this;
        let items = [];

        forms.forEach(server => {
            server.links.forEach(form => {
                const methods = form.methods;

                if (methods) {
                    for (let method in methods) {
                        if (methods.hasOwnProperty(method)) {
                            items.push((
                                <Form action={form.url}
                                        method={method}
                                        params={methods[method].params}
                                        onAction={this.props.onAction}
                                        opened={this.props.opened[method + form.url]}
                                        onSwitch={this.props.onSwitch}
                                        key={method + form.url}>
                                </Form>
                            ));
                        }
                    }
                }
            });
        })
        
        
        return (
            <div>
                <Accordion fluid styled>
                    {items}
                </Accordion>
                <br/>
                &ensp;&ensp;<Button circular icon='refresh' onClick={function() { self.props.onAction(Actions.REFRESH, [])} } />
                <br/><br/>
            </div>
        )
        
    }
}