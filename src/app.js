requirejs.config({
    baseUrl: 'src/modules',
    paths: {
        jquery: '../jquery-2.1.4',
        knockout: '../knockout-3.4.0',
        underscore: '../underscore'
    }
});

requirejs(['knockout','main'], function(ko, main){
	ko.applyBindings(new main());
});