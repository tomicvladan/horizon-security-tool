
declare var browser: any;

export class LibraryExtractor {

    private extractAngularVersion(): string {
        const allElements = document.getElementsByTagName('*');
        
        for (var i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute('ng-version') !== null) {
                return allElements[i].getAttribute('ng-version');
            }
        }

        return null;
    }

    public extract(): Array<any> {
        const wrapped = (window as any).wrappedJSObject;
        const libs = [];

        if (typeof wrapped.jQuery != 'undefined') {
            libs.push({
                name: 'JQuery',
                version: (wrapped.jQuery.fn) ? wrapped.jQuery.fn.jquery : '?'
            })
        }

        if (wrapped.ng) {
            libs.push({
                name: 'Angular',
                version: this.extractAngularVersion()
            })
        }

        if (wrapped.angular && wrapped.angular.version) {
            libs.push({
                name: 'AngularJS',
                version: wrapped.angular.version.full
            })
        }

        if (wrapped.React) {
            libs.push({
                name: 'React',
                version: wrapped.React.version
            })
        }

        return libs;
    }
}