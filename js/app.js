/**
 * Created on : 2014
 * Author's Name : Diptesh Shrestha
 * Author's Email : diptesh.shrestha@gmail.com
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
	
	network_connectionType: null,
    
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
		
		App.network_connectionType = navigator.network.connection.type;
		
		if (parseFloat(window.device.version) === 7.0) {
			document.body.style.marginTop = "20px";
	    }
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
			navigator.notification.beep(2);
			navigator.notification.alert(msg, null, 'ERROR', 'OK');
	    },
		writeLocalStorage: function(key, value) {
			window.localStorage.setItem(key, value);
		},
		readLocalStorage: function(key) {
			return window.localStorage.getItem(key);
		},
    },
    display: {
    	userLogin: function() {
    		$('#user-login-section').css("display","block");
			$('#show-user-registration').css("display","block");
			
			$('#user-registration-section').css("display","none");
			$('#show-user-login').css("display","none");
    	},
    	userRegistration: function() {
    		$('#user-registration-section').css("display","block");
			$('#show-user-login').css("display","block");
			
			$('#user-login-section').css("display","none");
			$('#show-user-registration').css("display","none");
    	},
    	welcomeNote: {
    		UserLoggedIn: function(fullname) {
				$('#right-panel').panel('close');
				$("#user-info").html("<p><label><b>Welcome!</b></label>" + 
						"<label>You have logged in as " + fullname + ".</label>" + 
						"<label><a href='#' onclick='App.form.logout()'>LOGOUT</a></label></p>"); 
			},
			UserNotLoggedIn: function() {
				$("#user-info").html("<p><label><b>Welcome!</b></label>" +
						"<label>You have not logged in.</label>" + 
						"<label>Click <a href='#right-panel' onclick='App.display.userLogin();'><b>HERE</b></a> to login if already a member.</label>" +
						"<label>Otherwise, you can click <a href='#right-panel' onclick='App.display.userRegistration();'><b>HERE</b></a> to register.</label>" +
						"</p>"); 
			},
    	},
    },
    form: {
    	logout: function() {
    		if (!App.testing_on_desktop) {
	    		var storage = App.feature.storage;
		    	storage.tblName = "USER";
		    	storage.tblfields = "USERNAME, FULLNAME";
		    	storage.tblValues = "'" + data['username'] + "','" + data['fullname'];
		    	storage.db.transaction(createTable, App.data.showError);
		    	storage.db.transaction(insertData, App.data.showError);
	    	}
	    	
    		App.display.welcomeNote.UserLoggedIn(data['fullname']);
    	},
    	login: {
    		submit: function() {
    			var uName = $('#login-username').val();
				var pWord = $('#login-password').val();
				
				if(uName.length > 0 && pWord.length > 0) {
					if(!App.feature.reachability()){
						navigator.notification.beep(2);
				        navigator.notification.alert('No internet connection available', null, 'ERROR', 'OK');
				    }
				    else{
				    	$.ajax({
						    url        		: "http://myappserver.zymichost.com/login.php?callback=myCallBack",
						    type       		: "POST",
						    crossDomain		: true,
						    data       		: {username : uName, password : pWord},
						    contentType		: "application/json; charset=utf-8",
						    dataType		: "jsonp",
						    jsonp			: "callback",
						    jsonpCallback	: "jsonpCallback",
						    success    		: function(data) {
						    	if(data['status'] == "success") {
						    		App.form.login.success(data);
						    	}
						    	else {
									navigator.notification.vibrate(0);
						    		navigator.notification.alert("Wrong Username/Password. Try again.", null, '', 'OK');
						    	}
						    },
						    error : function(xhr, ajaxOptions, thrownErrorw) {
						        navigator.notification.beep(2);
								navigator.notification.alert('Some error occurred. Please try again later.', null, 'ERROR', 'OK');           
						    }
						});
				    }
				}
				else {
					navigator.notification.beep(2);
					navigator.notification.alert('Please provide the required login details.', null, 'ERROR', 'Login');
				}
    		},
    		cancel: function() {
    			$('#login-username').val('');
				$('#login-password').val('');
    		},
    		success: function(data) {
	    		if (!App.testing_on_desktop) {
		    		var storage = App.feature.storage;
			    	storage.tblName = "USER";
			    	storage.tblfields = "username, fullname";
			    	storage.tblValues = "'" + data['username'] + "','" + data['fullname'];
			    	storage.db.transaction(createTable, App.data.showError);
			    	storage.db.transaction(insertData, App.data.showError);
		    	}
		    	
		    	App.data.writeLocalStorage('username',data['username']);
		    	App.data.writeLocalStorage('fullname',data['fullname']);
		    	
		    	App.display.welcomeNote.UserLoggedIn(data['fullname']);
    		}
    	},
    	registration: {
    		submit: function() {
    			var fName = $('#register-fullname').val();
    			var uName = $('#register-username').val();
				var pWord = $('#register-password').val();
				var cWord = $('#register-confirm-password').val();
				var eMail = $('#register-email').val();
				
				if(fName.length > 0 && uName.length > 0 && pWord.length > 0 && eMail.length > 0) {
					if(pWord == cWord) {
						if(!App.feature.reachability()){
							navigator.notification.beep(2);
					        navigator.notification.alert('No internet connection available', null, 'ERROR', 'OK');
					    }
					    else{
					    	$.ajax({
							    url        		: "http://myappserver.zymichost.com/register.php?callback=myCallBack",
							    type       		: "POST",
							    crossDomain		: true,
							    data       		: {fullname : fName, username : uName, password : pWord, email: eMail},
							    contentType		: "application/json; charset=utf-8",
							    dataType		: "jsonp",
							    jsonp			: "callback",
							    jsonpCallback	: "jsonpCallbackfunction",
							    success    		: function(data) {
							    	if(data['status'] == "success") {
							    		App.form.registration.success(data);
							    	}
							    	else {
										navigator.notification.vibrate(0);
							    		navigator.notification.alert("Some error occurred. Please try again later.", null, '', 'OK');
							    	}
							    },
							    error : function(xhr, ajaxOptions, thrownErrorw) {
						        	navigator.notification.beep(2);	
							        navigator.notification.alert('Some error occurred. Please try again later.', null, '', 'OK');        
							    }
							});
					    }
				    }
					else {
						navigator.notification.beep(2);
						navigator.notification.alert('Password does not match.', null, 'ERROR', 'OK');
					}
				}
				else {
					navigator.notification.beep(2);
					navigator.notification.alert('Please provide the required login details.', null, 'ERROR', 'OK');
				}
    		},
    		success: function() {
    			navigator.notification.alert("You can now login.", null, '', 'OK');
    			App.display.userLogin();
    		},
    		cancel: function() {
    			$('#register-username').val('');
				$('#register-password').val('');
				$('#register-confirm-password').val('');
				$('#register-email').val('');
				$('#right-panel').panel('close');
    		},
    	}
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
				
				var states = {};
				    states[Connection.UNKNOWN]  = 'Unknown connection';
				    states[Connection.ETHERNET] = 'Ethernet connection';
				    states[Connection.WIFI]     = 'WiFi connection';
				    states[Connection.CELL_2G]  = 'Cell 2G connection';
				    states[Connection.CELL_3G]  = 'Cell 3G connection';
				    states[Connection.CELL_4G]  = 'Cell 4G connection';
				    states[Connection.NONE]     = 'No network connection';
				
				$('#device-status-bar').css("display","none");
				$('#device-details').css("display","block");
				
				$('#device-model').html(App.device_model);
				$('#device-uuid').html(App.device_uuid);
				$('#device-platform').html(App.device_platform);
				$('#device-version').html(App.device_version);
				$('#device-cordova').html(App.device_cordova);
				$('#network-connection').html(states[App.network_connectionType]);
				$('#screen-width').html(App.screen_width);
				$('#screen-height').html(App.screen_height);
				$('#screen-availWidth').html(App.screen_availWidth);
				$('#screen-availHeight').html(App.screen_availHeight);
				$('#screen-colorDepth').html(App.screen_colorDepth);
			},
		},
		accelerometer: {
			watchID: null,
			oCan: null,
			oCtx: null,
			oImg: null,
			xPos: null,
			yPos: null,
			preX: 0,
			preY: 0,
			
			showData: function(acceleration) {
				console.log("[App.feature.accelerometer.showData]");
				var xVal = acceleration.x;
				var yVal = acceleration.y;
				var zVal = acceleration.z;
				var d = new Date(acceleration.timestamp);
				var date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
				date += ' ' + d.getHours() + ':' + App.data.numLength(2, d.getMinutes()) + ':' + App.data.numLength(2, d.getSeconds());
				
				$('#accelerometer-status-bar').html("Watching device orientation...");
				$('#accelerometer-details').css("display","block");
				
				$('#xVal').html(App.data.roundNumber(xVal, 5));
				$('#yVal').html(App.data.roundNumber(yVal, 5));
				$('#zVal').html(App.data.roundNumber(zVal, 5));
				$('#date').html(date + '');

				App.feature.accelerometer.moveObject(xVal, yVal);
			},
			moveObject: function(xVal, yVal) {
				var acc = App.feature.accelerometer; 
				
				if(acc.preX != xVal && acc.preY != yVal) {
					acc.xPos = acc.xPos + (-1*(xVal * 1.5))/2;
					acc.yPos = acc.yPos + (yVal * 1.5)/2;
				
					acc.oCtx.clearRect(0, 0, acc.oCan.width, acc.oCan.height);
					acc.oCtx.drawImage(acc.oImg, acc.xPos, acc.yPos, 50, 50);
					
					acc.preX = xVal;
					acc.preY = yVal;
				}
			},
			createObject: function() {
				var acc = App.feature.accelerometer;
				acc.oCan = document.getElementById('myCanvas');
				acc.oCtx = acc.oCan.getContext("2d");
				acc.oCtx.clearRect(0, 0, acc.oCan.width, acc.oCan.height);
				
				acc.oImg = new Image();
				acc.oImg.src = "css/images/football.png";
		      	
		      	acc.oCan.height = acc.oCan.width;
				acc.xPos = (acc.oCan.width - acc.oImg.width)/2;
		      	acc.yPos = (acc.oCan.height - acc.oImg.height)/2;
			},
			startService: function() {
				console.log("[App.feature.accelerometer.startService]");
				
				var acc = App.feature.accelerometer;
				acc.createObject();
				
				var options = { 
					frequency: 50
				};
				if (!acc.watchID) {
					acc.watchID = navigator.accelerometer.watchAcceleration(acc.showData, App.data.showError, options);
				}
			},
			stopService: function() {
				console.log("[App.feature.accelerometer.stopService]");
				var acc = App.feature.accelerometer;
				
				navigator.accelerometer.clearWatch(acc.watchID);
				acc.watchID = null;
				
				$('#accelerometer-status-bar').html("Device orientation watch stopped...");
		        $('#toogle-accelerometer').html("Start watching");
			},
			toogleAccelerometer: function() {
				var acc = App.feature.accelerometer;
				if (acc.watchID != null) {
					acc.stopService();
				}
				else {
					acc.startService();
		        	$('#toogle-accelerometer').html("Stop watching");
				}
			},
		},
		camera: {
			startService: function() {
				console.log("[App.feature.camera.startService]");
			},
			onPhotoDataSuccess: function(imageData) {
				console.log("[App.feature.camera.onPhotoDataSuccess]");
				
				var imgFrame = document.getElementById('img-frame');
				var iWt = imgFrame.width - 2;
				var iHt = imgFrame.Height - 2;
				var imgPreview = document.getElementById('img-preview');
				
				imgPreview.width = iWt + "px";
				imgPreview.Height = iHt + "px";
				imgPreview.style.display = 'block';
    			imgPreview.style.visibility = 'visible';
				imgPreview.src = "data:image/jpeg;base64," + imageData;
			},		
			onPhotoURISuccess: function(imageURI) {
				console.log("[App.feature.camera.onPhotoURISuccess]");
				var imgPreview = document.getElementById('img-preview');
				imgPreview.style.display = 'block';
    			imgPreview.style.visibility = 'visible';
	    		imgPreview.src = imageURI;
			},
			capturePhoto: function() {
				console.log("[App.feature.camera.capturePhoto]");
				var options = { 
						quality: 50, 
						destinationType: App.camera_destinationType.DATA_URL,
						encodingType: Camera.EncodingType.JPEG,
						targetHeight: 250,
						saveToPhotoAlbum: true
				};
				navigator.camera.getPicture(App.feature.camera.onPhotoDataSuccess, App.data.showError, options);
			},
			openPhotoAlbum: function() {
				console.log("[App.feature.camera.openPhotoAlbum]");
				var options = { 
						quality: 50, 
						destinationType: App.camera_destinationType.FILE_URI,
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
					zIndex: 90,
					optimized: false,
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
					zoom : 14
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
				
				$('#geolocation-status-bar').html("Watching Geolocation...");
				$('#geolocation-details').css("display","block");

				$('#lat').html(lat);
				$('#lng').html(lng);
				$('#alt').html(alt);
				$('#acc').html(acc + 'm');
				
				App.feature.geolocation.showMap(position);
			},
			startService: function() {
				console.log("[App.feature.geolocation.startService]");
				
				var gl = App.feature.geolocation;
				
				if(!App.feature.reachability()){
			        navigator.notification.alert('No internet connection available', null, '', 'OK');
			    }
			    else{
			    	var options = { frequency: 2000, enableHighAccuracy: true };
			    	gl.watchID = navigator.geolocation.watchPosition(gl.showData, App.data.showError, options);
			    }
			},
			stopService: function() {
				var gl = App.feature.geolocation;
				console.log("[App.feature.geolocation.stopService]");
		        
		        navigator.geolocation.clearWatch(gl.watchID);
		        gl.watchID = null;
		        
		        $('#geolocation-status-bar').html("Geolocation watch stopped...");
				$('#toogle-geolocation').html("Start watching");
			},
			toogleGeolocation: function() {
				var gl = App.feature.geolocation;
				
				if (gl.watchID != null) {
					gl.stopService();
				}
				else {
					gl.startService();
					$('#toogle-geolocation').html("Stop watching");
				}
			},
		},
		contacts: {
			showContacts: function(contacts) {
				console.log("[App.feature.contacts.showContacts]");
				
				var txtContactList = "<strong>" + contacts.length + "</strong> contacts found, but showing contacts with phone numbers only.<br/>";
			    
			    for (var i = 0; i < contacts.length ; i++) { 
			        if (contacts[i].phoneNumbers) {
	                	txtContactList += "<br/> [" + (i+1) + "] <strong>" + contacts[i].displayName + "</strong>";
	                	
	                    for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
	                        txtContactList += " : " + contacts[i].phoneNumbers[j].value + "(" + contacts[i].phoneNumbers[j].type + ")";
	                    }
                	}
			    }
			    $('#contact-list').html(txtContactList);
			},
			startService: function() {
				console.log("[App.feature.contacts.startService]");
				
				var contactOptions = new ContactFindOptions();
			    contactOptions.filter = "";
			    contactOptions.multiple = true;
			    
			    var contactfields = ["displayName", "name", "phoneNumbers"];
				navigator.contacts.find(contactfields, App.feature.contacts.showContacts, App.data.showError, contactOptions);
			},
		},
		media: {
			mediaRec: 0,
			
			playbackRecord: function() {
				var mda = App.feature.media;
				
				if (mda.mediaRec) {
			        console.log("Playing Record");
			        $('#media-info').html("Playing record...");
					$('#img-microphone').attr('src','css/images/microphone-not-recording.png');
			        
			        $('#audio-position').css({
				    	"visibility":"hidden",
				    	"display":"none"
					});
					
					$('#playback-rec').css({
				    	"visibility":"hidden",
				    	"display":"none"
					});
			        
			        mda.mediaRec.play();
			    }
			}, 
			recSuccess: function() {
				console.log("Record Success");
			    $('#media-info').html("Recoding finished...");
			    
			    $('#playback-rec').css({
			    	"visibility":"visible",
			    	"display":"block"
				});
			}, 
			recordAudio: function() {
				console.log("Recording started");
			    var src = "myRecording.mp3";
				var mda = App.feature.media;
				
				if (mda.mediaRec) {
			        mda.mediaRec.release();  // help prevent errors
			    }
			    mda.mediaRec = new Media(src, mda.recSuccess, App.data.showError);
				
				mda.mediaRec.startRecord();
				$('#media-info').html("Recording (total 10 sec)...");
				$('#img-microphone').attr('src','css/images/microphone-recording.png');
				
				$('#audio-position').css({
			    	"visibility":"visible",
			    	"display":"block"
				});
				
				var recTime = 0;
				$('#audio-position').html(recTime + " sec");
		        var recInterval = setInterval(function() {
		            recTime = recTime + 1;
		            $('#audio-position').html(recTime + " sec");
		            if (recTime >= 10) {
		                clearInterval(recInterval);
		                mda.mediaRec.stopRecord();
		            }
		        }, 1000);
			},
		},
		storage: {
			db: 0,
			tblName: null,
			tblFields: null,
			tblValues: null,
			
			createTbl: function(tran) {
				var str = App.feature.storage;
				tran.executeSql("DROP TABLE IF EXISTS " + str.tblName);
    			tran.executeSql("CREATE TABLE IF NOT EXISTS " + str.tblName + 
    													 " (" + str.tblFields + ")");
			},
			insertData: function(tran) {
				var str = App.feature.storage;
				tran.executeSql("INSERT INTO " + str.tableName + 
							 			  " (" + str.tblFields + 
							 	  ") VALUES (" + str.tblValues + ")");
			},
			deleteTbl: function(tran) {
				tran.executeSql("DROP TABLE IF EXISTS " + App.feature.storage.tblName);
			},
			createDb: function() {
				if (!App.feature.storage.db) {
			        App.feature.storage.db = window.openDatabase("app_db", "1.0", "TEST DB", 200000);
			    }
			},
			getResultSet: function(tran, results) {
    			if (results.rowsAffected) {
	    			var len = results.rows.length;
	    			console.log("Num. Rows Returned = " + len);
	    			
    				console.log("Last inserted row ID = " + results.insertId);
    				
    				// Show only one record
    				var i = 0; //For showing all data create a loop as => for (var i=0; i<len; i++) {...}
    				console.log("Row = 0" + i + " USERNAME = " + results.rows.item(i).username + ", fullname =  " + results.rows.item(i).fullname);
    				
    				App.display.welcomeNote.UserLoggedIn(results.rows.item(i).username);
    			}
    			else {
				  console.log('No rows affected!');
				  return false;
				}
			},
			selectData: function() {
				if(!App.feature.storage.tblName) {
					App.feature.storage.tblName = "USER";
				}
				tran.executeSql("SELECT * FROM " + App.feature.storage.tblName, [], App.feature.storage.getResultSet, App.data.showError);
			}, 
		},
    },
};
