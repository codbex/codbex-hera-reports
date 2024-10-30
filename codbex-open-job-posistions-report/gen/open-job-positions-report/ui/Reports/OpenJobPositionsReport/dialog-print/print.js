const viewData = {
    id: 'codbex-open-job-posistions-report-Reports-OpenJobPositionsReport-print',
    label: 'Print',
    link: '/services/web/codbex-open-job-posistions-report/gen/open-job-positions-report/ui/Reports/OpenJobPositionsReport/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpenJobPositionsReport',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}