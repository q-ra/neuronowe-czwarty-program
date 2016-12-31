let examples = [] //Przykłady
let weights = []
let lastPos = { x: 0, y: 0 } //Ostatnia znana pozycja przykłądu
let painting = $('.painting')[0]
let ctx = painting.getContext('2d') //canvas


let offests = painting.getBoundingClientRect();
let offset_left = offests.left
let offset_top = offests.top


// Funkcja rysująca graf
function drawPointsAndLines(pointsList) {
  firstPoint = pointsList[0]
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
  examples = []
  weights = []
  lastPos = { x: 0, y: 0 }
  clearCanvas()
})

$('.js-debugger').on('click', function () {
  debugger
})



$('.js-start').on('click', function () {
  T = $('.js-t').val()
  for (let t = 0; t <= T; t += 1) {

    currentExample = examples[Math.floor(Math.random() * examples.length)]
    currentDistance = weights[0].distance(currentExample)
    // [itTmp, distanceTmp] = [0, 0]
    itTmp = 0
    distanceTmp = 0
    for (let itWeight of Object.keys(weights)) {
      // debugger

      distanceTmp = weights[itWeight].distance(currentExample)
      if (distanceTmp < currentDistance) {
        [currentDistance, itTmp] = [distanceTmp, itWeight]
      }
      for (let it of [0, 1]) {
        G = 1.0 / (it + 1);
        if (itTmp + it < weights.length) {
          weights[parseInt(itTmp) + it].update(alpha(t, T), G, currentExample);
        }
        if (parseInt(itTmp) - it >= 0) {
          weights[parseInt(itTmp) - it].update(alpha(t, T), G, currentExample);
        }
      }
    }
  }
  clearCanvas()
  drawPointsAndLines(weights)
  redrawExamples()
}) 
