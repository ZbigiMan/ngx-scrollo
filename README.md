# ngx-scrollo

## Angular 2x directive
## Scroll animations made simple and responsive

# How to use

### tweenBegin and tweenEnd properties
`tweenBegin` - Number from 1 to 100, relative to viewport height

`tweenEnd` - Number from 1 to 100, relative to viewport height

### Inline style properties animation

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

### Animate using CSS clasess
`scrolloTweenOnBegin` - class added on scroll tween begin

`scrolloTweenOnEnd` - class added on scroll tween end

example:
```html
<div 
  class="box"
  ngx-scrollo
  [tweenBegin]="50"
>
```

```css
.box {
  transform: perspective(146rem) rotateX(10deg) rotateY(70deg) scale(0.5);
  transition: all 1s ease;
        
  &.scrolloTweenOnBegin {
  opacity: 1;
  transform: perspective(146rem) rotateX(0deg) rotateY(0deg) scale(1);
  }
}
```

### Callback functions
`tweenOnBegin`

`tweenOnEnd`

`tweenOnReverseBegin`

`tweenOnReverseBegin`

`tweenOnReverseEnd`

`tweenOnProgress`

