bolster
=======

Library to augment jQuery with additional functionality

### Purpose

jQuery is a wonderful, magical, omnipresent library that makes the lives of most developers a little easier. Who are we kidding, a lot easier. But the fact is ... it is missing some pieces that have become very common in today's JavaScript world. We use other libraries to assist with this, but as the list of resources and external calls grows, so does your pageload times. The goal of this library is to centralize these features into a single, compact augmentation library, using syntax that jQuery users are familiar with.

### Size

+ Uncompressed: 58.11KB
+ Minified: 20.83KB
+ Minified and gzipped: 6.38KB

### Components

+ $ methods
  + Publish / Subscribe
  + Feature detection
  + Window attributes
  + Document attributes
  + Promises / deferreds
  + Retrieve page name
  + localStorage / sessionStorage with cookie fallback
+ $(selector) methods
  + Setting / removing / detecting "active" elements
  + Completion of image loading
  + Getting natural width / height of image
  + Setting attributes to not be selectable
  + Removing inline styling

### $ Methods

**$.document()**

Provide document-specific attributes, based on the parameter passed. To execute the method, pass in the string value of the attribute (a parameter is optional). The following parameters can be passed:
+ anchors
+ attributes
  + returns object with the following values:
    + anchors
    + characterSet
    + forms
    + height
    + images
    + links
    + page
    + referrer
    + styleSheets
    + styleSheetSets
    + title
    + uri
    + width
+ characterSet
+ dimensions
  + returns object with the following values:
    + width
    + height
+ forms
+ height
+ images
+ links
+ referrer
+ styleSheets
+ styleSheetSets
+ title
+ uri
+ width

If no parameter is passed, then the jQuery object of the document is retrieved.

Example:
```html
var dims = $.document('dimensions'),
    $document = $.document();

if(dims.width > 100){
  console.log($.document('height'));
  // returns full height of document (not the window)
}
```

**$.localStorage()**
Assigns or retrieves existing storage items that are considered "permanent" (meaning they persist upon closure of the session), depending on the parameters that are passed in. To execute assignment, pass in any one of the following parameters:
+ key,value *(2 string parameters that are comma-separated, optional)*
+ object containing 1 to many key:value pairs *(1 object parameter only, optional)*

If no parameter is passed, all localStorage items will be retrieved and returned as an object of key:value pairs.

Examples:
```html
$.localStorage('foo','bar');
$.localStorage({
  foo:'bar',
  beyond:'reason'
});
```

To execute retrieval, pass in any one of the following parameters:
+ key *(1 string parameter)*
  + returns value of key
+ array of keys *(1 array parameter)*
  + returns object of key:value pairs

Examples:
```html
$.localStorage('foo'); // returns bar
$.localStorage(['foo','beyond']); // returns {foo:'bar',beyond:'reason'}
```

**$.pledge()**

Provide basic promise functionality, allowing for conversion of function execution to become asynchronous. To execute the method, pass in the first function in the chain.

Methods used in pledges:
+ complete()
  + Processes function passed, not continuing chain afterwards
  + Parameters:
    + Function to process if previous step successful *(function, required)*
    + Function to process if previous step unsuccessful *(function, optional)*
+ concurrent()
  + Processes in parallel list of functions passed, continuing chain afterwards
  + Parameters:
    + Functions to process if previous step successful *(array, required)*
    + Function to process if previous step unsuccessful *(function, optional)*
+ consecutive()
  + Processes in order list of functions passed, continuing chain afterwards
  + Parameters:
    + Functions to process if previous step successful *(array, required)*
    + Function(s) to process if previous step unsuccessful *(array / function, optional)*
+ proceed()
  + Processes function passed, continuing chain afterwards
  + Parameters:
    + Function to process if previous step successful *(function, required)*
    + Function to process if previous step unsuccessful *(function, optional)*
+ start()
  + Processes function passed, beginning chain that continues afterwards
    + Parameters:
      + Function to process *(function, required)*
  + Not required, passing function to *$.pledge* will perform the same function
+ wait()
  + Delays chain of promises for period of time passed in
  + Parameters:
    + delay, in milliseconds *(integer, required)*
    + test to determine if should continue or not *(boolean / function, optional)*

Examples:
```html
var func1 = function(data){
    console.log(data);
    this.resolve('Data from func1');
  },
  func2 = function(data){
    console.log(data);
    this.resolve('Data from func2');
  },
  x = 10;

$.pledge(function(){
  console.log('Begin');
  this.resolve('Data from first');
})
  .proceed(function(data){
    var self = this;
    // capture this, because it changes inside setTimeout
  
    window.setTimeout(function(){
      console.log(data);
      // logs "Data from first"
      self.resolve('Data from second');
    },1000);
  })
  .wait(1000)
  // waits for 1 second before continuing
  .consecutive([func1,func2])
  // first logs "Data from second", then logs "Data from func1"
  .wait(2500,(x === 10))
  // waits for 2.5 seconds before continuing, only because (x === 10) is true
  .concurrent([func1,func2])
  // logs "Data from func2" twice (as the same data was passed into each concurrent function)
  .wait(500,function(){
    return (x > 5);
  })
  // waits for 0.5 seconds before continuing, only because the function return is true
  .complete(function(data){
    console.log(data);
    // logs array ["Data from func1","Data from func2"]
    // array is in order of processing finished, not in order of array passed in
  
    window.setTimeout(function(){
      console.log('done');
      // no promise is returned from the complete method
    });
  });
```

**$.postpone()**

Provide basic deferred functionality, allowing a function to have a promise allocated to it simply by executing it. To execute this method, assign the deferred to a variable and apply methods.

Example:
```html
function testDeferred(x){
  var postpone = $.postpone();
      
  if(x === 10){
    postpone.resolve('X equals 10');
  } else {
    postpone.reject('X does not equal 10');
  }
  
  return postpone.pledge();
}

testDeferred(10).proceed(function(data){
  console.log(data);
  // logs "X equals 10"
});

testDeferred(20).proceed(function(data){
  console.log(data);
  // logs "X does not equal 10"
});
```
In application of the function with the deferred returned, it operates like any other promise. However, there are methods unique to *$.postpone*:
+ resolve *(string, optional)*
  + Assigns data that will be passed to the next function in the promise chain
+ reject *(string, optional)*
  + Assigns data that will be passed upon rejection
+ pledge *(no parameters)*
  + Used in the return to instantiate a new pledge and begin the chain

**$.publish()**

Publish a topic, usually upon some other event. This topic can be subscribed to by an unlimited number of objects. To execute the method, a single object is passed in with the following components:
+ topic *(string, required)*
  + Unique name given to topic
+ data *(string / array / object, optional)*
  + Data that can be accessed in the subscription
  + Can be any datatype, but defaults to an object

Example:
```html
$('div').on('click',function(){
  var $self = $(this);

  $.publish({
    topic:'divClick',
    data:{
      height:$self.height(),
      width:$self.width()
    }
  });
});
```

**$.removeStorage()**
Removes existing items stored with $.localStorage() and $.sessionStorage(), depending on the parameters passed in. To execute the method, pass in the following parameters:
+ key(s) *(string / array / object, optional)*
  + if string, will remove single key
  + if array, will remove each key in array
  + if object, will remove each key in value of "keys"
    + can also pass in type as value of "type"
+ type *(string, optional)*
  + if passed in, will limit removal to a specific type (local vs session)

If no parameter is passed, all localStorage and sessionStorage items will be removed.

Examples:
```html
$.removeStorage('foo'); // removes key of "foo" from both localStorage and sessionStorage
$.removeStorage(['foo','beyond'],'local'); // removes keys "foo" and "beyond" from localStorage only
$.removeStorage({
  keys:'beyond',
  type:'session'
}); // removes key "beyond" from sessionStorage only
```

**$.sessionStorage()**
Assigns or retrieves existing storage items that are considered "temporary" (meaning they expire upon closure of the session), depending on the parameters that are passed in. To execute assignment, pass in any one of the following parameters:
+ key,value *(2 string parameters that are comma-separated, optional)*
+ object containing 1 to many key:value pairs *(1 object parameter only, optional)*

If no parameter is passed, all sessionStorage items will be retrieved and returned as an object of key:value pairs.

Examples:
```html
$.sessionStorage('foo','bar');
$.sessionStorage({
  foo:'bar',
  beyond:'reason'
});
```

**$.supports()**

Check if browser supports a specific feature, and there are many features that are tested. To execute the method, pass in the string value for the feature (a parameter is always required). Features tested (returns boolean value, unless specified):
+ applicationCache *(HTML5 Application Cache API)*
+ attachEvent *(proprietary legacy IE event-to-function assignment)*
+ audio *(HTML5 audio element)*
  + returns object with boolean values for
    + mp3
    + mp4
    + ogg
+ audioMP3 *(audio type MP3)*
+ audioMP4 *(audio type MP4)*
+ audioOGG *(audio type OGG)*
+ boxShadow *(CSS3 box-shadow property)*
+ canvas *(HTML5 canvas element)*
+ classList *(classList attribute of element)*
+ cssAnimation *(CSS3 animations)*
+ cssCalc *(CSS3 value based on calc() function)*
+ cssColumn *(CSS3 columns)*
+ cssReflection *(CSS3 reflections)*
+ cssStylesheet *(HTML5 styleSheet attribute)*
+ customEvent *(CustomEvent creation)*
+ dragAndDrop *(HTML5 draggable / droppable attributes)*
+ eventListener *(modern event-to-function assignment)*
+ flexbox *(CSS3 new display type of flex)*
+ geolocation *(HTML5 Geolocation API)*
+ getElementsByClassName *(getElementsByClassName method)*
+ gradient *(CSS3 gradient background type)*
  + returns object with boolean values for:
    + linear
    + radial
+ hashchange *(HTML5 hashchange event)*
+ history *(HTML5 History API)*
+ hsla *(CSS3 HSLA colors)*
+ html5Attribute *(HTML5 attributes)*
  + returns object with boolean values for:
    + autocomplete
    + autofocus
    + list
    + max
    + min
    + multiple
    + pattern
    + placeholder
    + required
    + step
+ html5Input *(HTML5 new input element types)*
  + returns object with boolean values for:
    + color
    + date
    + dateTime
    + dateTimeLocal
    + email
    + month
    + number
    + range
    + search
    + tel
    + time
    + url
    + week
+ indexedDB *(HTML5 IndexedDB API)*
+ linearGradien *(CSS3 Linear Gradient)*
+ localStorage *(HTML5 localStorage API)*
+ mediaQueries *(CSS3 Media Queries)*
+ pageOffset *(pageYOffset and pageXOffset)*
+ postMessage *(onmessage event)*
+ pseudoClass *(Pseudo-class selectors)*
  + returns object with boolean values for:
    + active
    + after
    + before
    + focus
    + hover
    + link
    + visited
+ pseudoElement *(CSS3 Pseudo-element selectors)*
  + returns object with boolean values for:
    + after
    + before
    + firstLetter
    + firstLine
+ rgba *(CSS3 RGBA colors)*
+ sessionStorage *(HTML5 sessionStorage API)*
+ smil *(HTML5 SMIL)*
+ storage *(HTML5 localStorage and SessionStorage)*
  + returns object with boolean values for:
    + local
    + session
+ svg *(HTML5 SVG element type)*
+ textShadow *(CSS3 text-shadow property)*
+ touchEvents *(touch events)*
+ transform *(CSS3 transforms)*
  + returns object with boolean values for:
    + twoD
    + threeD
+ transform2d *(CSS3 2D Transforms)*
+ transform3d *(CSS3 3D Transforms)*
+ transition *(CSS3 Transitions)*
+ video *(HTML5 video element type)*
  + returns object with boolean values for:
    + mp4
    + ogg
    + webM
+ videoMP4 *(video type MP4)*
+ videoOGG *(video type OGG)*
+ videoWebM *(video type WebM)*
+ webGL *(HTML5 WebGL / 3D Canvas)*
+ webSocket *(HTML5 Web Sockets API)*

Example:
```html
if($.supports('webSocket')){
  // do Web Socket stuff
}

if($.supports('video').mp4){
  // do MP4 video stuff
}
```

**$.subscribe()**

Subscribe to a topic, so that a specific function you pass in will be executed upon each publishing of that topic. To execute the method, a single object is passed in with the following components:
+ topic *(string / array, required)*
  + Name of topic(s) to which you are subscribing
  + If subscribing to multiple topics, provide them as strings in an array
+ name *(string, required)*
  + Unique name of subscription
+ once *(boolean, optional)*
  + Perform the subscription funcion only once (default is false)
+ fn *(function, required)*
  + Function that will be executed upon each publishing of given topic

Example:
```html
$.subscribe({
  // topic:'divClick',
  topic:['divClick','divDimensionsResize'],
  name:'getDivDimensions',
  fn:function(data,topic){
    if(data.width > 200){
      // do large width stuff
    }
    
    if(topic === 'divClick'){
      // do divClick specific stuff
    }
  }
});
```

Built-in published topics:
+ documentReady *(published when DOM is ready)*
  + data provided is object with the following values:
    + everything retrievable through $.document('attributes')
+ documentResize *(published when document is resized)*
  + data provided is object with the following values:
    + width *(document width)*
    + height *(document height)*
+ fullscreenChange *(published when elements enter or exit fullscreen state)*
  + data provided is object with the following values:
    + active *(boolean of whether fullscreen is active or not)*
    + element *(if fullscreen, element that is fullscreen, else null)*
+ popstateChange *(published whenever popstate event is triggered)*
  + data provided is object with the following values:
    + event *(popstate event)*
    + height *(window height)*
    + originalState *(previous event state)*
    + scrollTop *(window scrollTop)*
    + width *(window width)*
+ windowLoad *(published when window is loaded)*
  + data provided is object with the following values:
    + everything retrievable from $.window('attributes')
+ windowResize *(published when window is resized)*
  + data provided is object with the following values:
    + width *(window width)*
    + height *(window height)*
+ windowScroll *(published when scrolling happens on the window object)*
  + data provided is object with the following values:
    + scrollTop *(scrollTop relative to top of document)*

**$.unsubscribe()**

Remove subscription(s) to a topic based on subscription name passed in. To execute the method, a single object is passed in with the following components:
+ name *(string / array, required)*
  + Unique name of subscription

Example:
```html
$.unsubscribe({
  //name:'getDivDimensions'
  name:['getDivDimensions','someOtherTopic']
});
```

**$.window()**

Provide window-specific attributes, based on the parameter passed. To execute the method, pass in the string value of the attribute (a parameter is optional). The following parameters can be passed:
+ attributes
  + returns object with the following values:
    + fullscreenActive
    + fullscreenElement
    + hash
    + height
    + hostname
    + href
    + page
    + querystring
    + scrollTop
    + width
+ dimensions
  + returns object with the following values:
    + width
    + height
+ enterFullscreen *(only if Fullscreen API is supported)*
  + must pass element as second parameter
+ exitFullscreen
+ fullscreenElement
  + returns *null* if not fullscreen
+ hash
+ height
+ hostname
+ href
+ isFullscreen
+ page
+ querystring
+ scrollTop
+ width

If no parameter is passed, then the jQuery object of the window is retrieved.

Example:
```html
var dims = $.window('dimensions'),
    video = $('video').get(0),
    $window = $.window();

if((dims.width > 100) && ($.window('scrollTop') > 300)){
  $.window('enterFullscreen',video);

  console.log($.window('isFullscreen'));
  // returns true, assuming Fullscreen API is supported
}
```

### $(selector) methods

**$(selector).activate()**

Set object to be "active", denoted by a class added to each element in the object. To execute the method, you can pass in the following parameters:
+ class to denote "active" status *(string, optional)*
+ parent selector of active element *(string, optional but requires class to be passed in to use)*

Examples:
```html
$('.SimpleActive').activate(); 
// all children of .SimpleActive's parent have class of "active" removed
// class of "active" is added to .SimpleActive

$('.ActiveSpecific').activate('SpecificActive'); 
// all children of .SpecificActive's parent have class of "SpecificActive" removed
// class of "SpecificActive" is added to .ActiveSpecific

$('.ActiveWithParent').activate('ActiveChild','.ParentOfChild');
// all children of .ActiveChild's ancestor of .ParentOfChild have class of "ActiveChild" removed
// class of "ActiveChild" added to .ActiveWithParent
```

**$(selector).active()**

Test if object is considered "active", denoted by classes used in the *activate* method, returning a boolean value. To execute the method, you can pass in the following parameters:
+ class to denote "active" status *(string, optional)*

Example:
```html
var simpleActive = $('.SimpleActive').active(), // checks if has "active" class
    specificActive = $('li').active('SpecificActive'); // checks if has "SpecificActive" class
```

**$(selector).deactivate()**

Set object to be "inactive", denoted by a class removed from each element in the object. To execute the method, you can pass in the following parameters:
+ class to denote "active" status *(string, optional)*
+ parent selector of active element *(string, optional but requires class to be passed in to use)*

Examples:
```html
$('.SimpleActive').deactivate();
// all children of .SimpleActive's parent have class of "active" removed

$('.ActiveSpecific').deactivate('SpecificActive'); 
// all children of .SpecificActive's parent have class of "SpecificActive" removed

$('.ActiveWithParent').deactivate('ActiveChild','.ParentOfChild');
// all children of .ActiveChild's ancestor of .ParentOfChild have class of "ActiveChild" removed
```

**$(selector).imgLoad()**

Execute callback function upon the completion of loading for each image in the object. To execute the method, you can pass in the following parameters:
+ function to execute upon image loaded *(function, required)*
+ delay with which to process the callback of each image in the object *(integer, optional)*

Examples:
```html
$('img').imgLoad(function(percent){
  if(percent === 100){
    // all images loaded
  }
});

$('img').imgLoad(function(percent){
  $('.LoadingSpan').text(percent + '%');
},50);
// delay is in milliseconds
```

**$(selector).naturalHeight()**

Retrieve the natural height of an image (height that it would be absent any CSS styling). To execute the method, simply call it (no parameters accepted).

Example:
```html
console.log($('img').naturalHeight());
// assuming img dimensions are 300x200 (W x H), logs 200
```

**$(selector).naturalWidth()**

Retrieve the natural width of an image (width that it would be absent any CSS styling). To execute the method, simply call it (no parameters accepted).

Example:
```html
console.log($('img').naturalWidth());
// assuming img dimensions are 300x200 (W x H), logs 300
```

**$(selector).unselectable()**

Apply CSS- and attribute-based values to prevent item from being selectable by mouse. To execute the method, you can pass in the following parameters:
+ boolean value, to determine if children should be selectable *(boolean, optional with default of false)*

Example:
```html
$('.NoSelect').unselectable();
// it, and all its children, are unselectable

$('.NoSelectOnlyMe').unselectable(true);
// it is unselectable, but children remain selectable
```

**$(selector).unstyle()**

Remove inline styling applied with *css* method (native to jQuery). To execute the method, you can pass in the following parameters:
+ style(s) to be removed *(string / array, optional)*
  + if multiple styles are to be removed, pass array with string values for each to remove

Examples:
```html
$(.NoStyle).unstyle();
// removes all inline styles

$('.NoBackgroundColor').unstyle('background-color');
// removes only background-color applied inline

$('.NoColors').unstyle(['background-color','color']);
// removes both background-color and color applied inline
```

### Future goals

While the scope of this will remain small, there are a few points of expansion I hope to eventually target:
+ Enhance Promise functionality (adding timeout function)
+ Expansion of window and document attributes
+ Expansion of feature detection
+ More built-in published topics
+ Any recommendations

Enjoy!
