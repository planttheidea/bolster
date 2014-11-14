/*
 *
 * Copyright 2014 Tony Quetano under the terms of the MIT
 * license found at https://github.com/planttheidea/bolster/MIT_License.txt
 *
 * Bolster.js - An augmentation library for jQuery
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
(function(window,document,$){
	var throwError = function(e){
			throw new Error(e);
		},
		supports = (function(){
			var testElement = {
					audio:document.createElement('audio'),
					canvas:document.createElement('canvas'),
					div:document.createElement('div'),
					input:document.createElement('input'),
					p:document.createElement('p'),
					style:document.createElement('style'),
					video:document.createElement('video')
				},
				newCss3Style = function(prefixArray){
					var support = false;
					
					for(var i = prefixArray.length; i--;){
						if(testElement.div.style[prefixArray[i]] !== 'undefined'){
							support = true;
							break;
						}
					}
					
					return support;
				},
				newCss3Value = function(type,val){
					var curVal = testElement.div.style[type];
					
					testElement.div.style[type] = val;
					
					if(curVal !== testElement.div.style[type]){
						testElement.div.style[type] = '';
						return true;
					} else {
						return false;
					}
				},
				newHtml5Attribute = function(newAttr){
					return (newAttr in testElement.input);
				},
				newHtml5Input = function(newType){
					var curType = testElement.input.type;
					
					testElement.input.type = newType;
					
					if(curType !== testElement.input.type){
						testElement.input.type = 'text';
						return true;
					} else {
						return false;
					}
				},
				pseudoSelectorTest = function(selector){					
					var root = document.documentElement,
						h = (document.head || document.getElementsByTagName('head')[0]),
						sheet = (testElement.style.sheet || testElement.style.styleSheet),
						supportFunc,
						support;
					
					testElement.style.type = 'text/css';
					
					h.appendChild(testElement.style);

					if(!(sheet && selector)){
						return false;
					}
					
					if(cssStylesheet){
						supportFunc = function(selector) {
							sheet.cssText = selector + ' { }';
							
							return ((sheet.cssText.length !== 0) && !(/unknown/i).test(sheet.cssText) && (sheet.cssText.indexOf(selector) === 0));
						}
					} else {
						supportFunc = function(selector) {
							try {
								sheet.insertRule(selector + '{ }', 0);
								sheet.deleteRule(sheet.cssRules.length - 1);
							} catch (e) {
								return false;
							}
							
							return true;
						}
					}

					support = supportFunc(selector);
					
					return support;
				},
				pseudoSelectorInitialize = (function(){
					return pseudoSelectorTest('test');
				})(),
				stylesheetCleanup = function(){
					var h = (document.head || document.getElementsByTagName('head')[0]);
					
					if(h.contains(testElement.style)){
						h.removeChild(testElement.style);
					}
				},
				eventTest = function(eventName,el){
					var el = el || testElement.div
						support = false;
					
					eventName = 'on' + eventName;
					
					support = (eventName in el);
					
					if(!support){
						el.setAttribute(eventName,'return;');
						
						support = ($.type(el[eventName]) === 'function');
						
						el.removeAttribute(eventName);
					}
					
					return support;
				},
				applicationCache = !!(window.applicationCache),
				attachEvent = (function(){					
					return (testElement.div.attachEvent);
				})(),
				audioMP3 = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/mpeg;').replace(/no/,'')),
				audioMP4 = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/mp4;').replace(/no/,'')),
				audioOGG = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/ogg;').replace(/no/,'')),
				boxShadow = (function(){
					return newCss3Style(['boxShadow','MozBoxShadow','WebkitBoxShadow','MsBoxShadow','KhtmlBoxShadow','OBoxShadow']);
				})(),
				canvas = !!(testElement.canvas.getContext && testElement.canvas.getContext('2d')),
				classList = !!(document.documentElement.classList),
				cssAnimation = (function(){
					if(testElement.div.style.animationName) {
						return true;
					} else {
						return newCss3Style(['WebkitAnimationName','MozAnimationName','OAnimationName','msAnimationName','KhtmlAnimationName']);
					}
				})(),
				cssColumn = (function(){
					return newCss3Style(['columnCount','webkitColumnCount','MozColumnCount']);
				})(),
				cssReflection = (function(){
					return newCss3Style(['boxReflect','WebkitBoxRefect']);
				})(),
				cssStylesheet = !!(testElement.style.styleSheet),
				customEvent = !!(window.CustomEvent),
				dragAndDrop = !!('draggable' in testElement.div),
				eventListener = (function(){
					return (testElement.div.addEventListener);
				})(),
				flexbox = (function(){
					return newCss3Value('display','flex');
				})(),
				geolocation = !!('geolocation' in navigator),
				getElementsByClassName = !!(document.getElementsByClassName),
				hashchange = (function(){
					return eventTest('hashchange',window);
				})(),
				history = !!(window.history && window.history.pushState),
				hsla = (function(){
					return newCss3Value('background-color','hsla(0,0%,0%,0)');
				})(),
				indexedDB = (function(){
					var prefixArray = ['webkit','ms','moz'],
						support = false;
					
					if(window.indexedDB && window.IDBTransaction && window.IDBKeyRange){
						support = true;
					} else {
						for(var i = prefixArray.length; i--;){
							if(window[prefixArray[i] + 'IndexedDB'] && window[prefixArray[i] + 'IDBTransaction'] && window[prefixArray[i] + 'IDBKeyRange']){
								support = true;
								break;
							}
						}
					}
					
					return support;
				})(),
				inputAutocomplete = (function(){
					return newHtml5Attribute('autocomplete');
				})(),
				inputAutofocus = (function(){
					return newHtml5Attribute('autofocus');
				})(),
				inputColor = (function(){
					return newHtml5Input('color');
				})(),
				inputDate = (function(){
					return newHtml5Input('date');
				})(),
				inputDateTime = (function(){
					return newHtml5Input('datetime');
				})(),
				inputDateTimeLocal = (function(){
					return newHtml5Input('datetime-local');
				})(),
				inputEmail = (function(){
					return newHtml5Input('email');
				})(),
				inputList = (function(){
					return newHtml5Attribute('list');
				})(),
				inputMax = (function(){
					return newHtml5Attribute('max');
				})(),
				inputMin = (function(){
					return newHtml5Attribute('min');
				})(),
				inputMultiple = (function(){
					return newHtml5Attribute('multiple');
				})(),
				inputMonth = (function(){
					return newHtml5Input('month');
				})(),
				inputNumber = (function(){
					return newHtml5Input('number');
				})(),
				inputPattern = (function(){
					return newHtml5Attribute('pattern');
				})(),
				inputPlaceholder = (function(){
					return newHtml5Attribute('placeholder');
				})(),
				inputRange = (function(){
					return newHtml5Input('range');
				})(),
				inputRequired = (function(){
					return newHtml5Attribute('required');
				})(),
				inputSearch = (function(){
					return newHtml5Input('search');
				})(),
				inputStep = (function(){
					return newHtml5Attribute('step');
				})(),
				inputTel = (function(){
					return newHtml5Input('tel');
				})(),
				inputTime = (function(){
					return newHtml5Input('time');
				})(),
				inputUrl = (function(){
					return newHtml5Input('url');
				})(),
				inputWeek = (function(){
					return newHtml5Input('week');
				})(),
				localStorage = (function(){
					var mod = 'test';
			
					try {
						window.localStorage.setItem(mod,mod);
						window.localStorage.removeItem(mod);
						return true;
					} catch(e){
						return false;
					}
				})(),
				linearGradient = (function(){
					var valueArray = ['linear-gradient','-webkit-linear-gradient','-moz-linear-gradient','-o-linear-gradient'],
						support = false;
					
					for(var i = valueArray.length; i--;){
						if(newCss3Value('background',valueArray[i] + '(-45deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%)')){
							support = true;
							break;
						}
					}
					
					if(!support){
						return newCss3Value('background','-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,0)),to(rgba(0,0,0,1)))');
					} else {					
						return support;
					}
				})(),
				mediaQueries = (function(){
					var mqStyle = document.createElement('style'),
						support = false;
										
					testElement.div.id = 'MediaTest';
					document.body.appendChild(testElement.div);
					
					mqStyle.textContent = '@media screen and (min-width:1px) { #MediaTest { position:absolute; }}';
					document.body.appendChild(mqStyle);
					
					if(window.getComputedStyle && window.getComputedStyle(testElement.div).position == "absolute") {
						support = true;
					}
					
					testElement.div.style = '';
					document.body.removeChild(testElement.div);
					document.body.removeChild(mqStyle);
					
					return support;
				})(),
				pageOffset = (($.type(window.pageXOffset) !== 'undefined') && ($.type(window.pageYOffset) !== 'undefined')),
				postMessage = !!(window.postMessage),
				pseudoActive = (function(){
					return pseudoSelectorTest(':active');
				})(),
				pseudoAfterClass = (function(){
					return pseudoSelectorTest(':after');
				})(),
				pseudoAfterElement = (function(){
					return pseudoSelectorTest('::after');
				})(),
				pseudoBeforeClass = (function(){
					return pseudoSelectorTest(':before');
				})(),
				pseudoBeforeElement = (function(){
					return pseudoSelectorTest('::before');
				})(),
				pseudoFocus = (function(){
					return pseudoSelectorTest(':focus');
				})(),
				pseudoHover = (function(){
					return pseudoSelectorTest(':hover');
				})(),
				pseudoFirstLetter = (function(){
					return pseudoSelectorTest('::first-letter');
				})(),
				pseudoFirstLine = (function(){
					return pseudoSelectorTest('::first-line');
				})(),
				pseudoLink = (function(){
					return pseudoSelectorTest(':link');
				})(),
				pseudoVisited = (function(){
					return pseudoSelectorTest(':visited');
				})(),
				radialGradient = (function(){
					var valueArray = ['radial-gradient','-webkit-radial-gradient','-moz-radial-gradient','-o-radial-gradient'],
						support = false;
					
					for(var i = valueArray.length; i--;){
						if(newCss3Value('background',valueArray[i] + '(rgb(0,0,0) 0%,rgb(255,255,255) 100%)')){
							support = true;
							break;
						}
					}
					
					return (support ? support : newCss3Value('background','-webkit-gradient(radial, center center, 0px, center center, 100%, from(rgb(0,0,0)), to(rgb(255,255,255)))'));
				})(),
				rgba = (function(){
					return newCss3Value('background-color','rgba(0,0,0,0)');
				})(),
				sessionStorage = (function(){
					var mod = 'test';
			
					try {
						window.sessionStorage.setItem(mod,mod);
						window.sessionStorage.removeItem(mod);
						return true;
					} catch(e){
						return false;
					}
				})(),
				smil = !!(document.createElementNS('http://www.w3.org/2000/svg','animateMotion').toString().indexOf('SVG') > -1),
				svg = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect),
				textShadow = (function(){
					return newCss3Style(['textShadow']);
				})(),
				touchEvents = !!(('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints),
				transform2d = (function(){
					return newCss3Style(['transform','webkitTransform','MozTransform','msTransform','OTransform']);
				})(),
				transform3d = (function(){
					if(transform2d){
						var prefixedTransforms = ['transform','webkitTransform','MozTransform','msTransform','OTransform'],
							support = false;
													
						for(var i = prefixedTransforms.length; i--;){
							if(newCss3Value(prefixedTransforms[i],'translate3d(1px,1px,1px)')){
								support = true;
								break;
							}
						}
						
						return support;
					} else {
						return false;
					}
				})(),
				videoMP4 = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/mp4;').replace(/no/,'')),
				videoOGG = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/ogg;').replace(/no/,'')),
				videoWebM = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/webm;').replace(/no/,'')),
				webGL = (function(){
					var support = false;
					
					try {
						testElement.canvas.getContext('webgl');
						support = true;
					} catch(ex) {
						try {
							testElement.getContext('experimental-webgl');
							support = true;
						} catch(ex) {
							support = false;
						}
					}
					
					return support;
				})(),
				webSocket = !!(window.WebSocket && window.WebSocket.prototype.send),
				webSQL = !!(window.openDatabase);
				
			stylesheetCleanup();
				
			function prv_getApplicationCache(){
				return applicationCache;
			}
				
			function prv_getAttachEvent(){
				return attachEvent;
			}
			
			function prv_getAudio(){
				return {
					mp3:audioMP3,
					mp4:audioMP4,
					ogg:audioOGG
				};
			}
			
			function prv_getAudioMP3(){
				return audioMP3;
			}
			
			function prv_getAudioMP4(){
				return audioMP4;
			}
			
			function prv_getAudioOGG(){
				return audioOGG;
			}
				
			function prv_getBoxShadow(){
				return boxShadow;
			}
			
			function prv_getCanvas(){
				return canvas;
			}
			
			function prv_getClassList(){
				return classList;
			}
				
			function prv_getCssAnimation(){
				return cssAnimation;
			}
			
			function prv_getCssColumn(){
				return cssColumn;
			}
			
			function prv_getCssReflection(){
				return cssReflection;
			}
			
			function prv_getCustomEvent(){
				return customEvent;
			}
			
			function prv_getDragAndDrop(){
				return dragAndDrop;
			}
			
			function prv_getEventListener(){
				return eventListener;
			}
			
			function prv_getFlexbox(){
				return flexbox;
			}
			
			function prv_getGeolocation(){
				return geolocation;
			}
			
			function prv_getGetElementsByClassName(){
				return getElementsByClassName;
			}
			
			function prv_getHashchange(){
				return hashchange;
			}
			
			function prv_getHistory(){
				return history;
			}
			
			function prv_getHsla(){
				return hsla;
			}
			
			function prv_getHtml5Attribute(){
				return {
					autocomplete:inputAutocomplete,
					autofocus:inputAutofocus,
					list:inputList,
					max:inputMax,
					min:inputMin,
					multiple:inputMultiple,
					pattern:inputPattern,
					placeholder:inputPlaceholder,
					required:inputRequired,
					step:inputStep
				};
			}
			
			function prv_getHtml5Input(){
				return {
					color:inputColor,
					date:inputDate,
					dateTime:inputDateTime,
					dateTimeLocal:inputDateTimeLocal,
					email:inputEmail,
					month:inputMonth,
					number:inputNumber,
					range:inputRange,
					search:inputSearch,
					tel:inputTel,
					time:inputTime,
					url:inputUrl,
					week:inputWeek
				};
			}
			
			function prv_getIndexedDB(){
				return indexedDB;
			}
			
			function prv_getGradient(){
				return {
					linear:linearGradient,
					radial:radialGradient
				};
			}
			
			function prv_getLinearGradient(){
				return linearGradient;
			}
			
			function prv_getLocalStorage(){
				return localStorage;
			}
			
			function prv_getMediaQueries(){
				return mediaQueries;
			}
			
			function prv_getPageOffset(){
				return pageOffset;
			}
			
			function prv_getPostMessage(){
				return postMessage;
			}
			
			function prv_getPseudoClass(){
				return {
					active:pseudoActive,
					after:pseudoAfterClass,
					before:pseudoBeforeClass,
					focus:pseudoFocus,
					hover:pseudoHover,
					link:pseudoLink,
					visited:pseudoVisited
				};
			}
			
			function prv_getPseudoElement(){
				return {
					after:pseudoAfterElement,
					before:pseudoBeforeElement,
					firstLetter:pseudoFirstLetter,
					firstLine:pseudoFirstLine
				};
			}
			
			function prv_getRadialGradient(){
				return radialGradient;
			}
			
			function prv_getRgba(){
				return rgba;
			}
			
			function prv_getSessionStorage(){
				return sessionStorage;
			}
			
			function prv_getSmil(){
				return smil;
			}
			
			function prv_getStorage(){
				return {
					local:localStorage,
					session:sessionStorage
				};
			}
			
			function prv_getSvg(){
				return svg;
			}
			
			function prv_getTextShadow(){
				return textShadow;
			}
			
			function prv_getTouchEvents(){
				return touchEvents;
			}
			
			function prv_getTransform(){
				return {
					twoD:transform2d,
					threeD:transform3d
				}
			}
			
			function prv_getTransform2d(){
				return transform2d;
			}
			
			function prv_getTransform3d(){
				return transform3d;
			}
			
			function prv_getVideo(){
				return {
					mp4:videoMP4,
					ogg:videoOGG,
					webM:videoWebM
				};
			}
			
			function prv_getVideoMP4(){
				return videoMP4;
			}
			
			function prv_getVideoOGG(){
				return videoOGG;
			}
			
			function prv_getVideoWebM(){
				return videoWebM;
			}
			
			function prv_getWebGL(){
				return webGL;
			}
			
			function prv_getWebSocket(){
				return webSocket;
			}
			
			return {
				applicationCache:prv_getApplicationCache,
				attachEvent:prv_getAttachEvent,
				audio:prv_getAudio,
				audioMP3:prv_getAudioMP3,
				audioMP4:prv_getAudioMP4,
				audioOGG:prv_getAudioOGG,
				boxShadow:prv_getBoxShadow,
				canvas:prv_getCanvas,
				classList:prv_getClassList,
				cssAnimation:prv_getCssAnimation,
				cssColumn:prv_getCssColumn,
				cssReflection:prv_getCssReflection,
				customEvent:prv_getCustomEvent,
				dragAndDrop:prv_getDragAndDrop,
				eventListener:prv_getEventListener,
				flexbox:prv_getFlexbox,
				geolocation:prv_getGeolocation,
				getElementsByClassName:prv_getGetElementsByClassName,
				gradient:prv_getGradient,
				hashchange:prv_getHashchange,
				history:prv_getHistory,
				hsla:prv_getHsla,
				html5Attribute:prv_getHtml5Attribute,
				html5Input:prv_getHtml5Input,
				indexedDB:prv_getIndexedDB,
				linearGradient:prv_getLinearGradient,
				localStorage:prv_getLocalStorage,
				mediaQueries:prv_getMediaQueries,
				pageOffset:prv_getPageOffset,
				postMessage:prv_getPostMessage,
				pseudoClass:prv_getPseudoClass,
				pseudoElement:prv_getPseudoElement,
				radialGradient:prv_getRadialGradient,
				rgba:prv_getRgba,
				sessionStorage:prv_getSessionStorage,
				smil:prv_getSmil,
				storage:prv_getStorage,
				svg:prv_getSvg,
				textShadow:prv_getTextShadow,
				touchEvents:prv_getTouchEvents,
				transform:prv_getTransform,
				transform2d:prv_getTransform2d,
				transform3d:prv_getTransform3d,
				video:prv_getVideo,
				videoMP4:prv_getVideoMP4,
				videoOGG:prv_getVideoOGG,
				videoWebM:prv_getVideoWebM,
				webGL:prv_getWebGL,
				webSocket:prv_getWebSocket
			};
		})(),
		pubsub = (function(){
			var topics = {},
				IDs = {},
				subUid = -1;
				
			function prv_getID(idObj){
				return IDs[idObj.name];
			}
			
			function prv_publish(publishObj){
				var data = (publishObj.data || {}),
					subscribers,
					len;
				
				if(!topics[publishObj.topic]){
					return false;
				}
				
				subscribers = topics[publishObj.topic];
				len = (subscribers ? subscribers.length : 0);
					
				while(len--){
					subscribers[len].func(data,publishObj.topic);
				}
			}
			
			function prv_unsubscribe(unsubscribeObj){
				var token = IDs[subscribeObj.name];
				
				if(token > 0){
					for(var m in topics){
						if(topics[m]){
							for (var i = topics[m].length; i--;) {			
								if(topics[m][i].token === token){
									delete IDs[unsubscribeObj.name];									
									topics[m].splice(i,1);
								}
							}
						}
					}
				}
				
				return this;
			}
			
			function prv_subscribe(subscribeObj){			
				if(IDs[subscribeObj.name]){
					prv_unsubscribe(subscribeObj);
				}
				
				subscribeObj.token = (++subUid);
				
				switch($.type(subscribeObj.topic)){
					case 'string':
						if($.type(topics[subscribeObj.topic]) !== 'array'){
							topics[subscribeObj.topic] = [];
						}
					
						topics[subscribeObj.topic].push({
							token:subscribeObj.token,
							func:subscribeObj.fn
						});
						
						break;
					case 'array':					
						for(var i = subscribeObj.topic.length; i--;){
							if($.type(topics[subscribeObj.topic[i]]) !== 'array'){
								topics[subscribeObj.topic[i]] = [];
							}
							
							topics[subscribeObj.topic[i]].push({
								token:subscribeObj.token,
								func:subscribeObj.fn
							});
						};
						
						break;
					case 'undefined':
						throwError('Must provide a topic to subscribe to; aborting processing.');
						
						break;
					default:
						throwError('Invalid topic type, must be either string or array; aborting processing.');		
										
						break;
				}
				
				IDs[subscribeObj.name] = subscribeObj.token;
				
				return subscribeObj.token;
			}
			
			return {
				getID:prv_getID,
				publish:prv_publish,
				subscribe:prv_subscribe,
				unsubscribe:prv_unsubscribe
			};
		})(),
		win = (function(){
			var $window = $(window),
				h = $window.height(),
				w = $window.width(),
				t = $window.scrollTop();
			
			function prv_getWidth(){
				return w;
			}
			
			function prv_getHeight(){
				return h;
			}
			
			function prv_getScrollTop(){
				return t;
			}
			
			function prv_getDimensions(){
				return {
					width:w,
					height:h
				};
			}
			
			function prv_setDimensions(){
				h = $window.height();
				w = $window.width();
				
				pubsub.publish({
					topic:'windowSize',
					data:{
						width:w,
						height:h
					}
				});
			}
			
			function prv_setScrollTop(){
				t = $window.scrollTop();
				
				pubsub.publish({
					topic:'windowScroll',
					data:{
						scrollTop:t
					}
				});
			}
			
			$window
				.off('.jQueryPlus.setWindowAttributes')
				.on({
					'load.jQueryPlus.setWindowDimensions resize.jQueryPlus.setWindowDimensions':prv_setDimensions,
					'scroll.jQueryPlus.setWindowDimensions':prv_setScrollTop
				});
			
			return {
				dimensions:prv_getDimensions,
				height:prv_getHeight,
				scrollTop:prv_getScrollTop,
				width:prv_getWidth
			};
		})(),
		pledge = (function(){
			var errors = {
					badParam:'Parameter passed is not a valid type for this method.',
					testFailed:'Test did not pass.'
				},
				Pledge = function(){
					this.init = function(){
						this.resolved = {};
						this.rejected = {};
						
						this.puid = -1;
						this.cuid = -1;
					};
					
					this.resolve = function(data){
						this.cuid++;

						if(this.resolved[this.cuid]){
							this.resolved[this.cuid].call(this,data);
						}
					};

					this.reject = function(e){	
						this.cuid++;

						if(this.rejected[this.cuid]){
							this.rejected[this.cuid].call(this,e);
						}
					};

					this.push = function(onResolution, onRejection){
						this.puid++;

						if($.type(onResolution) === 'function'){
							this.resolved[this.puid] = onResolution;
						} else {
							this.resolved[this.puid] = undefined;
						}

						if($.type(onRejection) === 'function'){
							this.rejected[this.puid] = onRejection;
						} else {
							this.rejected[this.puid] = function(e){
								throwError('Rejected: ' + (e || ''));
							};
						}
					};
					
					this.init();
					
					return this;
				},
				Postpone = function(){
					var self = this;
					
					this.resolve = function(resolutionData){
						this.resolvePostpone = true;
						this.resolveData = resolutionData;
					};
					
					this.reject = function(rejectionData){
						this.rejectPostpone = true;
						this.rejectData = rejectionData;
					};
					
					this.pledge = function(){
						return (new Pledge()).start(function(){
							var p = this;
							
							if(self.resolvePostpone) {
								p.resolve(self.resolveData);
							} else if(self.rejectPostpone) {
								p.reject(self.rejectData);
							}
						});
					};
				};
				
			Pledge.prototype = {
				complete:function(onResolution,onRejection){
					this.push(onResolution, onRejection);
				},
				consecutive:function(onResolutions,onRejections){
					var isArray = ($.type(onRejections) === 'array'),
						len = onResolutions.length;
					
					for(var i = 0, len = onResolutions.length; i < len; i++){
						if(isArray){
							this.push(onResolutions[i], onRejections[i]);
						} else {
							this.push(onResolutions[i], onRejections);
						}
					}
						
					return this;
				},
				concurrent:function(onResolutions,onRejection){
					if(($.type(onRejection) === 'undefined') || ($.type(onRejection) === 'function')){
						var len = onResolutions.length,
							finished = [];
						
						function newPledge(fn,self,data){                        
							(new Pledge()).start(function(){
								fn.call(this,data);
							}).complete(function(newData){
								finished.push(newData);
								
								if(finished.length === len){
									self.resolve(finished);
								}
							});
						}
						
						return this.proceed(function(data){
							for(var i = onResolutions.length; i--;){
								newPledge(onResolutions[i],this,data);
							}
						},onRejection);
					} else {
						this.init();
						throwError(errors.badParam);
					}
				},
				proceed:function(onResolution,onRejection){
					this.push(onResolution, onRejection);     
					return this;
				},
				start:function(fn){
					if($.type(fn) === 'function'){
						var self = this;
						
						window.setTimeout(function(){
							fn.call(self);
						},0);
						
						return self;
					}
				},
				wait:function(delay,test){
					var self = this,
						testResult;
						
					if(!delay){
						throwError('Value of delay must be provided.');
					}
					
					switch($.type(test)){
						case 'boolean':
							testResult = test;
							break;
						case 'function':
							testResult = test();
							break;
						default:
							testResult = true;
							break;
					}
					
					return self.proceed(function(data){
						window.setTimeout(function(){
							if(testResult){
								self.resolve.call(self,data);
							} else {
								self.reject.call(self,errors.testFailed);
							}
						},delay);
					});
				}
			};
			
			$.extend({
				pledge:function(fn){
					if($.type(fn) === 'function'){
						return (new Pledge()).start(fn);
					} else {
						throwError(errors.badParam);
					}
				},
				postpone:function(){
					return new Postpone();
				}
			});
		})(),
		helpFuncs = {
			loadImg:function(self,i,len,callback){
				if($.type(callback) === 'function'){
					var img = new Image();
					
					img.src = self.src;
					
					if(self.complete || (self.readyState === 4) || (self.readyState === 'complete')){
						callback.apply(self,[Math.floor(((i + 1) * 100) / len)]);
					} else {
						$(self)
							.one('load',function(e){
								callback.apply(self,[Math.floor(((i + 1) * 100) / len)]);
							})
							.attr({
								src:self.src
							});
					}
				}
			}
		};
		
	$.extend({
		publish:function(publishObj){
			return pubsub.publish(publishObj);
		},
		subscribe:function(subscribeObj){
			return pubsub.subscribe(subscribeObj);
		},
		supports:function(feature){
			return supports[feature]();
		},
		unsubscribe:function(unsubscribeObj){
			return pubsub.unsubscribe(unsubscribeObj);
		},
		window:function(attribute){
			return win[attribute]();
		}
	});
	
	$.fn.extend({
		active:function(cls){
			cls = cls || 'active';
			
			return this.hasClass(cls);
		},
		activate:function(cls,parent){
			cls = cls || 'active';
			
			if(parent){
				return this
					.deactivate(cls,parent)
					.addClass(cls);
			} else {
				return this
					.deactivate(cls)
					.addClass(cls);
			}
		},
		deactivate:function(cls,parent){
			var $self = this;
			
			cls = cls || 'active';
			
			if(parent){
				$self
					.parents(parent)
					.find('.' + cls)
					.removeClass(cls);
			} else {
				$self
					.parent()
					.find('.' + cls)
					.removeClass(cls);
			}
			
			return $self;
		},
		imgLoad:function(callback,delay){
			var len = this.length;
		
			if(delay && (delay > 0)){
				return this.each(function(i){
					var self = this;
					
					window.setTimeout(function(){					
						pluginFuncs.loadImg(self,i,len,callback);
					},(delay * i));
				});
			} else {
				return this.each(function(i){
					pluginFuncs.loadImg(this,i,len,callback);
				});
			}
		},
		unselectable:function(allowChildren){
			var $nodes = (allowChildren ? this : this.add($self.find('*')));
			
			$nodes
				.attr({
					unselectable:'on'
				})
				.css({
					'-webkit-touch-callout':'none',
					'-webkit-user-select':'none',
					'-khtml-user-select':'none',
					'-moz-user-select':'none',
					'-ms-user-select':'none',
					'user-select':'none'
				});
			
			return this;
		},
		unstyle:function(styles){
			switch($.type(styles)){
				case 'string':
					return this.css(styles,'');
					break;
				case 'array':
					var styleObj = {};
					
					for(var i = styles.length; i--;){
						styleObj[styles[i]] = '';
					}
					
					return this.css(styleObj);
					
					break;
				case 'undefined':
					return this.removeAttr('style');
					
					break;
				default:
					throwwError('Parameter passed in is not of appropriate type; processing aborted.');
					
					return this;
					
					break;
			}
			
		}
	});
})(window,document,jQuery);
