'use strict'
var examples = [] //Przykłady
var weights = []
var lastPos = { x: 0, y: 0 } //Ostatnia znana pozycja przykłady -- rysowanie
var painting = $('.painting')[0]
var ctx = painting.getContext('2d') //canvas


var offests = painting.getBoundingClientRect();
var offset_left = offests.left
var offset_top = offests.top


// Funkcja rysująca graf
function drawPointsAndLines(pointsList) {
  var firstPoint = pointsList[0]
  ctx.beginPath()
  ctx.lineWidth = 1;
  ctx.moveTo(firstPoint.x, firstPoint.y)
  ctx.fillRect(firstPoint.x, firstPoint.y, 10, 10)
  for (let point of pointsList.slice(1, pointsList.length)) {

    ctx.strokeStyle = 'red'
    ctx.lineTo(point.x, point.y)
    ctx.moveTo(point.x, point.y)
    ctx.fillRect(point.x, point.y, 10, 10)
    ctx.stroke()
  }
  ctx.closePath()
}


painting.addEventListener('mousemove', draw);
painting.addEventListener('mousedown', setPosition);
painting.addEventListener('mouseenter', setPosition);


function setPosition(e) {
  lastPos.x = e.clientX - offset_left;
  lastPos.y = e.clientY - offset_top;
}

function redrawExamples() {
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  for (let example of examples) {
    ctx.moveTo(example.x, example.y);
    ctx.lineTo(example.x, example.y);
  }
  ctx.stroke();
}


function clearCanvas() {
  ctx.clearRect(0, 0, 500, 500);
}

function draw(e) {
  if (e.buttons !== 1) return;
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'green';
  setPosition(e);
  ctx.moveTo(lastPos.x, lastPos.y);
  ctx.lineTo(lastPos.x, lastPos.y);
  examples.push(new Point(lastPos.x, lastPos.y))
  ctx.stroke();
}

function alpha(t, T) {
  return 1 - ((t - 1) / T);
}

$('.js-rand').on('click', function () {
  for (let it = 0; it < $('.js-number-of-points').val(); it += 1) {
    weights.push(new Point(parseInt(Math.random() * 500), parseInt(Math.random() * 500)))
  }
  drawPointsAndLines(weights)
})

$('.js-number-of-points').on('change', function(){
  $('.js-number-of-points-l').text($('.js-number-of-points').val())
})

$('.js-t').on('change', function(){
  $('.js-t-l').text($('.js-t').val())
})

$('.js-reset').on('click', function () {
  window.location = window.location
})

$('.js-debugger').on('click', function () {
  debugger
})



$('.js-start').on('click', function () {
  var T = $('.js-t').val()
  for (let t = 0; t <= T; t += 1) {

    var currentExample = examples[Math.floor(Math.random() * examples.length)]
    var currentDistance = weights[0].distance(currentExample)
    var itTmp = 0
    var distanceTmp = 0
    for (let itWeight of Object.keys(weights)) {
      // debugger

      distanceTmp = weights[itWeight].distance(currentExample)
      if (distanceTmp < currentDistance) {
        [currentDistance, itTmp] = [distanceTmp, itWeight]
      }
    }
      for (let it of [0, 1]) { // 0 - punkt, +1/-1 sąsiedzi
        let neighbourOrSelf = 1.0 / (it + 1);
        if (itTmp + it < weights.length) {
          weights[parseInt(itTmp) + it].update(alpha(t, T), neighbourOrSelf, currentExample);
        }
        if (parseInt(itTmp) - it >= 0) {
          weights[parseInt(itTmp) - it].update(alpha(t, T), neighbourOrSelf, currentExample);
        }
      }
  }
  clearCanvas()
  drawPointsAndLines(weights)
  redrawExamples()
})
