define(['jquery'],
	function($){

	var fetchData = function(queryType, successHandler, errorHandler){
		return $.ajax({
                        url: "http://zoomcar-ui.0x10.info/api/courier",
                        dataType: 'json',
                        data: {
                        	type: "json",
                        	query: queryType
                        },
                        cache: false,
                        success: successHandler,
                        error: errorHandler
                  });
	}

	return fetchData;
});