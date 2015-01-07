(function () {
    angular
        .module('rest.user', ['rest.config'])
        .service('userService', service);

    //@ngInject
    function service (config, $http, $q, localStorageService) {
        var request, deferred, data, temp_data;

        return {
            get_live : get_live,
            get_test : get_test,
            update_basic : update_basic,
            confirm_user : confirm_user,
            get_summary : get_summary,
            set : set_local,
            get_token : get_token,
            get : get,
            get_user : get_user,
            login_as : login_as,
            get_logs : get_logs,
            delete_channel : delete_channel,
            submit_spotlight_vid : submit_spotlight_vid
        }; 

        function get_live () {
            request = $http.get(config.api_base_url + '/user', config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function get_user (id) {
            request = $http.get(config.api_base_url + '/user/' + id, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }


        function get_test () {
            request = $http.get(config.api_base_url + '/user', config.http_config);
            return request;
        }

        function update_basic (data) {
            request = $http.put(config.api_base_url + '/user', data, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function confirm_user (_email, _password) {
            data = { email: _email, password: _password };
            request = $http.post(config.api_base_url + '/login?confirmation=1', data, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function get_summary (id) {
            if (id) {
                request = $http({
                    method: 'GET',
                    url: config.api_base_url + '/summary?network_id='+id,
                    ignoreLoadingBar: true,
                    headers: config.http_config.headers
                });
            }
            else {
                request = $http({
                    method: 'GET',
                    url: config.api_base_url + '/summary',
                    ignoreLoadingBar: true,
                    headers: config.http_config.headers
                });
            }
            return request.then(config.handle_success, config.handle_error);
        }

        function get (refresh) {
            var deferred = $q.defer(), temp_data = localStorageService.get('u#' + config.api_key()), current_sandbox = localStorageService.get('current_sandbox');
            
            if (current_sandbox) {
                temp_data = current_sandbox;
            }


            if (temp_data && !refresh) {
                deferred.resolve(temp_data);
            } else {
                get_live().then(function(user_instance) {
                    localStorageService.set("u#" + config.api_key(), user_instance);
                    deferred.resolve(user_instance);
                }, function (res) {
                    console.log("error", res);
                    deferred.reject(null);
                });
            }

            return deferred.promise;
        }

        function set_local (user) {
            if (user) {
                localStorageService.set("u#" + config.api_key(), user);
                return true;
            }
            return false;
        }

        function submit_spotlight_vid (video_id, reason) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/points/spotlight_vid',
                data: 'video_id=' + video_id + '&reason=' + reason,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        function get_token (sandbox) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/admin/view_as',
                data: 'user_id=' + encodeURIComponent(sandbox._id) + '&roles=' + sandbox.app_data.roles.join(','),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function delete_channel (channel) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/channel/' + encodeURIComponent(channel._id),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_logs (page) {
            var url = '?page=' + (page ? page : 1);
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/logs' + url,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function login_as (channel_id, network_id) {
            // var deferred = $q.defer()
            return;
        }

    }
    service.$inject = ["config", "$http", "$q", "localStorageService"];

})();

