
function init () {
    (window as any).browser.devtools.panels.create(
        'Horizon',
        '../assets/button.svg',
        'panel/panel.html'
    );
};


init();