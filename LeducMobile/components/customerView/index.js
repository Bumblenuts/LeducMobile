'use strict';
var storedItem;
app.customerView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_customerView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_customerView
(function(parent) {
    var dataProvider = app.data.leducMobile,
        processImage = function(img) {
            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            } else if (img.slice(0, 4) !== 'http' &&
                img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
                var setup = dataProvider.setup || {};
                img = setup.scheme + ':' + setup.url + setup.appId + '/Files/' + img + '/Download';
            }

            return img;
        },
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Customers',
                dataProvider: dataProvider
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    dataItem['PhotoUrl'] =
                        processImage(dataItem['Photo']);

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'CustomerName': {
                            field: 'CustomerName',
                            defaultValue: ''
                        },
                        'Address': {
                            field: 'Address',
                            defaultValue: ''
                        },
                        'HomeTel': {
                            field: 'HomeTel',
                            defaultValue: ''
                        },
                        'Mobile': {
                            field: 'Mobile',
                            defaultValue: ''
                        },
                        'Email': {
                            field: 'Email',
                            defaultValue: ''
                        },
                        'Photo': {
                            field: 'Photo',
                            defaultValue: ''
                        },
                        'GPS': {
                            field: 'GPS',
                            defaultValue: null
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        customerViewModel = kendo.observable({

            dataSource: dataSource,

            itemClick: function (e) {
                app.mobileApp.navigate('#components/customerView/details.html?uid=' + e.dataItem.uid);
            },

            detailsShow: function (e) {
                var item = e.view.params.uid,
                
                    dataSource = customerViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.CustomerName) {
                    itemModel.CustomerName = String.fromCharCode(160);
                }
                storedItem = itemModel;
                customerViewModel.set('currentItem', itemModel);
            },

            addClick: function (e) {
                //create a new item.....initialize it as you please
                var item = { 'CustomerName': 'EnterIt' };
                //retrieve the data source
                dataSource = customerViewModel.get('dataSource');
                dataSource.add(item);
                dataSource.sync();
                storedItem =item = dataSource.at(dataSource.total() - 1);
                customerViewModel.set('currentItem', item);
                app.mobileApp.navigate('#components/customerView/addCustomer.html?uid=' + item.uid);
            },
           getPointSuccess: function (position) {
              
    
                customerViewModel.currentItem.GPS = new Everlive.GeoPoint(position.coords.longitude /* longitude */, position.coords.latitude  /* latitude */);

               


    },


  getPointFail: function(message) {
        alert('Failed because: ' + message);
    },

            editClick: function (e) {

                app.mobileApp.navigate('#components/customerView/addCustomer.html');
            },

            getPoint: function (e)
            {
                e.preventDefault();
                navigator.geolocation.getCurrentPosition(this.getPointSuccess, this.getPointFail, gpsoptions);
                return false;
            },

            getPhoto: function(e)
            {
                e.preventDefault();
                    navigator.camera.getPicture(this.onSuccess, this.onFail, {
                        quality: 50,
                        encodingType: Camera.EncodingType.JPEG,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.DATA_URL
                    });
                    return false;
            },
            
            saveChanges: function (e) {
                e.preventDefault();
                dataSource.sync();
                app.mobileApp.navigate('#components/customerView/view.html');
            },

            onSuccess: function (imageData) {
                var file = {
                    Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                    ContentType: "image/jpeg",
                    base64: imageData,
                };

                dataProvider.Files.create(file, function (response) {
                    var fileUri = response.result.Uri;

                    //var imgEl = document.createElement("img");
                    //imgEl.setAttribute('src', fileUri);
                    //imgEl.style.position = "absolute";
                    //document.body.appendChild(imgEl);

                    customerViewModel.currentItem.Photo = response.result.Id;
                    dataItem['PhotoUrl'] =
                   processImage(customerViewModel.currentItem.Photo);
        
                  
                }, function(err) {
                    navigator.notification.alert("Unfortunately the upload failed: " + err.message);
                });
         
            },


            onFail: function(e)
            {
                alert('bad coder');
            },
 
            currentItem: null
        });

    parent.set('customerViewModel', customerViewModel);
})(app.customerView);

// START_CUSTOM_CODE_customerViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


// END_CUSTOM_CODE_customerViewModel