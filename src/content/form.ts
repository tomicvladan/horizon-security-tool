
export class Form {

    private form: HTMLFormElement;

    constructor(action, method, params) {
        this.create(action, method, params);
    }

    private create(action, method, params) {
        this.form = document.createElement('form');
        this.form.method = method;
        this.form.action = action;
        this.form.style.display = 'hidden';

        for (let param in params) {
            if (params.hasOwnProperty(param)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = param;
                input.value = params[param].value;
                this.form.appendChild(input);
            }
        }
    }

    public submit() {
        document.body.appendChild(this.form);
        this.form.submit();
    }
}