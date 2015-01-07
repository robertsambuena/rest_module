(function () {
    'use strict';
    
    angular
        .module('rest.points', ['rest.config'])
        .service('pointsService', service);

    function service (config, $http, $q) {
        var request, data;

        return {
        	compute_growth: compute_growth,
            connect_forum: connect_forum,
            upsert_username : upsert_username,
            get_username : get_username,
            get_transaction: get_transaction,
        	register_event: register_event
        }; 

        function compute_growth (fast) {
    	    request = $http({
	    	    method: 'PUT',
	    	    url: config.api_base_url + '/points/compute' + (fast ? '?saved=true' : ''),
                ignoreLoadingBar: true,
	    	    headers: config.http_config.headers
    	 	});
    	  	return request.then(config.handle_success, config.handle_error);
    	}

    	function register_event (event) {
    		data = {
    	  	  	name: event
    	  	};
    	  	request = $http({
    		    method: 'GET',
    		    url: config.api_base_url + '/register_event',
    		    data: data,
    		    headers: config.custom_headers
    		});
    		return request.then(config.handle_success, config.handle_error);
		}


        function connect_forum (username, password) {
            request = $http({
                method: 'PUT',
                url : config.api_base_url + '/points/forum',
                data : 'username=' + username + '&password=' + password,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_username () {
            request = $http({
                method: 'GET',
                url : config.api_base_url + '/username?app=forum',
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_transaction (accomplishment) {
            request = $http({
                method: 'GET',
                url : config.api_base_url + '/points/transaction?accomplishment=' + encodeURIComponent(accomplishment),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function upsert_username (username) {
            request = $http({
                method: 'POST',
                url : config.api_base_url + '/username',
                data : 'app=forum&username=' + encodeURIComponent(username),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

    }
    service.$inject = ["config", "$http", "$q"];

})();
