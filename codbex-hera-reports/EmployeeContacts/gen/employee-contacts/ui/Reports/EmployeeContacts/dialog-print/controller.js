angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-hera-reports.Reports.EmployeeContacts';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-hera-reports/gen/employee-contacts/api/EmployeeContacts/EmployeeContactsService.ts";
    }])
    .controller('PageController', ['$scope', 'messageHub', 'entityApi', 'ViewParameters', function ($scope, messageHub, entityApi, ViewParameters) {

		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
			};
			if (filterEntity.employeeName) {
				filter.employeeName = filterEntity.employeeName;
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
                    messageHub.showAlertError("EmployeeContacts", `Unable to list/filter EmployeeContacts: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['Birth date']) {
                        e['Birth date'] = new Date(e['Birth date']);
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
            messageHub.closeDialogWindow("codbex-hera-reports-Reports-EmployeeContacts-print");
        }

    }]);
