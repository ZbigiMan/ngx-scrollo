// Circus Scroll 2
// December 2016
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { Directive, ElementRef, HostListener, Input, Renderer, Inject } from '@angular/core';
import { TinTween } from './tin-tween';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[ngx-scrollo]',
    providers: [TinTween]
})

export class ScrolloDirective {

    @Input() tweenBegin: string;
    @Input() tweenEnd: string;
    @Input() tweenFrom: string;
    @Input() tweenTo: string;
    @Input() tweenEasing: string;
    @Input() tweenOnBegin: Function;
    @Input() tweenOnEnd: Function;
    @Input() tweenOnReverseBegin: Function;
    @Input() tweenonReverseEnd: Function;
    @Input() tweenOnProgress: Function;
    @Input() tweenDuration: number;

    private begin = this.tweenBegin;
    private end = this.tweenEnd;
    private from = this.tweenFrom;
    private to = this.tweenTo;
    private easing = this.tweenEasing;
    private onBegin = this.tweenOnBegin;
    private onEnd = this.tweenOnEnd;
    private onReverseBegin = this.tweenOnBegin;
    private onReverseEnd = this.tweenOnEnd;
    private onProgress = this.tweenOnProgress;
    private duration = this.tweenDuration;

    private el;
    private tag;
    private beginParsed;
    private endParsed;
    private started = 0;
    private completed = 0;
    private revStarted = 0;
    private revCompleted = 0;

    private errors = {
        'error': 'Circus Scroll Settings Error.',
        'formToDontMatch': 'tweenFrom and tweenTo values don\'t match.',
        'beginEndDontMatch': 'tweenBegin and tweenEnd values don\'t match.'
    };

    constructor(
        @Inject(DOCUMENT) document,
        public elementRef: ElementRef,
        private renderer: Renderer,
        private tinTween: TinTween
        ) {
        this.tinTween = tinTween;
        this.el = elementRef;
        this.tag = this.el.nativeElement.tagName;

        if (this.duration === undefined) {
            this.duration = 1000;
        }
    }

    @HostListener('click', ['$event']) private onClick(event: Event) {
        if (this.tag === 'A') {
            event.preventDefault();
            const href = this.el.nativeElement.href;
            if (href.indexOf('#') !== -1) {

                const anchorId: string = href.split('#')[1];
                const anchor: HTMLElement = document.getElementById(anchorId);
                const anchorOffset: any = this.offset(anchor);
                const currentScrollTop: number = document.documentElement.scrollTop || document.body.scrollTop;
                let body: HTMLElement;

                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                    body = document.documentElement;
                } else {
                    body = document.body;
                }

                this.tinTween.tween({
                    'element': body,
                    'property': 'scrollTop',
                    'from': currentScrollTop,
                    'to': anchorOffset.top,
                    'duration': this.duration,
                    'onComplete': function (data) {
                        document.location.hash = anchorId;
                    }
                });
            }
        }
    }

    @HostListener('window:scroll', []) private onscroll(el) {

        if (this.begin !== undefined) {

            if (this.end === undefined) {
                this.end = this.begin;
            }

            // Parse 'begin' and end 'values'
            const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const beginVal = parseInt(this.begin, 10);
            const endVal = parseInt(this.end, 10);
            const beginUnit = this.begin.toString().split(beginVal.toString()).join('');
            const endUnit = this.end.toString().split(endVal.toString()).join('');
            const elOffset = this.offset(this.el.nativeElement);

            if (beginUnit !== endUnit) {
                console.error(this.errors.error);
                console.error(this.errors.beginEndDontMatch);
                console.error(this.el);
                return;
            }

            if (beginUnit === 'vh' && endUnit === 'vh') {
                if (elOffset.top > vh) {
                    this.beginParsed = ((beginVal / 100) * vh) + elOffset.top - vh;
                    this.endParsed = ((endVal / 100) * vh) + elOffset.top - vh;
                } else {
                    this.beginParsed = (beginVal / 100) * vh;
                    this.endParsed = (endVal / 100) * vh;
                }

            } else {
                this.beginParsed = beginVal;
                this.endParsed = endVal;
            }


            const scrollTop = window.scrollY;
            let p = (scrollTop - this.beginParsed) / (this.endParsed - this.beginParsed); // progress

            if (p < 1) {
                if (this.completed > 0) {
                    this.revStarted++;
                }
                this.completed = 0;
            }

            if (p >= 1) {
                this.completed++;
                this.revStarted = 0;
            }

            if (p <= 0) {
                if (this.started > 0) {
                    this.revCompleted++;
                }
                this.started = 0;
            }

            if (p > 0) {
                this.started++;
                this.revCompleted = 0;
            }

            const that = this;

            // Tween function

            if (this.to !== undefined && this.from !== undefined) {

                // Checking 'from' and 'to' objects length 

                if (Object.keys(this.from).length !== Object.keys(this.to).length) {
                    console.error(this.errors.error);
                    console.error(this.errors.formToDontMatch);
                    console.error(this.el);
                    return;
                }

                //

                Object.keys(this.to).forEach(function (prop, i) {

                    // Checking if 'from' and 'to' property match

                    if (prop !== Object.keys(that.from)[i]) {
                        console.error(this.errors.error);
                        console.error(this.errors.formToDontMatch);
                        console.error(this.el);
                        return;
                    }

                    // Easing function parameters

                    const value = that.to[prop];

                    const e = that.parseValue(value); // End
                    const b = that.parseValue(that.from[prop]); // Begin;
                    const c = e - b; // Change
                    const d = that.endParsed - that.beginParsed; // Duration
                    let t = p * d; // Time,
                    let unit = false; // px for example

                    if (that.completed === 1) {
                        t = d;
                    }

                    if (that.revCompleted === 1) {
                        t = 0;
                    }

                    if (e !== value) {
                        unit = value.split(e).join('');
                    } else {
                        unit = false;
                    }

                    if (t >= 0 && t <= d) {

                        // Checking 'easing'

                        if (that.tinTween.Easing[that.easing] === undefined) {
                            that.easing = 'easeOutQuad';
                        }

                        //

                        const newIntVal = that.tinTween.Easing[that.easing](null, t, b, c, d);
                        let newVal: string;

                        if (unit !== false) {
                            newVal = newIntVal + unit;
                        } else {
                            newVal = newIntVal;
                        }

                        that.el.nativeElement.style[prop] = newVal;

                    }
                });
            }

            // Callbacks

            // onBegin

            if (this.started === 1) {
                this.addClass(that.el.nativeElement, 'tinTweenonBegin');
                if (this.onBegin !== undefined) {
                    this.onBegin(this.el);
                }
            }

            // onEnd

            if (this.completed === 1) {
                p = 1;
                this.addClass(that.el.nativeElement, 'tinTweenonEnd');
                if (this.onEnd !== undefined) {
                    this.onEnd(this.el);
                }
            }

            // onReverseBegin

            if (this.revStarted === 1) {
                this.removeClass(that.el.nativeElement, 'tinTweenonEnd');
                if (this.onReverseBegin !== undefined) {
                    this.onReverseBegin(this.el);
                }
                this.revStarted++;
            }

            // onReverseEnd

            if (this.revCompleted === 1) {
                p = 0;
                this.removeClass(that.el.nativeElement, 'tinTweenonBegin');
                if (this.onReverseEnd !== undefined) {
                    this.onReverseEnd(this.el);
                }
                this.revCompleted++;
            }


            // onProgress

            if (p >= 0 && p <= 1) {
                if (this.onProgress !== undefined) {
                    this.onProgress(this.el, p);
                }
            }
        }
    }

    parseValue(val) {
        if (val.indexOf('.') > 0) {
            return parseFloat(val);
        } else {
            return parseInt(val, 0);
        }
    }

    // offset

    isWindow(obj) {
        return obj != null && obj === obj.window;
    }
    getWindow(elem) {
        return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    offset(elem) {
        
        let docElem, win,
            box = { top: 0, left: 0 };

        const doc = elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = this.getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    // addClass and removeClass methods

    // Thanks to: http://jaketrent.com/post/addremove-classes-raw-javascript/

    hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!this.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }

    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else if (this.hasClass(el, className)) {
            const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }
    //
}
