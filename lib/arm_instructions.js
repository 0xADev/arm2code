/**
 * @author Pr0xy
 * @description ARM instructions set1
 */
var instructions = [
    'adc',
    'add',
    'and',
    'b',
    'bic',
    'bl',
    'bx',
    'cdp',
    'cmn',
    'cmp',
    'eor',
    'ldc',
    'ldm',
    'ldr',
    'mcr',
    'mla',
    'mov',
    'mrc',
    'mrs',
    'msr',
    'mul',
    'mvn',
    'orr',
    'rsb',
    'rsc',
    'sbc',
    'stc',
    'stm',
    'str',
    'sub',
    'swi',
    'swp',
    'teq',
    'tst',

    'push',
    'pop'
];

var branch_instructions = [
    'b',
    'bl',
    'bx'
];

var json_instructions = {};


(function(){
    for( var  i in instructions){
        json_instructions[instructions[i]] = instructions[i];
        json_instructions[instructions[i]+'s'] = instructions[i]+'s';
    }
    return json_instructions;
})();


module.exports.instructions = instructions;
module.exports.json_instructions = json_instructions;


