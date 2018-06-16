import * as url from 'url';

import { ApplicationData } from "./application-data";
import { Actions, PageCommands } from '../common/constants';

declare var TextDecoder;

export class TabHandler {

    private _host: string = null;
    private _url: string = null;

    private _devtool = null;

    constructor(
        private id: string,
        private apps: Map<string, ApplicationData>
    ) {
        this.onDevtoolAction = this.onDevtoolAction.bind(this);
    }

    set devtool(devtool: any) {
        this._devtool = devtool;
        this.updateDevtool();

        this._devtool.onMessage.addListener(this.onDevtoolAction);
    }

    public updateDevtool(state?: any) {
        let appData: ApplicationData = this.apps.get(this._host);

        if (appData && this._devtool) {
            state = state || { state: appData.getState() };
            this._devtool.postMessage(state);
        }
    }

    private sendMessageToPage(data) {
        try {
            (window as any).browser.tabs.sendMessage(this.id, data);
        } catch(error) {
        }
    }

    private async executeAndUpdate(host: string, callback: Function) {
        let appData: ApplicationData = this.apps.get(host);

        if (!appData) {
            return;
        }

        const update = await callback.apply(this, [appData]);

        if (update) {
            this.updateDevtool(update);
        }
    }

    private async onDevtoolAction(data) {
        const { action, args } = data;

        if (action === Actions.OPEN_LINK) {
            (window as any).browser.tabs.create({
                active: true,
                url: args[0]
            });
        } else {
            this.executeAndUpdate(this._host, async function (appData: ApplicationData) {
                const rt = appData.requestTracker, ft = appData.formTracker;

                switch(action) {
                    case Actions.UPDATE_REQUEST_VALUE:
                        return { update: rt.alterCapturedParameter.apply(rt, args), state: appData.requests };
                    case Actions.UPDATE_REQUEST_HEADER:
                        return { update: rt.alterCapturedHeader.apply(rt, args), state: appData.requests };
                    case Actions.RESEND_CAPTURED_REQUEST:
                        return { update: await rt.resend.apply(rt, args), state: appData.responses };
                    case Actions.DELETE_CAPTURED_REQUEST:
                        return { update: rt.deleteCaptured.apply(rt, args), state: appData.requests };
                    case Actions.NEW_REQUEST_PROPERTY:
                        return { update: rt.addProperty.apply(rt, args), state: appData.requests };
                    case Actions.DELETE_REQUEST_PROPERTY:
                        return { update: rt.deleteProperty.apply(rt, args), state: appData.requests };
                    case Actions.DELETE_REQUEST_HEADER:
                        return { update: rt.deleteHeader.apply(rt, args), state: appData.requests };
                    case Actions.NEW_REQUEST:
                        return { update: rt.createNewRequest.apply(rt, args), state: appData.requests }
                    case Actions.NEW_REQUEST_HEADER:
                        return { update: rt.addHeader.apply(rt, args), state: appData.requests };
                    case Actions.COPY_CAPTURED_REQUEST:
                        rt.copy.apply(rt, args)
                        return { state: appData.requests };
                    case Actions.UPDATE_FORM_PARAMETER:
                        ft.updateParameter.apply(ft, args);
                        return { state: appData.forms };
                    case Actions.NEW_FORM_PARAMETER:
                        ft.updateParameter.apply(ft, args);
                        return { state: appData.forms };
                    case Actions.DELETE_FORM_PARAMETER:
                        ft.deleteParameter.apply(ft, args);
                        return { state: appData.forms };
                    case Actions.SUBMIT_FORM:
                        this.sendMessageToPage({ action: PageCommands.SUBMIT, args: args });
                        return;
                    case Actions.REFRESH:
                        this.sendMessageToPage({ action: PageCommands.UPDATE });
                        return;
                    case Actions.DOS_ATTACK:
                        rt.dosAttack.apply(rt, args)
                        return;
                }
            });
        }
    }

    public onPageMessage(state: any) {
        this.executeAndUpdate(state.url, (appData: ApplicationData) => {
            appData.libraries = state.libraries;
            appData.linkCollection.addCollection(state.links);
            appData.formTracker.addForms(state.forms);
            return { state: appData.pageInfo };
        });
    }

    public onHttpRequest(request) {
        this.executeAndUpdate(this._host, (appData: ApplicationData) => {
            appData.requestTracker.update(request);
            return null;
        });
    }

    public onHttpRequestHeaders(request) {
        this.executeAndUpdate(this._host, (appData: ApplicationData) => {
            appData.requestTracker.updateHeaders(request);
            return { state: appData.requests };
        });
    }

    public update(_url: string) {
        const address: url.Url = url.parse(_url, true);

        if (address.host === 'blank') {
            return;
        }

        if (this._host !== address.host) {
            this.onRemove();

            this._host = address.host;

            let appData: ApplicationData = this.apps.get(this._host);

            if (!appData) {
                appData = new ApplicationData();
                this.apps.set(this._host, appData);

            } else {
                appData.tabCount++;

                if (appData.removeTimeout) {
                    clearTimeout(appData.removeTimeout);
                }
            }
        }

        if (this._url !== _url) {
            this.sendMessageToPage({ action: PageCommands.UPDATE });
        }

        this._url = _url;
    }


    public onRemove() {
        const appData: ApplicationData = this.apps.get(this._host);

        if (appData && --appData.tabCount === 0) {
            if (appData.removeTimeout) {
                clearTimeout(appData.removeTimeout);
            }
            appData.removeTimeout = setTimeout(() => {
                this.apps.delete(this._host);
            }, 30 * 60 * 1000);
        }
    }
}