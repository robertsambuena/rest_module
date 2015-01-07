(function () {
    'use strict';
    
    angular
        .module('rest.password', ['rest.config'])
        .service('passwordService', service);

    //@ngInject
    function service(config, $http, $q) {
        var request, data;

        return {
            submit_change: submit_change,
            request_change: request_change
        };

        function submit_change (_email, _password, _reset_token) {
            data = {
                'email': _email,
                'password': _password,
                'reset_token': _reset_token
            };
            if (config.api_key()) {
                request = $http.post(config.api_base_url + '/reset_password', data, config.http_config);
            }
            else {
                request = $http.post(config.api_base_url + '/reset_password', data);
            }
            
            return request.then(config.handle_success, config.handle_error);
        }

        function request_change (email) {
            if (config.api_key()) {
                request = $http.get(config.api_base_url + '/send_reset_mail?email=' + email, config.http_config);
            } else {
                request = $http.get(config.api_base_url + '/send_reset_mail?email=' + email);
            }
            
            return request.then(config.handle_success, config.handle_error);
        }

    }
    service.$inject = ['config', '$http', '$q'];
})();
