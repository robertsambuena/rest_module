(function () {
    'use strict';
    
    angular
        .module('rest.config', [])
        .service('config', config);

    //@ngInject
    function config($cookies, $q, localStorageService, settings, $http) {
        var request, val;

        return {
            base_url : settings.base_url,
            api_base_url: settings.api_url,
            headers : {
                'X-ACCESS-TOKEN': api_key(),
            },
            custom_headers: {
                'X-ACCESS-TOKEN': api_key(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            http_config : {
                headers : { 'X-ACCESS-TOKEN': api_key() }
            },
            api_key : api_key,
            handle_error : handle_error,
            validate_token : validate_token,
            handle_success : handle_success,
        };

        function api_key () {
            var sandbox = localStorageService.get('current_sandbox');
            val = $cookies.access_token;

            if (sandbox) {
                val = sandbox.access_token || 'currentbox';
            }

            return val ? val : null;
        }

        function handle_error (response) {
            if (!angular.isObject( response.data ) || !response.data.message) {
                if (validate_token(response)) {
                    // window.location.href = '/error?message=expired';
                }
                
                if (response.data) {
                    // if (res.data.message === 'Invalid access_token. Access_token not found.') {
                    //     localStorageService.clearAll();
                    //     delete $cookies.access_token;
                    //     window.location.href = '/logout?message=expired';
                    // }
                }

                return $q.reject('An unknown error occurred.');
            }

            return $q.reject(response.data.message);
        }

        function handle_success (res) {           
            return res.data;
        }
        
        function validate_token (res) {
            return res.data.message === 'invalid_grant' ? true : false;
        }
    }
    config.$inject = ['$cookies', '$q', 'localStorageService', 'settings', '$http']; //end service
})();
