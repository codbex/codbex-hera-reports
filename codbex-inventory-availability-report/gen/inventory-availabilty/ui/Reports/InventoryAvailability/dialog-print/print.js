const viewData = {
    id: 'codbex-inventory-availability-report-Reports-InventoryAvailability-print',
    label: 'Print',
    link: '/services/web/codbex-inventory-availability-report/gen/inventory-availabilty/ui/Reports/InventoryAvailability/dialog-print/index.html',
    perspective: 'Reports',
    view: 'InventoryAvailability',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}