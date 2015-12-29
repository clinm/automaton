/**
 * Created by Matthieu on 17/12/2015.
 */

var autoParams = {  surfaceId: 'canvas-automaton',
    numberElements: [50, 50],
    colors: ['#629F61', '#69394A'],
    freqUpdate: 1000,
    auto:'conway',
    circular: false
};

var auto = Automaton.automata(autoParams);

var autoType = document.getElementById('automaton-type');

var automatonStartStop = document.getElementById('automaton-startStop');
var running = false;

Object.keys(Automaton.lifeAutomatons).forEach(function(a){
    var opt = document.createElement('option');
    opt.value = a;
    opt.innerHTML = Automaton.lifeAutomatons[a].name;
    autoType.appendChild(opt);
});

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
