import * as url from 'url';
import { LinkCollection, LinkNode } from '../common/link-collection';
import { Request } from './request';

declare var TextDecoder;

export class MethodData {
    parameters: any = {};
    captured: Array<{
        origin: string,
        requestId: string | number,
        parameters: any,
        headers: Array<{ name: string, value: string }>
    }> = [];
}

export class RequestTracker {

    private requestCollection: LinkCollection = new LinkCollection();
    private _responses = [];
    private responseId = 0;
    private copiedRequestId = 'aaaaaaaa';


    static decoder = new TextDecoder("utf-8");
    static idCharacters = 'abcdefghijklmnopqrstuvwxyz';
    

    get requests(): any { return this.requestCollection; }

    get responses(): any { return this._responses }

    private generateRequestIdPrefix() {
        return this.copiedRequestId = (parseInt(this.copiedRequestId, 36) + 1)
            .toString(36).replace(/0/g,'a');
    }

    private getProperty(props: any, path: Array<string>, len: number): any {
        let property, length = len > path.length ? path.length : len;

        for (let i = 0; i < length; props = props[property], i++) {
            property = path[i]
            if (!props[property]) {
                props[property] = {};
            }
        }

        return props;
    }

    private findHeader(
        headers: Array<{ name: string, value: string }>, name: string):
        { index: number, header: { name: string, value: string }} {

        name = name.toLowerCase();
        for (let i = headers.length - 1; i >= 0; i--) {
            if (headers[i].name.toLowerCase() === name) {
                return { index: i, header: headers[i] };
            }
        }

        return { index: -1, header: null };
    }

    private findCapturedRequest(url: string, method: string, requestId: string | number) {
        let node = this.requestCollection.get(url);

        if (!node || !node.methods || !node.methods[method]) {
            return;
        }

        const methods: MethodData = node.methods[method];

        for (let i = methods.captured.length - 1; i >= 0; i--) {
            if (methods.captured[i].requestId === requestId) {
                return methods.captured[i];
            }
        }
    }

    /**
     * Adds parameters from new request to the existing parameters object
     */
    private mergeParameters(parameters: any, property: string | number, body: any) {

        if (typeof(body) === 'object' || typeof(body) === 'function') {

            if (body instanceof Array) {
                if (parameters[property] instanceof Array === false) {
                    parameters[property] = [];
                }

                if (body.length && body[0]) {
                    this.mergeParameters(parameters[property], 0, body[0]);
                }
            } else {
                let nextProps = parameters[property];

                if (!nextProps) {
                    nextProps = parameters[property] = {};
                }

                for (var prop in body) {
                    if (!body.hasOwnProperty(prop)) continue;

                    const value = body[prop];
                    let created = false;

                    if (!nextProps[prop]) {
                        created = true;
                        nextProps[prop] = {};
                    }

                    if (value === null && created) {
                        nextProps[prop] = '?';
        
                    } else if (typeof(value) === 'object' || typeof(value) === 'function') {
                        this.mergeParameters(nextProps, prop, value);
        
                    } else if (typeof(value) === 'undefined') {
                        // skip
                    } else {
                        nextProps[prop] = typeof(value);
                    }
                }
            }
        } else {
            parameters[property] = typeof(body);
        }
    }

    public update(request) {
        const address: url.Url = url.parse(request.url, true);
        const method = request.method;
        let methodData: MethodData;
        let params;

        if (request.type !== 'xmlhttprequest' || request.method === 'OPTIONS') {
            return;
        }

        let { added, node } = this.requestCollection.add(request.url);

        if (!node.methods) {
            node.methods = {};
        }

        if (!node.methods[method]) {
            node.methods[method] = new MethodData();
        }

        methodData = node.methods[method];

        if (method === 'GET') {
            params = address.query;

        } else if (request.requestBody) {
            
            if (request.requestBody.formData) {
                params = request.requestBody.formData;
            } else {
                try {
                    params = RequestTracker.decoder.decode(request.requestBody.raw[0].bytes, {stream: true});
                    params = JSON.parse(params);
                } catch(error) {}
            }
        }

        this.mergeParameters(methodData, 'parameters', params);

        if (methodData.captured.length < 5) {
            methodData.captured.push({
                origin: request.originUrl,
                requestId: request.requestId,
                parameters: params,
                headers: null
            });
        }
    }

    /**
     * Updates headers of the captured request
     */
    public updateHeaders(request) {
        const address: url.Url = url.parse(request.url, true);
        const pathname = address.pathname ? address.pathname : '';

        let captured = this.findCapturedRequest(
            address.protocol + '//' + address.host + pathname,
            request.method,
            request.requestId
        );

        if (captured) {
            captured.headers = request.requestHeaders;
        }

        return {
            site: address.host,
            url: pathname
        }
    }

    public alterCapturedParameter(site, url, method, requestId, path, value) {
        let captured = this.findCapturedRequest(site + url, method, requestId);

        if (!captured) {
            return;
        }

        if (!path || path.length === 0) {
            captured.parameters = value;

        } else {
            let lastPathIndex = path.length - 1;
            let prop = this.getProperty(captured.parameters, path, lastPathIndex);
    
            prop[path[lastPathIndex]] = value;
        }

        return { site, url };
    }

    public alterCapturedHeader(site, url, method, requestId, name, value) {
        let captured = this.findCapturedRequest(site + url, method, requestId);

        if (!captured || !captured.headers) {
            return;
        }

        const header = this.findHeader(captured.headers, name).header;

        if (header) {
            header.value = value;
        }

        return { site, url };
    }

    public addProperty(site, url, method, requestId, path, name, value) {
        let captured = this.findCapturedRequest(site + url, method, requestId);
  
        if (!captured) {
            return;
        }

        if (name === null || name === undefined) {
            captured.parameters = value;
            return { site, url };
        }

        let prop = this.getProperty(captured.parameters, path, path.length);

        if (prop instanceof Array) {
            prop.push(value);
        } else {
            prop[name] = value;
        }

        return { site, url };
    }

    public addHeader(site, url, method, requestId, path, name, value) {
        let captured = this.findCapturedRequest(site + url, method, requestId);
  
        if (!captured) {
            return;
        }

        if (!captured.headers) {
            captured.headers = [];
        }

        captured.headers.push({ name, value });

        return { site, url };
    }

    public deleteProperty(site, url, method, requestId, path) {
        let captured = this.findCapturedRequest(site + url, method, requestId);

        if (!captured) {
            return;
        }

        if (!path || path.length === 0) {
            captured.parameters = null;
            return { site, url };
        }

        let lastPathIndex = path.length - 1;
        let prop = this.getProperty(captured.parameters, path, lastPathIndex);

        if (prop instanceof Array) {
            prop.splice(path[lastPathIndex], 1);
        } else {
            delete prop[path[lastPathIndex]];
        }

        return { site, url };
    }

    public deleteHeader(site, url, method, requestId, name) {
        let captured = this.findCapturedRequest(site + url, method, requestId);

        if (!captured || !captured.headers) {
            return;
        }

        const headerIndex = this.findHeader(captured.headers, name).index;

        if (headerIndex >= 0) {
            captured.headers.splice(headerIndex, 1);
        }

        return { site, url };
    }

    public deleteCaptured(site, url, method, requestId) {
        let node = this.requestCollection.get(site + url);

        if (!node || !node.methods[method]) {
            return;
        }

        const methods: MethodData = node.methods[method];

        for (let i = methods.captured.length - 1; i >= 0; i--) {
            if (methods.captured[i].requestId === requestId) {
                methods.captured.splice(i, 1);
                return;
            }
        }

        return { site, url };
    }

    public createNewRequest(method, _url, captured?) {
        if (!method || !_url) {
            return;
        }

        const address: url.Url = url.parse(_url, true);
        const pathname = address.pathname ? address.pathname : '';

        let node = this.requestCollection.add(address.protocol + '//' + address.host + pathname).node;

        if (!node.methods) {
            node.methods = {};
        }

        method = method.toUpperCase();

        if (!node.methods[method]) {
            node.methods[method] = new MethodData();
        }

        let newCaptured;

        if (captured) {
            newCaptured = JSON.parse(JSON.stringify(captured));
        } else {
            newCaptured = { }
        }

        newCaptured.requestId = this.generateRequestIdPrefix() + newCaptured.requestId;

        node.methods[method].captured.unshift(newCaptured);

        if (node.methods[method].captured.length > 5) {
            node.methods[method].captured.splice(5, 1);
        }
    }

    public async resend(site, url, method, requestId) {
        let captured = this.findCapturedRequest(site + url, method, requestId);

        if (!captured) {
            return;
        }

        let response = await (new Request(method, site + url, captured.headers, captured.parameters)).send();

        response.id = this.responseId++;
        
        this._responses.unshift(response);

        if (this._responses.length > 100) {
            this._responses = this._responses.slice(0, 100);
        }
    }

    public copy(site, _url, method, requestId, newUrl: string) {
        const captured = this.findCapturedRequest(site + _url, method, requestId);

        if (!captured) {
            return;
        }

        this.createNewRequest(method, newUrl, captured);
    }
}