var app = angular.module('sushiMe.filters', []);

app.filter("join", function () {
	return function (arr, sep) {
		return arr.join(sep);
	};
});
