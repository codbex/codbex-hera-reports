const viewData = {
    id: 'codbex-hera-employee-contacts-report-Reports-EmployeeContacts-print',
    label: 'Print',
    link: '/services/web/codbex-hera-employee-contacts-report/gen/employee-contacts/ui/Reports/EmployeeContacts/dialog-print/index.html',
    perspective: 'Reports',
    view: 'EmployeeContacts',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}