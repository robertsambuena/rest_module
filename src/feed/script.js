(function () {
    'use strict';

    angular
        .module('rest.feed', ['rest.config'])
        .service('feedService', service);

    //@ngInject
    function service(config, $http, $q) {
        var request, data;

        return {
            add_announcement: add_announcement,
            delete_announcement: delete_announcement,
            get_announcements : get_announcements,
        	get: get
        };

        function get () {
            request = $http.get(config.api_base_url + '/feed', config.http_config);
            return request.then(config.handle_success, config.handle_error );
        }

        function add_announcement (an) {
            data = {
                feed: an,
            };
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/network/feed',
                data: data,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_announcements () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/network/feed',
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function delete_announcement (id) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/network/feed/'+id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
    }
    service.$inject = ["config", "$http", "$q"];
})();
