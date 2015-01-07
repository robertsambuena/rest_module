(function () {
    'use strict';
    
    angular
        .module('rest.userearnings', ['rest.config'])
        .service('userearningsService', service);

    function service (config, $http, $q) {
        var request;

        return {
            call_range : call_range,
            get_recruiter_earnings : get_recruiter_earnings,
            search_recruiters : search_recruiters,
            search_recruiter_earnings : search_recruiter_earnings,
            get_report_from_date : get_report_from_date,
            get_user_earnings: get_user_earnings,
            get_overall_earnings : get_overall_earnings,
        }; 

        function call_range (all) {
            var url = all && '?all=true' || '';
            
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/date_range'+url,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_recruiter_earnings () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/recruits',
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function search_recruiters (key, page, order) {
            var url = '?key=' + encodeURIComponent(key) + '&page='+ page + '&order=' + order || 'total_views';

            request = $http({
                method: 'GET',
                url: config.api_base_url + '/search_recruits' +  url,
                headers: config.custom_headers
            }); 
            return request.then(config.handle_success, config.handle_error);
        }

        function search_recruiter_earnings (id) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/recruits?channel_id=' + encodeURIComponent(id),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_report_from_date (list_reports) {
            if (list_reports.split(',') && list_reports.split(',')[0]) {
                request = $http({
                    method: 'GET',
                    url: config.api_base_url + '/earnings/channels?report_id=' + encodeURIComponent(list_reports),
                    headers: config.custom_headers
                });
            }
            return request.then(config.handle_success, config.handle_error);
        }

        function get_user_earnings (id,list_reports) {
            console.log('list_reports',list_reports);
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/channels?user_id=' + encodeURIComponent(id) + '&report_id='+ encodeURIComponent(list_reports),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_overall_earnings (list_reports) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/admin/freedom_earnings?report_id=' + encodeURIComponent(list_reports),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

    }
    service.$inject = ["config", "$http", "$q"];

})();
