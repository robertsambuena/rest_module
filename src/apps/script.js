(function () {
    'use strict';

    angular
        .module( 'rest.apps', ['rest.config'])
        .service( 'appsService', service);
    
    // @ngInject
    function service (config, $http, $q) {
        var request, url = '';

        return {
            get_videos_and_playlists : get_videos_and_playlists,
            get_videos_and_playlists_with_token_playlist : get_videos_and_playlists_with_token_playlist,
            get_videos_and_playlists_with_token_videos : get_videos_and_playlists_with_token_videos,
            update_playlist : update_playlist,
            update_video : update_video,
            get_stats_ideal : get_stats_ideal,
            delete_video : delete_video,
            delete_playlist : delete_playlist,
            get_videos_from_playlist : get_videos_from_playlist,
            get_videos_from_playlist_with_token : get_videos_from_playlist_with_token,
            remove_videos_from_playlist : remove_videos_from_playlist,
            insert_video_to_playlists : insert_video_to_playlists,
            get_xsplit_count : get_xsplit_count,
            get_xsplit_code : get_xsplit_code,
            get_xsplit_ext_code : get_xsplit_ext_code,
            get_xsplit_video : get_xsplit_video,
            get_xsplit_all_videos : get_xsplit_all_videos,
            update_xsplit_username : update_xsplit_username,
            submit_xsplit_video : submit_xsplit_video,
            set_xsplit_video_status : set_xsplit_video_status,
            apply_sponsorship : apply_sponsorship,
            get_channel_spotlights : get_channel_spotlights,
            get_promises : get_promises,
            delete_request : delete_request,
            update_request : update_request,
            accept_request : accept_request,
            submit_request : submit_request,
            get_sponsorship_categories : get_sponsorship_categories,
            get_sponsorship_applications : get_sponsorship_applications,
            change_application_status : change_application_status,
            get_videos_onbid : get_videos_onbid,
            bid_on_video : bid_on_video
        }; 

        function get_videos_and_playlists (id) {
            request = $http.get(config.api_base_url + '/channel/' + id + '/videos_and_playlists', config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_videos_and_playlists_with_token_playlist (id, pageToken) {
            request = $http.get(config.api_base_url + '/channel/' + id + '/videos_and_playlists?playlist_page_token=' + pageToken, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function get_videos_and_playlists_with_token_videos (id, pageToken) {
            request = $http.get(config.api_base_url + '/channel/' + id + '/videos_and_playlists?video_page_token=' + pageToken, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function update_playlist (playlistInformation) {
            request = $http.put(config.api_base_url + '/channel/' + playlistInformation.channel_id + '/playlist/' + playlistInformation.playlist_id, playlistInformation, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }

        function update_video (videoInformation) {
            request = $http.put(config.api_base_url + '/channel/' + videoInformation.channel_id + '/video/' + videoInformation.video_id, videoInformation, config.http_config);
            config.http_config.ignoreLoadingBar = true;
            return request.then(config.handle_success, config.handle_error);
        }
        function get_stats_ideal (channelId, startDate, endDate) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/channel/analytics/' + channelId + '?start_date=' + startDate + '&end_date=' + endDate + '&format=dddd',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function delete_playlist (playlist) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/channel/' + playlist.snippet.channelId + '/playlist/' + playlist.id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });    
            return request.then(config.handle_success, config.handle_error);
        }

        function delete_video (video) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/channel/' + video.snippet.channelId + '/video/' + video.id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_videos_from_playlist (playlist) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/playlist/' + playlist.id,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_videos_from_playlist_with_token (playlist, pageToken) {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/playlist/' + playlist.id + '?page_token=' + pageToken,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function remove_videos_from_playlist (channelId, videosString) {
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/channel/' + channelId + '/playlist_item?ids=' + videosString,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function insert_video_to_playlists (channelId, playlistsString, resource) {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/channel/' + channelId + '/playlist_item?ids=' + playlistsString,
                data: resource,
                ignoreLoadingBar: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
          }

        function get_xsplit_count() {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/sponsorship/xsplit/count',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_xsplit_code() {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/sponsorship/xsplit/get_code',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_xsplit_ext_code() {
            request = $http({
                method: 'POST',
                url: config.api_base_url + '/sponsorship/xsplit/get_code_ext',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_xsplit_video(){
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/sponsorship/xsplit/has_video_review',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_xsplit_all_videos(){
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/sponsorship/xsplit/submitted_videos',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function update_xsplit_username(username){
            var data = { username: username };

            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/sponsorship/xsplit/update_username',
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error); 
        }

        function submit_xsplit_video(video_id, title, image, campaign_id) {
            var data = {
                    video_id: video_id,
                    title: title,
                    image: image,
                    campaign_id: campaign_id
                };

            request = $http({
                method: 'POST',
                data: data,
                url: config.api_base_url + '/sponsorship/xsplit/submit_video_review',
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function set_xsplit_video_status(status, user_id, video_id) {
            var data = {
                    status: status,
                    user_id: user_id,
                    video_id: video_id,
                };
            
            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/sponsorship/xsplit/video_status',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function apply_sponsorship(data) {
            request = $http({
                method: 'POST',
                data: data,
                url: config.api_base_url + '/sponsorship',
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_channel_spotlights() {
            request = $http({
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=id%2C+snippet&maxResults=50&playlistId=PLxLYo5_7D3ScpQSJC74FENcBE25hlDE78&key=AIzaSyDqWOahd3OSYfctw5pTTcNjQjjfD3QC-s4',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_promises() {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/promises',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function delete_request(id){
            request = $http({
                method: 'DELETE',
                url: config.api_base_url + '/promise/' + id,
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function update_request(id, requestTitle, requestBody) {
            var data = {
                    title: requestTitle,
                    body: requestBody,
                };

            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/promise/' + id,
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function accept_request(id, fullname, name, status) {
            var data = {
                    accepted_by : fullname,
                    name: name,
                    status: status
                };

            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/promise/' + id,
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function submit_request(name, requestTitle, requestBody) {
            var data = {
                    name: name,
                    title: requestTitle,
                    body: requestBody,
                };

            request = $http({
                method: 'POST',
                data: data,
                url: config.api_base_url + '/promise',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_sponsorship_categories(){
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/sponsorship/categories/',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_sponsorship_applications(status, category){
            var url;

            if (status) {
                url = config.api_base_url + '/sponsorship/applications?status=' + status;
            } 
            else if (category) {
                url = config.api_base_url + '/sponsorship/applications?category=' + category;
            } 
            else if (category && status) {
                url = config.api_base_url + '/sponsorship/applications?status=' + status + '&category=' + category;
            } 
            else {
                url = config.api_base_url + '/sponsorship/applications';
            }

            request = $http({
                method: 'GET',
                url: url,
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function change_application_status(status, category, channel_id) {
            var data = {
                    status: status,
                    category: category,
                    channel_id: channel_id,
            };
            
            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/sponsorship/status',
                ignoreLoadingBar: false,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function get_videos_onbid() {
            request = $http({
                method: 'GET',
                url: config.api_base_url + '/points/vids',
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
        }

        function bid_on_video(bid, video_id) {
            var data = {
                    bid: bid,
                    video_id: video_id,
                };
            
            request = $http({
                method: 'PUT',
                data: data,
                url: config.api_base_url + '/points/bid',
                ignoreLoadingBar: false,
                ignoreGrowl: true,
                headers: config.http_config.headers
            });
            return request.then(config.handle_success, config.handle_error);
          }
    }
    service.$inject = ['config', '$http', '$q'];
})();
