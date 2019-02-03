const 
    argumentProcessor = require('./processor_argument.js').ArgumentProcessor,
    jsonArmInstructions =  require('./arm_instructions.js').json_instructions,
    armInstructions =  require('./arm_instructions.js').instructions,
    jsonArmRegisters = require('./arm_registers.js').json_registers,
    armRegistersLower = require('./arm_registers.js').arm_registers_lower;

const operators = require('../config/config_operators.json');

/**
 * @description Pseudocode for MOV instr
 * @deprecated Do not use that
 */
var i_MOV = {
    pseudocode : (arg1,arg2,arg3,arg4) => {
        var 
            hasArg3 = arg3 != undefined,
            hasArg4 = arg4 != undefined;
            return arg1 + ' = ' + arg2; 
    }
}
/**
 * @description Pseudocode for ADD instr
 * @deprecated Do not use that
 */
var i_ADD = {
    pseudocode : (arg1,arg2,arg3,arg4) => {
        var 
            hasArg3 = arg3 != undefined,
            hasArg4 = arg4 != undefined;
        if( !hasArg3 && !hasArg4 )
            return arg1 + operators.OPERATOR_EQUAL + arg2;
        if( !hasArg4 )
            return arg1 + operators.OPERATOR_EQUAL + arg2 + operators.OPERATOR_ADD + arg3;
    }
}


var i_instr = {
    i_NO_PSEUDO_CODE : (string) => {
        return string.trim();
    },

    /**
    * @description Pseudocode for MOV instr
    * @returns {string}
    */
    i_MOV : {
        pseudocode : (arg1,arg2,arg3,arg4) => {
            var 
                hasArg3 = arg3 != undefined,
                hasArg4 = arg4 != undefined;

            if( arg1.startsWith(jsonArmRegisters.PC)) return 'return r0\n}';

                return operators.KEYWORD_VAR + arg1 + ' = ' + arg2; 
        }
    },
    /**
    * @description Pseudocode for ADD instr
    * @returns {string}
    */
    i_ADD : {
        pseudocode : (arg1,arg2,arg3,arg4) => {
            var 
                hasArg3 = arg3 != undefined,
                hasArg4 = arg4 != undefined;
            if( !hasArg3 && !hasArg4 )
                return operators.KEYWORD_VAR + arg1 +  operators.OPERATOR_EQUAL + arg2;
            if( !hasArg4 )
                return operators.KEYWORD_VAR + arg1 +  operators.OPERATOR_EQUAL + arg2 + operators.OPERATOR_ADD + arg3;
        }
    },
    /**
    * @description Pseudocode for SUB instr
    * @returns {string}
    */
    i_SUB : {
        pseudocode : (arg1,arg2,arg3,arg4) => {
            var 
                hasArg3 = arg3 != undefined,
                hasArg4 = arg4 != undefined;
            if( !hasArg3 && !hasArg4 )
                return operators.KEYWORD_VAR + arg1 +  operators.OPERATOR_EQUAL + arg2;
            if( !hasArg4 )
                return operators.KEYWORD_VAR + arg1 +  operators.OPERATOR_EQUAL + arg2 + operators.OPERATOR_SUB + arg3;
        }
    },
    /**
    * @description Pseudocode for PUSH instr
    * @returns {string}
    */
    i_PUSH : {
        pseudocode : (listArray) =>{
            var reglist = listArray[0].toLowerCase().replace(/\s/g,'');
            return 'stack.push( ' + reglist + ' )';
        }
    },
    /**
    * @description Pseudocode for POP instr
    * @returns {string}
    */
    i_POP : {
        pseudocode : (listArray) =>{
            var reglist = listArray[0].toLowerCase().replace(/\s/g,'');

            if( reglist.indexOf(jsonArmRegisters.PC) > -1 ) return 'return r0\n}';

            return 'stack.pop( ' + reglist + ' )';
        }
    },
    /**
    * @description Pseudocode for CMP instr
    * @returns {string}
    */
    i_CMP : {
        pseudocode : (arg1,arg2,nextInstr) => {
            var nextInstrArgs = InstrProcessor.processOperands(nextInstr);
            var condition_flag = InstrProcessor.getLogicOperand(nextInstrArgs[0]);
            console.log( condition_flag);
            return 'if( '+  condition_flag + ')\n       ' + nextInstrArgs[1] + '()'; ;
        }
    },
    /**
    * @description Pseudocode for BX instr
    * @returns {string}
    */
    i_BX : {
        pseudocode : (arg1) => {
            //console.log(arg1 == jsonArmRegisters.LR);
            switch(arg1){
                case jsonArmRegisters.LR:
                    return 'return r0\n}';
            }
        }
    },
    /**
    * @description Pseudocode for STR instr
    * @returns {string}
    */
    i_STR : {
        pseudocode : (arg1,arg2,arg3) => {
            
            var hasArg2 = arg2 != undefined;
            var hasArg3 = arg3 != undefined;

            var target = arg2;

            
            var isPreIndexedMode = (hasArg3)?arg3.indexOf('!') > -1:false;

            
            if(hasArg3){

            }
            var targetArray = target.split(',');
            try{
                var 
                    baseRegister = InstrProcessor.removeBrackets( targetArray[0] ),
                    value = InstrProcessor.removeBrackets( targetArray[1] ); 
            }catch(e){}

            if(targetArray.length > 1  && !isPreIndexedMode )
                return operators.KEYWORD_VAR + baseRegister + operators.OPERATOR_EQUAL + arg1 + operators.OPERATOR_ADD + value;
            if( isPreIndexedMode ){
                return operators.KEYWORD_VAR + baseRegister + operators.OPERATOR_EQUAL + baseRegister + operators.OPERATOR_ADD + value + '\n    ' + operators.KEYWORD_VAR + baseRegister + operators.OPERATOR_EQUAL + arg1;
            }
            return  operators.KEYWORD_VAR + arg1 + operators.OPERATOR_EQUAL + InstrProcessor.removeBrackets(target);
        }
    },
    /**
    * @description Pseudocode for LDR instr
    * @returns {string}
    */
    i_LDR : {
        pseudocode : (arg1,arg2,arg3) => {
            var hasArg2 = arg2 != undefined;
            var hasArg3 = arg3 != undefined;

            var target = arg2;

            var isPostIndexedMode = hasArg3;

            if(hasArg3){

            }
            var targetArray = target.split(',');
            try{
            var 
                baseRegister = InstrProcessor.removeBrackets( targetArray[0] ),
                value = InstrProcessor.removeBrackets( targetArray[1] ); 
            }catch(e){}

            if(targetArray.length > 1  && !isPostIndexedMode )
                return operators.KEYWORD_VAR + InstrProcessor.removeBrackets(arg1) + operators.OPERATOR_EQUAL + arg2;
            if( isPostIndexedMode ){
                return  operators.KEYWORD_VAR + InstrProcessor.removeBrackets(arg2) + operators.OPERATOR_EQUAL + InstrProcessor.removeBrackets(arg2) + operators.OPERATOR_ADD + arg3 + '\n    ' + operators.KEYWORD_VAR + arg1 + operators.OPERATOR_EQUAL + InstrProcessor.removeBrackets(arg2);
            }
            return operators.KEYWORD_VAR + arg1 + operators.OPERATOR_EQUAL + arg2;;
        }
    },
    i_ORR : {
        pseudocode : (arg1, arg2, arg3 ) => {
            //orr         r15, r14, r14 returns
        }
    }
}

var RegisterProcessor =  /*simulated class -->*/ {
    matchTokens : /^[\W\s]/g,

    isStackPointerRegister : (string) => {
        var 
            //matchTokens = /^[\W\s]/g,
            reg = string.replace(RegisterProcessor.matchTokens,''),
            isSpReg = reg.startsWith(jsonArmRegisters.SP)||reg.startsWith('R13');
        return isSpReg;
    },

    isLinkRegister : (string) => {
        var 
            //matchTokens = /^[\W\s]/g,
            reg = string.replace(RegisterProcessor.matchTokens,''),
            isSpReg = reg.startsWith(jsonArmRegisters.LR)||reg.startsWith('R14');
        return isSpReg;
    }
}


var InstrProcessor =  /*simulated class -->*/{

    /**
    * @param {string} asm
    * @returns {string}
    */
    pseudocode : (asm) => {
        var info =
            '// Pseudocode generated by arm2code\n'
            + '// Warning: this code isn\'t any programmatical language script, it\'s just a pseudocode';


        //var result = 'var ' + armRegistersLower.join(',')+';\n';
        var result = [  ]; 
        var buffer = InstrProcessor. format(asm);//asm.split('\n');

        result.push( '\n'+ info + '\n\n\n\n');
        result.push('var ' + armRegistersLower.join(',')+';\n');

        /*for( var i in buffer ){
            var line = buffer[i].replace(/,/g,', ').replace(/\s\s+/g, ' ').trimLeft();//Replace spaces with single space
            line = line.replace(/\;(.*)/g,''); //Remove comment
            result += InstrProcessor.instruction2code(line) + '\n';
        }*/
        var push = (line) => result.push(line);

        for( var i = 0; i < buffer.length ; i++ ){
            var line = buffer[i];
            var nextLine = buffer[i+1];

            if( InstrProcessor.isLabel(line) ){
                push('function ' + line + '\n{\n');
                continue;
            }

            try{
                var pseudocodeline =  InstrProcessor.instruction2code(line,nextLine);

                if( pseudocodeline !== 'nothing')
                    push( InstrProcessor.instrIndentation(pseudocodeline + '\n'));
            } catch (e){
                push(InstrProcessor.instrIndentation(line+'\n'));
            }
        }
        return InstrProcessor.formatResult( result.join('') );
    },

    /**
     * @param {string} line - line for indentation
     * @returns {string}
     */
    instrIndentation : line => {
        return '    ' + line;
    },

    /**
    * @param {string} asm
    * @returns {object}
    */
    format : (asm) => {
        var result = []
        var buffer = asm.split('\n');

        var 
            matchCommas = /,/g, // --> ",""
            matchTwoSpacesOrMore = /\s\s+/g, // --> "  ", "    ", "       "...
            matchAsmComments = /\;(.*)/g, // --> "; Hello Comment"
            matchCenterCommas = /\s{1}\,\s{1}/g; // --> " , "

        /*for( var i in buffer ){
            var line = buffer[i].replace(/,/g,', ').replace(/\s\s+/g, ' ').trimLeft();//Replace spaces with single space
            line = line.replace(/\;(.*)/g,''); //Remove comments
            line = line.replace(/\s{1}\,\s{1}/g, ', ');
            result.push(line);
        }*/

        var line;
        for( var i in buffer ){
            line = buffer[i];
            line = line.replace(/,/g,', ').replace(/\s\s+/g, ' ').trimLeft();//Replace spaces with single space
            line = line.replace(/\;(.*)/g,''); //Remove comments
            line = line.replace(/\s{1}\,\s{1}/g, ', ');
            result.push(line);
        }

        return result;
    },

    formatResult : (string) => {
        var 
            matchStringNoQuote = /(?!"[^"]*)[\w\W](?![^"]*")/g,
            matchUselessCommas = /,(?![\S])/g,
            matchOffsetOperator = /#((?=-)|(?=[0-9]))/g; 

        return string
            .replace(matchUselessCommas, '')
            .replace(matchOffsetOperator,'');
    },

    getSequentialRegisters : (string) => { //format = "r0-r3"
        var 
            matchFirstRegister = /[\w]{2,}(?=\-)/i,
            matchSecondRegister = /-(.*)/i;

        var 
            reg1 = matchFirstRegister.exec(string).toString(),
            reg2 = matchSecondRegister.exec(string).slice(1).toString();

        var 
            regIndex1 = armRegistersLower.indexOf(reg1),
            regIndex2 = armRegistersLower.indexOf(reg2);

        if( regIndex1 > regIndex2) return string;

        var result = [];


        for(var i = regIndex1 ; i < regIndex2+1 ; i++ ){
            result.push(armRegistersLower[i])
        }

        return result;
    },

    /**
    * @param {string} string
    * @returns {object}
    */
    processOperands : (string) => {
        return argumentProcessor.SplitArguments(string, 0);
    },
    /**
    * @param {string} string
    * @returns {object}
    */
    processCommaOperands : (string) => {
        var args = string.match(/\s(.*)/).join(',').split(',');
        for( var i = args.length/2 ; i > 0 ; i--){
            args.pop();
        }
        return args;
    },
    /**
    * @param {string} string
    * @returns {object}
    */
    processLists : (string) => {
        return string.match( /\{.*?\}/g); //Move to ArgumentProcessor coming soon
    },
    /**
    * @param {string} string
    * @returns {object}
    */
    processBrackets : (string) => {
        return string.match( /\[.*?\]/g);
    },
    /**
    * @param {string} string
    * @returns {string}
    */
    removeBrackets : (string) => {
        return string.replace(/\[/g, '' ).replace(/\]/g, '');
    },
    /**
    * @param {string} string
    * @returns {string}
    */
    removeValueHashtags : (string) => {
        return string.replace(/\#/g, '');
    },
    /**
    * @param {string} string
    * @returns {string}
    */
    removeCommas : (string) => {
        return string.replace(/\,/g, '');
    },
    /**
    * @param {string} string
    * @returns {boolean}
    */
    isLabel : string => {
        return string.trimLeft().startsWith('loc_'); //IDA Pro only, yet
    },
    /**
    * @param {string} instr
    * @returns {string}
    */
    getLogicOperand : instr => {
        /*
            N – Negative
            is set if the result of a data processing instruction was negative.
            Z – Zero
            is set if the result was zero.
            C – Carry
            is set if an addition, subtraction or compare causes a result bigger than 32 bits, or is set from the output of the shifter for move and logical instructions.
            V – Overflow
            is set if an addition, subtraction or compare produces a signed result bigger than 31 bits.
        */
        var arm_conditions = [
            'EQ','NE','LS','GE','LT','GT','LE',
            'MI', 'PL', 'VS', 'VC', 'HI', 'AL'
        ];
        var arm_logic_flags = {
            "EQ":"Z", // --> Equal / equals zero                            Z
            "NE":"!Z", // --> Not equal                                     !Z
            "LS":"!C or Z", // --> Unsigned lower or same                   !C or Z
            "GE":"N == V", // --> Signed greater than or equal              N == V
            "LT":"N != V", // --> Signed less than                          N != V
            "GT":"!Z and (N == V)", // --> Signed greater than	            !Z and (N == V) 
            "LE":"Z or (N != V)", // --> Signed less than or equal          Z or (N != V)
            "MI":"N", // --> Minus / negative	                            N
            "PL":"!N", // --> Plus / positive or zero	                    !N
            "VS":"V", // --> Overflow	                                    V
            "VC":"!V", // --> No overflow	                                !V
            "HI":"C and !Z", // --> Unsigned higher	C and                   !Z
            "AL":"any flag" // --> Always (default)	                        any
        }

        for( var i in arm_conditions){
            if( instr.toLowerCase().endsWith(arm_conditions[i].toLowerCase()))
                return arm_logic_flags[arm_conditions[i]];
        }
        return 'INVALID CMP'
    },
    /**
    * @param {string} string
    * @returns {string}
    */
    instruction2code : (string,nextInstr) => {
        const defaultInstr = string;

        
        var 
            args = InstrProcessor.processOperands(string),
            instruction = args[0].toLowerCase(); /*MNEMONIC */

            if( armInstructions.indexOf(instruction.trim()) == -1 ){
                return  i_instr.i_NO_PSEUDO_CODE(defaultInstr);
            }

        var listArray = InstrProcessor.processLists(string); //Array with bracket list example --> {R0,R1}
        var bracketArray = InstrProcessor.processBrackets(string);
        
        var commaOperands = InstrProcessor. processCommaOperands(string);

       // console.log(commaOperands);

        (()=>{ // --> Convert all items to lower case
            for( var i in args ){
                args[i] = args[i].toLowerCase();
            }
        })();

        var 
            arg1 = args[1] || commaOperands[1], //{S} - An optional suffix. If S is specified, the condition flags are updated on the result of the operation
            arg2 = args[2] || commaOperands[2], //{condition} - Condition that is needed to be met in order for the instruction to be executed
            arg3 = args[3] || commaOperands[3], //{Rd} - Register (destination) for storing the result of the instruction
            arg4 = args[4] || commaOperands[4], //Operand1 - First operand. Either a register or an immediate value 
            arg5 = args[5] || commaOperands[5]; //Operand2 - Second (flexible) operand. Can be an immediate value (number) or a register with an optional shift

        

        switch(instruction){
            case jsonArmInstructions.strs:
            case jsonArmInstructions.str:
                return i_instr.i_STR.pseudocode(arg1,bracketArray[0],arg3);

            case jsonArmInstructions.ldrs:
            case jsonArmInstructions.ldr:
                var ldrArg2 = (bracketArray[0]==undefined)?arg2:bracketArray[0];
                return i_instr.i_LDR.pseudocode(arg1,ldrArg2,arg3);

            case jsonArmInstructions.movs:
            case jsonArmInstructions.mov:
                return i_instr.i_MOV.pseudocode(arg1,arg2,arg3,arg4);
            break;
            case jsonArmInstructions.adds:
            case jsonArmInstructions.add:
                return i_instr.i_ADD.pseudocode(arg1,arg2,arg3,arg4);
            case jsonArmInstructions.subs:
            case jsonArmInstructions.sub:
                return i_instr.i_SUB.pseudocode(arg1,arg2,arg3,arg4);
            case jsonArmInstructions.pushs:
            case jsonArmInstructions.push:
                return i_instr.i_PUSH.pseudocode(listArray);
            case jsonArmInstructions.pops:
            case jsonArmInstructions.pop:
                return i_instr.i_POP.pseudocode(listArray);
            case jsonArmInstructions.cmps:
            case jsonArmInstructions.cmp:
                return i_instr.i_CMP.pseudocode(arg1,arg2, nextInstr);
            case jsonArmInstructions.bxs:
            case jsonArmInstructions.bx:
                return i_instr.i_BX.pseudocode(arg1);


            //default:
               // return defaultInstr;
        } 

        return line + ' ; not recognized\n';

    }
};

module.exports.InstrProcessor = InstrProcessor;