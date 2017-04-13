const electron = window.require('electron'); 
const ipcRenderer = electron.ipcRenderer;

console.log('render thread');

let videoPlayer_ = null;

window.addEventListener('DOMContentLoaded', init);

ipcRenderer.on('message', (event, arg) => {
    play(arg);
    ipcRenderer.send('async','message received on client render thread');
});

function init() {
    try {
        console.log('render thread init');
        //document.getElementById('door1').innerHTML = "testing 123";
        // videoPlayer_ = document.getElementById('videoPlayer');
        // videoPlayer_.loop = false;
        // videoPlayer_.src = "assets/mov_bbb.mp4";
    } catch (error) {
        console.log(error);
    }

    bindEvents();
}

function bindEvents() {
    // videoPlayer_.addEventListener('error', function(e) {
    //     videoError(e);   
    // });
}

function videoError(error) {
    //Do something
}

            // "id" : this._id,
            // "text" : this._text,
            // "localPath" : this._localPath,
            // "activeStartDate" : this._activeStartDate,
            // "activeEndDate" : this._activeEndDate,
            // "durationMs" : this.durationMs,
            // "type" : this._type,
            // "target" : this._target,
            // "mediaType" : this.mediaType

function play(playbackItem) {
    try {
        if (playbackItem.mediaType) {
            switch(playbackItem.mediaType) {
                case 'text': {
                    let fullScreenText = document.getElementById('fullScreenText');
                    fullScreenText.innerHTML = playbackItem.text;
                    break;
                }
                case 'image': {
                    break;
                }
                case 'video': {
                    break;
                }
            }
       }
    } catch (error) {
        console.log(error);
    }
}

function addClass(selector, myClass) {

  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.add(myClass);
  }
}

function removeClass(selector, myClass) {

  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // remove class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.remove(myClass);
  }
}
