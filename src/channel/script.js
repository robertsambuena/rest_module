(function () {
    'use strict';
    
    angular
        .module( 'rest.channel', ['rest.config'])
        .service( 'channelService', service);
    
    // @ngInject
    function service(config, $http, $q, localStorageService, Earnings) {
        var request, deferred, temp_data;

        return {
            get_live : get_live,
            get_channel_analytics : get_channel_analytics,
            get_channel_stats : get_channel_stats,
            get : get,
            add : add,
            unpartner_channel: unpartner_channel,
            accept_contract : accept_contract,
            clear: clear
        };
        function get_live (id, part) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/channels?ids=' + id + '&part=' + part,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_channel_analytics (id) {
            request = $http.get(config.api_base_url + '/channel/analytics/' + id, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_channel_stats (id, filter, network_id) {
            var url = '';
            if (network_id) {
                url = config.api_base_url + '/channel/mini_analytics/' + id + '?network_id='+network_id+'&filter=' + filter;
            }
            else {
                url = config.api_base_url + '/channel/mini_analytics/' + id + '?filter=' + filter;
            }
            request = $http({
                method: 'GET',
                url: url,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get (id) {
            var channels = temp_data.data;

            temp_data = localStorageService.get('c#' + config.api_key()) || [];
            
            deferred = $q.defer();
            if (channels) {
                angular.forEach(channels, function(temp) {
                    if (temp.id === id) {
                        deferred.resolve(temp);
                        return;
                    }
                });
            } else {
                get_live(id, 'network,statistics,basic').then(function(channel) {
                    temp_data[channel.id] = channel;
                    localStorageService.set('c#' + config.api_key(), temp_data);
                    deferred.resolve(temp_data[channel.id]);
                 }, function () {
                    deferred.reject(null);
                });
            }
            return deferred.promise;
        }

        function process_earnings (channel_instance, callback) {
            //process earnings
            Earnings.load().then(function(data){
                Earnings.get_current_earnings().then(function(data) {
                    console.log('$scop2eee.current_earnings', Earnings);
                    callback(map_earnings(channel_instance.id, Earnings.maps.channel_map));
                });
            });

            var map_earnings = function (channel_id, channel_earnings) {
                var return_raw_earnings = 0;

                if (channel_id) {
                    var temp_earnings = channel_earnings[channel_id];
                    return temp_earnings.total || 0;
                }

                return 0;
            };
        }

        function add (_channels_csv, status, isAdmin) {
            var deferred = $q.defer();
            
            get_live(_channels_csv, 'network,statistics,basic,rev_share').then(function( res) {
                var channel_arr = localStorageService.get('c#' + config.api_key()) || [];
                
                if (isAdmin) {
                    channel_arr = [];
                }
                
                angular.forEach(res, function (channel) {
                    channel.status = status;
                    channel.total_comments = parseFloat(channel.total_comments || 0);
                    channel.total_subscribers = parseFloat(channel.total_subscribers || 0);
                    channel.total_videos = parseFloat(channel.total_videos || 0);
                    channel.total_views = parseFloat(channel.total_views || 0);
                    channel.has_error = false;

                    channel_arr.push(channel);
                    
                    if (isAdmin) {
                        localStorageService.set('ac#' + config.api_key(), channel_arr);   
                    } else {
                        localStorageService.set('c#' + config.api_key(), channel_arr);
                    } 
                });
                
                deferred.resolve(channel_arr);
            }, function (res) {
                var channel_arr = localStorageService.get('c#' + config.api_key()) || [];
                
                angular.forEach(res, function (channel) {
                    if (channel.message === 'getaddrinfo ENOTFOUND') {
                      channel.status = 'backend_error';
                    }
                    else if (channel.error === 'unauthorized_client' || channel.error === 'invalid_grant' ) {
                      channel.error = 'reauth';
                    }
                    else if (channel === 'Channel not found using youtube API') {
                      channel = {};
                      channel.error = 'takendown';
                    }
                    else {
                        channel = {};
                    }

                    channel.has_error = true;
                    channel_arr.push(channel);

                    localStorageService.set('c#' + config.api_key(), channel_arr);
                });

                deferred.reject(channel_arr);
            });

            return deferred.promise;
        }

        function clear() {
            temp_data = localStorageService.remove('c#' + config.api_key());
            console.log('clear', localStorageService.get('c#' + config.api_key()), temp_data);
            return temp_data;
        }

        function unpartner_channel(id) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/channel/'+id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function accept_contract() {
            var url = config.api_base_url + '/accept_partnership_contract';
            request = $http({
                method: 'POST',
                url: url,
                data : {},
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
    }
    service.$inject = ['config', '$http', '$q', 'localStorageService', 'Earnings'];
})();
