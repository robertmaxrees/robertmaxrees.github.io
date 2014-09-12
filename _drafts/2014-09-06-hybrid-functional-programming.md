---
layout: post
title: Hybrid Functional Programming in JavaScript - A Primer
---

I'm just going to come out and say it.

I *really* don't like [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming) in JavaScript.  Traditional OOP relies on class-based inheritance, something that can be emulated in JavaScript, though not terribly well.  If you've ever tried any of the numerous techniques, you know it can feel really awkward.  Luckily, JavaScript isn't a one-trick pony - it can suport a variety of techniques much better than OOP, and today we'll focus on one I've been working with lately I like to call Hybrid Functional Programming.

My goals with HFP are fairly simple:

-	Separate data from logic.
-	Reduce surprises and side-effects.
-	Make no assumptions.
-	Favor functional composition over other forms of abstraction.
-	Be easy to read, and be consistent.

I'll go ahead and cover these, and give some code examples where possible.

## Separate data from logic

I've seen code like this more than a few times:

{% highlight js %}
$('#one').on('click', function(e) {
    e.preventDefault();

    $('#one').find('#sub-menu-' + $('#one').data('child-menu')).show();
});

$('#two').on('click', function(e) {
    e.preventDefault();

    $('#two').find('#sub-menu-' + $('#two').data('child-menu')).show();
});

$('#three').on('click', function(e) {
    e.preventDefault();

    $('#three').find('#sub-menu-' + $('#three').data('child-menu')).show();
});
{% endhighlight %}

Though contrived, this should illustrate the idea - this repeats code unnecessarily because it's tying logic to our data.  We could simplify it by doing something like this instead:

{% highlight js %}
var openMenu = functon(e) {
	e.preventDefault();

	var $this = $(this),
		$subMenu = $this.find('.subMenu');

	$subMenu.show();
};

$('.parentMenus').on('click', openMenu);
{% endhighlight %}

This takes a few liberties with our prior example - it assumes that you could change the markup to enable you to add some classes, but this helps with out separations of concern.  Let our data have good descriptors, and our logic can better leverage that.  This also skips some unnecessary steps (doing a .find() to get something by ID) and tightens things up considerably.  Now if we want a new menu item, we only need add the item in our markup and give it that particular class instead, as well as add the appropriate child element.

## Reduce surprises and side-effects

Surprises are things that we don't expect to happen.  For instance, features used in ways that are inconsistent with what they're normally used for.  Side-effects are things like creating new variables unnecessarily, or creating new object instances when it's completely unnecessary.  The following code should illustrate the point.

{% highlight js %}
var myArray = ['one', 'two', 'three', 'four', 'five'];

for (var i = 0; i < myArray.length; i++) {
	new GetWeird(myArray[i]);
};
{% endhighlight %}

This code uses a constructor in a surprising way (to create an object that isn't saved anywhere) and creates an i variable that we simply don't need.  We could instead do something like this:

{% highlight js %}
var myArray = ['one', 'two', 'three', 'four', 'five'];

var getWeird = function(currentNumber) {
	console.log('you\'re on number ' + currentNumber);
};

myArray.forEach(getWeird);
{% endhighlight %}

This ditches the constructor and doesn't create unnecessary objects/variables.  It keeps things predictable.  Even if I did't give you the code for the function, you'd know it was simply being called, instead of creating a new object.

## Make no assumptions

This rule is related to my earlier one about not tying data and logic together.  Basically, each function should be a self-contained unit of logic, without any notions about current state or available data.  It can take a little extra effort to manually pass data around, but it can be worth it in the long run when you wind up reusing code everywhere.  This example ties things together a little too much:

{% highlight js %}
var myData = {
	'prop1': ['some data', 'some more data'],
	'prop2': ['something else', 'get strange'],
	'prop3': ['this is contrived', 'no really']
};

var getAnArrayValue = function(propName) {
	return myData[propName][1];
};

console.log(getAnArrayValue('prop2'));
{% endhighlight %}

The getAnArrayValue function here is assuming a few things - which object we're using and which index we want.  This would be better written like this:

{% highlight js %}
var myData = {
	'prop1': ['some data', 'some more data'],
	'prop2': ['something else', 'get strange'],
	'prop3': ['this is contrived', 'no really']
};

var getAnArray = function(propName, object) {
	return object[propName];
};

var getAnArrayValue = function(propName, object, index) {
	var theArray = getAnArray(propName, object);

	return theArray[index];
};

console.log(getAnArrayValue('prop2', myData, 1));
{% endhighlight %}

This is a little more verbose, but if we had multiple similar objects we wanted an array from we'd have a generic function to work with.

## Favor functional composition over other forms of abstraction

JavaScript has some pretty wonderful capabilities when it comes to working with functions.  Since functions are objects, we can pass them around.  You saw an example of this before with the section about making no assumptions.  With clear naming and good use of partials, we can abstract out some of our logic in sensible ways that maintain readability.  Extending our example from before, it might look something like this:

{% highlight js %}
var myData = {
	'prop1': ['some data', 'some more data'],
	'prop2': ['something else', 'get strange'],
	'prop3': ['this is contrived', 'no really']
};

var getAnArray = function(propName, object) {
	return object[propName];
};

var getAnArrayValue = function(propName, object, index) {
	var theArray = getAnArray(propName, object);

	return theArray[index];
};

var getIndexOneInArray = function(propName, object) {
	return getAnArrayValue(propName, object, 1)
};

console.log(getIndexOneInArray('prop2', myData));
{% endhighlight %}

The astute ones of you out there will notice that the new getIndexOneInArray function might break the rule of no assumptions, but the name is very clear about what it's doing.  This sort of abstraction is useful when we need to make the same call repeatedly and don't want to write the same code over and over.

Also, clear naming goes a long way into the last goal.

## Be easy to read, and be consistent

This is a general guideline for programming in general, but it's important enough to be enumerated on here as well.  Avoid short variable names for the sake of brevity.  Use clear, expressive names when possible.  A little extra typing isn't a bad thing, especially when we have code completion in any editor worth using.  camelCasing is also a great idea - it helps others differentiate between words.  Use single quotes for all strings.

I won't get into the tabs vs. spaces debate, but pick one and use it.

Try to use questions for booleans.  A variable named `isActiveRecord` is very clearly a status bit and will help whoever touches the file next know that.  Prepend method names with verbs, like `get`, `set`, `push`, `add`, etc.  These will help others know what is and is not a method object at a quick glance.

This code is not clear what it's trying to do:

{% highlight js %}

var md = {
	'p1': 'a string',
	'p2': 'something else',
	'p1isweird': function() {

	}
}


{% endhighlight %}
