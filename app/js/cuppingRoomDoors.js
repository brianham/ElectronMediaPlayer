const electron = window.require('electron'); 
const ipcRenderer = electron.ipcRenderer;

let fullScreenText = document.getElementById('fullScreenText');
let fullScreenImage = document.getElementById('fullScreenImage');
let fullScreenVideo = document.getElementById('fullScreenVideo');

ipcRenderer.on('message', (event, arg) => { play(arg); });

function play(item) {
    switch(item.mediaType) {
        case 'image': {
            renderImageAndText(item.localPath, item.durationMs, item.text).then(value => {
                console.log('image playback completed');
                ipcRenderer.send('async','image playback completed');
            }).catch(error => {

            });
            
            break;
        }
        case 'video': {
            renderVideoAndText(item.localPath, item.durationMs, item.text).then(value => {
                console.log('video playback completed');
                ipcRenderer.send('async','video playback completed');
            }).catch(error => {

            });

            break;
        }
        case 'text': {
            renderText(item.text, item.durationMs).then(value => {
                console.log('text playback completed');
                ipcRenderer.send('async','video playback completed');
            }).catch(error => {

            });

            break;
        }
        default: {
            break;
        }
    }
}

function renderImageAndText(path, duration, text) {
    return new Promise((resolve, reject) => {        
        fullScreenImage.addEventListener('load', function callback(event) { 
            event.currentTarget.removeEventListener(event.type, callback);            
            fullScreenImage.classList.add('fadeIn'); 
            if (text) {
                fullScreenText.innerHTML = text;
                fullScreenText.classList.add('fadeIn');    
            } else {
                fullScreenText.innerHTML = '';
            }
        }); 

        fullScreenImage.addEventListener("transitionend", function callback(event) {
            event.currentTarget.removeEventListener(event.type, callback);         
            window.setTimeout(() => { 
                fullScreenImage.classList.remove('fadeIn'); 
                if (text) fullScreenText.classList.remove('fadeIn');  
                resolve();              
            }, duration);
        });

        fullScreenImage.src = path;
    });
}

function renderVideoAndText(path, duration, text) {
    return new Promise((resolve, reject) => {        
        fullScreenVideo.addEventListener('canplay', function callback(event) { 
            event.currentTarget.removeEventListener(event.type, callback);            
            fullScreenVideo.play();
            fullScreenVideo.classList.add('fadeIn');
            if (text) {
                fullScreenText.innerHTML = text;
                fullScreenText.classList.add('fadeIn');    
            } else {
                fullScreenText.innerHTML = '';
            }
        }); 

        fullScreenVideo.addEventListener('ended', function callback(event) { 
            event.currentTarget.removeEventListener(event.type, callback); 
            if (text) fullScreenText.classList.remove('fadeIn');  
            fullScreenVideo.pause();
            fullScreenVideo.src = '';
            fullScreenVideo.load();
            resolve();
        }); 

        fullScreenVideo.src = path;
    });
}

function renderText(text, duration) {
    return new Promise((resolve, reject) => {
        fullScreenText.addEventListener("transitionend", function callback(event) {
            event.currentTarget.removeEventListener(event.type, callback);         
            window.setTimeout(() => { 
                fullScreenText.classList.remove('fadeIn');  
                resolve();              
            }, duration);
        });

        fullScreenText.innerHTML = text;
        fullScreenText.classList.add('fadeIn');
    });
}