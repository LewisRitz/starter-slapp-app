var mappings = require('./mappings');

const maturityTypeVals = ["M","Y"];
const rateTypeVals = ["UST", "LIBOR", "SEMI", "SWAP", "EXCHANGE"];
const validCurrencyPairs = ["EURUSD","EURGBP","USDJPY"];
const validYearsMaturity = [1,2,3,4,5,6,7,8,9,10,20,30];
const validMonthsMaturity = [1,2,3,6,12];

getRic = function(text){
    text = text.toUpperCase();
    
    var argsArray = [];
    var maturity_type = null;
    var maturity_length = null
    var currency_pair = null;
    var rate_type = null;

    var parsedCommand = validateString(text);

    if (parsedCommand != null){
        argsArray = parsedCommand.split(" ");
    }
        console.log("argsArray", argsArray);

    rate_type = extractRateType(argsArray[0]);

    if(rate_type != "EXCHANGE"){
        maturity_type = extractMaturityType(argsArray[1].substr(-1,1));
        maturity_length = extractMaturityLength(argsArray[1].slice(0,-1), maturity_type);
        console.log("maturity_length", maturity_length, maturity_type, argsArray[1].substr(-2,1));
    } else {
        currency_pair = extractCurrencyPair(argsArray[1]);
    }
    
    return convertToRic(rate_type, maturity_length, maturity_type, currency_pair);

    // UST2YD=

    // console.log("rate type: " + rate_type);
    // console.log("maturity type: " + maturity_type);
    // console.log("maturity length: " + maturity_length);
    // console.log("currency pair: " + currency_pair);
}



convertToRic = function(rate_type, maturity_length, maturity_type, currency_pair) {
  return mappings.getRicFromMappings(rate_type, maturity_length, maturity_type);
}

validateString = function(text){
    var parsedCommand; 
    var validateRegExp = new RegExp(/\w+\s(\d+\w|\w+)$/);
    var command = text.match(validateRegExp);

    if (command != null){
        parsedCommand =  command[0];
    } else {
        console.log("Invalid Command!");
        parsedCommand = null;
    }

    return parsedCommand;
}

extractRateType = function(typeString){
    return checkForProperty(typeString, rateTypeVals);
}

extractMaturityType = function(maturityTypeString){
    return checkForProperty(maturityTypeString, maturityTypeVals);
}

extractMaturityLength = function(maturityLengthString, maturtiy_type){
    if (maturtiy_type == "Y"){
        return checkForProperty(parseInt(maturityLengthString), validYearsMaturity);
    }
    if (maturtiy_type == "M"){
        return checkForProperty(parseInt(maturityLengthString), validMonthsMaturity);
    }
    else{
        return null;
    }
}

extractCurrencyPair = function(currencyString){
    return checkForProperty(currencyString, validCurrencyPairs);
}

checkForProperty = function(prop, arr){
    var result;

    if (typeof prop == "string"){
        prop = prop.toUpperCase();
    }

    if (arr.indexOf(prop) > -1 ){
        result = prop;
    } else {
        result = null;
        error = new Error("Error Message Here!");
        error.name = "UserInputError";
        throw error;
    }
    return result;
}


//examples
// parse("/rates ust 3m");
// console.log("\n");
// parse("/rates libor 3m");
// console.log("\n");
// parse("/rates exchange EURUSD");
// console.log("\n");
// parse("/rates notvalid EURUSD");


module.exports = {
  getRic: getRic
};