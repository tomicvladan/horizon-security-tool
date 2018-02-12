import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import { Property } from './property';
import { NewProperty } from './new-property';

export class JsonLevel extends React.Component<any, any> {

    generateSpaces(level) {
        let spaces = '';
        for (let i = 0; i < level; i++) {
            spaces += '&ensp;&ensp;';
        }
        return <span dangerouslySetInnerHTML={{__html: spaces}}></span>;
    }

    renderProperty(name, value, key, level, spaces, isArray, addComma) {
        if (value && typeof(value) === 'object' || typeof(value) === 'function') {
            return (
                <div key={key}>
                    {spaces}&ensp;&ensp;
                    {isArray ? null : <span>{name}:&ensp;</span>}
                    <JsonLevel
                        data={value}
                        level={level}
                        path={this.props.path.concat(name)}
                        editable={this.props.editable}
                        onNewProperty={this.props.onNewProperty}
                        onPropertyDelete={this.props.onPropertyDelete}
                        onValueChange={this.props.onValueChange}>
                    </JsonLevel>
                    {addComma ? ',' : null}
                </div>
            )
        } else {
            return (
                <div key={key}>
                    {spaces}&ensp;&ensp;
                    <Property
                        name={name}
                        value={value}
                        path={this.props.path.concat(name)}
                        editable={this.props.editable}
                        hideName={isArray}
                        onValueChange={this.props.onValueChange}
                        onPropertyDelete={this.props.onPropertyDelete}>
                    </Property>{addComma ? ',' : ''}
                </div>
            )
        }
    }

    render() {
        const data = this.props.data;
        const level = this.props.level;
        const spaces = this.generateSpaces(level);
        const isArray = data instanceof Array;
        const props = [];
        let key = 1;

        if (isArray && data.length) {
            for (let i = 0, len = data.length; i < len; i++) {
                props.push(this.renderProperty(i, data[i], key++, level + 1, spaces, isArray, i !== len - 1));
            }
        } else if (data && typeof(data) === 'object' || typeof(data) === 'function') {
            const keys = Object.keys(data)
            for (let i = 0, len = keys.length; i < len; i++) {
                const prop = keys[i];
                if (data.hasOwnProperty(prop)) {
                    props.push(this.renderProperty(prop, data[prop], key++, level + 1, spaces, isArray, i !== len - 1));
                }
            }
        }

        if (this.props.editable) {
            props.push((
                <div key={key++}>
                    {spaces}&ensp;&ensp;
                    <NewProperty nameEditable={!isArray}
                                name={isArray ? 0 : null}
                                path={this.props.path}
                                hideName={isArray}
                                onNewProperty={this.props.onNewProperty}>
                    </NewProperty>
                </div>
            ));
        }

        const leftBracket = isArray ? '[' : '{';
        const rightBracket = isArray ? ']' : '}';

        if (props.length === 0) {
            return <span>{leftBracket} {rightBracket}</span>
        }

        return (
            <span>
            {leftBracket}<br/>
                {props}
            {spaces}{rightBracket}
            {this.props.editable ? (
                <a className='edit'
                    onClick={() => this.props.onPropertyDelete(this.props.path)}>
                    <Icon name='remove' />
                </a>
            ) : null}
            </span>
        );
    }

}