---
layout: post
title: How to write cleaner JavaScript - a Primer
---

I'm just going to come out and say it;

I actually *like* JavaScript.  I know a lot of people don't, and I agree that it has some nasty warts (try to show me a language that doesn't, though).  Regardless of how you feel about it, we can all agree that good coding practices are something we should all strive for.  I'll cover some general guidelines and rules that I try to follow that helps makes things easier, if not even a little fun.

My goals with good JavaScript are fairly simple:

-	Separate data from logic.
-	Reduce surprises and side-effects.
-	Make no assumptions.
-	Favor functional abstraction over other forms of abstraction.
-	Be easy to read, be consistent, and use good practices.

I'll go ahead and cover these, and give some code examples to illustrate points.

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

This takes a few liberties with our prior example - it assumes that you could change the markup to enable you to add some classes, but this helps with separations of concern.  Let our data have good descriptors, and our logic can better leverage that.  This also skips some unnecessary steps (doing a .find() to get something by ID) and tightens things up considerably.  Now if we want a new menu item, we only need add the item in our markup and give it that particular class instead, as well as add the appropriate child element.

## Reduce surprises and side-effects

Surprises are things that we don't expect to happen.  For instance, features used in ways that are inconsistent with what they're normally used for.  Side-effects are things like creating new variables unnecessarily, or creating new object instances when it's completely unnecessary.  Take a look at the following example.

{% highlight js %}
var myArray = ['one', 'two', 'three', 'four', 'five'];

for (var i = 0; i < myArray.length; i++) {
	new getWeird(myArray[i]);
};
{% endhighlight %}

This code uses a constructor in a surprising way - it creates an object that isn't saved anywhere, which makes it completely unnecessary.  This also uses a traditional array iterator, which creates an extra variable that's entirely unnecessary and unrelated to what we're trying to accomplish.  We could instead do something like this:

{% highlight js %}
var myArray = ['one', 'two', 'three', 'four', 'five'];

myArray.forEach(getWeird);
{% endhighlight %}

This ditches the constructor and doesn't create unnecessary objects/variables.  It keeps things predictable.  Even though we don't have the code for the `getWeird` function, you'd know it's simply being called, instead of creating a new object.  The more astute readers out there will want to point out that Array.prototype.forEach doesn't exist in IE8 - if you need to support older browsers, I'd encourage you to check out a polyfill library like [es5-shim](https://github.com/ljharb/es5-shim) and its bretheren to fill in those gaps for you.  Even a minimal build will save you some headaches.

## Make no assumptions

This rule is related to my earlier one about not tying data and logic together.  Each function should be a self-contained unit of logic, without any notions about current state or available data.  It can take a little extra effort to manually pass data around, but it can be worth it in the long run with better code reuse.  This example ties things together a little too much:

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

This is a little more verbose and may be entirely unnecessary in some cases, but if we're in a situation where we're working with many objects in a similar way this could be very useful and ultimately save us some time.

## Favor functional abstraction over other forms of abstraction

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

My getIndexOneInArray function might break the rule of no assumptions, but the name is very clear about what it's doing.  This sort of abstraction is useful when we need to make the same call repeatedly and don't want to write the same code over and over.  It also provides a clear name to the logic, which goes a long way into the last goal.

## Be easy to read, be consistent, and use good practices

These are generla guidelines I use for almost all languages I work in.  Some of them can't be followed all the time (single quotes for strings in Java, for instance), but I find them to be generally applicable.

Avoid short variable names for the sake of brevity.  Instead, use clear, expressive names when possible.  A little extra typing isn't a bad thing, especially when we have code completion in any editor worth using.  camelCasing is also a great idea - it helps others differentiate between words.  Use single quotes for all strings.

I won't get into the tabs vs. spaces debate, but pick one and use it, and consistently indent everything.  I tend to prefer tabs since anybody can configure their editor to display them at any arbitrary width, instead of enforcing your particular preferences on other people.  Don't rely on ASI, since the extra cognitive overhead for most people outweighs any redeeming qualities it may (or may not) have.  Use strict equality.

Try to use questions for booleans.  A variable named `isActiveRecord` is very clearly a status bit and will help whoever touches the file next know that.  Prepend method names with verbs, like `get`, `set`, `push`, `add`, etc.  These will help others know what is and is not a method at a quick glance.

This code is not clear what it's trying to do, and is also very hard to follow:

{% highlight js %}

var md = {
  p1: 'a string',
p2: 'something else',
  	p1isweird: function() {
		if (this.p1 != 'nunchucks')
		this.p1 = 'a different value'
		}
}
console.log(md.p1)
md.p1isweird()
console.log(md.p1)

{% endhighlight %}

It should be formatted like this instead.

{% highlight js %}

var myData = {
	prop1: 'a string',
	prop2: 'something else',
	updateProp1: function(testValue, newValue) {
		if (this.prop1 !== testValue) {
			this.prop1 = newValue;
		}
	}
};

console.log(myData.prop1);

myData.updateProp1('nunchucks', 'a different value');

console.log(myData.prop1);

{% endhighlight %}

This is much more readable.  Meaningful names make things much easier to follow and understand.  Consistent, clean indentation also serves to make things easier to read by giving our eyes a more natural path to follow - whitespace is an often forgotten tool, especially vertical whitespace.

## A Summary

These guidelines are simply that - many people disagree with some of these points, or have their own personal style guides that works better for them.  Programming is a very difficult thing to do, so anything we can do to ultimately simplify and ease some of our pain is very welcome.  Experiment around and keep learning.  Question your assumptions and investigate claims always.  You'll be surprised by how much you'll ultimately learn.