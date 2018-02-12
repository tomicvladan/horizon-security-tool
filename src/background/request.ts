
export class Request {

    private request;

    constructor(
        private method: string,
        private url: string,
        private headers?,
        private params?
    ) { }

    public send(): Promise<any> {
        const method = this.method;
        let params = this.params;

        return new Promise((resolve, reject) => {

            const request: XMLHttpRequest = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (this.readyState == 4) {
                    let response: any = {};

                    if (this.responseText) {
                        const contentType = this.getResponseHeader('content-type');
                        if (contentType && contentType.toLowerCase().startsWith('application/json')) {
                            response.result = JSON.parse(this.responseText);
                        } else {
                            response.result = this.responseText;
                        }
                    }

                    response.headers = this.getAllResponseHeaders().trim().split(/[\r\n]+/);
                    response.url = this.responseURL;
                    response.method = method;
                    response.status = {
                        code: this.status,
                        text: this.statusText
                    }
                    response.params = params;
                    
                    resolve(response);
                }
            };

            request.onerror = function() {
                reject();
            }

            let url = this.url;

            if (this.method === 'GET' && this.params && typeof(this.params) === 'object') {
                let query = '';
                for (let param in this.params) {
                    if (this.params.hasOwnProperty(param)) {
                        query += '&' + param + (this.params[param] ? '=' + this.params[param] : '');
                    }
                }

                if (query) {
                    url = url + '?' + query.substring(1, query.length);
                }
            }

            request.open(this.method, url, true);

            if (this.headers) {
                this.headers.forEach(header => {
                    request.setRequestHeader(header.name, header.value)
                });
            }
            
            if (this.method !== 'GET' && this.params) {
                request.send(JSON.stringify(this.params))
            } else {
                request.send();
            }
            
        });
    }
}