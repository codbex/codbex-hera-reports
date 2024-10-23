angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-hera-employee-salaries-report.Reports.EmployeeSalaries';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-hera-employee-salaries-report/gen/employee-salaries-report/api/EmployeeSalaries/EmployeeSalariesService.ts";
    }])
    .controller('PageController', ['$scope', 'messageHub', 'entityApi', 'ViewParameters', function ($scope, messageHub, entityApi, ViewParameters) {

		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
			};
			if (filterEntity.startdate) {
				filter.startdate = new Date(filterEntity.startdate);
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
                    messageHub.showAlertError("EmployeeSalaries", `Unable to list/filter EmployeeSalaries: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['Start Date']) {
                        e['Start Date'] = new Date(e['Start Date']);
                    }
                    if (e['Pay Date']) {
                        e['Pay Date'] = new Date(e['Pay Date']);
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
            messageHub.closeDialogWindow("codbex-hera-employee-salaries-report-Reports-EmployeeSalaries-print");
        }

    }]);