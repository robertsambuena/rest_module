(function () {
    'use strict';
    angular
        .module('ui.freedom')
        .factory('Points', factory);

    //@ngInject
    function factory (pointsService, localStorageService, $rootScope, $q) {
        var defer, 
        points = {
            get_points : get_points
        };

        return points;

        function get_points(fresh) {
            defer = $q.defer();
            points.fp = localStorageService.get($rootScope.access_token + 'points');
            
            if (is_empty(points.fp)) {
                pointsService.get_points(fresh).then(function(data){
                    localStorageService.set($rootScope.access_token + 'points', data);
                    points.fp = data;
                    defer.resolve(data);
                }, function(data) {
                    defer.reject({points: 0});
                });
            } else {
                defer.resolve(points.fp);
            }
            
            return defer.promise;
        }

    }
    factory.$inject = ['pointsService', 'localStorageService', '$rootScope', '$q'];



})();
