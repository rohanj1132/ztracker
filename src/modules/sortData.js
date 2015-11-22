define(['underscore'],
	function(_){

	var sortData = function(data, parameter){
		var sortedData = _.sortBy(data, parameter);
		return sortedData;
	}

	return sortData;
})