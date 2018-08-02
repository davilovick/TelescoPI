var gamepadController = require('./gamepadController.js')

var raAxis = 3;
var decAxis = 4;


gamepadController.initGamepad(raAxis, decAxis, (value)=>{
    console.log(`RA: ${value}`)
},
(value)=>{
    console.log(`DEC: ${value}`)
});