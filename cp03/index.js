if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
        scope: './'
    });
    navigator.serviceWorker.ready.then(reload);
}

var referenceIframe = document.getElementById('reference');
var sampleIframe = document.getElementById('sample');
referenceIframe.onload = fixHeight;
sampleIframe.onload = fixHeight;
var reloadButton = document.querySelector('#reload');
reloadButton.onclick = reload;

function loadIframes() {
    referenceIframe.src = './non-controlled.html';
    sampleIframe.src = './controlled.html';
}
function fixHeight(evt) {
    var iframe = evt.target;
    var document = iframe.contentWindow.document.documentElement;
    iframe.style.height = document.getClientRects()[0].height + 'px';
    if (window.parent !== window) {
        window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
    }
}

function reload() {
    referenceIframe.contentWindow.location.reload();
    sampleIframe.contentWindow.location.reload();
}
