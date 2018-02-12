import * as React from 'react';
import { Table, Accordion, Icon } from 'semantic-ui-react';
import { Link } from './link';

export class Site extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = { opened: !!this.props.opened };

        this.switchSite = this.switchSite.bind(this);
    }

    switchSite() {
        const opened = !this.state.opened;

        this.setState({ opened });

        this.props.onSwitch(0, this.props.site.url, opened);
    }

    render() {
        const site = this.props.site || { links: [] };

        const linkItems = site.links.map((link, i) => {
            return <Link link={link} onAction={this.props.onAction} key={link.url}></Link>
        })

        return (
            <div>
                <Accordion.Title active={this.state.opened} onClick={this.switchSite}>
                    <Icon name='dropdown' />
                    {site.url}
                </Accordion.Title>
                <Accordion.Content active={this.state.opened}>
                    <Table selectable unstackable compact='very' basic='very'>
                        <Table.Body>
                            {linkItems}
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </div>
        );
    }
}