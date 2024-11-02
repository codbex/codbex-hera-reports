angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['Start date']) {
				params.entity['Start date'] = new Date(params.entity['Start date']);
			}
			if (params.entity['Pay date']) {
				params.entity['Pay date'] = new Date(params.entity['Pay date']);
			}
			$scope.entity = params.entity;
		}

	}]);