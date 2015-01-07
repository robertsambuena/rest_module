(function () {
    'use strict';
    
    angular
        .module('rest.misc', ['rest.config'])
        .service('helpers', service);

    //@ngInject
    function service(config, $http, $q) {
        var request;

        return {
        	get_countries : get_countries
        };

        function get_countries () {
            request = $http.get('http://restcountries.eu/rest/v1');
            return request.then(config.handle_success, config.handle_error);
        }
    }
    service.$inject = ['config', '$http', '$q'];
})();
