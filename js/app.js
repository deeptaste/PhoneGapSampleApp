/**
 * @author Diptesh Shrestha
 */
var App = {
    testing_on_desktop: false,
    device_model: null,
	device_platform: null,
	device_version: null,
	device_uuid: null,
	device_cordova: null,
	
    screen_width: null,
	screen_height: null,
	screen_availWidth: null,
	screen_availHeight: null,
	screen_colorDepth: null,
	
	camera_pictureSource: null,
	camera_destinationType: null,
    
    initialize: function () {
	    console.log("Initializing Apps");
	 	App.bindEvents();
	},
	bindEvents: function() {
        if (document.URL.indexOf("http://") == 0) {
	        App.testing_on_desktop = true;
	    }
	 
	    $(document).ready(function () {
	    	$(document).bind("mobileinit", function () {
			    $.support.cors = true;
			    $.mobile.allowCrossDomainPages = true;
			     
			    $.mobile.phonegapNavigationEnabled = false;
			    $.mobile.defaultDialogTransition = "pop";
			    $.mobile.defaultPageTransition = "none";
			     
			    $.mobile.loader.prototype.options.text = "loading";
			    $.mobile.loader.prototype.options.textVisible = true;
			    $.mobile.loader.prototype.options.theme = "b";
			});
	    	
	    	console.log("jQuery finished loading");
		 
		    var deviceReadyDeferred = $.Deferred();
		    var jqmReadyDeferred    = $.Deferred();
		    
		    if (App.testing_on_desktop) {
	            App.onDeviceReady();
				deviceReadyDeferred.resolve();
		    } 
		    else {
		        document.addEventListener("deviceReady", function () {
		        	App.onDeviceReady();
					deviceReadyDeferred.resolve();
		        }, false);
	       	}
	       	
	       	jQuery(document).one("pageinit", function () {
				console.log("jQuery.Mobile finished loading");
		        jqmReadyDeferred.resolve();
		    });
		 
		    jQuery.when(deviceReadyDeferred, jqmReadyDeferred).then(function () {
		        App.initPages();
		    });	
		    
		    $.when(deviceReadyDeferred, jqmReadyDeferred).then(App.initPages);
		});
    },
    onDeviceReady: function () {
		console.log("PhoneGap finished loading");
		
		App.device_model = device.model;
		App.device_platform = device.platform;
		App.device_version = device.version;
		App.device_uuid = device.uuid;
		App.device_cordova = device.cordova;
	
	    App.screen_width = screen.width;
		App.screen_height = screen.height;
		App.screen_availWidth = screen.availWidth;
		App.screen_availHeight = screen.availHeight;
		App.screen_colorDepth= screen.colorDepth;
		
		App.camera_pictureSource = navigator.camera.PictureSourceType;
		App.camera_destinationType = navigator.camera.DestinationType;
	},
	initPages: function () {
		console.log("App finished loading");
		
		FastClick.attach(document.body);
	},
    data: {
    	isNull: function (value) {
	    	return value == null ? 0 : ( value[1] || 0 );
	    },
	    isUndefined: function (value) {
	    	if(typeof(value) === 'undefined') {
				return '-';
			}
	    },
	    numLength: function (len, num) {
	    	var num = '' + num;
			
			if (num.length < len) {
				for(i = 1; i < len; i++) {
					num = "0" + num;
				}
			}
			return num;
	    },
	    roundNumber: function (num, dec) {
	    	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	    },
		showError: function (err) {
			console.log("[App.data.showError]");
			var msg = 'code: ' + err.code + '\n' + 'message: ' + err.message + '\n';
			navigator.notification.alert(msg, null, 'ERROR', 'OK');
	    },
    },
    feature: {
    	reachability: function () {
			if(navigator.network.connection.type == Connection.NONE || navigator.network.connection.type == Connection.UNKNOWN) {
		        return false;
		    }
		    else {
		        return true;
		    }
		},
		deviceInfo: {
			showData: function () {
				console.log("[App.feature.deviceInfo.showData]");
				
				document.getElementById('device-status-bar').setAttribute('style', 'display: none !important;');
				
				document.getElementById('device-model').innerHTML = App.device_model;
				document.getElementById('device-uuid').innerHTML = App.device_uuid;
				document.getElementById('device-platform').innerHTML = App.device_platform;
				document.getElementById('device-version').innerHTML = App.device_version;
				document.getElementById('device-cordova').innerHTML = App.device_cordova;
				
				document.getElementById('screen-width').innerHTML = App.screen_width;
				document.getElementById('screen-height').innerHTML = App.screen_height;
				document.getElementById('screen-availWidth').innerHTML = App.screen_availWidth;
				document.getElementById('screen-availHeight').innerHTML = App.screen_availHeight;
				document.getElementById('screen-colorDepth').innerHTML = App.screen_colorDepth;
				
				document.getElementById('device-details').setAttribute('style', 'display: block !important;');
			},
		},
		accelerometer: {
			watchID: null,
			oCan: null,
			oCanTwoD: null,
			oCanWt: null,
			oCanHt: null,
			oImg: null,
			xPos: null,
			yPos: null,
			
			showData: function(acceleration) {
				console.log("[App.feature.accelerometer.showData]");
				var xVal = acceleration.x;
				var yVal = acceleration.y;
				var zVal = acceleration.z;
				var d = new Date(acceleration.timestamp);
				var date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
				date += ' ' + d.getHours() + ':' + App.data.numLength(2, d.getMinutes()) + ':' + App.data.numLength(2, d.getSeconds());
				
				document.getElementById('accelerometer-status-bar').setAttribute('style', 'display: none !important;');
				
				document.getElementById('xVal').innerHTML = App.data.roundNumber(xVal, 3);
				document.getElementById('yVal').innerHTML = App.data.roundNumber(yVal, 3);
				document.getElementById('zVal').innerHTML = App.data.roundNumber(zVal, 3);
				document.getElementById('date').innerHTML = date + ' (watching)';
				
				document.getElementById('accelerometer-details').setAttribute('style', 'display: block !important;');
				
				var acc = App.feature.accelerometer;
				acc.oCanTwoD.clearRect(0, 0, acc.oCan.width, acc.oCan.height);
				acc.xPos += -1*(xVal * 1.5);
			    acc.yPos += (yVal * 1.5);
			    acc.oCanTwoD.drawImage(acc.oImg, acc.xPos, acc.yPos);
			},
			startService: function() {
				console.log("[App.feature.accelerometer.startService]");
				
				var acc = App.feature.accelerometer;
				acc.oCan = document.getElementById('myCanvas');
				acc.oCanTwoD = acc.oCan.getContext("2d");
				acc.oCanWt = acc.oCan.width;
				acc.oCanHt = acc.oCan.height;
				
				acc.oImg = new Image();
		      	acc.oImg.src = "css/images/red-round-ball.png";
		      	acc.xPos = (acc.oCanWt - acc.oImg.width)/2;
		      	acc.yPos = (acc.oCanHt - acc.oImg.height)/2;
		      	
				/*
				acc.oImg.onload = function()
				{
					acc.oCanTwoD.drawImage(acc.oImg, acc.xPos, acc.yPos);
				};
				*/
		      	
		      	var options = { 
					frequency: 25
				};
				if (!acc.watchID) {
					acc.watchID = navigator.accelerometer.watchAcceleration(acc.showData, App.data.showError, options);
				}
			},
			stopService: function() {
				console.log("[App.feature.accelerometer.stopService]");
				
				navigator.accelerometer.clearWatch(App.feature.accelerometer.watchID);
				App.feature.accelerometer.watchID = null;
		        document.getElementById('toogleAccelerometer').innerHTML = "Start watching";
			},
			toogleAccelerometer: function() {
				if (App.feature.accelerometer.watchID != null) {
					App.feature.accelerometer.stopService();
				}
				else {
					App.feature.accelerometer.startService();
		        	document.getElementById('toogleAccelerometer').innerHTML = "Stop watching";
				}
			},
		},
		camera: {
			startService: function() {
				console.log("[App.feature.camera.startService]");
			},
			onPhotoDataSuccess: function(imageData) {
				console.log("[App.feature.camera.onPhotoDataSuccess]");
				var imgPreview = document.getElementById('img-preview');
				imgPreview.style.display = 'block !important';
    			imgPreview.style.visibility = 'visible';
				imgPreview.src = "data:image/jpeg;base64," + imageData;
			},		
			onPhotoURISuccess: function(imageURI) {
				console.log("[App.feature.camera.onPhotoURISuccess]");
				var imgPreview = document.getElementById('img-preview');
				imgPreview.style.display = 'block !important';
    			imgPreview.style.visibility = 'visible';
	    		imgPreview.src = imageURI;
			},
			capturePhoto: function() {
				console.log("[App.feature.camera.capturePhoto]");
				var options = { 
						quality: 30, 
						destinationType: App.camera_destinationType.DATA_URL
				};
				navigator.camera.getPicture(App.feature.camera.onPhotoDataSuccess, App.data.showError, options);
			},
			openPhotoAlbum: function() {
				console.log("[App.feature.camera.getPhoto]");
				var options = { 
						quality: 30, 
						destinationType: App.App.camera_destinationType.FILE_URI,
						sourceType: App.camera_pictureSource.SAVEDPHOTOALBUM 
				};
				navigator.camera.getPicture(App.feature.camera.onPhotoURISuccess, App.data.showError, options);
			},
		},
		geolocation: {
			watchID: null,
			
			createMarker: function(map, placeLoc, desc) {
				console.log("[App.feature.geolocation.createMarker]");
				var marker = new google.maps.Marker({
					map : map,
					position : placeLoc,
					title: desc
				});
				
				var infowindow = new google.maps.InfoWindow();
			
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(desc);
					infowindow.open(map, this);
				});
				
				return marker;
			},
			showMap: function(position) {
				console.log("[App.feature.geolocation.showMap]");
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				
				var mapFrame 	= document.getElementById('map-frame');
				var curLocation = new google.maps.LatLng(lat, lng);
				
				var map = new google.maps.Map(mapFrame, {
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					center : curLocation,
					zoom : 11
				});
				
				var homeMarker = App.feature.geolocation.createMarker(map, curLocation, "YOU ARE HERE");
				
				iconFile = 'css/images/green-dot.png';
				homeMarker.setIcon(iconFile);
			},
			showData: function(position) {
				console.log("[App.feature.geolocation.showData]");
				
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				var alt = position.coords.altitude;
				var acc = position.coords.accuracy;
				var alc = position.coords.altitudeAccuracy;
				var hed = position.coords.heading;
				var spd = position.coords.speed;
				
				document.getElementById('geolocation-status-bar').setAttribute('style', 'display: none !important;');

				document.getElementById('lat').innerHTML = lat + '(watching)';
				document.getElementById('lng').innerHTML = lng;
				document.getElementById('alt').innerHTML = alt;
				document.getElementById('acc').innerHTML = acc + 'm';
				document.getElementById('alc').innerHTML = alc;
				document.getElementById('hed').innerHTML = hed;
				document.getElementById('spd').innerHTML = App.data.isNull(spd);
				
				document.getElementById('geolocation-details').setAttribute('style', 'display: block !important;');
				
				App.feature.geolocation.showMap(position);
			},
			startService: function() {
				console.log("[App.feature.geolocation.startService]");
				
				if(!App.feature.reachability()){
			        navigator.notification.alert('No internet connection available', null, '', 'OK');
			    }
			    else{
			    	var options = { frequency: 3000, maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };
			    	App.feature.geolocation.watchID = navigator.geolocation.watchPosition(App.feature.geolocation.showData, App.data.showError, options);
			    }
			},
			stopService: function() {
				console.log("[App.feature.geolocation.stopService]");
		        
		        navigator.geolocation.clearWatch(App.feature.geolocation.watchID);
		        App.feature.geolocation.watchID = null;
		        document.getElementById('toogleGeolocation').innerHTML = "Start watching";
			},
			toogleGeolocation: function() {
				if (App.feature.geolocation.watchID != null) {
					App.feature.geolocation.stopService();
				}
				else {
					App.feature.geolocation.startService();
		        	document.getElementById('toogleGeolocation').innerHTML = "Stop watching";
				}
			},
		},
		contacts: {
			showContacts: function(contacts) {
				console.log("[App.feature.contacts.showContacts]");
				
				var cList = document.getElementById('contact-list');
				cList.innerHTML = "<strong>" + contacts.length + "</strong> contacts found.<br/>";
			    
			    for (var i = 0; i < contacts.length ; i++) { 
			        cList.innerHTML += "<br/> [" + (i+1) + "] <strong>" + contacts[i].displayName + "</strong>";
			    }
			},
			startService: function() {
				console.log("[App.feature.contacts.startService]");
				
				var options = new ContactFindOptions();
			    options.filter = "";
			    options.multiple = true;
			    
			    var fields = ["displayName", "name"];
				navigator.contacts.find(fields, App.feature.contacts.showContacts, App.data.showError, options);
			},
		},
    },
};

$(document).on('pageshow', '#home', function(){  
	
	// User Login via Ajax Functionalities
	$(document).on('click', '#login', function(e) {
		var uName = $('#username').val();
		var pWord = $('#password').val();
		
		if(uName.length > 0 && pWord.length > 0) {
			navigator.notification.alert('Processing...', null, '', 'OK');
			
			if(!App.feature.reachability()){
		        navigator.notification.alert('No internet connection available', null, 'ERROR', 'OK');
		    }
		    else{
		    	$.ajax({
				    url        		: "http://localhost/SoapWebServiceForMobileApp/login.php?callback=myCallBack",
				    type       		: "POST",
				    crossDomain		: true,
				    data       		: {username : uName, password : pWord},
				    contentType		: "application/json; charset=utf-8",
				    dataType		: "jsonp",
				    jsonp			: "callback",
				    jsonpCallback	: "jsonpCallbackfunction",
				    success    		: function(data) {
				    	navigator.notification.alert(data, null, '', 'OK');
				    },
				    error      		: function(xhr, ajaxOptions, thrownErrorw) {
				        navigator.notification.alert('Some error occurred. Please try again later.', null, 'ERROR', 'OK');           
				    }
				});
		    }
		}
		else {
			navigator.notification.alert('Please provide the required login details.', null, 'ERROR', 'Login');
		}
	});
	
	// User Registration via Ajax Functionalities
	$(document).on('click', '#register', function(e) {
		var uName = $('#username').val();
		var pWord = $('#password').val();
		var cWord = $('#confirmPassword').val();
		var eMail = $('#email').val();
		
		if(uName.length > 0 && pWord.length > 0 && eMail.length > 0) {
			if(pWord == cWord) {
				navigator.notification.alert('Processing...', null, '', 'OK');
				
				if(!App.feature.reachability()){
			        navigator.notification.alert('No internet connection available', null, 'ERROR', 'OK');
			    }
			    else{
			    	$.ajax({
					    url        		: "http://localhost/SoapWebServiceForMobileApp/register.php?callback=myCallBack",
					    type       		: "POST",
					    crossDomain		: true,
					    //beforeSend 	: function() {$.mobile.loading('show');},
					    //complete   	: function() {$.mobile.loading('hide');},
					    data       		: {username : uName, password : pWord, email: eMail},
					    contentType		: "application/json; charset=utf-8",
					    dataType		: "jsonp",
					    jsonp			: "callback",
					    jsonpCallback	: "jsonpCallbackfunction",
					    success    		: function(data) {
					    	navigator.notification.alert(data, null, '', 'OK');
					    },
					    error      		: function(xhr, ajaxOptions, thrownErrorw) {
					        navigator.notification.alert('Some error occurred. Please try again later.', null, '', 'OK');        
					    }
					});
			    }
		    }
			else {
				navigator.notification.alert('Password does not match.', null, 'ERROR', 'OK');
			}
		}
		else {
			navigator.notification.alert('Please provide the required login details.', null, 'ERROR', 'OK');
		}
	});
});

function userRegistrationDisplay() {
	document.getElementById('userRegistrationSection').setAttribute('style', 'display: block !important;');
	document.getElementById('userLoginLink').setAttribute('style', 'display: block !important;');
	
	document.getElementById('userLoginSection').setAttribute('style', 'display: none !important;');
	document.getElementById('userRegistrationLink').setAttribute('style', 'display: none !important;');
}

function userLoginDisplay() {
	document.getElementById('userLoginSection').setAttribute('style', 'display: block !important;');
	document.getElementById('userRegistrationLink').setAttribute('style', 'display: block !important;');
	
	document.getElementById('userRegistrationSection').setAttribute('style', 'display: none !important;');
	document.getElementById('userLoginLink').setAttribute('style', 'display: none !important;');
}
