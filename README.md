# Crumble

A quirky, interactive feature tour using [grumble.js](https://github.com/jamescryer/grumble.js) for steps along the way.

<img src="https://github.com/tommoor/crumble/blob/master/examples/screenshot.png?raw=true" />

[See the live demo here](http://tommoor.github.com/crumble/).


## Documentation

Crumble works as a jquery plugin, the meta information for the tour is stored as a standard ordered list in the page HTML.

### Basic Usage

```javascript
$('#tour').crumble();
```

```html
<ol id="tour" style="display: none;">
  <li data-target="#one" data-angle="130">
    The first step in the tour
  </li>
  <li data-target=".two" data-options="distance:20">
    This is the second step in the tour
  </li>
</ol>
```

The text of each list element becomes the tour text, this is best kept as short as possible. The possible parameters are:

* data-target: A selector that tells the tour which element on the page to point at. (required)
* data-angle: An override for the angle of the bubble between 0-360 (optional)
* data-options: A list of options that will be passed to grumble seperated by semicolons. (optional)


### Options

Crumble can take a range of options to customise it's behaviour and look.

* scrollSpeed: the speed at which the page will scroll into position if a tour step is off screen.
* grumble: this object gets passed straight to grumble.js and can include any of the options [outlined here](http://jamescryer.github.com/grumble.js/)
* onStep: this callback gets triggered every time the user moves forward in the tour
* onStart: this callback gets triggered at the beginning of the tour
* onFinish: this callback gets triggered when the tour ends

```javascript
$('#tour').crumble({
  scrollSpeed: 'fast',
  grumble: {
    distance: 40
  },
  onStep: function(){
    console.log('you moved forward');
  },
	onStart: function(){
    console.log('you started the tour');
  },
	onFinish: function(){
    console.log('you finished the tour');
  }
});
```

## License / Credits

Crumble is released under the MIT license. It is simple and easy to understand and places almost no restrictions on what you can do with Crumble.
[More Information](http://en.wikipedia.org/wiki/MIT_License)

Crumble depends on and was inspired by [Grumble.js](https://github.com/jamescryer/grumble.js)


## Download

Releases are available for download from
[GitHub](http://github.com/tommoor/crumble).