---
layout: post
title: Hybrid Functional Programming in JavaScript - A Primer
---

I'm just going to come out and say it.

I *really* don't like [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming) in JavaScript.  Traditional OOP relies on class-based inheritance, something that can be emulated in JavaScript, though not terribly well.  If you've ever tried any of the numerous techniques, you know it can feel really awkward.  Luckily, JavaScript isn't a one-trick pony - it can suport a variety of techniques much better than OOP, and today we'll focus on one I've been working with lately I like to call Hybrid Functional Programming.

My goals with HFP are fairly simple:

-	Separate data from logic.
-	Favor functional composition over other forms of abstraction.
-	Reduce surprises and side-effects.
-	Make no assumptions.
-	Be easy to read.

I'll go ahead and cover these, and give some code examples where possible.

## Separate data from logic

Far too often do we see code like this:

{% highlight js %}
$('#one').on('click', function(e) {
    e.preventDefault();
    $('#one').sibling('.somethingElseOne').data('someValue');
});

$('#two').on('click', function(e) {
    e.preventDefault();
    $('#two').sibling('.somethingElseTwo').data('someValue');
});

$('#three').on('click', function(e) {
    e.preventDefault();
    $('#three').sibling('.somethingElseThree').data('someValue');
});
{% endhighlight %}

Code like this is bulky, and it ties our logic to our data, because it doesn't distingui

## Favor functional composition over other forms of abstraction

JavaScript has some pretty wonderful capabilities when it comes to working with functions.  In particular


{% highlight js linenos %}
// Do this - simpler and binds a single listener.  Less overhead.
$('div').on('click', 'a', function(e) {
    e.preventDefault();
    console.log('delegated listener for ' + $(this).prop('id'));
});
{% endhighlight %}