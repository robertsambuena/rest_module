(function () {
	angular
		.module( 'rest.translation', ['rest.config'])
		.service( 'translationService',translator);

	//@ngInject
	function translator(config, $http, settings) {
		var request, key;
 	 	return function (options) {
 	 		key = settings.languages[options.key.toLowerCase()] && settings.languages[options.key.toLowerCase()].key || settings.languages.en.key;

		    request = $http({
		        method: 'GET',
		        url: 'https://spreadsheets.google.com/feeds/list/'+key+'/od6/public/values?alt=json'
		    });
	    	return request.then(parse_json, config.handle_error);
  		};


  		function parse_json(data) {
  			var entry = data.data.feed.entry, json = {};
  			
  			for (var i = entry.length - 1; i >= 0; i--) {
  				json[entry[i].gsx$key.$t] = entry[i].gsx$value.$t === '' && entry[i].gsx$key.$t || entry[i].gsx$value.$t;
  			}
  			
  			return json;
  		}
	}
	translator.$inject = ["config", "$http", "settings"];
})();
