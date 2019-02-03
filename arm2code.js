const argumentProcessor = require('./lib/processor_argument.js').ArgumentProcessor;
const instructionProcessor = require('./lib/processor_instruction.js').InstrProcessor;
const armRegisters =  require('./lib/arm_instructions.js').instructions;
//const armInstructions =  require('./lib/arm_register.js').ArgumentProcessor;


var fs = require('fs');


fs.readFile('./ARM.asm', 'utf8', function(err, contents) {
    var pseudocode = instructionProcessor.pseudocode(contents);
  
    fs.writeFile('./pseudocode.txt', pseudocode);
    console.log( pseudocode );
  // instructionProcessor.format(contents)
});


//console.log( instructionProcessor.processOperands ('MOV R0, R1, #0xFF'))

//console.log(instructionProcessor.instruction2code('PUSH {R0}'))
//console.log(instructionProcessor.instruction2code('MOV R1, R0'))