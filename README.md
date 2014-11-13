bolster
=======

Library to augment jQuery with additional functionality

### Purpose

jQuery is a wonderful, magical, omnipresent library that makes the lives of most developers a little easier. Who are we kidding, a lot easier. But the fact is ... it is missing some pieces that have become very common in today's JavaScript world. We use other libraries to assist with this, but as the list of resources and external calls grows, so does your pageload times. The goal of this library is to centralize these features into a single, compact augmentation library, using syntax that jQuery users are familiar with.

### Size

+ Uncompressed: 23.06KB
+ Minified: 9.74KB
+ Minified and gzipped: 3.53KB

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

**$.publish**

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

**$.subscribe**

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

Built-in topics:
+ windowSize
  + data provided is object with the following values:
    + width *(window width)*
    + height *(window height)*
+ windowScroll
  + data provided is object with the following values:
    + scrollTop *(scrollTOp relative to top of document)*

**$.unsubscribe**

Remove subscription(s) to a topic based on subscription name passed in. To execute the method, a single object is passed in with the following components:
+ name *(string, required)*
  + Unique name of subscription

Example:
```html
$.unsubscribe({
  name:'getDivDimensions'
});
```

**$.supports**

Check if browser supports a specific feature, and there are many features that are tested. To execute the method, pass in the string value for the feature. Features tested (returns boolean value, unless specified):
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

**$.window**

Provide window-specific attribute, based on the parameter passed. To execute the method, pas in the string value of the attribute. The following parameters can be passed:
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

Coming soon
