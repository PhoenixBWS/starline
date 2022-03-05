# starline
ES6 Module to easily deploy image marquee with HTML5 Canvas
[![version]()]

### Basic Integration
1. Download the main branch and copy the `starline.min.js` from the `dist` directory to your project.
2. Format your HTML:

Create your own JS file from where we shall call the module. Here, we are calling it `initiator.js`. Add it as a module inside your HTML's `<head>` tag. Add `defer` attribute in it.
```
<script type="module" src="/path/to/initiator.js" defer ></script>
```
Now, place a `<canvas>` element wrapped in a `<div>` with `position: relative` style applied in it. Create a data attribute with the name `data-starline-srcset` in the canvas and type in the path of the images you want to display separated by comma as its value like below:
```
<div style="position: relative;" >
  <canvas data-starline-srcset="https://eg.site/external/image.jpg, /local/image.webp, /like/so/on.png" ></canvas>
</div>
```
3. Set it up

Add the following line at the very top of the `initiator.js`:
```
import starline from '/path/to/starline.min.js';
```
After that, use the Query Selector for the `<canvas>` elements in your `HTML` to initialize. You can put this line anywhere based on your needs. In this example, we are targeting canvas element with class `starline`:
```
new starline(".starline");
```

### Options
Starline.js is pretty straight forward with a pretty basic syntax. The constructor accepts 2 parameters:
```
new starline(querySelector, options);
```

**querySelector:** string _(Required)_
**options:** object _(Optional)_

There are currently 7 options available:

```
**mode:** string _("horizontal")_
```
Sets the animation direction. Accepts "horizontal" or "vertical" as value.

```
**speed:** int _(100)_
```
A positive or negative integer representing the movement in pixel/sec. Positive value in "horizontal" mode sets right-to-left animation and in "vertical" mode sets bottom-to-top animation. Negative value reverses the animation direction.

```
**hoverPause:** bool _(false)_
```
If set to true, hovering over the respective canvas will pause the animation.

```
**radius:** int _(0)_
```
Accepts a positive integer value. Sets border radius on all the images in pixel.

```
**gap:** int _(32)_
```
Accepts a positive integer value. Sets gap between the images in pixel.

```
**width:** int|string _(128)_
```
`Effective only in "vertical" mode.` Accepts a positive integer value (as pixel) or a string with a valid css representation of length to set an equal amount of width for the images and the canvas element itself. Dynamic values (eg. "40%") rely on the nearest relatively set container's dimension. Height for the images are set automatically maintaining the aspect ratio.

```
**height:** int|string _(96)_
```
`Effective only in "horizontal" mode.` Accepts a positive integer value (as pixel) or a string with a valid css representation of length to set an equal amount of height for the images and the canvas element itself. Dynamic values (eg. "25%") rely on the nearest relatively set container's dimension. Width for the images are set automatically maintaining the aspect ratio.

### Donate
Donation options will be available soon!
