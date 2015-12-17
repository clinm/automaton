/**
 * Created by Matthieu on 17/12/2015.
 */

var autoLifeLike = [{'conway': 'Conway'},
    {'seeds' : 'Seeds'},
    {'replicator' : 'Replicator'},
    {'highlife': 'Highlife'}];

var autoParams = {  surfaceId: 'canvas-automaton',
    numberElements: [50, 50],
    colors: ['#629F61', '#69394A'],
    freqUpdate: 1000,
    auto:'conway',
    circular: false
};

var auto = Automaton.automata(autoParams);


var autoType = document.getElementById('automaton-type');
autoType.addEventListener('change', onAutomatonUpdate ,false);

var autoFreq = document.getElementById('automaton-frequency');
autoFreq.value = autoParams.freqUpdate;
autoFreq.addEventListener('change', onUpdateFrequency, false);

var autoWidth = document.getElementById('automaton-width');
autoWidth.value = autoParams.numberElements[0];
autoWidth.addEventListener('change', onUpdateWidth, false);

var autoHeight = document.getElementById('automaton-height');
autoHeight.value = autoParams.numberElements[1];
autoHeight.addEventListener('change', onUpdateHeight, false);

var autoCircular = document.getElementById('automaton-circular');
autoCircular.checked = autoParams.circular;
autoCircular.addEventListener('change', onUpdateCircular, false);

var automatonStartStop = document.getElementById('automaton-startStop');
var running = false;


for(var a in autoLifeLike){
    for(var k in autoLifeLike[a]){
        var opt = document.createElement('option');
        opt.value = k;
        opt.innerHTML = autoLifeLike[a][k];
        autoType.appendChild(opt);
    }
}

function onAutomatonUpdate(){
    autoParams.auto =  autoType.options[autoType.selectedIndex].value;
}

function onUpdateFrequency(){
    autoParams.freqUpdate = autoFreq.value;
}

function onUpdateWidth(){
    autoParams.numberElements[0] = autoWidth.value;
}

function onUpdateHeight(){
    autoParams.numberElements[1] = autoHeight.value;
}

function onUpdateCircular(){
    autoParams.circular = autoCircular.checked;
}

function newAuto(){
    auto.stop();
    auto = Automaton.automata(autoParams);

    running = false;
    automatonStartStop.innerHTML = 'Start';
}

function startStop(){
    if(running){
        auto.stop();
        running = false;
        automatonStartStop.innerHTML = 'Start';
    }else{
        auto.start();
        running = true;
        automatonStartStop.innerHTML = 'Stop';
    }
}

function next(){
    auto.nextIteration();
}
