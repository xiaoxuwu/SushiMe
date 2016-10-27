var app = angular.module('sushiMe.controllers', []);

app.controller("YelpController", function($scope, YelpService) {
	$scope.yelp = YelpService;
	$scope.suggestView = false;
	
	$scope.showPopUp = function() {
		alert('Displaying Pop Up!');
	}

	$scope.doRefresh = function() {
		if (!$scope.yelp.isLoading) {
			$scope.yelp.refresh().then(function() {
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	}

	$scope.loadMore = function() {
		if (!$scope.yelp.isLoading && $scope.yelp.hasMore) {
			$scope.yelp.next().then(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			})
		}
	}

	$scope.loadImage = function(image) {
		if(image) {
			return image;
		} else {
			return '../img/no-image.png';
		}
	}

	$scope.getDirections = function(restaurant) {
		var destination = [
			restaurant.location.coordinate.latitude,
			restaurant.location.coordinate.longitude,
		];

		var source = [
			$scope.yelp.lat,
			$scope.yelp.lon
		];

		launchnavigator.navigate(destination, source);
	}
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
		$scope.propertyName = propertyName;
	}

		$scope.openMap = function(restaurant) {
		console.log('openMap');
	}
});