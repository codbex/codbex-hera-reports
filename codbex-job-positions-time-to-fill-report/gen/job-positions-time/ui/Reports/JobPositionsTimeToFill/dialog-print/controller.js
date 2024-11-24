angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-job-positions-time-to-fill-report.Reports.JobPositionsTimeToFill';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-job-positions-time-to-fill-report/gen/job-positions-time/api/JobPositionsTimeToFill/JobPositionsTimeToFillService.ts";
    }])
    .controller('PageController', ['$scope', 'messageHub', 'entityApi', 'ViewParameters', function ($scope, messageHub, entityApi, ViewParameters) {

		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
			};

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
                    messageHub.showAlertError("JobPositionsTimeToFill", `Unable to list/filter JobPositionsTimeToFill: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['Date opened']) {
                        e['Date opened'] = new Date(e['Date opened']);
                    }
                    if (e['Date closed']) {
                        e['Date closed'] = new Date(e['Date closed']);
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
            messageHub.closeDialogWindow("codbex-job-positions-time-to-fill-report-Reports-JobPositionsTimeToFill-print");
        }

    }]);
