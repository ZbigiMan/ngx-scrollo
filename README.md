# ngx-scrollo

### Angular 2+ directive
### Angular Scroll animations made simple and responsive

#### Example: https://github.com/ZbigiMan/ngx-scrollo-example

#### Live demo: http://zbigiman.com/ngx-scrollo-example

### Install:
```bash
npm i ngx-scrollo
```
### Import:
```javascript
import { NgxScrolloModule } from 'ngx-scrollo';

@NgModule({
    // ...
    imports: [
        NgxScrolloModule,
        // ...
    ],
    // ...
})
```

## Use:

### The `tweenBegin` and `tweenEnd` properties:
`tweenBegin` - Number from 1 to 100, relative to viewport height

`tweenEnd` - Number from 1 to 100, relative to viewport height

### Inline style properties animation:

`tweenFrom` - start CSS properties

`tweenTo` - end CSS properties

example:
```html
<h1
  class="title"
  ngx-scrollo
  [tweenBegin]="1"
  [tweenEnd]="100"
  [tweenFrom]="{letterSpacing : '0vw', fontSize : '2.25em', opacity: '1'}"
  [tweenTo]="{letterSpacing : '6vw', fontSize : '0em', opacity: '0'}"
  [tweenEasing]="'easeOutQuad'"
  [tweenOnBegin]="animOneOnBegin"
  [tweenOnEnd]="animOneOnEnd"
  [tweenOnReverseBegin]="animOneOnReverseBegin"
  [tweenOnReverseEnd]="animOneOnReverseEnd"
  [tweenOnProgress]="animOneOnProgress"
>
  ngx-scrollo
</h1>
```

### Animate using CSS clasess:
`scrolloTweenOnBegin` - class added on scroll tween begin

`scrolloTweenOnEnd` - class added on scroll tween end

example:
```html
<pre
   class="prettyprint lang-js"
   ngx-scrollo
   [tweenBegin]="1"
   [tweenEnd]="30"
 >
   {{ codeExamples.install }}
 </pre>
```

```css
pre {

  // ...
        
  &.scrolloTweenOnBegin {
     opacity: 0.9;
     transform: perspective(146rem) rotateX(0deg) rotateY(0deg) scale(1.1);
  }

   &.scrolloTweenOnEnd {
     opacity: 0.9;
     transform: perspective(146rem) rotateX(0deg) rotateY(0deg) scale(1);
   }
}
```

### Smooth scroll to anchor:
Works only on html A tag.

example:
```html
<a
  href="#bottom"
  ngx-scrollo
  [tweenDuration]="6000"
  [tweenEasing]="'linear'"
>
</a>
```

### Callback functions:
`tweenOnBegin`

`tweenOnEnd`

`tweenOnReverseBegin`

`tweenOnReverseEnd`

`tweenOnProgress`

### The `tweenEasing` property:

ngx-sxrollo implements jQuery Easing v1.3 plugin functions* by gesheo - https://gist.github.com/gesheo/6194940 under BSD Licence.

*&nbsp;Only gesheo's easing functions are used, ngx-scrollo is undepended of jQuery lib.

### Easing types:
* linear
* swing
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInCirc
* easeOutCirc
* easeInOutCirc
* easeInElastic
* easeOutElastic
* easeInOutElastic
* easeInBack
* easeOutBack
* easeInOutBack
* easeInBounce
* easeOutBounce
* easeInOutBounce

### Licence:

ngx-scrollo:
* MIT

jQuery Easing v1.3
* BSD