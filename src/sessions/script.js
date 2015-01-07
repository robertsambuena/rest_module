(function () {
    'use strict';
    
    angular
        .module('ui.freedom')
        .factory('Sessions', factory);

    //@ngInject
    function factory (userService, localStorageService, $rootScope, $q, $window, $cookies) {
        var defer, request, boxes = localStorageService.get('boxes') || [], num = localStorageService.get('num_of_boxes') || 0,
        sessions = {
            current_sandbox: false,
            add: add,
            remove: remove,
            change : change,
            update_current_sandbox: update_current_sandbox,
            get_current_sandbox : get_current_sandbox,
            get_sandboxes: get_sandboxes
        };

        return sessions;

        function add (id) {
            defer = $q.defer();
            userService.get_user(id).then(function(user){
                user.isInformed = false;
                // localStorageService.set('current_sandbox', user);
                sessions.current_sandbox = localStorageService.get('current_sandbox');
                // boxes = localStorageService.get('boxes') ;
                userService.get_token(user).then( function (data) {
                    user.access_token = data.user_access_token || data;
                    boxes.push(user);
                    localStorageService.set('boxes', boxes);
                    localStorageService.set('sandbox_' + id, user);
                    localStorageService.set('current_sandbox', user);
                    defer.resolve(user);
                }, function (err) {
                    console.log('failed',err);
                    defer.reject(user);
                });
            });        
            return defer.promise;
        }
        
        function is_sandbox_mode () {
            return localStorageService.get('current_sandbox');
        }

        function remove (id) {
            sessions.current_sandbox = false;
            var boxes = localStorageService.get('boxes');
            localStorageService.clearAll();
            localStorageService.set('boxes', boxes);

            return localStorageService.remove('sandbox_' + id);
        }

        function change (box) {
            var boxes = localStorageService.get('boxes');
            console.log('   boxes', boxes);
            localStorageService.clearAll();
            localStorageService.set('sandbox_' + box._id, box);
            localStorageService.set('boxes', boxes);
            localStorageService.set('u#'+  box.access_token,  box);
            // alert('changed');
            return localStorageService.set('current_sandbox', box);
        }

        function get_current_sandbox () {
           // $scope.boxes.push(localStorageService.get('u#'+$cookies.access_token));
           // console.log("localStorageService.get('sandbox_')",localStorageService.get('sandbox_'));
           return localStorageService.get('current_sandbox');
        }

        function get_master () {
           // $scope.boxes.push(localStorageService.get('u#'+$cookies.access_token));
           // console.log("localStorageService.get('sandbox_')",localStorageService.get('sandbox_'));
           return localStorageService.get('u#'+$cookies.access_token);
        }

        function get_sandboxes () {
            // boxes.push(get_master());
            return localStorageService.get('boxes') || [];
        }

        function update_current_sandbox (data) {
            return localStorageService.set('current_sandbox', data);
        }

    }
    factory.$inject = ['userService', 'localStorageService', '$rootScope', '$q', '$window', '$cookies'];

})();
