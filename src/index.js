// Import de tous les différents dossiers/fichiers 
import './css/style.styl'
import 'babel-polyfill'
import * as handTrack from 'handtrackjs'

const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.9,  // reduce input image size for gains in speed.
    maxNumBoxes: 5,        // maximum number of boxes to detect
    iouThreshold: 0.2,      // ioU threshold for non-max suppression
    scoreThreshold: 0.75,    // confidence threshold for predictions.
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitgetUserMedia || navigator.mozgetUserMedia || navigator.msgetUserMedia

const video = document.querySelector('video#video'),
      canvas = document.querySelector('canvas'),
      context = canvas.getContext('2d')
let model, indicator = document.querySelector('.hand')


handTrack.startVideo(video).then(status => {
    if(status) {
        navigator.getUserMedia(
            {video: {}},
            stream => {
                video.srcObject = stream
                setInterval(async () => {
                    runDetection()
                }, 5)
            },
            err => console.error(err)
        )
    }
})

function runDetection(){
    model.detect(video).then(predictions => {
        // model.renderPredictions(predictions,canvas,context,video)
        let pos = {x: 0, y: 0}, mediumX = 0, mediumY = 0
        if(predictions.length > 0) {
            console.log(predictions)
            for (const hand of predictions) {
                mediumX += hand.bbox[0]
                mediumY += hand.bbox[1]
            }
            pos.x = mediumX / predictions.length
            pos.y = mediumY / predictions.length
            console.log(pos)
            indicator.style.top = pos.y + 'px'
            indicator.style.right = pos.x + 'px'
        }
    })
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel
})