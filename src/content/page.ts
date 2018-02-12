import { PageAnalyzer } from './page-analyzer';
import { Form } from './form';
import { PageCommands } from '../common/constants';
declare var browser: any;

var active = true;


function sendPageState() {
    const pageAnalyzer = new PageAnalyzer();

    pageAnalyzer.extract();

    browser.runtime.sendMessage(pageAnalyzer.getState());
}

function onBackgroundMessage(message) {
    if (active && message.action === PageCommands.UPDATE) {
        sendPageState();

    } else if (message.action === PageCommands.STOP) {
        active = false;

    } else if (message.action === PageCommands.START) {
        active = true;

    } else if (message.action === PageCommands.SUBMIT) {
        const args = message.args;
        (new Form(args[0], args[1], args[2])).submit();
    }
}

browser.runtime.onMessage.addListener(onBackgroundMessage);


sendPageState();


