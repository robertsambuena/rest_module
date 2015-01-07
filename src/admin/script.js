(function () {
    'use strict';
    
    angular
        .module( 'rest.admin', ['rest.config'])
        .service( 'adminService', service);
    
    // @ngInject
    function service (config, $http, $q) {
        var request, url = '';

        return {
            load_applicants : load_applicants,
            process_application : process_application,
            get_all_users : get_all_users,
            load_revshare_changes : load_revshare_changes,
            process_revshare : process_revshare,
            get_revshare_applications : get_revshare_applications,
            approve_change_revshare : approve_change_revshare,
            change_revshare : change_revshare,
            export_payout : export_payout,
            payout_dates : payout_dates,
            soundcloud_get_artists : soundcloud_get_artists,
            soundcloud_add_artists : soundcloud_add_artists,
            soundcloud_remove_artists : soundcloud_remove_artists,
            soundcloud_get_new_songs : soundcloud_get_new_songs,
            soundcloud_save_track_to_database : soundcloud_save_track_to_database,
            get_tracks_from_artist : get_tracks_from_artist,
            delete_track_of_artist_from_database : delete_track_of_artist_from_database
        }; 

        function load_applicants (selection, filter, page) {
            url = (selection && (selection.toLowerCase() === 'networks') ?  '/applicants/network' : '/applicants/channel');
            request = $http({
                method: 'GET',
                url: config.api_base_url + url + '?network_id=1&status=' + encodeURIComponent(filter) + '&page=' + (page || 1),
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_all_users (page, search) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/admin/user_list?page=' + page + '&sort=profile_info.fname&search='+ encodeURIComponent(search),
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function process_application (applicant, type, status){
            var url = (type.toLowerCase() === 'networks' ?  '/applicant/network/'+encodeURIComponent(applicant._id) : '/applicant/channel/'+ applicant._id),
            request = $http({
                method: 'PUT',
                url: config.api_base_url  + url,
                ignoreLoadingBar: true,
                data: 'status=' + encodeURIComponent(status),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function load_revshare_changes (page, filter) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/rev_share?'+ 'page=' + (page || 1) + '&filter=' + (filter || 'approved'),
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function process_revshare (share, status) {
            request = $http({
                method: 'PUT',
                url: config.api_base_url + '/rev_share',
                ignoreLoadingBar: true,
                data: '_id='+share.entity_id+'&status=' + encodeURIComponent(status),
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_revshare_applications (filter, limit, offset) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/rev_share?'+ 'filter=' + filter + '&limit=' + limit + '&offset=' + offset,
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function approve_change_revshare (data) {
            request = $http({
                method: 'PUT',
                url: config.api_base_url + '/rev_share',
                ignoreLoadingBar: true,
                data: '_id=' + data._id + '&approved=' + data.approved,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function change_revshare (data) {
            request = $http({
                method: 'PUT',
                url: config.api_base_url + '/admin/rev_share',
                ignoreLoadingBar: true,
                data: 'channel_id=' + data.channel_id + '&share=' + data.share +  '&date_effective=' + data.date_effective + '&network_id=' + data.network_id,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function export_payout (date, category) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/payout?date=' + date + '&category=' + category,
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function payout_dates () {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/earnings/payout_dates',
                ignoreLoadingBar: true,
                ignoreGrowl: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function soundcloud_get_artists (page) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/artists?page='+page,
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function soundcloud_add_artists (data) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/artists',
                ignoreLoadingBar: true,
                data: 'id='+data.id+'&username='+data.username+'&uri='+data.uri+'&permalink_url='+data.permalink_url+'&track_count='+data.track_count+'&avatar='+data.avatar_url,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function soundcloud_remove_artists (artist_id) {

            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/artist/'+artist_id,
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });

            return request.then(config.handle_success, config.handle_error);

        }

        function soundcloud_get_new_songs () {

        }

        function soundcloud_save_track_to_database (track, copyright_status) {
            var cs = (copyright_status === 'Yes') ? 1 : 0;

            request = $http({
                method: 'POST',
                url: config.api_base_url + '/track',
                ignoreLoadingBar: true,
                data: 'artist_id='+track.user.id+'&track_id='+track.id+'&track_title='+track.title+'&artist_name='+track.user.username+'&download_count='+track.download_count+'&genre='+track.genre+'&artwork_url='+track.artwork_url+'&downloadable='+track.downloadable+'&download_url='+track.download_url+'&copyright='+cs,
                headers: config.custom_headers
            });

            return request.then(config.handle_success, config.handle_error);

        }

        function get_tracks_from_artist (artist_id, page) {

            if (!page) {
                page = 1;
            }

            request = $http({
                method: 'GET',
                url: config.api_base_url + '/artist/'+artist_id+'/tracks?limit=100&page='+page,
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });
            return request.then(config.handle_success, config.handle_error);

        }

        function delete_track_of_artist_from_database (track_id) {

            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/track/'+track_id,
                ignoreLoadingBar: true,
                headers: config.custom_headers
            });

            return request.then(config.handle_success, config.handle_error);
        }
    }
    service.$inject = ["config", "$http", "$q"];

})();
