import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { Actions } from '../../../../common/constants';

export class Link extends React.Component<any, any> {

    render() {
        const link = this.props.link || {};

        return (
            <Table.Row>
                <Table.Cell>
                    <a className='link' onClick={() => this.props.onAction(Actions.OPEN_LINK, [link.url])}>
                        {link.url}
                    </a>
                </Table.Cell>
            </Table.Row>
        )
    }
}