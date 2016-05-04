'use strict';

app.addCustomer = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_addCustomer
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_addCustomer
(function(parent) {
    var addCustomerModel = kendo.observable({
        fields: {
            mobile: '',
            email: '',
            address: '',
            customerName: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('addCustomerModel', addCustomerModel);
})(app.addCustomer);

// START_CUSTOM_CODE_addCustomerModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_addCustomerModel