#Automaton
This is my first project since I have learn Javascript. It is a mean for me to practise and share this beautiful little things that are cellular Automatons.

#Overview
This project is using a HTML5 canvas to graphically displayed the automaton.
For now, I am only implementing the well-known [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

#Usage
##Creation
```javascript
    var myAutomaton = Automaton.automata({surfaceId: 'displayId',     // HTML canvas' ID
                        numberElements: [10, 10],                     // number of elements on each dimension
                        colors: ['#629F61', '#69394A'],               // color for each state
                        freqUpdate: 100}                              // update frequency in ms
                        );                  
```
##Start and Stop
```javascript
    myAutomaton.start();
    myAutomaton.stop();
```

#Example
A correct example is now available in the examples directory. There are two intances of the automaton with each its own lifecycle, colors and frequency

#Incoming features
- [x] First implementation of a Cellular Automaton
- [x] Better looking interface
- [ ] Add more Cellular Automaton