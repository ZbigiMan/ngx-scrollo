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
import { ScrolloModule } from 'ngx-scrollo';

@NgModule({
    // ...
    imports: [
        ScrolloModule,
        // ...
    ],
    // ...
})
```

## Use:

### The `scrolloBegin` and `scrolloEnd` properties:
`scrolloBegin` - Number from 1 to 100, relative to viewport height

`scrolloEnd` - Number from 1 to 100, relative to viewport height

### Inline style properties animation:

`scrolloFrom` - start CSS properties

`scrolloTo` - end CSS properties

example:
```html
<h1
  class="title"
  ngx-scrollo
  [scrolloBegin]="1"
  [scrolloEnd]="100"
  [scrolloFrom]="{letterSpacing : '0vw', fontSize : '2.25em', opacity: '1'}"
  [scrolloTo]="{letterSpacing : '6vw', fontSize : '0em', opacity: '0'}"
  [scrolloEasing]="'easeOutQuad'"
  [scrolloOnBegin]="animOneOnBegin"
  [scrolloOnEnd]="animOneOnEnd"
  [scrolloOnReverseBegin]="animOneOnReverseBegin"
  [scrolloOnReverseEnd]="animOneOnReverseEnd"
  [scrolloOnProgress]="animOneOnProgress"
>
  ngx-scrollo
</h1>
```

### Animate using CSS clasess:
`scrolloOnBegin` - class added on scroll tween begin

`scrolloOnEnd` - class added on scroll tween end

example:
```html
<pre
   class="prettyprint lang-js"
   ngx-scrollo
   [scrolloBegin]="1"
   [scrolloEnd]="30"
 >
   {{ codeExamples.install }}
 </pre>
```

```css
pre {

  // ...
        
  &.scrolloOnBegin {
     opacity: 0.9;
     transform: perspective(146rem) rotateX(0deg) rotateY(0deg) scale(1.1);
  }

   &.scrolloOnEnd {
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
  [scrolloDuration]="6000"
  [scrolloEasing]="'linear'"
>
</a>
```

### Callback functions:
`scrolloOnBegin`

`scrolloOnEnd`

`scrolloOnReverseBegin`

`scrolloOnReverseEnd`

`scrolloOnProgress`

### The `scrolloEasing` property:

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
