bolster
=======

Library to augment jQuery with additional functionality

### Purpose

jQuery is a wonderful, magical, omnipresent library that makes the lives of most developers a little easier. Who are we kidding, a lot easier. But the fact is ... it is missing some pieces that have become very common in today's JavaScript world. We use other libraries to assist with this, but as the list of resources and external calls grows, so does your pageload times. The goal of this library is to centralize these features into a single, compact augmentation library, using syntax that jQuery users are familiar with.

### Size

+ Uncompressed: 23.73KB
+ Minified: 9.96KB
+ Minified and gzipped: 3.6KB

### Components

+ $ methods
  + Publish / Subscribe
  + Feature detection
  + Window values
+ $(selector) methods
  + Setting / removing / detecting "active" elements
  + Completion of image loading
  + Setting attributes to not be selectable
  + Removing inline styling

### $ Methods

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

**$.subscribe()**

Subscribe to a topic, so that a specific function you pass in will be executed upon each publishing of that topic. To execute the method, a single object is passed in with the following components:
+ topic *(string / array, required)*
  + Name of topic(s) to which you are subscribing
  + If subscribing to multiple topics, provide them as strings in an array
+ name *(string, required)*
  + Unique name of subscription
+ fn *(function, required)*
  + Function that will be executed upon each publishing of given topic

Example:
```html
$.subscribe({
  // topic:'divClick',
  topic:['divClick','windowSize'],
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
+ windowSize
  + data provided is object with the following values:
    + width *(window width)*
    + height *(window height)*
+ windowScroll
  + data provided is object with the following values:
    + scrollTop *(scrollTOp relative to top of document)*

**$.unsubscribe()**

Remove subscription(s) to a topic based on subscription name passed in. To execute the method, a single object is passed in with the following components:
+ name *(string, required)*
  + Unique name of subscription

Example:
```html
$.unsubscribe({
  name:'getDivDimensions'
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

**$.window()**

Provide window-specific attribute, based on the parameter passed. To execute the method, pass in the string value of the attribute (a parameter is always required). The following parameters can be passed:
+ width
+ height
+ scrollTop
+ dimensions
  + returns object with the following values:
    + width
    + height

Example:
```html
var dims = $.window('dimensions');

if((dims.width > 100) && ($.window('scrollTop') > 300)){
  // do some wacky window stuff
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
+ Promise functionality
+ Expansion of window attributes
+ Expansion of feature detection
+ More built-in published topics
+ Any recommendations

Enjoy!
