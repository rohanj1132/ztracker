define(["underscore", "knockout", "jquery", "knockoutmapping",
	"./fetchData", "./googleMapsIntg", "./sortData"],
	function(_, ko, $, komapping, fetchData, googleMapsIntg, sortData){

	var main = function() {

		var self = this;
		var PARCEL_QUERY = "list_parcel";
		var APIHITS_QUERY = "api_hits";
		this.parcels;
		this.parcelData = ko.observableArray();
		this.apiHitsCount = ko.observable();
		this.parcelCount = ko.observable();
		this.parcelDetails = ko.observable();
		this.query = ko.observable();
		this.likedItems;

		this.fetchParcel = function(){
			var self = this;
			$.when(fetchData(PARCEL_QUERY, this.fetchParcelSuccessHandler, this.fetchParcelErrorHandler)).done(
				function(data){
					self.showDetails(data.parcels[0]);
				}
				);	
		};

		this.fetchParcelSuccessHandler = function(data) {
			this.parcelCount(data.parcels.length);
			this.parcelData(data.parcels);
			this.parcels = data.parcels.slice();
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

		this.showDetails = function(data){
			var isItemLiked = this.checkIfItemIsLiked(data);
			//Adding like information to data
			data.liked = isItemLiked;

			var eta = Date(data.date);
			data.eta = eta;
			//Creating observable item details data
			this.createDetailsData(data);

			googleMapsIntg(data.live_location.latitude, data.live_location.longitude);
			
		};

		this.createDetailsData = function(data){
			this.parcelDetails(komapping.fromJS(data));
		};

		this.sortList = function(data, event){
			var sortingParameter = event.target.value;
			var sortingData = this.parcelData();
			var sortedData = sortData(sortingData, sortingParameter);
			this.parcelData(sortedData);
		};

		this.getLikedItems = function(){
			this.likedItems = localStorage.getItem("LikedItems"); 
		};

		this.likeItem = function(data, event){
			//using name as unique identifier for lack of an id
			var unMappedData = komapping.toJS(data);
			var isLiked = this.checkIfItemIsLiked(unMappedData);
			var likedArray = [this.likedItems];
			
			if(isLiked){
				newLikedItem = _.without(likedArray, unMappedData.name);
				localStorage.setItem("LikedItems", _.compact(newLikedItem));
				unMappedData.liked = false;
			} else {
				likedArray.push(unMappedData.name);
				localStorage.setItem("LikedItems",  _.compact(likedArray));
				unMappedData.liked = true;
			}

			this.createDetailsData(unMappedData);
		};

		this.checkIfItemIsLiked = function(data){
			this.getLikedItems();
			var likedArray = [this.likedItems]
			var index = _.indexOf(likedArray, data.name);
			if(index === -1){
				return false;
			} else if(index >= 0){
				return true;
			}
		};

		this.search = function(value) {
		    // remove all the current beers, which removes them from the view
		    this.parcelData.removeAll();
		    var parcels = this.parcels;
		    for(var x in parcels) {
		      if(parcels[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 
		      	|| parcels[x].price.toLowerCase().indexOf(value.toLowerCase()) >= 0 
		      	|| parcels[x].type.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
		        this.parcelData.push(parcels[x]);
		      }
		    }
		};

		this.refreshLocation = function() {
			var self = this;
			$.when(fetchData(PARCEL_QUERY, this.fetchParcelSuccessHandler, this.fetchParcelErrorHandler)).done(
				function(data){
					googleMapsIntg(self.parcelDetails().live_location.latitude(),
					 self.parcelDetails().live_location.longitude());
				}
			);
			
		};

		_.bindAll(this, 'fetchParcel', 'fetchParcelSuccessHandler', 'fetchParcelErrorHandler',
		 'fetchApiHits', 'fetchApiHitsSuccessHandler', 'fetchApiHitsErrorHandler', 'showDetails',
		 'sortList', 'likeItem', 'getLikedItems', 'createDetailsData', 'checkIfItemIsLiked', 
		 'search', 'refreshLocation');

		this.fetchParcel();
		this.fetchApiHits();
		this.query.subscribe(this.search);
		setTimeout(this.refreshLocation, 300);
	}
	
	return main;
});