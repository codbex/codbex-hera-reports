const viewData = {
    id: 'codbex-hera-reports-Reports-EmployeeSalaries-print',
    label: 'Print',
    link: '/services/web/codbex-hera-reports/gen/employee-salaries-report/ui/Reports/EmployeeSalaries/dialog-print/index.html',
    perspective: 'Reports',
    view: 'EmployeeSalaries',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}