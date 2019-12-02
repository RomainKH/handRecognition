// Import de tous les différents dossiers/fichiers 
import './css/style.styl'
import 'babel-polyfill'
import * as handTrack from 'handtrackjs'

const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.9,  // reduce input image size for gains in speed.
    maxNumBoxes: 5,        // maximum number of boxes to detect
    iouThreshold: 0.2,      // ioU threshold for non-max suppression
    scoreThreshold: 0.85,    // confidence threshold for predictions.
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

class Hand {
    constructor(id){
        this.x = 0
        this.y = 0
        this.height = 0
        this.width = 0
        this.id = id
        this.parent = document.querySelector('.container-video')
        this.hand = document.createElement('div')
        this.hand.classList.add('hands')
        this.hand.classList.add('hand'+id)
    }
    createHand() {
        this.parent.appendChild(this.hand)
        console.log('create');
        
    }
    moveHand(id, x, y, width, height) { 
        if (this.id == id) {
            this.hand.style.top = y + "px"
            this.hand.style.right = x + "px"
            this.hand.style.width = width + "px"
            this.hand.style.height = height + "px"
        }
    }
    deleteHand() {
        this.parent.removeChild(this.hand)
        console.log('delete');
        
    }
}

let handsUp = []

function runDetection(){
    model.detect(video).then(predictions => {   
        if (handsUp.length > predictions.length) {
            for (const hand of handsUp) {
                hand.deleteHand()
            }
            handsUp = []
        }  
        if (predictions.length > 0) {
            if (handsUp.length < predictions.length) {
                let square = new Hand(handsUp.length)
                square.createHand(handsUp.length)
                handsUp.push(square)
            } 
            for (let i = 0; i < predictions.length; i++) {
                let hand = predictions[i]
                let id = i
                let x = hand.bbox[0]
                let y = hand.bbox[1]
                let width = hand.bbox[2]
                let height = hand.bbox[3]
                for (const hand of handsUp) {
                    hand.moveHand(id, x, y, width, height)
                }
            }
        }   
    })
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel
})