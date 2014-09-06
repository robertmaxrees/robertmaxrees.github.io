---
layout: post
title: Hybrid Functional Programming in JavaScript - A Primer
---

<h1>IGNORE ME</h1>

I'm just going to come out and say it.

I *really* don't like [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming) in JavaScript.  Traditional OOP relies on class-based inheritance, something that can be emulated in JavaScript, though not terribly well.  If you've ever tried any of the numerous techniques, you know it can feel really awkward.  Luckily, JavaScript isn't a one-trick pony - it can suport a variety of techniques much better than OOP, and today we'll focus on one I've been working with lately I like to call Hybrid Functional Programming.

My goals with HFP are fairly simple:

-	Favor functional composition over other forms of abstraction.
-	Create reusable code.
-	Reduce surprises and side-effects.
-	Separate data from logic.
-	Give meaningful names to things.
-	Make no assumptions.
-	Be easy to read.
-	Be modular.

Let's start by briefly covering each of these ideas, and then we'll dive into some code examples to illustrate how to apply them.

## Favor functional composition over other forms of abstraction



{% highlight js linenos %}
// Don't do this - code duplication, and three separate listeners.
$('#one').on('click', function(e) {
    e.preventDefault();
    console.log('direct listener for one.');
});

$('#two').on('click', function(e) {
    e.preventDefault();
    console.log('direct listener for two.');
});

$('#three').on('click', function(e) {
    e.preventDefault();
    console.log('direct listener for three.');
});

// Do this - simpler and binds a single listener.  Less overhead.
$('div').on('click', 'a', function(e) {
    e.preventDefault();
    console.log('delegated listener for ' + $(this).prop('id'));
});
{% endhighlight %}