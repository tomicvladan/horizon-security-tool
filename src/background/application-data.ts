import { RequestTracker } from './request-tracker';
import { FormTracker } from './form-tracker';
import { LinkCollection } from '../common/link-collection';

export class ApplicationData {

    public libraries: Array<any> = [];
    public linkCollection: LinkCollection = new LinkCollection();
    public formTracker: FormTracker = new FormTracker();
    public requestTracker: RequestTracker = new RequestTracker();
    public tabCount: number = 1;
    public removeTimeout = null;

    get pageInfo() {
        return {
            libraries: this.libraries,
            links: this.linkCollection.toArray(),
            forms: this.formTracker.forms.toArray()
        }
    }

    get forms() {
        return {
            forms: this.formTracker.forms.toArray()
        }
    }

    get requests() {
        return {
            requests: this.requestTracker.requests.toArray(false)
        }
    }

    get responses() {
        return {
            responses: this.requestTracker.responses
        }
    }

    public getState() {
        return {
            libraries: this.libraries,
            links: this.linkCollection.toArray(),
            forms: this.formTracker.forms.toArray(),
            requests: this.requestTracker.requests.toArray(false),
            responses: this.requestTracker.responses
        }
    }
}