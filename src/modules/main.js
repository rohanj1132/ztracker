define(["underscore", "knockout", "jquery", "./fetchData", "./googleMapsIntg"],
	function(_, ko, $, fetchData, googleMapsIntg){

	var main = function() {

		var self = this;
		var PARCEL_QUERY = "list_parcel";
		var APIHITS_QUERY = "api_hits";
		this.parcelData = ko.observableArray();
		this.apiHitsCount = ko.observable();
		this.parcelCount = ko.observable();
		this.parcelDetails = ko.observable();

		this.fetchParcel = function(){
			fetchData(PARCEL_QUERY, this.fetchParcelSuccessHandler, this.fetchParcelErrorHandler);	
		};

		this.fetchParcelSuccessHandler = function(data) {
			this.parcelCount(data.parcels.length);
			this.parcelData(data.parcels);
			this.showDetails(data.parcels[0]);
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

		//TODO: Use KO mapping
		this.showDetails = function(data){
			this.parcelDetails({
				color: ko.observable(data.color),
				date: ko.observable(data.date),
				image: ko.observable(data.image),
				link: ko.observable(data.link),
				name: ko.observable(data.name),
				phone: ko.observable(data.phone),
				price: ko.observable(data.price),
				quantity: ko.observable(data.quantity),
				type: ko.observable(data.type),
				weight: ko.observable(data.weight),
				//live_location: {latitude: 12.936543, longitude: 77.611538}
			});
			googleMapsIntg(data.live_location.latitude, data.live_location.longitude);
		};

		this.sortList = function(a,b,c,d,e){
			console.log(a,b,c,d,e);
		};

		_.bindAll(this, 'fetchParcel', 'fetchParcelSuccessHandler', 'fetchParcelErrorHandler',
		 'fetchApiHits', 'fetchApiHitsSuccessHandler', 'fetchApiHitsErrorHandler', 'showDetails',
		 'sortList');

		this.fetchParcel();
		this.fetchApiHits();
	}
	
	return main;
});