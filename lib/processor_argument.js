/**
 * @author 0xADev
 * @description Split instruction operands MOV R#, 0xFF --> ['MOV', 'R#', '0xFF']
 */
module.exports.ArgumentProcessor = {

    /**
     * @param {string} string - String for split
     * @param {number} ignoreLength - Skip length
     */
    SplitArguments : (string, ignoreLength) => {
        var matchSpaceArgs = /\s+/g;
        var argumentArray = string.slice( ignoreLength).split(matchSpaceArgs);
        return argumentArray;
    },
    
     /**
     * @param {string} string - String for split
     * @param {number} ignoreLength - Skip length
     */
    SplitQuoteArguments : ( string, ignoreLength ) => {
        var matchQuoteArgs = /\".*?\"/g;
        return string.slice(ignoreLength).match(matchQuoteArgs);
    },
    
     /**
     * @param {string} string - String for split
     * @param {string} barrierChar - Character block example quotes "text123"
     * @param {number} ignoreLength - Skip length
     */
    SplitArgumentsInsideChar : ( string, barrierChar, ignoreLength ) => {
        var matchQuoteArgs = new RegExp(barrierChar+'.*?'+barrierChar); // /\".*?\"/g;
        return string.slice(ignoreLength).match(matchQuoteArgs);
    },

     /**
     * @param {string} string - String for get quotes removed
     */
    RemoveArgumentQuotes : string => {
        console.log('Removing quotes at: ' + string.replace( /\"/g, '' ) );
        return string.replace( /\"/g, '' );
    },

    /**
     * @param {string} string - String for get char removed
     * @param {string} char - Char for remove
     */
    RemoveArgumentChar : (string,char) => {
        var matchChar = new RegExp(char, 'g')
        return string.replace( matchChar, '' );
    }
    
}