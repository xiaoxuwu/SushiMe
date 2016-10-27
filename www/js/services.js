var app = angular.module('sushiMe.services', []);

app.service("YelpService", function ($q, $http, $cordovaGeolocation, $ionicPopup) {
  var self = {
    'page': 1,
    'isLoading': false,
    'hasMore': true,
    'results': [],
    'lat': 37.773972,
    'lon': -122.431297,
    'refresh': function () {
      self.page = 1;
      self.isLoading = false;
      self.hasMore = true;
      self.results = [];
      return self.load();
    },
    'next': function () {
      self.page += 1;
      return self.load();
    },
    'load': function () {
      self.isLoading = true;
      var deferred = $q.defer();

      function loadMap() {
        $cordovaGeolocation
          .getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: false
          })
          .then(function (position) {
            self.lat = position.coords.latitude;
            self.lon = position.coords.longitude;

            var locParams = {
              page: self.page,
              lat: self.lat,
              lon: self.lon
            };

            var currentLocation = locParams.lat + "," + locParams.lon;

            var method = 'GET';
            var url = 'http://api.yelp.com/v2/search?callback=JSON_CALLBACK';
            var params = {
              offset: String((self.page - 1) * 20),
              callback: 'angular.callbacks._0',
              ll: currentLocation,
              oauth_consumer_key: 'cTdzw2Jhabjeuz_VTXZ1qQ', //Consumer Key
              oauth_token: 'v144kjf94ArVGz1Lov0jDNbm0uZ2ssJF', //Token
              oauth_signature_method: "HMAC-SHA1",
              oauth_timestamp: new Date().getTime(),
              oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
              term: 'sushi'
            };
            var consumerSecret = 'wpv-QXOiFojYFjbaCJkyTw0F_fU'; //Consumer Secret
            var tokenSecret = 'arE0E1zwEve_PCagA90q5YRFWZ4'; //Token Secret
            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
              encodeSignature: false
            });
            params['oauth_signature'] = signature;
            $http.jsonp(url, {
                params: params
              }).then(function (data) {
                if (data.data.businesses.length == 0)
                  self.hasMore = false;
                angular.forEach(data.data.businesses, function (business) {
                  console.log(business);
                  self.results.push(business);
                });
                deferred.resolve();
                self.isLoading = false;
              })
              .catch(function (err) {
                console.log(err.statusText, err);
              });

          }, function (err) {
            console.error("Error getting position");
            console.error(err);
            $ionicPopup.alert({
              'title': 'Please switch on geolocation',
              'template': "It seems like you've switched off geolocation for SushiMe, please switch it on by going to you application settings."
            });
          })
      }

      ionic.Platform.ready(function () {
        loadMap();
      });

      return deferred.promise;
    }
  };

  self.load();
  return self;
});

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}
