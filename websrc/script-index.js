/**
 * Created by Matthieu on 17/12/2015.
 */

var autoParams = {  surfaceId: 'canvas-automaton',
    numberElements: [50, 50],
    colors: ['#629F61', '#69394A'],
    freqUpdate: 1000,
    auto:'conway',
    circular: false,
    // only used to link form to data
    custom: ["lifelike", [],[]]
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

// adding "custom"
var opt = document.createElement('option');
opt.value = "lifelike";
opt.innerHTML = "Custom";
autoType.appendChild(opt);

var customAutomatonTable = document.getElementById('customAutomaton');

autoType.addEventListener("change", function(event){
    var src = event.target || event.srcElement;
    if(src[src.selectedIndex].value === 'lifelike'){
        customAutomatonTable.style.display = 'block';
    }else{
        customAutomatonTable.style.display = 'none';
    }
});

function newAuto(){

    if(autoParams.auto === 'lifelike'){
        var tmp = ['lifelike', [], []];
        for(var i = 0; i < 9; i++){
            for(var j = 1; j < 3; j++){
                if(autoParams.custom[j][i] === true){
                    tmp[j].push(i);
                }
            }
        }

        autoParams.auto = tmp;
    }else{

    }
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

var automatonFrequency = document.getElementById('automaton-frequency');

automatonFrequency.addEventListener('change', function(event){
    var src = event.target || event.srcElement;
    auto.updateFrequency(parseInt(src.value, 10));
});