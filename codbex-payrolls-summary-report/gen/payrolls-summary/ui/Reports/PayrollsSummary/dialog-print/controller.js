angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-payrolls-summary-report.Reports.PayrollsSummary';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-payrolls-summary-report/gen/payrolls-summary/api/PayrollsSummary/PayrollsSummaryService.ts";
    }])
    .controller('PageController', ['$scope', 'messageHub', 'entityApi', 'ViewParameters', function ($scope, messageHub, entityApi, ViewParameters) {

		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
			};
			if (filterEntity.StartDate) {
				filter.StartDate = new Date(filterEntity.StartDate);
			}

            $scope.filter = filter;
		}

        $scope.loadPage = function (filter) {
            if (!filter && $scope.filter) {
                filter = $scope.filter;
            }
            let request;
            if (filter) {
                request = entityApi.search(filter);
            } else {
                request = entityApi.list();
            }
            request.then(function (response) {
                if (response.status != 200) {
                    messageHub.showAlertError("PayrollsSummary", `Unable to list/filter PayrollsSummary: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['Start date']) {
                        e['Start date'] = new Date(e['Start date']);
                    }
                    if (e['Pay date']) {
                        e['Pay date'] = new Date(e['Pay date']);
                    }
                });

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();

                }, 250);
            });
        };
        $scope.loadPage($scope.filter);

        window.onafterprint = () => {
            messageHub.closeDialogWindow("codbex-payrolls-summary-report-Reports-PayrollsSummary-print");
        }

    }]);
