
var mappings = {
	'UST_3_M': 'USDTB3L3M=BRKR',
	'UST_6_M': 'US6MT=RR',
	'UST_12_M': 'US12MT=RR',
	'UST_2_Y': 'US2YT=RR',
	'UST_3_Y': 'US3YT=RR',
	'UST_5_Y': 'US5YT=RR',
	'UST_7_Y': 'US7YT=RR',
	'UST_10_Y': 'US10YT=RR',
	'UST_20_Y': 'US20YT=RR',
	'UST_30_Y': 'US30YT=RR'
};

getRicFromMappings = function(rate_type, maturity_length, maturity_type) {
	var key = buildMapKey(rate_type, maturity_length, maturity_type);
    console.log("KEY", key);
	return mappings[key];
};

buildMapKey = function (rate_type, maturity_length, maturity_type) {
	return rate_type + "_" + maturity_length + "_" + maturity_type;
}

module.exports = {
  getRicFromMappings: getRicFromMappings
};