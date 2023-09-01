
function initCanvas() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext("2d");
    context.strokeColor = '#7142f4';
    return context;
}
 
function plotDataset(context, dataSet) {
    var canvasHeight = context.canvas.height;
 
    context.beginPath();
    context.moveTo(0, dataSet[0]);
 
    for (var i = 0; i < dataSet.length; i++) {
        var population = dataSet[i],
            xCoordinate = i * xScale,
            yCoordinate = canvasHeight - population;
 
        context.lineTo(xCoordinate, yCoordinate);
    }
 
    context.stroke();
}

function drawParticle(ctx, particle) {
    var canvasHeight = ctx.canvas.height;

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(particle.x,
            canvasHeight - getYValue(particle.x),
            5, 0, Math.PI*2);
    ctx.fill();
}

function drawAll() {
    var ctx = initCanvas();
    ctx.clear();
    plotDataset(ctx, yValues);
    for (var i = 0; i < particles.length; i += 1) {
        drawParticle(ctx, particles[i]);
    }

    var canvasHeight = ctx.canvas.height;

    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(globalBest,
            canvasHeight - getYValue(globalBest),
            5, 0, Math.PI*2);
    ctx.fill(); 
}