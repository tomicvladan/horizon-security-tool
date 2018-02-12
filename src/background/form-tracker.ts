import { LinkCollection, LinkNode } from '../common/link-collection';

export class FormTracker {

    private formCollection: LinkCollection = new LinkCollection();

    get forms(): any { return this.formCollection; }

    public addForms(forms: LinkNode) {
        this.formCollection.addCollection(forms);
    }

    public updateParameter(url, method, name, value) {
        let node: LinkNode = this.formCollection.get(url);

        if (!node.methods || !node.methods[method]) {
            return;
        }

        let methodData = node.methods[method];

        if (!methodData.params[name]) {
            methodData.params[name] = {
                type: '?'
            };
        }

        methodData.params[name].value = value;
    }


    public deleteParameter(url, method, name) {
        let node: LinkNode = this.formCollection.get(url);

        if (!node.methods || !node.methods[method]) {
            return;
        }

        let methodData = node.methods[method];

        delete methodData.params[name];
    }
}