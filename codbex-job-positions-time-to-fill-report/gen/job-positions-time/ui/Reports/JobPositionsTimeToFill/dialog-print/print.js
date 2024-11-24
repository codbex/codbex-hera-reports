const viewData = {
    id: 'codbex-job-positions-time-to-fill-report-Reports-JobPositionsTimeToFill-print',
    label: 'Print',
    link: '/services/web/codbex-job-positions-time-to-fill-report/gen/job-positions-time/ui/Reports/JobPositionsTimeToFill/dialog-print/index.html',
    perspective: 'Reports',
    view: 'JobPositionsTimeToFill',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}