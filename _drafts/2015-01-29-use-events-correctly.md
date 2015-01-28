---
layout: post
title: Be Smarter About Events
---

Probably the largest "woah" moment I ever had early on with in-browser JavaScript was when I learned about events.  That was followed shortly by learning about bubbling and capturing and delegation, which really opened my eyes.  Then seeing how jQuery [abstracts it all away](http://api.jquery.com/on) made events one of my favorite features of JS.  They're so simple to use effectively and hard to really screw up.

Mostly.

What follows are some of the guidelines I use when dealing with events.  These aren't all set rules, but I've found they've largely made my life a lot easier.

## Understand everything .on() can do in jQuery

`$.fn.on()` is an incredibly powerful tool that happens to have some features people either haven't heard of, or never bother to research.  If we look at the docs, we'll see that .on() takes up to 4 arguments.  They are `events [, selector ] [, data ], handler`.  Most people are aware of `events` and `handler`.  Some people know about `selector`, and very few know about `data`, which is a shame because one of my favorite tricks with AJAX and forms can be handled with it.

### Basic event binding

Let's take a look at a basic event binding example:
<iframe width="100%" height="150" src="http://jsfiddle.net/robertmaxrees/xamv2cb3/embedded/result,js,html,css/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This is fairly straightforward, right?  We've all written (or seen) code like this before, but there are some considerations to make.

Notice the use of `e.preventDefault();`.  You may have seen this, or `e.stopPropagation();`, as well as `e.stopImmediatePropagation();` and `return false;`.  There are some important differences between these methods that we should be aware of.  `e.preventDefault();` stops the default action from occurring.  In this case, it stops the browser from trying to navigate to the given href, which would append a `#` to the end of the URL in most cases.  This is especially helpful in cases when we want to have a fallback for users without JavaScript enabled, but want to enhance the experience for those who do.

`e.stopPropagation();` is an interesting one, and it touches on a subject I'll cover a little bit more later, but this basically stops the event from bubbling up - event bubbling (and capturing) is covered at length in [many](http://www.quirksmode.org/js/events_order.html) [other](http://www.nczonline.net/blog/2009/06/30/event-delegation-in-javascript/) [places](http://javascript.info/tutorial/bubbling-and-capturing).  The short of it is that most events "bubble up" through the document from the element that emitted it all the way to the root of the page.  I'll leave the mental gymnastics of understanding how you bubble "up" to the "root" of something to you.  `e.stopPropagation();` comes in handy in cases where we don't want this behavior.  Take a look at this example:
<iframe width="100%" height="180" src="http://jsfiddle.net/robertmaxrees/x9durj0k/1/embedded/result,js,html,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

If you remove the `e.stopPropagation();` call from the click event binding on the anchor, you'll cause both elements to get a border when you click on just the anchor.  This is because the event bubbles up and triggers the event listener on the div.  Be careful, however, because you can quickly shoot yourself in the foot with this method.  If we added it to the div's event listener, then removed it from the anchor tag's listener, and then needed to add a "global" listener to the entire document, we'd never see clicks on the anchor.  Only stop propagation when you really need to.  Otherwise, leave it alone.

You might see that we also have `e.stopImmediatePropagation();` and think "ugh, ANOTHER one?!", but this one is pretty simple.  It simply combines the effects of the other two into one convenient call.  Told you it was simple.

We have a 4th choice, and it's one that I often suggest people avoid because it's an implicit behavior and can cause headaches later on when refactoring code.  The internals of the jQuery event handling system recognize any listener that returns false and runs `e.stopImmediatepropagation();` internally for you.  For this reason, I suggest that you avoid using `return false;` and instead explicitly run one of the aformentioned methods instead.

## Understand the event object

In the preceding examples, you'll notice that we ran methods against something called `e`.  This is shorthand for "event", and we could just have easily replaced every instance of the object name with the full word if we wanted to.  The code would function exactly the same.  We could also call it "monkey", or "cabbage" or any other valid variable name.  `e` is simply a common abbreviation for it.

The event object contains a lot of useful information and methods.  Some information we can glean includes:

-	`e.bubbles`: tells us if the event can bubble, regardless of any methods that might prevent otherwise.
-	`e.target`: tells us information about the element that emitted the event.  Helpful for non-delegated listeners that we want more specifics on.
-	`e.isDefaultPrevented()`: tells us if the handler ran `e.preventDefault();`

There are many more properties available on the event object.  I encourage you to familiarize yourself with them so you know what's available to you.

## Abstract out that handler

### finish me
You'll often see people use inline anonymous functions for event handlers, but this robs us of the ability to abstract out our code, which is particularly handy when we want multiple bindings to run the same handler

## Learn about delegation and how to use it

### finish me
I briefly mentioned event bubbling earlier and how to prevent it, but also noted that you should avoid it when possible because of being able to add event listeners to the document in general for them.  This uses something called "event delegation" and is an incredibly powerfull tool.  

### Learn about .trigger(), too!

## Don't juggle bindings

## Most of jQuery's convenience methods for events map to .on()

{% highlight js %}
$('#one').on('click', function(e) {
    e.preventDefault();

    $('#one').find('#sub-menu-' + $('#one').data('child-menu')).show();
});
{% endhighlight %}
