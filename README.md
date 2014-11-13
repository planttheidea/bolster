bolster
=======

Library to augment jQuery with additional functionality

### Purpose

jQuery is a wonderful, magical, omnipresent library that makes the lives of most developers a little easier. Who are we kidding, a lot easier. But the fact is ... it is missing some pieces that have become very common in today's JavaScript world. We use other libraries to assist with this, but as the list of resources and external calls grows, so does your pageload times. The goal of this library is to centralize these features into a single, compact augmentation library, using syntax that jQuery users are familiar with.

### Size

+ Uncompressed: 23.06KB
+ Minified: 9.72KB
+ Minified and gzipped: 3.52KB

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

### Methods

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
  topic:'divClick',
  // topic:['divClick','windowSize'],
  name:'getDivDimensions',
  fn:function(data,topic){
    console.log(data); // result: {height:100,width:200}
    console.log(topic); // result: divClick
  }
});

**$.unsubscribe**

Remove subscription(s) to a topic based on subscription name passed in. To execute the method, a single object is passed in with the following components:y
+ name *(string, required)*
  + Unique name of subscription

Example:
```html
$.unsubscribe({
  name:'getDivDimensions'
});
```
