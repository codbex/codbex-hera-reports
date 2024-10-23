angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['Birth date']) {
				params.entity['Birth date'] = new Date(params.entity['Birth date']);
			}
			$scope.entity = params.entity;
		}

	}]);