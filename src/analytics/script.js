(function () {
    'use strict';

    angular
        .module('rest.analytics', ['rest.config'])
        .service('analyticsService', service);

    function service (config, $http) {
        var request, url = '';

        return {
            get_default_uploads : get_default_uploads,
            get_default_uploads_videos : get_default_uploads_videos,
            get_dated_uploads : get_dated_uploads,
            get_default_playlists : get_default_playlists,
            get_default_uploads_decoy : get_default_uploads_decoy
        }; 
          
        function get_default_uploads (id) {
            request = $http.get(config.api_base_url + '/channel/analytics/' + id, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_default_uploads_videos (id, videoId) {
            request = $http.get(config.api_base_url + '/channel/analytics/' + id + '/video/' + videoId, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_dated_uploads (id, sdate, edate) {
            request = $http.get(config.api_base_url + '/channel/analytics/' + id + '?start_date=' + sdate + '&end_date=' + edate, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_default_playlists (channelId, playlistId) {
            request = $http.get(config.api_base_url + '/channel/analytics/' + channelId + '/playlist/' + playlistId, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_default_uploads_decoy (link) {
            request = $http.get(config.api_base_url + link, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }
    }
    service.$inject = ["config", "$http"];
})();