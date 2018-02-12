import { LinkCollection } from "../common/link-collection";


export class FormExtractor {

    private linkCollection = new LinkCollection();

    private extractInputs(params, type, form: HTMLFormElement) {
        const elements = form.getElementsByTagName(type);

        for (let i = 0, len = elements.length; i < len; i++) {
            const input = elements[i];

            if (!input.name || input.name.toLowerCase() === 'submit'
                || input.type === 'submit') {
                continue;
            }

            let inputData = params[input.name];

            if (!inputData) {
                inputData = params[input.name] = {};
            }

            inputData.type = (type === 'input') ? input.type : type;
            inputData.value = input.value;

            if (input.type === 'radio' || type === 'select') {
                if (!inputData.options) {
                    inputData.options = [];
                }

                if (input.type === 'radio') {
                    if (inputData.options.indexOf(input.value) < 0) {
                        inputData.options.push(input.value);
                    }
                } else {
                    const options = form.getElementsByTagName('option');

                    for (let j = 0, len = options.length; j < len; j++) {
                        if (inputData.options.indexOf(options[j].value) < 0) {
                            inputData.options.push(options[j].value);
                        }
                    }
                }

            }
        }
    }

    public extract() {
        let forms = document.getElementsByTagName('form');

        for (let i = 0, len = forms.length; i < len; i++) {
            const form: HTMLFormElement = forms[i];

            if (!form.action) { continue; }

            const formData = this.linkCollection.add(form.action).node;

            if (!formData.methods) {
                formData.methods = {};
            }
            
            const method: any = formData.methods[form.method ? form.method.toUpperCase() : 'POST'] = {};

            method.params = {};

            this.extractInputs(method.params, 'input', form);
            this.extractInputs(method.params, 'select', form);
            this.extractInputs(method.params, 'textarea', form);
        }

        return this.linkCollection.links;
    }
}