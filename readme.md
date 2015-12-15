#Automaton
This is my first project since I have learn Javascript. It is a mean for me to practise and share this beautiful little 
things that are cellular Automatons.

#Overview
This project is using a HTML5 canvas to graphically displayed the automaton.
For now, I am only implementing several 'life like' automatons.

#Usage
##Creation
```javascript
var myAutomaton = Automaton.automata({surfaceId: 'displayId',     // HTML canvas' ID
                    numberElements: [10, 10],                     // number of elements on each dimension
                    colors: ['#629F61', '#69394A'],               // color for each state
                    freqUpdate: 100},                             // update frequency in ms
                    auto: 'conway'                                // default is conway, values available are 
                                                                  // in the list below
                    );                  
```
The automatons available are :
- conway [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- seeds  [Seeds](https://en.wikipedia.org/wiki/Seeds_(CA))
- replicator
- highlife [HighLife](https://en.wikipedia.org/wiki/Highlife_(cellular_automaton))

Injecting custom life like automatons is also possible:
```javascript
var customLifeLike = ['lifelike',       // keyword to detect lifelike automaton
                        [1,2,3],        // number of neighbours needed to come to life
                        [4,5,6]         // number of neighbours needed to stay alive
                     ];
var myAutomaton = Automaton.automata({surfaceId: 'displayId', auto: customLifeLike});                  
```

##Start and Stop
```javascript
    myAutomaton.start();
    myAutomaton.stop();
    
    // compute only one iteration
    myAutomaton.nextIteration();
```
##Default values
Here is described the default value for each parameters

| Field             | Type              | Default value             |
| ----------------- | ----------------- | ------------------------- |
| surfaceId         | string            | non optional              |
| freqUpdate        | number            | 1000                      |
| numberElements    | [number, number]) | cells 10px*10px computed  |
| colors            | [string, string]  | ['#D1D1D1', '#DD5856']    |
| auto              | string            | conway                    |
| circular          | boolean           | true                      |

#Example
The index.html page shows the four automatons in action. 
#Incoming features
- [x] First implementation of a Cellular Automaton
- [x] Better looking interface
- [x] Add more Cellular Automaton
- [ ] Interface allowing to change parameters on the fly
- [x] Additional parameters to generate custom life like automatons
- [ ] Basics patterns for each automaton instead of random generation