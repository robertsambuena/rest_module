(function () {
    'use strict';
    
    angular
        .module('rest.network', ['rest.config', 'rest.user'])
        .service('networkService', service);

    //@ngInject
    function service(config, userService, localStorageService, $http, $q) {
        var request, url;

        return {
            get_applicants: get_applicants,
            edit_application_status: edit_application_status,
            view_members : view_members,
            update : update,
            get_partners : get_partners,
            get_current_networks: get_current_networks,
            get : get,
            export_csv : export_csv,
            apply_revshare : apply_revshare,
            get_selected_network: get_selected_network,
            apply_sponsorship: apply_sponsorship,
            get_sponsor_applicants: get_sponsor_applicants,
            get_sponsor_applicants_admin: get_sponsor_applicants_admin,
            update_sponsors_status: update_sponsors_status,
            get_spotlight: get_spotlight,
            get_networks : get_networks,
            move_to_network : move_to_network,
            sponsored_networks : sponsored_networks,
            update_spotlight: update_spotlight
        };

        function view_members(network_id, search, page, limit, sortby) {
            if(search) {
                request = $http({
                    method: 'GET',
                    ignoreLoadingBar: true,
                    url: config.api_base_url + '/network/channel_search?network_id=' + network_id + '&key=' + encodeURIComponent(search),
                    headers: config.custom_headers
                });
                return request.then(config.handle_success, config.handle_error);
            } else {
                url = '?network_id='+network_id+'&order=' + sortby || 'total_views';
                url += page && '&page=' + page || '';
                
                if (limit) {
                    url += '&limit=' + limit;
                }
               
                request = $http({
                    method: 'GET',
                    ignoreLoadingBar: true,
                    url: config.api_base_url + '/network/channels' + url,
                    headers: config.custom_headers
                });
                return request.then(config.handle_success, config.handle_error);
            }
        }

        function get_applicants (network_id, status) {
            request = $http.get(config.api_base_url + '/applicants/channel?network_id='+network_id+'&status=' + status, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function edit_application_status (channel_id, status) {
            var data = (status=='accept')?{'status': 'Accepted'}:(status=='reject'?{'status': 'Rejected'}:{'status': 'Pending'});
            data.ids = [];
            
            if (typeof channel_id === 'string') {
                data.ids = channel_id;
            } else if (channel_id && channel_id.length) {
                data.ids = channel_id.join();
            }
            
            request = $http.put(config.api_base_url + '/applicant/channel', data, config.http_config);
            return( request.then( config.handleSuccess, config.handleError ) );
        }

        function get_partners (id, page) {
            request = $http.get(config.api_base_url + '/network/channels?id='+ id +'&page=' + page, config.http_config);
            return( request.then( config.handleSuccess, config.handleError ) );
        }

        function get_current_networks () {
            var deferred = $q.defer();
            userService.get().then(function (res) {
                if (res && res.app_data && res.app_data.channels_owned) {
                    var ch_ow = res.app_data.channels_owned,
                    network_ids = [];
                    ch_ow.filter(function (elem, idx, arr) {
                        if (elem && elem.network_id && !~network_ids.indexOf(elem.network_id)) {
                            network_ids.push(elem.network_id);
                        }
                    });
                    console.log('network_ids', network_ids);
                    deferred.resolve(network_ids);
                }
                else {
                    deferred.reject(null);
                }
            });
            return deferred.promise;
        }

        function get_selected_network (real) {
            var len = 0,
                network_id = null,
                user = null,
                deferred = $q.defer();
            
            userService.get().then(function (res) {
                user = res;
                
                if (user.networks && user.networks.length) {
                    console.log('user.networks get_selected_network',user.networks);
                    if (localStorageService.get('sn#' + config.api_key())) {
                        network_id = localStorageService.get('sn#' + config.api_key());
                    } else {
                        localStorageService.set('sn#' + config.api_key(), user.networks[0]._id);
                        network_id = user.networks[0]._id;
                    }
                    
                    len = user.networks.length;
                    if (real) {
                        get(network_id, false).then(function (real_network) {
                            real_network.landing_page_styles = JSON.parse(real_network.landing_page_styles);
                            deferred.resolve(real_network);
                        });
                    } else {
                        for (var i = 0; i < len ; i++) {
                            // console.log('network_id',network_id);
                            // console.log('user.networks[i]._id',user.networks[i]._id);
                            // console.log('user.networks[i]._id === network_id',user.networks[i]._id === network_id);
                            if (user.networks[i]._id === parseInt(network_id)) {
                                deferred.resolve(user.networks[i]);
                            }
                        }
                        deferred.resolve(1);
                    }
                } else {
                    deferred.resolve(2);
                }
            }, function (res) {
                deferred.reject(3);
            });

            return deferred.promise;
        }

        function change_selected_network (id) {
            return localStorageService.set('sn#' + config.api_key(), id);
        }

        function get (id, public_access) {
            request = null;
            
            if (public_access) {
                console.log('config.api_base_url id', config.api_base_url + '/network/' + id);
                request = $http.get(config.api_base_url + '/network/' + id);
            } else {
                console.log('config.api_base_url id' + id, config.http_config);
                request = $http.get(config.api_base_url + '/network/' + id, config.http_config);
            }

            return request.then(config.handle_success, config.handle_error);
        }

        function update (id, edited) {
            request = $http.put(config.api_base_url + '/network/' + id, edited, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function mass_accept (ids, status) {
            var data = {
                ids: ids, 
                status: status
            };
            request = $http.put(config.api_base_url + '/applicant/channel', data, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function mass_reject (ids) {
            request = $http.put(config.api_base_url + '/network/' + id, edited, config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function export_csv () {
            request = $http.get(config.api_base_url + '/network/csv', config.http_config);
            return request.then(config.handle_success, config.handle_error);
        }

        function apply_revshare (data) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/apply/rev_share',
                data: data,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function apply_sponsorship (data) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/network/sponsored',
                data: data,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_sponsor_applicants (id, filters) {
            var params = '?';

            params += 'limit='+filters.limit+'&';
            params += 'offset='+filters.offset+'&';
            params += 'filter='+filters.filter+'&';
            params += 'sort='+filters.sort;

            request = $http({
                method: 'GET',
                url: config.api_base_url + '/network/sponsored/' + id + params,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_sponsor_applicants_admin (filters) {
            var params = '?';
            params += 'page='+filters.page+'&';
            params += 'filter='+filters.filter+'&';
            params += 'sort='+filters.sort;

            request = $http({
                method: 'GET',
                url: config.api_base_url + '/admin/sponsored_network' + params,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function update_sponsors_status (data) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/network/accept_sponsor',
                data: data,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_spotlight (id) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/spotlight?network_id=' + id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
        function update_spotlight (id, array_of_url, array_of_channels) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/spotlight',
                data: {
                    'network_id': id, 
                    'playlists': array_of_url,
                    'channels': array_of_channels
                },
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_networks (page, search) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/networks?key=' + search + '&page=' + page,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function move_to_network (channel_id, user_id, to, from) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/admin/move_channel_network',
                data: {
                    channel_id: channel_id,
                    _id : user_id,
                    to: to,
                    from: from
                },
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });

            return request.then(config.handle_success, config.handle_error);
        }

        function sponsored_networks (network_id, filter, sort, page) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/network/sponsored/'+network_id+'?filter=' + filter.toLowerCase() + '&sort=' + sort + '&page=' +page,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }
        
    }

    service.$inject = ['config', 'userService', 'localStorageService', '$http', '$q'];
})();
