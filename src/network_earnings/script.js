(function () {
    'use strict';
    
    angular
        .module('rest.networkearnings', ['rest.config'])
        .service('networkearningsService', service);

    function service (config, $http) {
        var request;

        return {
            call_range : call_range,
            get_details: get_details,
            search_users : search_users,
            search_channels : search_channels,
            get_report_from_date : get_report_from_date
        }; 

        function call_range () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/date_range',
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_report_from_date (list_reports) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/network?report_id=' + encodeURIComponent(list_reports),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_details (list_reports) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/network/details?report_id=' + encodeURIComponent(list_reports),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function search_channels (key) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/network/details?channel_id=' + encodeURIComponent(key),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function search_users (id, list_reports) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/network?report_id=' + encodeURIComponent(list_reports) +'&user_id=' + encodeURIComponent(id),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
    }
    service.$inject = ["config", "$http"];

})();
