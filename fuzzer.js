var yValues = [1, 1, 1, 1, 1];
var xScale = 5;
var yMaxValues = 200;
var xMax = xScale * yMaxValues;
var yMax = 600;

var globalBest = null;
var particles = [];
var numberOfUpdates = 1;

CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.fillStyle = 'transparent';
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }           
};

function updateYValues() {
    let gradient = (Math.random() - 0.5) * 0.06;
    let sinusPower = (Math.random() - 0.5) * 10;

    let yVal = yMax / 2;
    for (var i = 0; i < yMaxValues; i += 1) {
        yVal += (Math.random() - 0.5) * 20;
        yVal += gradient * i;
        yVal += Math.sin(i / 20) * sinusPower;
        yValues[i] = yVal;
    }

    globalBest = 0;
    for (var i = 0; i < particles.length; i += 1) {
        if (isOptionOn("resetParticles"))
            particles[i] = createParticle();
    }

}

function getYValue(x) {
    if (x === null)
      return 0;
    var index = x / xScale;
    return yValues[Math.floor(index)];
}

function createParticle() {
    var result = {};
    result.x = Math.random() * xMax;
    let maxStartSpeed = 10;
    result.vx = Math.random() * maxStartSpeed * 2 - maxStartSpeed;
    result.inertia = getOptionValue("startIntertia") / 100;;
    result.localBest = result.x;
    result.localBias = getOptionValue("startCognitive") / 100;
    result.globalBias = getOptionValue("startSocial") / 100;

    if (isOptionOn("randomizeLocalOnce"))
        result.localBias = Math.random();
    if (isOptionOn("randomizeGlobalOnce"))
        result.globalBias = Math.random();

    return result;
}

function updateParticle(p) {
    if (isOptionOn("randomizeLocalEachCycle"))
      p.localBias = Math.random();
    if (isOptionOn("randomizeGlobalEachCycle"))
      p.globalBias = Math.random();

    let localDx = (p.localBest - p.x);
    let globalDx = (globalBest - p.x);
    p.vx = p.inertia * p.vx + p.localBias * localDx + p.globalBias * globalDx;
    p.x += p.vx * 0.1;

    if (getYValue(p.x) > getYValue(p.localBest)) {
        p.localBest = p.x;
    }

    if (getYValue(p.x) > getYValue(globalBest)) {
        globalBest = p.x;
    }
}


function update() {
    numberOfUpdates += 1;
    if (numberOfUpdates % getOptionValue("updateInterval") == 0) {
        updateYValues();
    }
    for (var i = 0; i < particles.length; i += 1) {
        updateParticle(particles[i]);
    }
    drawAll();
    setTimeout(update, 100);
}

function isOptionOn(name) {
    return document.getElementById("option_" + name).checked;
}

function getOptionValue(name) {
    return document.getElementById("option_" + name).value;
}

function startSimulation() {
    updateYValues();
    globalBest = null;
    particles = [];
    numberOfUpdates = 1;
    for (var i = 0; i < getOptionValue("numParticles"); ++i) {
        particles.push(createParticle());
    }
    setTimeout(update, 100);
}
