(function () {
    'use strict';
    
    angular
        .module('rest.recruits', ['rest.config'])
        .service('recruitsService', service);

    function service (config, $http, $q) {
        var request;

        return {
            load_recruits_users : load_recruits_users,
            load_recruits_channels : load_recruits_channels,
            network_recruiters : network_recruiters,
            overall_recruiters : overall_recruiters,
            get_recruiter_commission : get_recruiter_commission,
            save_recruiter_commission : save_recruiter_commission
        }; 

        function load_recruits_users () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/recruits',
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function load_recruits_channels () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/recruits?has_channels=1',
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function overall_recruiters (page, sort) {
            var url = '?page=' + page || 0 + '&order=' + sort || 'total';
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/recruiters' + url,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function network_recruiters (page, sort, network_id) {
            var url = '?page=' + (page || 0) + '&order=' + (sort || 'total');
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/recruiters' + url + '&network_id=' + network_id,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
        function get_recruiter_commission (csv_ids) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/admin/recruiter_commission?ids=' + csv_ids,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
        function save_recruiter_commission (commission) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/admin/recruiter_commission',
                data: commission,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
    }
    service.$inject = ["config", "$http", "$q"];

})();
