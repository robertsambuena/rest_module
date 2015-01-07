angular.module( 'ui.freedom.rest', [
  'rest.user',
  'rest.channel',
  'rest.network',
  'rest.recruits',
  'rest.admin',
  'rest.points',
  'rest.userearnings',
  'rest.networkearnings',
  'rest.prospects',
  'rest.feed',
  'rest.password',
  'rest.translation',
  'rest.apps',
  'rest.analytics',
  'rest.misc'
])
.constant('environment', (public_dir === '') ? 'development' : 'production' )
.constant('public_dir', public_dir )
;
