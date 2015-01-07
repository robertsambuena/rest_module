(function () {
    'use strict';

    angular
        .module('rest.prospects', ['rest.config'])
        .service('prospectsService', service);
    
    //@ngInject
    function service (config, $http, $q) {
        var request, data;

        return {
            search : search,
            add_prospects : add_prospects,
            update_status : update_status,
            view_prospects : view_prospects,
            network_prospects : network_prospects,
            remove_prospects : remove_prospects
        }; 

        function search (key) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/prospect/search/' + key,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function add_prospects (prospect){
            data = {
                username: prospect.snippet.title,
                owner: prospect.snippet.title,
                thumbnail: prospect.snippet.thumbnails.default.url
            };
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/prospect/',
                data: data,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function update_status (item){
            request = $http({
                method: 'PUT',
                ignoreLoadingBar: true,
                url: config.api_base_url + '/prospect/' + encodeURIComponent(item._id),
                data: 'status=' + item.status + '&note=' + item.note,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function view_prospects () {
            request = $http({
                method: 'GET',
                ignoreLoadingBar: true,
                url: config.api_base_url + '/prospects/',
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function remove_prospects (prospect) {
            request = $http({
                method: 'DELETE',
                ignoreLoadingBar: true,
                url: config.api_base_url + '/prospects',
                data: 'ids=' + prospect._id,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function network_prospects (page, network_id) {
            var url = '?limit=25&page=' + (page || 0);
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/network/recruited_by_recruiters' + url,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

    }
    service.$inject = ["config", "$http", "$q"];

})();
