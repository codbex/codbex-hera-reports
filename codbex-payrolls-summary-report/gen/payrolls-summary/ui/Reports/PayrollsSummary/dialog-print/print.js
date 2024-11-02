const viewData = {
    id: 'codbex-payrolls-summary-report-Reports-PayrollsSummary-print',
    label: 'Print',
    link: '/services/web/codbex-payrolls-summary-report/gen/payrolls-summary/ui/Reports/PayrollsSummary/dialog-print/index.html',
    perspective: 'Reports',
    view: 'PayrollsSummary',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}