---
layout: post
title: Be Smarter About Events
---

Probably the largest "woah" moment I ever had early on with in-browser JavaScript was when I learned about events.  That was followed shortly by learning about bubbling and capturing and delegation, which really opened my eyes.  Then seeing how jQuery [abstracts it all away](http://api.jquery.com/on) made events one of my favorite features of JS.  They're so simple to use effectively and hard to really screw up.

Mostly.

What follows are some of the guidelines I use when dealing with events.  These aren't all set rules, but I've found they've largely made my life a lot easier.

## Understand everything .on() can do in jQuery

`$.fn.on()` is an incredibly powerful tool that happens to have some features people don't bother to research or have simply never heard of.  If we look at the docs, we'll see that .on() takes up to 4 arguments.  They are `events [, selector ] [, data ], handler`.  Most people are aware of `events` and `handler`.  Some people know about `selector`, and very few know about `data`, which is a shame because one of my favorite tricks with AJAX and forms can be handled with it.

### Learn about .trigger(), too!

## Learn about delegation and how to use it

## Don't juggle bindings

## Most of jQuery's convenience methods for events map to .on()

{% highlight js %}
$('#one').on('click', function(e) {
    e.preventDefault();

    $('#one').find('#sub-menu-' + $('#one').data('child-menu')).show();
});
{% endhighlight %}
