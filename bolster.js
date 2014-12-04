/*
 *
 * Copyright 2014 Tony Quetano under the terms of the MIT
 * license found at https://github.com/planttheidea/bolster/MIT_License.txt
 *
 * bolster.js - An augmentation library for jQuery
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
(function(window,document,$){
	// universal error-throwing function
	var throwError = function(e){
			throw new Error(e);
		},
		// build module for $.supports()
		supports = (function(){
			// elements to be used in testing functionality
			var testElement = {
					audio:document.createElement('audio'),
					canvas:document.createElement('canvas'),
					document:(document.documentElement || document.body),
					div:document.createElement('div'),
					input:document.createElement('input'),
					p:document.createElement('p'),
					style:document.createElement('style'),
					video:document.createElement('video')
				},
				// test if new CSS property is supported
				newCss3Property = function(prefixArray){
					try {
						var support = false;
						
						for(var i = prefixArray.length; i--;){
							if(prefixArray[i] in testElement.document.style){
								support = true;
								break;
							}
						}
						
						return support;
					} catch(ex) {
						return false;
					}
				},
				// test if new value for existing CSS property is supported
				newCss3Value = function(type,val){
					try {
						var curVal = testElement.div.style[type];
						
						testElement.div.style[type] = val;
						
						if(curVal !== testElement.div.style[type]){
							testElement.div.style[type] = '';
							return true;
						} else {
							return false;
						}
					} catch(ex) {
						return false;
					}
				},
				// tests if new attribute for existing HTML element is supported
				newHtml5Attribute = function(newAttr){
					return (newAttr in testElement.input);
				},
				// tests if new type of input HTML element is supported
				newHtml5Input = function(newType){
					try {
						var curType = testElement.input.type;
						
						testElement.input.type = newType;
					
						if(curType !== testElement.input.type){
							testElement.input.type = 'text';
							return true;
						} else {
							return false;
						}
					} catch(ex) {
						return false;
					}
				},
				// function to test if new pseudo-class or pseudo-element is supported
				pseudoSelectorTest = function(selector){
					try {
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
					} catch(ex) {
						return false;
					}
				},
				// initializes pseudo selector test, necessary to avoid invalid returns of false
				pseudoSelectorInitialize = (function(){
					return pseudoSelectorTest('test');
				})(),
				// removes stylesheet added for testing on page
				stylesheetCleanup = function(){
					var h = (document.head || document.getElementsByTagName('head')[0]);
					
					if(h.contains(testElement.style)){
						h.removeChild(testElement.style);
					}
				},
				// tests if event is supported
				eventTest = function(eventName,el){
					try {
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
					} catch(ex) {
						return false;
					}
				},
				//HTML5 Application Cache
				applicationCache = !!(window.applicationCache),
				// legacy IE attachEvent for event binding
				attachEvent = (function(){					
					return (testElement.div.attachEvent);
				})(),
				// HTML5 audio element
				audio = !!(testElement.audio.canPlayType),
				// and each specific adio format
				audioMP3 = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/mpeg;').replace(/no/,'')),
				audioMP4 = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/mp4;').replace(/no/,'')),
				audioOGG = !!(testElement.audio.canPlayType && testElement.audio.canPlayType('audio/ogg;').replace(/no/,'')),
				// CSS3 box-shadow property, with prefixes
				boxShadow = (function(){
					return newCss3Property(['boxShadow','MozBoxShadow','WebkitBoxShadow','MsBoxShadow','KhtmlBoxShadow','OBoxShadow']);
				})(),
				// HTML5 canvas element
				canvas = !!(testElement.canvas.getContext && testElement.canvas.getContext('2d')),
				// classList API
				classList = !!(document.documentElement.classList),
				// CSS3 animation
				cssAnimation = (function(){
					if(testElement.div.style.animationName) {
						return true;
					} else {
						return newCss3Property(['WebkitAnimationName','MozAnimationName','OAnimationName','msAnimationName','KhtmlAnimationName']);
					}
				})(),
				// dimensions based on CSS3 calc()
				cssCalc = (function(){
					return newCss3Value('width','calc(100% - 10px)');
				})(),
				// CSS3 columns
				cssColumn = (function(){
					return newCss3Property(['columnCount','webkitColumnCount','MozColumnCount']);
				})(),
				// Reflection of elements
				cssReflection = (function(){
					return newCss3Property(['boxReflect','WebkitBoxRefect']);
				})(),
				// HTML5 styleSheet API
				cssStylesheet = !!(testElement.style.styleSheet),
				// HTML5 CustomEvent
				customEvent = !!(window.CustomEvent),
				// HTML5 draggable / droppable attribute
				dragAndDrop = !!('draggable' in testElement.div),
				// HTML5 eventListener for event binding
				eventListener = (function(){
					return (testElement.div.addEventListener);
				})(),
				// CSS3 display property value of flex
				flexbox = (function(){
					return newCss3Value('display','flex');
				})(),
				// HTML5 geolocation API
				geolocation = !!('geolocation' in navigator),
				// getBoundingClientRect API
				getBoundingClientRect = (function(){
					return (document.documentElement || document.body).getBoundingClientRect;
				})(),
				// getElementsByClassName API
				getElementsByClassName = !!(document.getElementsByClassName),
				// HTML5 hashchange event
				hashchange = (function(){
					return eventTest('hashchange',window);
				})(),
				// HTML5 History API
				history = !!(window.history && window.history.pushState),
				// CSS3 hsla color values
				hsla = (function(){
					return newCss3Value('background-color','hsla(0,0%,0%,0)');
				})(),
				// HTML IndexedDB API
				indexedDB = (function(){
					try {
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
					} catch(ex) {
						return false;
					}
				})(),
				// HTML5 autocomplete attribute on input
				inputAutocomplete = (function(){
					return newHtml5Attribute('autocomplete');
				})(),
				// HTML5 autofocus attribute on input
				inputAutofocus = (function(){
					return newHtml5Attribute('autofocus');
				})(),
				// HTML5 color input type
				inputColor = (function(){
					return newHtml5Input('color');
				})(),
				// HTML5 date input type
				inputDate = (function(){
					return newHtml5Input('date');
				})(),
				// HTML5 datetime input type
				inputDateTime = (function(){
					return newHtml5Input('datetime');
				})(),
				// HTML5 datetime-local input type
				inputDateTimeLocal = (function(){
					return newHtml5Input('datetime-local');
				})(),
				// HTML5 email input type
				inputEmail = (function(){
					return newHtml5Input('email');
				})(),
				// HTML5 list attribute on input
				inputList = (function(){
					return newHtml5Attribute('list');
				})(),
				// HTML5 max attribute on input
				inputMax = (function(){
					return newHtml5Attribute('max');
				})(),
				// HTML5 min attribute on input
				inputMin = (function(){
					return newHtml5Attribute('min');
				})(),
				// HTML5 multiple attribute on input
				inputMultiple = (function(){
					return newHtml5Attribute('multiple');
				})(),
				// HTML5 month input type
				inputMonth = (function(){
					return newHtml5Input('month');
				})(),
				// HTML5 number input type
				inputNumber = (function(){
					return newHtml5Input('number');
				})(),
				// HTML5 pattern attribute on input
				inputPattern = (function(){
					return newHtml5Attribute('pattern');
				})(),
				// HTML5 placeholder attribute on input
				inputPlaceholder = (function(){
					return newHtml5Attribute('placeholder');
				})(),
				// HTML5 range input type
				inputRange = (function(){
					return newHtml5Input('range');
				})(),
				// HTML5 required attribute on input
				inputRequired = (function(){
					return newHtml5Attribute('required');
				})(),
				// HTML5 search input type
				inputSearch = (function(){
					return newHtml5Input('search');
				})(),
				// HTML5 step attribute on input
				inputStep = (function(){
					return newHtml5Attribute('step');
				})(),
				// HTML5 tel input type
				inputTel = (function(){
					return newHtml5Input('tel');
				})(),
				// HTML5 time input type
				inputTime = (function(){
					return newHtml5Input('time');
				})(),
				// HTML5 url input type
				inputUrl = (function(){
					return newHtml5Input('url');
				})(),
				// HTML5 week input type
				inputWeek = (function(){
					return newHtml5Input('week');
				})(),
				// JSON functions like .parse() and .stringify()
				json = !!(JSON && ($.type(JSON.parse) === 'function')),
				// HTML5 localStorage API
				localStorage = (function(){
					try {
						window.localStorage.setItem('test','test');
						window.localStorage.removeItem('test');
						return true;
					} catch(e){
						return false;
					}
				})(),
				// CSS3 linear gradient values for background-image property
				linearGradient = (function(){
					try {
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
					} catch(ex) {
						return false;
					}
				})(),
				// CSS3 @media support for stylesheets based on size of window
				mediaQueries = (function(){
					try {
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
					} catch(ex) {
						return false;
					}
				})(),
				// CSS3 opacity property
				opacity = (function(){
					return newCss3Property(['opacity']);
				})(),
				// HTML5 pageXOffset and pageYOffset APIs
				pageOffset = (($.type(window.pageXOffset) !== 'undefined') && ($.type(window.pageYOffset) !== 'undefined')),
				// HTML5 postMessage API
				postMessage = !!(window.postMessage),
				// CSS3 support for :active psuedo-selector
				pseudoActive = (function(){
					return pseudoSelectorTest(':active');
				})(),
				// CSS3 support for ::after psuedo-class
				pseudoAfterClass = (function(){
					return pseudoSelectorTest(':after');
				})(),
				// CSS3 support for ::after psuedo-element
				pseudoAfterElement = (function(){
					return pseudoSelectorTest('::after');
				})(),
				// CSS3 support for :before psuedo-class
				pseudoBeforeClass = (function(){
					return pseudoSelectorTest(':before');
				})(),
				// CSS3 support for ::before psuedo-element
				pseudoBeforeElement = (function(){
					return pseudoSelectorTest('::before');
				})(),
				// CSS3 support for :focus psuedo-class
				pseudoFocus = (function(){
					return pseudoSelectorTest(':focus');
				})(),
				// CSS3 support for :hover psuedo-class
				pseudoHover = (function(){
					return pseudoSelectorTest(':hover');
				})(),
				// CSS3 support for ::first-letter psuedo-element
				pseudoFirstLetter = (function(){
					return pseudoSelectorTest('::first-letter');
				})(),
				// CSS3 support for ::first-line psuedo-element
				pseudoFirstLine = (function(){
					return pseudoSelectorTest('::first-line');
				})(),
				// CSS3 support for :link psuedo-class
				pseudoLink = (function(){
					return pseudoSelectorTest(':link');
				})(),
				// CSS3 support for :visited psuedo-class
				pseudoVisited = (function(){
					return pseudoSelectorTest(':visited');
				})(),
				// CSS3 radial gradient values for background-image property
				radialGradient = (function(){
					try {
						var valueArray = ['radial-gradient','-webkit-radial-gradient','-moz-radial-gradient','-o-radial-gradient'],
							support = false;
						
						for(var i = valueArray.length; i--;){
							if(newCss3Value('background',valueArray[i] + '(rgb(0,0,0) 0%,rgb(255,255,255) 100%)')){
								support = true;
								break;
							}
						}
						
						return (support ? support : newCss3Value('background','-webkit-gradient(radial, center center, 0px, center center, 100%, from(rgb(0,0,0)), to(rgb(255,255,255)))'));
					} catch(ex) {
						return false;
					}
				})(),
				// CSS3 rgba color values
				rgba = (function(){
					return newCss3Value('background-color','rgba(0,0,0,0)');
				})(),
				// HTML5 sessionStorage API
				sessionStorage = (function(){
					try {
						window.sessionStorage.setItem('test','test');
						window.sessionStorage.removeItem('test');
						return true;
					} catch(e){
						return false;
					}
				})(),
				// HTML5 SMIL API
				smil = !!(document.createElementNS && (document.createElementNS('http://www.w3.org/2000/svg','animateMotion').toString().indexOf('SVG') > -1)),
				// HTML5 svg element
				svg = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect),
				// CSS3 text-shadow property
				textShadow = (function(){
					return newCss3Property(['textShadow']);
				})(),
				// HTML5 touch events
				touchEvents = !!(('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints),
				// CSS3 2D transforms
				transform2d = (function(){
					return newCss3Property(['transform','WebkitTransform','MozTransform','msTransform','OTransform']);
				})(),
				// CSS3 3D transforms
				transform3d = (function(){
					if(transform2d){
						try {
							var prefixedTransforms = ['transform','WebkitTransform','MozTransform','msTransform','OTransform'],
								support = false;
														
							for(var i = prefixedTransforms.length; i--;){
								if(newCss3Value(prefixedTransforms[i],'translate3d(1px,1px,1px)')){
									support = true;
									break;
								}
							}
							
							return support;
						} catch(ex) {
							return false;
						}
					} else {
						return false;
					}
				})(),
				transition = (function(){
					return newCss3Property(['transition','WebkitTransition','MozTransition','OTransition']);
				})(),
				// HTML5 video element
				video = !!(testElement.video.canPlayType),
				// and each specific video format
				videoMP4 = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/mp4;').replace(/no/,'')),
				videoOGG = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/ogg;').replace(/no/,'')),
				videoWebM = !!(testElement.video.canPlayType && testElement.video.canPlayType('video/webm;').replace(/no/,'')),
				// HTML4 webgl (3D canvas)
				webGL = (function(){
					try {
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
					} catch(ex) {
						return false;
					}
				})(),
				// HTML5 Web Socket API
				webSocket = !!(window.WebSocket && window.WebSocket.prototype.send),
				// HTML5 Web SQL API (now deprecated)
				webSQL = !!(window.openDatabase);
				
			stylesheetCleanup();
			
			/*
			 * functions below are to retrieve all values from the module
			 * objects that return an object with multiple properties also have
			 * a separate function to retrieve that one property; the consolidated
			 * object exists in case multiple types of the same test are needed
			 */
			
			function prv_getApplicationCache(){
				return applicationCache;
			}
				
			function prv_getAttachEvent(){
				return attachEvent;
			}
			
			function prv_getAudio(){
				return audio;
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
			
			function prv_getCssCalc(){
				return cssCalc;
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
			
			function prv_getGetBoundingClientRect(){
				return getBoundingClientRect;
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
			
			function prv_getJson(){
				return json;
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
			
			function prv_getOpacity(){
				return opacity;
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
			
			function prv_getTransition(){
				return transition;
			}
			
			function prv_getVideo(){
				return video;
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
			
			// API for all above functions
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
				cssCalc:prv_getCssCalc,
				cssColumn:prv_getCssColumn,
				cssReflection:prv_getCssReflection,
				customEvent:prv_getCustomEvent,
				dragAndDrop:prv_getDragAndDrop,
				eventListener:prv_getEventListener,
				flexbox:prv_getFlexbox,
				geolocation:prv_getGeolocation,
				getBoundingClientRect:prv_getGetBoundingClientRect,
				getElementsByClassName:prv_getGetElementsByClassName,
				gradient:prv_getGradient,
				hashchange:prv_getHashchange,
				history:prv_getHistory,
				hsla:prv_getHsla,
				html5Attribute:prv_getHtml5Attribute,
				html5Input:prv_getHtml5Input,
				indexedDB:prv_getIndexedDB,
				json:prv_getJson,
				linearGradient:prv_getLinearGradient,
				localStorage:prv_getLocalStorage,
				mediaQueries:prv_getMediaQueries,
				opacity:prv_getOpacity,
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
				transition:prv_getTransition,
				video:prv_getVideo,
				videoMP4:prv_getVideoMP4,
				videoOGG:prv_getVideoOGG,
				videoWebM:prv_getVideoWebM,
				webGL:prv_getWebGL,
				webSocket:prv_getWebSocket
			};
		})(),
		// build module for $.publish(), $.subscribe(), and $.unsubscribe()
		pubsub = (function(){
			var topics = {},
				IDs = {},
				subUid = -1;
			
			// function to retrieve internal ID assigned to subscription
			function prv_getID(idObj){
				return IDs[idObj.name];
			}
			
			// publishes event, with data and topic as arguments
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
				
				return this;
			}
			
			/* 
			 * performs unsubscription (abstracted for different types of names
			 * passed into API function
			 */
			function prv_unsubscribeName(name){
				if(IDs[name] > 0){
					for(var m in topics){
						if(topics[m]){
							for (var i = topics[m].length; i--;) {
								if(topics[m][i].token === IDs[name]){
									delete IDs[name];
									
									topics[m].splice(i,1);
								}
							}
						}
					}
				}
			}
			
			// API access, calls prv_unsubscribeName differently depending on type
			function prv_unsubscribe(unsubscribeObj){
				switch($.type(unsubscribeObj.name)){
					case 'string':
						prv_unsubscribeName(unsubscribeObj.name);
						
						break;
					case 'array':
						for(var i = unsubscribeObj.name.length; i--;){
							prv_unsubscribeName(unsubscribeObj.name[i]);
						}
						
						break;
					default:
						throwError('Name passed is not of valid type.');
						break;
				}
				
				return this;
			}
			
			// performs subscription (abstrated for the same reason as above unsubscription)
			function prv_subscribeTopic(topic,fn,once,name,newToken){
				if($.type(topics[topic]) !== 'array'){
					topics[topic] = [];
				}
				
				if(once){
					fn = function(){
						fn.call();
						prv_unsubscribeName(name);
					};
				}
			
				topics[topic].push({
					token:newToken,
					func:fn
				});
			}
			
			/*
			 * unsubscribes name if subscription already exists, then subscribes
			 * to the topics provided
			 */
			function prv_subscribe(subscribeObj){
				// throws an error if the name passed is not a string
				if($.type(subscribeObj.name) !== 'string'){
					throwError('Name passed is not a string.');
					return false;
				}
				
				// unsubscribes from topic if subscription already exists
				if(IDs[subscribeObj.name]){
					prv_unsubscribeName(subscribeObj.name);
				}
				
				// assigns new ID
				IDs[subscribeObj.name] = (++subUid);
				
				// subscriptions called differently depending on typ
				switch($.type(subscribeObj.topic)){
					case 'string':
						prv_subscribeTopic(subscribeObj.topic,subscribeObj.fn,subscribeObj.once,subscribeObj.name,IDs[subscribeObj.name]);

						break;
					case 'array':					
						for(var i = subscribeObj.topic.length; i--;){
							prv_subscribeTopic(subscribeObj.topic[i],subscribeObj.fn,subscribeObj.once,subscribeObj.name,IDs[subscribeObj.name]);
						};
						
						break;
					case 'undefined':
						throwError('Must provide a topic to subscribe to.');
						
						break;
					default:
						throwError('Invalid topic type, must be either string or array.');		
										
						break;
				}
				
				return this;
			}
			
			// API to perform actions
			return {
				getID:prv_getID,
				publish:prv_publish,
				subscribe:prv_subscribe,
				unsubscribe:prv_unsubscribe
			};
		})(),
		// build module for $.window()
		win = (function(){
			// cache window object
			var $window = $(window),
				// initial window attributes
				h = $window.height(),
				w = $window.width(),
				t = $window.scrollTop(),
				// video element used for fullscreen testing
				video = document.createElement('video'),
				// get prefix-specific fullscreen API functions
				fullscreen = (function(){
					// proper Fullscreen API support
					if(video.requestFullScreen){
						return {
							active:function(){
								return (document.fullscreenElement !== null);
							},
							element:function(){
								return document.fullscreenElement;
							},
							enter:function(el){
								el.requestFullscreen();
							},
							exit:function(){
								document.exitFullscreen();
							}
						};
					// legacy Webkit prefixed support
					} else if(video.webkitRequestFullscreen){
						return {
							active:function(){
								return (document.webkitFullscreenElement !== null);
							},
							element:function(){
								return document.webkitFullscreenElement;
							},
							enter:function(el){
								el.webkitRequestFullscreen();
							},
							exit:function(){
								document.webkitExitFullscreen();
							}
						};
					// legacy Mozilla prefixed support
					} else if(video.mozRequestFullScreen){
						return {
							active:function(){
								return (document.mozFullScreenElement !== null);
							},
							element:function(){
								return document.mozFullScreenElement;
							},
							enter:function(el){
								el.mozRequestFullScreen();
							},
							exit:function(){
								document.mozCancelFullScreen();
							}
						};
					// legacy Microsoft prefixed support
					} else if(video.msRequestFullscreen){
						return {
							active:function(){
								return (document.msFullscreenElement !== null);
							},
							element:function(){
								return document.msFullscreenElement;
							},
							enter:function(el){
								el.msRequestFullscreen();
							},
							exit:function(){
								document.msExitFullscreen();
							}
						};
					// no support at all
					} else {
						return {
							active:function(){
								return false;
							},
							element:function(){
								return undefined;
							},
							enter:function(){
								throwError('Fullscreen API is not supported.');
							},
							exit:function(){
								throwError('Fullscreen API is not supported.');
							}
						};
					}
				})(),
				// initial fullscreen values
				f = fullscreen.element(),
				a = fullscreen.active(),
				/*
				 * retrieve page without full pathing, which
				 * is different depending on whether lastIndexOf
				 * is supported by the browser
				 */
				getPage = (function(){
					if(!Array.prototype.lastIndexOf){
						return function(pg){
							var url = pg.split('/');									
							return url[url.length-1].split('#')[0].split('?')[0];
						};
					} else {
						return function(pg){
							return pg.substring(pg.lastIndexOf('/')+1).split('#')[0].split('?')[0];
						}
					}
				})(),
				hr = window.location.href,
				p = getPage(hr),
				ha = window.location.hash.replace('#',''),
				hn = (window.location.hostname || window.location.host),
				setQs = function(){
					var qsArray = window.location.search.substr(1).split('&'),
						qsObj = {};
					
					for(var i = 0, len = qsArray.length; i < len; i++){
						var q = qsArray[i].split('=');
							if(q[0].length > 0){
								qsObj[q[0]] = q[1];
							}
					}
					
					return qsObj;
				},
				qs = setQs();
			
			// functions to access above values / functions through API
			function prv_fullscreenEnter(el){
				return fullscreen.enter(el);
			}
				
			function prv_fullscreenExit(){
				return fullscreen.exit();
			}
			
			function prv_getAttributes(e){
				return {
					fullscreenActive:a,
					fullscreenElement:f,
					hash:ha,
					height:h,
					hostname:hn,
					href:hr,
					page:p,
					querystring:qs,
					scrollTop:t,
					width:w
				};
			}
			
			function prv_getDimensions(){
				return {
					width:w,
					height:h
				};
			}
				
			function prv_getFullscreenElement(){
				return f;
			}
			
			function prv_getHash(){
				return ha;
			}
			
			function prv_getHeight(){
				return h;
			}
			
			function prv_getHostname(){
				return hn;
			}
			
			function prv_getHref(){
				return hr;
			}
			
			function prv_getPage(pg){
				return (pg ? getPage(pg) : p);
			}
			
			function prv_getQueryString(){
				return qs;
			}
			
			function prv_getScrollTop(){
				return t;
			}
			
			function prv_getWidth(){
				return w;
			}
				
			function prv_getWindow(){
				return $window;
			}
				
			function prv_isFullscreenActive(){
				return a;
			}
			
			function prv_setDimensions(){
				h = $window.height();
				w = $window.width();
				
				// publish new dimensions on resize
				pubsub.publish({
					topic:'windowResize',
					data:{
						height:h,
						width:w
					}
				});
			}
			
			function prv_setFullscreenElement(){
				f = fullscreen.element();
				a = fullscreen.active();
				
				// publish new fullscreen attributes on change
				pubsub.publish({
					topic:'fullscreenChange',
					data:{
						fullscreenActive:a,
						fullscreenElement:f
					}
				});
			}
			
			function prv_setHash(){
				ha = window.location.hash.replace('#','');
			}
			
			function prv_setHref(){
				hr = window.location.href;
			}
			
			function prv_setPage(){
				p = getPage(window.location.href);
			}
			
			function prv_setQueryString(){
				setQs();
			}
			
			function prv_setScrollTop(){
				t = $window.scrollTop();
				
				// publish new scrollTop on scroll
				pubsub.publish({
					topic:'windowScroll',
					data:{
						scrollTop:t
					}
				});
			}
			
			// establish initial publishing events for window activities
			$window
				.off('.bolster.setWindowAttributes')
				.on({
					'webkitfullscreenchange.bolster.setWindowAttributes mozfullscreenchange.bolster.setWindowAttributes fullscreenchange.bolster.setWindowAttributes MSFullscreenChange.bolster.setWindowAttributes':prv_setFullscreenElement,
					'load.bolster.setWindowAttributes':function(e){
						// publish all window attributes on load
						pubsub.publish({
							topic:'windowLoad',
							data:prv_getAttributes(e)
						});
					},
					'hashchange.bolster.setWindowAttributes':prv_setHash,
					'resize.bolster.setWindowAttributes':prv_setDimensions,
					'popstate.bolster.setWindowAttributes':function(e){
						// publish new attributes onpopstate
						pubsub.publish({
							topic:'popstateChange',
							data:{
								event:e,
								originalState:e.originalEvent.state
							}
						});
						
						prv_setHash();
						prv_setHref();
						prv_setQueryString();
						prv_setPage();
					},
					'scroll.bolster.setWindowAttributes':prv_setScrollTop
				});
			
			// API to get values
			return {
				attributes:prv_getAttributes,
				dimensions:prv_getDimensions,
				enterFullscreen:prv_fullscreenEnter,
				exitFullscreen:prv_fullscreenExit,
				fullscreenElement:prv_getFullscreenElement,
				hash:prv_getHash,
				height:prv_getHeight,
				hostname:prv_getHostname,
				href:prv_getHref,
				isFullscreen:prv_isFullscreenActive,
				page:prv_getPage,
				querystring:prv_getQueryString,
				scrollTop:prv_getScrollTop,
				width:prv_getWidth,
				window:prv_getWindow
			};
		})(),
		// build module for $.document()
		doc = (function(){
			// cache document object
			var $document = $(document),
				// get initial document values
				w = $document.width(),
				h = $document.height(),
				cs = (document.characterSet || document.charset),
				u = document.documentURI,
				styles = document.styleSheets,
				styleSets = document.styleSheetSets,
				r = document.referrer;
			
			// functions to retrieve document attributes
			function prv_getCharacterSet(){
				return cs;
			}
			
			function prv_getAnchors(){
				return document.anchors;
			}
			
			function prv_getAttributes(){
				return {
					anchors:document.anchors,
					characterSet:cs,
					forms:document.forms,
					height:h,
					images:document.images,
					links:document.links,
					page:win.page(),
					referrer:r,
					styleSheets:styles,
					styleSheetSets:styleSets,
					title:document.title,
					uri:u,
					width:w
				};
			}
			
			function prv_getDocument(){
				return $document;
			}
			
			function prv_getDocumentURI(){
				return u;
			}
			
			function prv_getForms(){
				return document.forms;
			}
			
			function prv_getHeight(){
				return h;
			}
			
			function prv_getImages(){
				return document.images;
			}
			
			function prv_getLinks(){
				return document.links;
			}
			
			function prv_getReferrer(){
				return r;
			}
			
			function prv_getStyleSheets(){
				return styles;
			}
			
			function prv_getStyleSheetSets(){
				return styleSets;
			}
			
			function prv_getTitle(){
				return document.title;
			}
			
			function prv_getWidth(){
				return w;
			}
			
			function prv_setDimensions(){
				w = $document.width();
				h = $document.height();
				
				// publish new dimensions on resize
				pubsub.publish({
					topic:'documentResize',
					data:{
						height:h,
						width:w
					}
				});
			}
			
			// establish publishing events for document activities
			$document
				.off('.bolster.setDocumentAttributes')
				.on({
					'ready.bolster.setDocumentAttributes':function(){
						// publish all document attributes on load
						pubsub.publish({
							topic:'documentReady',
							data:prv_getAttributes()
						});
					},
					'resize.bolster.setDocumentAttributes':prv_setDimensions
				});
			
			return {
				anchors:prv_getAnchors,
				attributes:prv_getAttributes,
				characterSet:prv_getCharacterSet,
				document:prv_getDocument,
				forms:prv_getForms,
				height:prv_getHeight,
				images:prv_getImages,
				links:prv_getLinks,
				referrer:prv_getReferrer,
				styleSheets:prv_getStyleSheets,
				styleSheetSets:prv_getStyleSheetSets,
				title:prv_getTitle,
				uri:prv_getDocumentURI,
				width:prv_getWidth
			}
		})(),
		// build module for $.storage()
		storage = (function(){
			// initial tests for support
			var ssSupport = supports.sessionStorage(),
				lsSupport = supports.localStorage(),
				jsonSupport = supports.json(),
				// create empty objects
				tempStorage = (function(){
					var tempObj = {};
					
					for(var i = 0,len = window.sessionStorage.length; i < len; i++){
						var key = window.localStorage.key(i);
						
						tempObj[key] = window.sessionStorage[key];
					}
					
					return tempObj;
				})(),
				permStorage = (function(){
					var tempObj = {};
					
					for(var i = 0,len = window.localStorage.length; i < len; i++){
						var key = window.localStorage.key(i);
						
						tempObj[key] = window.localStorage[key];
					}
					
					return tempObj;
				})(),
				// function to create expiry attribute if permanent
				setCookieExpiration = function(perm){
					return (perm ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '');
				},
				// function to build the full value
				setCookieValue = function(cookie,perm){
					var arr = cookie.replace('; ',';').split(';').sort(),
						len = arr.length,
						value = encodeURIComponent(arr[0]) + setCookieExpiration(perm);
					
					// create each attribute separately
					if(len > 1){
						for(var i = len; i--;){
							var tempArr = arr[i].split('=');
							
							switch(tempArr[0]){
								case 'path':
								case 'domain':
									value += ('; '+ tempArr[0] + '=' + tempArr[1]);
									break;
								case 'secure':
									value += '; secure';
									break;
								default:
									break;
							}
						}
					}
					
					// return completed string
					return value;
				},
				/*
				 * function to assign storage, which is a different function
				 * depending on whether localStorage/sessionStorage is supported
				 * or not, so we return a function in an IIFE that is specific
				 * to support
				 */
				setStorage = (function(){
					// support for HTML5 storage
					if(ssSupport && lsSupport){
						return function(perm,keys){
							// go through each object key and assign it to localStorage and internal object
							if($.type(keys) === 'object'){
								for(var key in keys){
									if(keys.hasOwnProperty(key)){
										// assign to correct internal object and storage type
										if(perm){
											permStorage[key] = keys[key]
											window.localStorage[key] = (($.type(keys[key]) === 'string') ? keys[key] : JSON.stringify(keys[key]));
										} else {
											tempStorage[key] = keys[key];
											window.sessionStorage[key] = (($.type(keys[key]) === 'string') ? keys[key] : JSON.stringify(keys[key]));
										}
									}
								}
							} else {
								throwError('Parameter passed must be an object.');
							}
						};
					// fallback to cookies
					} else {
						return function(perm,keys){								
							// go through each object key and assign it to document.cookie and internal object			
							if($.type(keys) === 'object'){
								for(var key in keys){									
									if(keys.hasOwnProperty(key)){
										var value = setCookieValue(keys[key],perm);
										
										// assign to correct internal object
										if(perm){
											permStorage[key] = value.split('; ')[0];
										} else {
											tempStorage[key] = value.split('; ')[0];
										}
										
										/*
										 * cookies do not have different types, but different
										 * expiration dates create session vs permanent
										 */
										document.cookie = encodeURIComponent(key) + '=' + JSON.stringify(value);
									}
								}
							} else {
								throwError('Parameter passed must be an object.');
							}
						};
					}
				})(),
				// function to remove storage item
				removeStorageItem = function(perm,item){
					if(perm && permStorage.hasOwnProperty(item)){
						window.localStorage.removeItem(item);
						delete permStorage[item];
					} else if(tempStorage.hasOwnProperty(item)){
						window.sessionStorage.removeItem(item);
						delete tempStorage[item];
					}
				},
				// function to remove cookie
				removeCookieItem = function(perm,item){
					if(perm && permStorage.hasOwnProperty(item)){
						document.cookie = encodeURIComponent(item) + permStorage[item].split('; ').push('; expires=Thu, 01 Jan 1970 00:00:00 GMT').sort().join('; ');
						delete permStorage[item];
					} else if(tempStorage.hasOwnProperty(item)){
						document.cookie = encodeURIComponent(item) + tempStorage[item].split('; ').push('; expires=Thu, 01 Jan 1970 00:00:00 GMT').sort().join('; ');
						delete tempStorage[item];
					}
				},
				/*
				 * function to remove storage, which is different
				 * depending on support, just as above
				 */
				removeStorage = (function(){
					// HTML5 storage support
					if(ssSupport && lsSupport){
						return function(perm,keys){
							switch($.type(keys)){
								case 'array':
									for(var i = keys.length; i--;){
										// remove each item from correct internal object and storage type
										removeStorageItem(perm,keys[i]);
									}
									
									break;
								case 'string':
									// remove item from correct internal object and storage type
									removeStorageItem(perm,keys);
									
									break;
								case 'object':
									removeStorageItem((keys.type === 'local'),keys.keys);
									
									break;
								default:
									throwError('Parameter passed is invalid.');
									return undefined;
									break;
							}
						};
					// fallback to cookies
					} else {
						return function(perm,keys){
							switch($.type(keys)){
								case 'array':
									// remove each item from correct internal object and storage type
									for(var i = keys.len; i--;){
										removeCookieItem(perm,keys[i]);
									}
									
									break;
								case 'string':
									// remove item from correct internal object and storage type
									removeCookieItem(perm,keys);
									
									break;
								case 'object':
									removeCookieItem((keys.type === 'local'),keys.keys);
									
									break;
								default:
									throwError('Parameter passed is invalid.');
									return undefined;
									break;
							}
						};
					}
				})();
			
			function prv_getStorage(type,keys){
				if(type === 'local'){
					switch($.type(keys)){
						case 'array':
							var permObj = {};
							
							for(var i = 0,len = keys.length; i < len; i++){
								permObj[keys[i]] = permStorage[keys[i]];
							}
							
							return permObj;
							
							break;
						case 'string':
							return permStorage[keys];
							
							break;
						case 'undefined':
							return permStorage;
							
							break;
						default:
							throwError('Parameter passed is invalid.');
							return undefined;
							break;
					}
				} else if(type === 'session'){
					switch($.type(keys)){
						case 'array':
							var tempObj = {};
							
							for(var i = 0,len = keys.length; i < len; i++){
								tempObj[keys[i]] = tempStorage[keys[i]];
							}
							
							return tempObj;
							
							break;
						case 'string':
							return tempStorage[keys];
							
							break;
						case 'undefined':							
							return tempStorage;
							
							break;
						default:
							throwError('Parameter passed is invalid.');
							return undefined;
							break;
					}
				}
			}
			
			function prv_localStorage(args){
				switch(args.length){
					case 0:
						return prv_getStorage('local');
						
						break;
					case 1:
						if($.type(args[0]) === 'object'){
							setStorage(true,args[0]);
						} else {
							return prv_getStorage('local',args[0]);
						}
						
						break;
					case 2:
						setStorage(true,args[0],args[1]);
						
						break;
					default:
						throwError('Parameter passed is not a valid type.');
						
						break;
				}
			}
			
			function prv_sessionStorage(args){
				switch(args.length){
					case 0:
						return prv_getStorage('session');
						
						break;
					case 1:
						if($.type(args[0]) === 'object'){
							setStorage(false,args[0]);
						} else {
							return prv_getStorage('session',args[0]);
						}
						
						break;
					case 2:
						setStorage(false,args[0],args[1]);
						
						break;
					default:
						throwError('Parameter passed is not a valid type.');
						
						break;
				}
			}
			
			function prv_removeStorage(args){
				switch(args.length){
					case 0:
						window.localStorage.clear();
						window.sessionStorage.clear();
						
						permStorage = tempStorage = {};
						
						break;
					case 1:
						switch($.type(args[0])){
							case 'string':
							case 'array':
								removeStorage(true,args[0]);
								removeStorage(false,args[0]);
								
								break;
							case 'object':
								if($.type(args[0].type) === 'undefined'){
										removeStorage(true,args[0].keys);
										removeStorage(false,args[0].keys);
								} else {
									switch(args[0].type){
										case 'local':
											removeStorage(true,args[0].keys);
											break;
										case 'session':
											removeStorage(false,args[0].keys);
											break;
										default:
											throwError('Invalid value for storage type.');
											break;
									}
								}
						}
						
						break;
					case 2:
						switch(args[1]){
							case 'local':
								removeStorage(true,args[0]);
								
								break;
							case 'session':
								removeStorage(false,args[0]);
								
								break;
							default:
								removeStorage(true,args[0]);
								removeStorage(false,args[0]);
								
								break;
						}
						
						break;
				}
			}
			
			return {
				local:prv_localStorage,
				remove:prv_removeStorage,
				session:prv_sessionStorage
			};
		})(),
		// build module for $.pledge() and $.postpone()
		pledge = (function(){
			// reusable error messages
			var errors = {
					badParam:'Parameter passed is not a valid type for this method.',
					testFailed:'Test did not pass.'
				},
				// create Pledge object
				Pledge = function(){
					// reset Pledge object
					this.init = function(){
						this.resolved = {};
						this.rejected = {};
						
						this.puid = -1;
						this.cuid = -1;
					};
					
					// execute resolution of pledge
					this.resolve = function(data){
						this.cuid++;

						if(this.resolved[this.cuid]){
							this.resolved[this.cuid].call(this,data);
						}
					};

					// execute rejection of pledge
					this.reject = function(e){	
						this.cuid++;

						if(this.rejected[this.cuid]){
							this.rejected[this.cuid].call(this,e);
						}
					};
					
					/*
					 * functions are stacked in order, awaiting
					 * resolution before the next in line is executed
					 */
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
				// create Postpone object
				Postpone = function(){
					// caching needed for this.pledge
					var self = this;
					
					// assign data for resolution of postponed function
					this.resolve = function(resolutionData){
						this.resolvePostpone = true;
						this.resolveData = resolutionData;
					};
					
					// assign data for rejection of postponed function
					this.reject = function(rejectionData){
						this.rejectPostpone = true;
						this.rejectData = rejectionData;
					};
					
					/*
					 * create new Pledge, begin the chain with simple
					 * resolution or rejection, based on assignment (only
					 * this.resolve OR this.reject is defined in a proper
					 * scenario; if both are assigned, defaults to resolve)
					 */
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
			
			// build functions for API of Pledge
			Pledge.prototype = {
				// executes function but does not continue the chain
				complete:function(onResolution,onRejection){
					this.push(onResolution, onRejection);
				},
				// executes all functions passed in order of array values
				consecutive:function(onResolutions,onRejections){
					var rejectionType = $.type(onRejections),
						validRejection = false;
					
					// make sure its a valid type
					switch(rejectionType){
						case 'array':
						case 'function':
						case 'undefined':
							validRejection = true;
							break;
						default:
							validRejection = false;
							break;
					}
					
					// value passed must be array
					if(($.type(onResolutions) === 'array') && validRejection){
						/* each rejection can have a unique function (array passed),
						 * or can have single rejection function (function passed)
						 */
						var isArray = (rejectionType === 'array');
						
						for(var i = 0, len = onResolutions.length; i < len; i++){
							if(isArray){
								this.push(onResolutions[i], onRejections[i]);
							} else {
								this.push(onResolutions[i], onRejections);
							}
						}
						
						return this;
					} else {
						throwError(errors.badParam);
					}
				},
				// executes all functions passed simultaneously
				concurrent:function(onResolutions,onRejection){
					var validRejection = false;
					
					// make sure its a valid type
					switch($.type(onRejections)){
						case 'function':
						case 'undefined':
							validRejection = true;
							break;
						default:
							validRejection = false;
							break;
					}
					
					// cannot pass array of rejectio
					if(validRejection){
						var len = onResolutions.length,
							finished = [];
						
						/*
						 * create unique Pledge for each function, and upon
						 * resolution push the data to the finished array;
						 * when finished array is equal to the length of
						 * the length of resolution functions, all resolutions
						 * have occured, and so the concurrent step resolves
						 */
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
						
						/*
						 * create proceed function calling newPledge for
						 * each function in array
						 */
						return this.proceed(function(data){
							for(var i = len; i--;){
								newPledge(onResolutions[i],this,data);
							}
						},onRejection);
					} else {
						throwError(errors.badParam);
					}
				},
				// push the resolve / reject functions to stack and continue chain
				proceed:function(onResolution,onRejection){
					this.push(onResolution, onRejection);     
					return this;
				},
				// begin chain by executing function
				start:function(fn){
					if($.type(fn) === 'function'){
						var self = this;
						
						window.setTimeout(function(){
							fn.call(self);
						},0);
						
						return self;
					}
				},
				/*
				 * create delay of processing based on delay passed,
				 * and if test function is passed then continue if true
				 */
				wait:function(delay,test){
					var self = this,
						testResult;
					
					// must pass delay to function
					if(!delay){
						throwError(errors.badParam);
					}
					
					// determine test type
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
					
					/*
					 * create proceed function creating setTImeout for
					 * before resolving itself
					 */
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
						throwError('Must pass function into $.pledge.');
					}
				},
				postpone:function(){
					return new postpone();
				}
			});
		})(),
		// functions to help internally
		helpFuncs = {
			// return complete bounding rect of element
			clientRect:(function(){
				if(supports.getBoundingClientRect()){
					return function($self){
						var rect = $self[0].getBoundingClientRect();
						
						return {
							bottom:Math.round(rect.bottom),
							height:Math.round(rect.height || (rect.bottom - rect.top)),
							left:Math.round(rect.left),
							right:Math.round(rect.right),
							top:Math.round(rect.top),
							width:Math.round(rect.width || (rect.right - rect.left))					
						};
					};
				} else {
					return function($self){
						var $first = $self.eq(0),
							first = $first[0],
							h = Math.max(first.scrollHeight,first.offsetHeight,first.clientHeight),
							w = Math.max(first.scrollWidth,first.offsetWidth,first.clientWidth),
							offset = $first.offset(),
							body = document.body;
					
						return {
							bottom:((offset.top - body.scrollTop) + h),
							height:h,
							left:(offset.left - body.scrollLeft),
							right:((offset.left - body.scrollLeft) + w),
							top:(offset.top - body.scrollTop),
							width:w
						};
					};
				}
			})(),
			// perform preload of images
			loadImg:function(self,i,len,callback){
				if($.type(callback) === 'function'){
					// create new Image object and assign element source to it
					var img = new Image();
					
					img.src = self.src;
					
					// traditional check if img has loaded
					if(img.complete || (img.readyState === 4) || (img.readyState === 'complete')){
						/*
						 * callback with object that includes many attributes
						 * that you want to know about the img element
						 */
						callback.call(self,{
							height:self.height,
							naturalHeight:(img.naturalHeight || img.height),
							naturalWidth:(img.naturalWidth || img.width),
							percentComplete:Math.floor(((i + 1) * 100) / len),
							src:self.src,
							width:self.width
						});
					// IE has a problem with cached images not loading automatically on src assignment
					} else {
						// bind onload to new Image object
						img.onload = function(){
							// same callback object as above
							callback.call(self,{
								height:self.height,
								naturalHeight:(img.naturalHeight || img.height),
								naturalWidth:(img.naturalWidth || img.width),
								percentComplete:Math.floor(((i + 1) * 100) / len),
								src:self.src,
								width:self.width
							});
						};
						
						// assign source again, must happen after onload is bound
						img.src = self.src;
					}
				}
			},
			/*
			 * retrieve both naturalHeight and naturalWidth
			 * modern browsers have this attribute included,
			 * but still need to wait for the img to be loaded
			 * before value is returned
			 */
			naturalDimensions:{
				height:function(el){
					var img = new Image();
					
					img.onload = function(){
						return (img.naturalHeight || img.height);
					};
					
					img.src = el.src;
				},
				width:function(el){
					var img = new Image();
					
					img.onload = function(){
						return (img.naturalWidth || img.width);
					};
					
					img.src = el.src;
				}
			}
		};
			
	$.extend({
		document:function(attribute,values){
			if(attribute){
				return doc[attribute](values);
			} else {
				return doc.document();
			}
		},
		localStorage:function(){
			return storage.local(arguments);
		},
		publish:function(publishObj){
			return pubsub.publish(publishObj);
		},
		removeStorage:function(){
			return storage.remove(arguments);
		},
		sessionStorage:function(){
			return storage.session(arguments);
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
		window:function(attribute,values){
			if(attribute){
				return win[attribute](values);
			} else {
				return win.window();
			}
		}
	});

	// $(selector) methods
	$.fn.extend({
		// is the object "active" based on class passed or default
		active:function(cls){
			cls = cls || 'active';
			
			return this.hasClass(cls);
		},
		// set object elements to "active" based on class and parent passed or default
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
		// get the clientRect of the first element in the object
		boundingBox:function(){
			return helpFuncs.clientRect(this);
		},
		// set object elements to "inactive" based on class and parent passed or default
		deactivate:function(cls,parent){
			cls = cls || 'active';
			
			if(parent){
				this
					.parents('.' + parent)
					.find('.' + cls)
					.removeClass(cls);
			} else {
				this
					.parent()
					.find('.' + cls)
					.removeClass(cls);
			}
			
			return this;
		},
		// perform callback function on loading of images
		imgLoad:function(callback,delay){
			var len = this.length;
		
			if(delay && (delay > 0)){
				return this.each(function(i){
					var self = this;
					
					window.setTimeout(function(){					
						helpFuncs.loadImg(self,i,len,callback);
					},(delay * i));
				});
			} else {
				return this.each(function(i){
					helpFuncs.loadImg(this,i,len,callback);
				});
			}
		},
		// retrieve naturalHeight of first element in object
		naturalHeight:function(){
			return helpFuncs.naturalDimensions.height(this[0]);
		},
		// retrieve naturalWidth of first element in object
		naturalWidth:function(){
			return helpFuncs.naturalDimensions.width(this[0]);
		},
		/*
		 * make all elements in object, and all children, unseletable
		 * based on both CSS and attribute values
		 */
		unselectable:function(allowChildren){
			var $self = this,
				$nodes = (allowChildren ? $self : $self.add($self.find('*')));
			
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
		/*
		 * remove styling for elements in object,
		 * really just an easy wrapper of .css() for
		 * removal of all styles or specific styles
		 */
		unstyle:function(styles){
			switch($.type(styles)){
				// if string, set css value to ''
				case 'string':
					return this.css(styles,'');
					break;
				// if array, set each css value in array to ''
				case 'array':
					var styleObj = {};
					
					for(var i = styles.length; i--;){
						styleObj[styles[i]] = '';
					}
					
					return this.css(styleObj);
					
					break;
				// if no parameter passed, remove all styles
				case 'undefined':
					return this.removeAttr('style');
					
					break;
				// if some other type, do not process
				default:
					throwError('Parameter passed in is not of appropriate type; processing aborted.');
					
					return this;
					
					break;
			}
			
		}
	});
})(window,document,jQuery);
