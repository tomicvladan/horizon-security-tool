import { TabHandler } from './background/tab-handler';
import { ApplicationData } from './background/application-data';
import { PageCommands } from './common/constants';

const tabs = new Map<string, TabHandler>();
const apps = new Map<string, ApplicationData>();
var active = false;


function getOrCreateTabHandler(tabId: string): TabHandler {
    let tabHandler: TabHandler = tabs.get(tabId);

    if (!tabHandler) {
        tabHandler = new TabHandler(tabId, apps);
        tabs.set(tabId, tabHandler);
    }

    return tabHandler;
}

function switchButton() {
    (window as any).browser.browserAction.setIcon({
        path: active ? 'assets/button.svg' : 'assets/button-disabled.svg'
    });
}

function onToolbarButtonClick() {
    active = !active;
    switchButton();

    
    tabs.forEach((tab, tabId) => {
        try {
            (window as any).browser.tabs.sendMessage(tabId, {
                action: active ? PageCommands.START : PageCommands.STOP
            });
        } catch(error) { }
    });
}

async function onTabUpdated(tabId: string, changeInfo: any) {
    const tab = await (window as any).browser.tabs.get(Number(tabId));

    const tabHandler: TabHandler = getOrCreateTabHandler(tabId);

    tabHandler.update(tab.url);
}

async function onTabActivated(tabId: string) {
    const tabHandler: TabHandler = getOrCreateTabHandler(tabId);

    tabHandler.updateDevtool();
}

function onTabRemoved(tabId: string) {
    const tabHandler: TabHandler = tabs.get(tabId);

    if (tabHandler) {
        tabHandler.onRemove();
        tabs.delete(tabId);
    }
}

function onPageMessage(request, sender, sendResponse) {
    const tab = sender.tab;

    const tabHandler: TabHandler = getOrCreateTabHandler(tab.id);

    tabHandler.onPageMessage(request);
}

async function onDevToolConnection(port) {
    const tab = await (window as any).browser.tabs.get(Number(port.name));
        
    const tabHandler: TabHandler = getOrCreateTabHandler(tab.id);

    tabHandler.devtool = port;
    tabHandler.update(tab.url);
    tabHandler.updateDevtool();
}

function onHttpRequest(requestDetails) {
    const tabHandler: TabHandler = tabs.get(requestDetails.tabId);

    if (tabHandler) {
        tabHandler.onHttpRequest(requestDetails);
    }
}

function onHttpRequestHeaders(requestDetails) {
    let tabHandler: TabHandler = tabs.get(requestDetails.tabId);

    if (tabHandler) {
        tabHandler.onHttpRequestHeaders(requestDetails);
    }
}

function callIfActive(callback: Function) {
    return function() {
        if (active) {
            return callback.apply(callback, arguments);
        }
    }
}


(window as any).browser.browserAction.onClicked
    .addListener(onToolbarButtonClick);

(window as any).browser.tabs.onUpdated
    .addListener(callIfActive(onTabUpdated));

(window as any).browser.tabs.onActivated
    .addListener(callIfActive(onTabActivated));

(window as any).browser.tabs.onRemoved
    .addListener(onTabRemoved);

(window as any).browser.runtime.onMessage
    .addListener(callIfActive(onPageMessage));

(window as any).browser.runtime.onConnect
    .addListener(onDevToolConnection);

(window as any).browser.webRequest.onBeforeRequest
    .addListener(callIfActive(onHttpRequest), { urls: ["<all_urls>"] }, ["requestBody"]);

(window as any).browser.webRequest.onBeforeSendHeaders
    .addListener(callIfActive(onHttpRequestHeaders), { urls: ["<all_urls>"] }, ["requestHeaders"]);

