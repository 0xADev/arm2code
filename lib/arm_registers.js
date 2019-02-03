/**
 * @author fadyi
 * @description ARM registers
 * 
 */

var arm_registers = [
    'R0',
    'R1',
    'R2',
    'R3',
    'R4',
    'R5',
    'R6',
    'R7',
    'R8',
    'R9',
    'R10',
    'R11',
    'R12',
    'SP',
    'LR',
    'PC',
    'CPSR'
];

var arm_registers_lower = [];

(function(){
    for( var  i in arm_registers){
        arm_registers_lower.push( arm_registers[i].toLowerCase());
    }

})();


var json_registers = {};

(function(){
    for( var  i in arm_registers){
        json_registers[arm_registers[i]] = arm_registers[i].toLowerCase();
    }
    return json_registers ;
})();


module.exports.arm_registers = arm_registers;
module.exports.json_registers = json_registers;
module.exports.arm_registers_lower =  arm_registers_lower;
