'use strict';

app.homeView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_homeView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
(function() {
    app.homeView.set('title', 'Home');
})();
// END_CUSTOM_CODE_homeView
(function(parent) {
    var provider = app.data.leducMobile,

        signinRedirect = 'customerView',
        init = function(error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }
                return false;
            }

            var activeView = '.signin-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }

        },
        successHandler = function(data) {
            var redirect = signinRedirect,
                model = parent.homeViewModel || {},
                logout = model.logout;

            if (logout) {
                model.set('logout', null);
            }
            if (data && data.result) {
                if (logout) {
                    provider.Users.logout(init, init);
                    return;
                }
                app.user = data.result;

                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        homeViewModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            validateData: function(data) {
                if (!data.email) {
                    alert('Missing email');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = homeViewModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }
                provider.Users.login(email, password, successHandler, init);
            }
        });

    parent.set('homeViewModel', homeViewModel);
    parent.set('afterShow', function(e) {
        if (e && e.view && e.view.params && e.view.params.logout) {
            homeViewModel.set('logout', true);
        }
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeViewModel