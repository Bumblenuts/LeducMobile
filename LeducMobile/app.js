'use strict';

(function() {
    var app = {
        data: {}
    };

    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'flat',
                initial: 'components/homeView/view.html'
            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

document.addEventListener("deviceready", onDeviceReady, false);

function id(element) {
    return document.getElementById(element);
}

function onDeviceReady() {

    cameraApp = new cameraApp();
    cameraApp.run();

    navigator.splashscreen.hide();
}

function cameraApp() {}

cameraApp.prototype = {
    _pictureSource: null,

    _destinationType: null,

    run: function() {
        var that = this;
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
        id("capturePhotoButton").addEventListener("click", function() {
            that._capturePhoto.apply(that, arguments);
        });
    },

    _capturePhoto: function() {
        var that = this;
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function() {
            that._onPhotoDataSuccess.apply(that, arguments);
        }, function() {
            that._onFail.apply(that, arguments);
        }, {
            quality: 50,
            destinationType: that._destinationType.DATA_URL
        });
    },

    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function() {
            that._onPhotoURISuccess.apply(that, arguments);
        }, function() {
            cameraApp._onFail.apply(that, arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },

    _onPhotoDataSuccess: function(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';

        // Show the captured photo.
        smallImage.src = "data:image/jpeg;base64," + imageData;
    },

    _onPhotoURISuccess: function(imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';

        // Show the captured photo.
        smallImage.src = imageURI;
    },

    _onFail: function(message) {
        alert(message);
    }
}

// Lookup object we'll be using to map file
// extension to mime type values
var mimeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif"
};

var AppHelper = {
    // produces the 'download' url for a given
    // file record id. This allows us, for ex,
    // to src an image in an img tag, etc.
    resolveImageUrl: function(id) {
        if (id) {
            return el.Files.getDownloadUrl(id);
        } else {
            return '';
        }
    },
    // helper function to produce the base64
    // for a given file input item
    getBase64ImageFromInput: function(input, cb) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
            if (cb) cb(e.target.result);
        };
        reader.readAsDataURL(input);
    },
    // produces the appropriate object structure
    // necessary for Everlive to store our file
    getImageFileObject: function(input, cb) {
        var name = input.name;
        var ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
        var mimeType = mimeMap[ext];
        if (mimeType) {
            this.getBase64ImageFromInput(input, function(base64) {
                var res = {
                    "Filename": name,
                    "ContentType": mimeType,
                    "base64": base64.substr(base64.lastIndexOf('base64,') + 7)
                };
                cb(null, res);
            });
        } else {
            cb("File type not supported: " + ext);
        }
    }
};
var gpsoptions = {
    enableHighAccuracy: true
};

// END_CUSTOM_CODE_kendoUiMobileApp