var examples = [] //Przykłady
var neurons = []
var lastPos = { x: 0, y: 0 } //Ostatnia znana pozycja przykłądu
var painting = $('.painting')[0]
var ctx = painting.getContext('2d') //canvas


var offests = painting.getBoundingClientRect();
var offset_left = offests.left
var offset_top = offests.top


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

function redrawExamples(){
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  for(let example of examples){
    ctx.moveTo(example.x, example.y);
    ctx.lineTo(example.x, example.y);
  }
  ctx.stroke();
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


$('.js-rand').on('click', function () {
  for (let it = 0; it < $('.js-number-of-points').val(); it += 1) {
    neurons.push(new Point(parseInt(Math.random() * 500), parseInt(Math.random() * 500)))
  }
  drawPointsAndLines(neurons)
})

$('.js-reset').on('click', function(){
  examples = [] 
  neurons = []
  lastPos = { x: 0, y: 0 }
  clearCanvas()
})

function alpha(t, T) {
  return 1 - ((t - 1) / T);
}

function clearCanvas() {
  ctx.clearRect(0, 0, 500, 500);
}

$('.js-start').on('click', function () {
  T = $('.js-t').val()
  for (let t = 0; t <= T; t += 1) {

    currentExample = examples[Math.floor(Math.random() * examples.length)]
    currentDistance =  neurons[0].distance(currentExample)
    // [itTmp, distanceTmp] = [0, 0]
    itTmp = 0
    distanceTmp = 0
    for (let itNeuron of Object.keys(neurons)) {
      // debugger

      distanceTmp = neurons[itNeuron].distance(currentExample)
      if (distanceTmp < currentDistance) {
        [currentDistance, itTmp] = [distanceTmp, itNeuron]
      }
      for (i = 0; i < 2; i++) {
        G = 1.0 / (i + 1);
        if (itTmp + i < neurons.length) {
          neurons[parseInt(itTmp) + i].update(alpha(t, T), G, currentExample);
        }
        if (parseInt(itTmp) - i >= 0) {
          neurons[parseInt(itTmp) - i].update(alpha(t, T), G, currentExample);
        }
      }
    }
  }
  clearCanvas()
  drawPointsAndLines(neurons)
  redrawExamples()
}) 
