define(["underscore", "knockout", "jquery", "./fetchData"],
	function(_, ko, $, fetchData){

	var main = function() {

		var self = this;
		var PARCEL_QUERY = "list_parcel";
		var APIHITS_QUERY = "api_hits";
		this.parcelData = ko.observableArray();
		this.apiHitsCount = ko.observable();
		this.parcelCount = ko.observable();

		this.fetchParcel = function(){
			fetchData(PARCEL_QUERY, this.fetchParcelSuccessHandler, this.fetchParcelErrorHandler);	
		};

		this.fetchParcelSuccessHandler = function(data) {
			this.parcelCount(data.parcels.length);
			this.parcelData(data.parcels);
		};

		this.fetchParcelErrorHandler = function(xhr, status, err) {
			console.error("fetchParcel", status, err.toString());
		};

		this.fetchApiHits = function(){
			fetchData(APIHITS_QUERY, this.fetchApiHitsSuccessHandler, this.fetchApiHitsErrorHandler);
		};

		this.fetchApiHitsSuccessHandler = function(data) {
			this.apiHitsCount(data.api_hits);
		};

		this.fetchApiHitsErrorHandler = function(xhr, status, err) {
			console.error("fetchApiHits", status, err.toString());
		};

		_.bindAll(this, 'fetchParcel', 'fetchParcelSuccessHandler', 'fetchParcelErrorHandler',
		 'fetchApiHits', 'fetchApiHitsSuccessHandler', 'fetchApiHitsErrorHandler');

		this.fetchParcel();
		this.fetchApiHits();
	}
	
	return main;
});