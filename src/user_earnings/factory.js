(function () {
    'use strict';
    angular
        .module('ui.freedom')
        .factory('Earnings', factory);

    //@ngInject
    function factory (userearningsService, networkearningsService, localStorageService, $rootScope, $q) {
        var defer, 
        months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
        earnings = { 
            load: get_reports, 
            get_user_earnings : get_user_earnings,
            get_raw_reports: get_raw_reports,
            get_current_earnings : get_current_earnings,
            get_recruiter_earnings : get_recruiter_earnings,
            get_channel_earnings : get_channel_earnings,
            details_tochart: details_tochart,
            change_reports : change_reports,
            get_raw_network_earnings : get_raw_network_earnings,
            get_raw_earnings : get_raw_earnings,
            search_recruiter_earnings : userearningsService.search_recruiter_earnings,
            net_earnings_tochart : net_earnings_tochart,
            get_overall_earnings: get_overall_earnings,
            get_month: get_month,
            overall_chart : overall_chart,
            set_list_reports : set_list_reports,
            set_list_reports_overall: set_list_reports_overall,
            recruiterdetails_tochart: recruiterdetails_tochart,
        };

        return earnings;

        function get_reports (refresh) {
            defer = $q.defer();
            earnings.reports = localStorageService.get($rootScope.access_token + 'reports');
            if( is_empty(earnings.reports) || refresh){
                userearningsService.call_range().then(function(data){
                    console.log('   data', data);
                    earnings.reports = data;
                    localStorageService.set($rootScope.access_token+ 'reports',data);
                    initialize();
                    defer.resolve(data);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                initialize();
                defer.resolve(earnings.reports);
            }
            return defer.promise;
        }

        function get_raw_reports (refresh) {
            defer = $q.defer();
            earnings.reports = localStorageService.get($rootScope.access_token + 'reports');
            if( is_empty(earnings.reports) || refresh){
                userearningsService.call_range(true).then(function(data){
                    console.log('   data', data);
                    earnings.reports = data;
                    localStorageService.set($rootScope.access_token+ 'reports',data);
                    initialize();
                    defer.resolve(data);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                initialize();
                defer.resolve(earnings.reports);
            }
            return defer.promise;
        }

        function get_channel_earnings (refresh) {
            defer = $q.defer();
            earnings.channel_earnings = localStorageService.get($rootScope.access_token + 'earnings');
            if (is_empty(earnings.channel_earnings) || refresh) {
                earnings.channel_earnings = earnings.raw_channel_earnings;
                localStorageService.set($rootScope.access_token + 'earnings',earnings.channel_earnings);
                channel_map_earnings(earnings.channel_earnings, false);
                defer.resolve(earnings.channel_earnings);
            } else {
                channel_map_earnings(earnings.channel_earnings, false);
                defer.resolve(earnings.channel_earnings);
            }
            return defer.promise;
        }

        // function get_user_earnings (id,list_reports) {
        //     defer = $q.defer();
        //     earnings.channel_earnings = localStorageService.get($rootScope.access_token + 'earnings');
        //     if (is_empty(earnings.channel_earnings) || refresh) {
        //         userearningsService.get_user_earnings(true).then(function(data){
        //             console.log('   data', data);
        //             earnings.reports = data;
        //             localStorageService.set($rootScope.access_token+ 'reports',data);
        //             initialize();
        //             defer.resolve(data);
        //         }, function(data){
        //             defer.reject(data);
        //         });
        //         // earnings.channel_earnings = earnings.raw_channel_earnings;
        //         // localStorageService.set($rootScope.access_token + 'earnings',earnings.channel_earnings);
        //         // channel_map_earnings(earnings.channel_earnings, false);
        //         defer.resolve(earnings.channel_earnings);
        //     } else {
        //         channel_map_earnings(earnings.channel_earnings, false);
        //         defer.resolve(earnings.channel_earnings);
        //     }
        //     return defer.promise;
        // }

         function get_user_earnings (id) {
            defer = $q.defer();
            // earnings.raw_channel_earnings = localStorageService.get($rootScope.access_token + 'rawearnings');
            // if(is_empty(earnings.raw_channel_earnings)) {
                userearningsService.get_user_earnings(id, earnings.list_reports).then(function(data){
                // userearningsService.get_user_earnings(id, earnings.list_reports_limited).then(function(data){
                    earnings.raw_channel_earnings = data;
                    // localStorageService.set($rootScope.access_token + 'rawearnings',data);
                    channel_map_earnings(earnings.raw_channel_earnings, false);
                    defer.resolve(earnings.raw_channel_earnings);
                }, function(data){
                    defer.reject(data);
                });
            // } else {
            //     channel_map_earnings(earnings.raw_channel_earnings, 1);
            //     defer.resolve(earnings.raw_channel_earnings);
            // }
            return defer.promise;
        }

        function initialize () {
            earnings.list_reports = '';
            earnings.list_reports_limited = '';
            earnings.start = earnings.reports[earnings.reports.length - 1];
            earnings.latest = earnings.reports[0];
            earnings.reports_mapping = {};
            var ctr = 0; 
            for (var i = earnings.reports.length - 1; i >= 0; i--) {
                earnings.list_reports += earnings.reports[i].id + ',';
                if(ctr<12) {
                    earnings.list_reports_limited += earnings.reports[i].id + ',';
                }
                earnings.reports_mapping[earnings.reports[i].id] = {
                    start_date: earnings.reports[i].start_date,
                    end_date: earnings.reports[i].date,
                };
                ctr++;
            }
        }

         function get_current_earnings () {
            defer = $q.defer();
            earnings.channel_earnings = localStorageService.get($rootScope.access_token + 'current_earnings');
            console.log('   earnings.channel_earnings', earnings.channel_earnings);
            if(is_empty(earnings.channel_earnings)) {
                if (earnings.latest) {
                    userearningsService.get_report_from_date(earnings.latest.id).then(function(data){
                        earnings.channel_earnings = data;
                        localStorageService.set($rootScope.access_token + 'current_earnings',data);
                        channel_map_earnings(data, false);
                        earnings.current_earnings = {
                            month: get_month(earnings.latest.start_date),
                            earnings: earnings.maps.date_map[earnings.latest.start_date].total
                        };
                        defer.resolve(earnings.current_earnings);
                    }, function(data){
                        defer.reject(data);
                    });
                }
                else {
                    defer.reject({});
                }
            } else {
                channel_map_earnings(earnings.channel_earnings, false);
                earnings.current_earnings = {
                    month: get_month(earnings.latest.start_date),
                    earnings: earnings.maps.date_map[earnings.latest.start_date].total
                };
                defer.resolve(earnings.current_earnings);
            }
            return defer.promise;
         }

         function get_raw_earnings () {
            defer = $q.defer();
            earnings.raw_channel_earnings = localStorageService.get($rootScope.access_token + 'rawearnings');
            if(is_empty(earnings.raw_channel_earnings)) {
                userearningsService.get_report_from_date(earnings.list_reports).then(function(data){
                    earnings.raw_channel_earnings = data;
                    localStorageService.set($rootScope.access_token + 'rawearnings',data);
                    channel_map_earnings(earnings.raw_channel_earnings, 1);
                    defer.resolve(earnings.raw_channel_earnings);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                channel_map_earnings(earnings.raw_channel_earnings, 1);
                defer.resolve(earnings.raw_channel_earnings);
            }
            return defer.promise;
        }

        function set_list_reports (start, after, year) {
            var reports_to_search = '', d, i, 
            diff = start - year,
            big = diff > 0 ? start : after,
            small = diff < 0 ? start : after,
            ctr = small,
            ch_earnings = earnings.raw_channel_earnings,
            reports = earnings.reports;
            earnings.channel_earnings = {};
            while(ctr <= big) {
                for (i in reports) {
                    d = year + '-' + pad2(parseInt(ctr)) + '-01';
                    if(reports[i].start_date === d) { 
                        reports_to_search += reports[i].id + ','; 
                        earnings.channel_earnings[reports[i].id] = ch_earnings[reports[i].id];
                    }
                }
                ctr++;
            }
            localStorageService.set($rootScope.access_token+ 'earnings', earnings.channel_earnings);
            earnings.reports_to_search = reports_to_search;
            channel_map_earnings(earnings.channel_earnings, false);
        }



        function channel_map_earnings (earn, raw) {
            console.log(' channel_map_earnings  earn', is_empty(earn));
            var k, key, i, obj, id, net_earnings, ch_earnings, revshare, ern = earn,
            maps = {
                details_map : {},
                channel_map : {},
                date_map : {},
                total: 0 
            };
            if(is_empty(earn)) {
                earnings.channel_chart_data = false;
                earnings[raw ? 'raw_maps' : 'maps'] = maps;
                return;
            }
            earnings.start_selection = 0;
            earnings.end_selection = 0;


            // for (key in ern) {
            //     for (i = ern[key].earnings.length - 1; i >= 0; i--) {
            //         ern[key].earnings.sort(function(a, b){return b.earnings-a.earnings;});
            //     }
            // }
            //     console.log('   ern', ern);
            // var data = [['Months',]]
            for (key in earn) {
                // Get first report
                // if(earnings.hasOwnProperty('raw_channel_earnings')){
                if(earnings.start_selection === 0) {
                    earnings.start_selection = earn[key];
                }
                // }
                // initialize every month on given earnings
                maps.date_map[(earn[key].start_date)] = {
                    total:0
                };

                // earn[key].earnings.sort(function(a, b){return b.earnings-a.earnings;});
                for (i = earn[key].earnings.length - 1; i >= 0; i--) {
                    obj = earn[key].earnings[i];
                    id = obj.user_channel_id;
                    ch_earnings = obj.earnings;

                    if (obj.revenue_share && obj.revenue_share.revenue_share)
                        revshare = obj.revenue_share.revenue_share;
                    else
                        revshare = 0;
                    net_earnings = ch_earnings * (revshare/100);
                    if(maps.channel_map.hasOwnProperty(id)) {
                        maps.channel_map[id][(earn[key].start_date)] = net_earnings;
                    } else {
                        maps.channel_map[id] = {total:0};
                        maps.channel_map[id][(earn[key].start_date)] = net_earnings;
                    }
                    maps.channel_map[id].total += net_earnings;
                    maps.details_map[id] = obj;

                    maps.date_map[(earn[key].start_date)][id] = net_earnings;
                    maps.date_map[(earn[key].start_date)].total += net_earnings;

                    maps.total += net_earnings;





                }
            }
            // if(earnings.hasOwnProperty('raw_channel_earnings')){
            earnings.end_selection =  earn[key];
            // }
            console.log('   maps', maps);
            earnings[raw ? 'raw_maps' : 'maps'] = maps;
            format_to_chart(maps);
        }   

        function format_to_chart (maps) {
            var data = [['Months', '-All Channels-']],
            array_to_add = [],
            length = 1, c = 0, 
            ctr = 0, 
            details_map = maps.details_map,
            date_map = maps.date_map;
            earnings.indexMap = {1: '-All Channels-'};
            for( var a in details_map ) {
                earnings.indexMap[length+1] = details_map[a].user_channel_id;
                data[0].push(details_map[a].channel_display_name);
                length++;    
            }
            ctr = 0;
            for (var i in date_map) {
                array_to_add = [get_month(i), 0];
                for (c = 2; c < data[0].length; c++) { 
                    if(maps.channel_map[earnings.indexMap[c]].hasOwnProperty(i)){
                        array_to_add.push(maps.channel_map[earnings.indexMap[c]][i]); 
                        ctr += maps.channel_map[earnings.indexMap[c]][i];
                    } else {
                        array_to_add.push(0); 
                    }
                }
                array_to_add[1] = ctr;
                ctr = 0;
                data.push(array_to_add);
            }
            earnings.channel_chart_data = data;
        }

        function get_raw_network_earnings () {
            defer = $q.defer();
            earnings.raw_network_earnings = localStorageService.get($rootScope.access_token + 'rawnetearnings');
            if(is_empty(earnings.raw_network_earnings)) {
                networkearningsService.get_report_from_date(earnings.list_reports).then(function(data){
                    earnings.raw_network_earnings = data;
                    localStorageService.set($rootScope.access_token + 'rawnetearnings',data);
                    raw_network_mapping(earnings.raw_network_earnings);
                    defer.resolve(earnings.raw_network_earnings);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                raw_network_mapping(earnings.raw_network_earnings);
                defer.resolve(earnings.raw_network_earnings);
            }
            return defer.promise;
        }

        function get_network_earnings (reports) {
            defer = $q.defer();
            earnings.raw_network_earnings = localStorageService.get($rootScope.access_token + 'net_earnings');
            if(is_empty(earnings.raw_network_earnings) || reports) {
                networkearningsService.get_report_from_date(reports).then(function(data){
                    earnings.raw_network_earnings = data;
                    localStorageService.set($rootScope.access_token + 'net_earnings',data);
                    // raw_network_earnings(earnings);
                    defer.resolve(earnings.raw_channel_earnings);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                // raw_network_earnings(earnings);
                defer.resolve(earnings.raw_network_earnings);
            }
            return defer.promise;
        }

        function raw_network_mapping(earn){
            earnings.raw_network_maps = {
                reports_mapping : {}
            };
            if( ! is_empty(earn)) {
                earnings.latest = earnings.reports_mapping[earn[earn.length-1].report_id || 0];
                earnings.start = earnings.reports_mapping[earn[0].report_id];
            } 

            earnings.net_earnings = {
                total: 0,
                current: 0,
                next: 0,
            };
            for (var i = 0; i < earn.length; i++) {
                earnings.net_earnings.total += earn[i].earnings;
                earnings.net_earnings.current = earn[i].earnings;
                earnings.raw_network_maps.reports_mapping[earn[i].report_id] = earn[i];
                earnings.raw_network_maps.reports_mapping[earn[i].report_id].start_date = earnings.reports_mapping[earn[i].report_id].start_date;
            }

            earnings.net_earnings.next = earnings.net_earnings.total / earn.length;
        }

        function change_reports (start, after, year) {
            console.log('   start', start);
            console.log('   after', after);
            var reports_to_search = '', d, i, 
            diff = start - year,
            big = diff > 0 ? start : after,
            small = diff < 0 ? start : after,
            reports = earnings.reports,
            ctr = small;
            earnings.net_earnings = {};
            console.log('   reports', reports);
            console.log('   small ', small );
            console.log('   big', big);
            console.log('   earnings.raw_network_earnings', earnings.raw_network_earnings);
            while(ctr <= big) {
                for (i in earnings.raw_network_maps.reports_mapping) {
                    d = year + '-' + pad2(parseInt(ctr)) + '-01';
                    console.log((earnings.raw_network_maps.reports_mapping[i].start_date === d));
                    if(earnings.raw_network_maps.reports_mapping[i].start_date === d) { 
                        reports_to_search += i + ','; 
                        earnings.net_earnings[i] = earnings.raw_network_maps.reports_mapping[i];
                    }
                }
                    ctr++;
            }
            console.log('   repo', reports_to_search); 
            console.log('   earnings.net_earnings', earnings.net_earnings);  
            return earnings.net_earnings;
        }

        function net_earnings_tochart (earn) {
            var report_data = [['Months', 'Earnings', 'Channels']];
            for (var c in earn) { 
                if(typeof earn[c] === 'function'){
                    break;
                }
                console.log('earn[c]',earn[c]);
                report_data.push([get_month(earnings.reports_mapping[earn[c].report_id].start_date), earn[c].earnings, earn[c].channel_count]);
            }
            return report_data;
        }

        function details_tochart (data) {
            var report_data = [['Months', 'Earnings']], ch_earnings, revshare,
            net_earnings = 0;
            for (var c = 0; c < data.length; c++) { 
                ch_earnings = data[c].earnings;
                revshare = data[c].channel_revshare;
                report_data[c+1] = [get_month(earnings.reports_mapping[data[c].report_id].start_date), ch_earnings * (revshare/100) ];
            }
            earnings.detailschart_data = report_data;
            return report_data;
        }


        function userearnings_tochart (data) {
            var report_data = [['Months', 'Earnings']], ch_earnings, revshare,
            net_earnings = 0;
            for (var c = 0; c < data.length; c++) { 
                for (var i = 0; i < data[c].length; i++) {
                    // data[c][i]
                    ch_earnings = data[c][i].earnings;
                    revshare = data[c][i].revenue_share.revenue_share;
                    // revshare = data[c][i].revenue_share.revenue_share || 60;
                    report_data[c+1] = [get_month(earnings.reports_mapping[data[c].report_id].start_date), ch_earnings * (revshare/100) ];
                }
            }
            earnings.detailschart_data = report_data;
            return report_data;
        }


        function recruiterdetails_tochart (data) {
            var report_data = [['Months', 'Earnings']], ch_earnings, revshare,
            net_earnings = 0;
            for (var c in data) { 
                for (var i = data[c].length - 1; i >= 0; i--) {
                    ch_earnings = data[c][i].earnings;
                    revshare = data[c][i].channel_revshare;
                    report_data.push([get_month(earnings.reports_mapping[c].start_date), ch_earnings * (revshare/100) ]);
                }
            }
            // earnings.detailschart_data = report_data;
            return report_data;
        }
        /*
            RECRUITER
        */

        function get_recruiter_earnings (reports) {
            defer = $q.defer();
            earnings.raw_recruiter_earnings = localStorageService.get($rootScope.access_token + 'recruiter_earnings');
            if(is_empty(earnings.raw_recruiter_earnings) || reports) {
                userearningsService.get_recruiter_earnings(reports).then(function(data){
                    earnings.raw_recruiter_earnings = data;
                    localStorageService.set($rootScope.access_token + 'recruiter_earnings',data);
                    defer.resolve(earnings.raw_channel_earnings);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                // raw_recruiter_earnings(earnings);
                defer.resolve(earnings.raw_recruiter_earnings);
            }
            return defer.promise;
        }

        function get_overall_earnings (reports) {
            defer = $q.defer();
            earnings.raw_overall_earnings = localStorageService.get($rootScope.access_token + 'overall_earnings');
            // console.log('earnings.raw_overall_earnings',earnings.raw_overall_earnings[0]);
            // if(!earnings.raw_overall_earnings[0].report_id){
            //     earnings.raw_overall_earnings = [];
            // }
            console.log('is_empty(earnings.raw_overall_earnings)',is_empty(earnings.raw_overall_earnings));
            if(is_empty(earnings.raw_overall_earnings) && reports) {
                userearningsService.get_overall_earnings(reports).then(function(data){
                    earnings.raw_overall_earnings = data;
                    localStorageService.set($rootScope.access_token + 'overall_earnings',data);
                    overall_chart(earnings.raw_overall_earnings);
                    defer.resolve(earnings.raw_overall_earnings);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                overall_chart(earnings.raw_overall_earnings);
                // console.log('earnings.raw_overall_earnings',earnings.raw_overall_earnings);
                defer.resolve(earnings.raw_overall_earnings);
            }
            return defer.promise;
        }



        // function get_raw_overall_earnings () {
        //     defer = $q.defer();
        //     earnings.raw_overall_earnings = localStorageService.get($rootScope.access_token + 'rawoverallearnings');
        //     if(is_empty(earnings.raw_overall_earnings)) {
        //         networkearningsService.get_report_from_date(earnings.list_reports).then(function(data){
        //             earnings.raw_network_earnings = data;
        //             localStorageService.set($rootScope.access_token + 'rawoverallearnings',data);
        //             raw_network_mapping(earnings.raw_network_earnings);
        //             defer.resolve(earnings.raw_network_earnings);
        //         }, function(data){
        //             defer.reject(data);
        //         });
        //     } else {
        //         raw_network_mapping(earnings.raw_network_earnings);
        //         defer.resolve(earnings.raw_network_earnings);
        //     }
        //     return defer.promise;
        // }
        function set_list_reports_overall (start, after, year) {
            var reports_to_search = '', d, i, 
            diff = start - year,
            big = diff > 0 ? start : after,
            small = diff < 0 ? start : after,
            ctr = small,
            ch_earnings = earnings.raw_overall_earnings,
            reports = earnings.reports;
            console.log('   earnings.raw', earnings.raw_overall_earnings);
            earnings.overall_earnings = [];
            while(ctr <= big) {
                for (i in reports) {
                    d = year + '-' + pad2(parseInt(ctr)) + '-01';
                    if(reports[i].start_date === d) { 
                        reports_to_search += reports[i].id + ','; 
                        if(ch_earnings[ch_earnings.objectIndexOf(reports[i].id,'report_id')]){
                            earnings.overall_earnings.push(ch_earnings[ch_earnings.objectIndexOf(reports[i].id,'report_id')]);
                        }
                    }
                }
                ctr++;
            }
            // localStorageService.set($rootScope.access_token+ 'earnings', earnings.channel_earnings);
            console.log('   earnings.overall_earnings', earnings);
            // earnings.reports_to_search = reports_to_search;
            return reports_to_search;
            // channel_map_earnings(earnings.channel_earnings, false);
        }


        function overall_chart (overall_earnings) {
            var report_data = [];
            earnings.overall = { net_earnings : 0 };
                for (var c = overall_earnings.length - 1; c >= 0; c--) {
                    if(overall_earnings[c]){
                        report_data.push([get_month(earnings.reports_mapping[overall_earnings[c].report_id].start_date), overall_earnings[c].sum ]);
                        earnings.overall.net_earnings += overall_earnings[c].sum;
                    }
                }
            report_data.push(['Months', 'Earnings']);
            // earnings.detailschart_data = report_data;
            return report_data.reverse();
        }

        function raw_overall_mapping(earn){
            console.log('   raw_network_mapping', earn);
            earnings.raw_overall_maps = {
                reports_mapping : {}
            };
            console.log('earn[0].start_date',earn[0]);
            if( ! is_empty(earn)) {
                earnings.latest = earnings.reports_mapping[earn[earn.length-1].report_id || 0];
                earnings.start = earnings.reports_mapping[earn[0].report_id];
            } 

            earnings.overall_earnings = {
                total: 0,
                current: 0,
                next: 0,
            };
            for (var i = 0; i < earn.length; i++) {
                earnings.overall_earnings.total += earn[i].earnings;
                earnings.overall_earnings.current = earn[i].earnings;
                earnings.raw_overall_maps.reports_mapping[earn[i].report_id] = earn[i];
                earnings.raw_overall_maps.reports_mapping[earn[i].report_id].start_date = earnings.reports_mapping[earn[i].report_id].start_date;
            }

            earnings.overall_earnings.next = earnings.overall_earnings.total / earn.length;
        }

        function pad2 (number) { return (number < 10 ? '0' : '') + number; }
        function get_month (value) { return (typeof value== "number") ? months[value - 1] : months[parseInt(value.split('-')[1]) - 1] + ' '+ value.split('-')[0]; }
    }
    factory.$inject = ["userearningsService", "networkearningsService", "localStorageService", "$rootScope", "$q"];



})();
