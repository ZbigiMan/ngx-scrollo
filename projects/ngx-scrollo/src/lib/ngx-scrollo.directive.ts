// ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { Directive, ElementRef, HostListener, Input, Renderer, Inject, OnInit } from '@angular/core';
import { TinTween } from './tin-tween';
import { DOCUMENT } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngx-scrollo]',
    providers: [TinTween]
})

export class ScrolloDirective implements OnInit {

    @Input() tweenBegin: string;
    @Input() tweenEnd: string;
    @Input() tweenFrom: string;
    @Input() tweenTo: string;
    @Input() tweenEasing: string;
    @Input() tweenOnBegin: Function;
    @Input() tweenOnEnd: Function;
    @Input() tweenOnReverseBegin: Function;
    @Input() tweenOnReverseEnd: Function;
    @Input() tweenOnProgress: Function;
    @Input() tweenDuration: number;

    private begin: number;
    private end: number;
    private from: string;
    private to: string;
    private easing: string;
    private onBegin: Function;
    private onEnd: Function;
    private onReverseBegin: Function;
    private onReverseEnd: Function;
    private onProgress: Function;
    private duration: number;

    private el: ElementRef;
    private tag: string;
    private vh: number;
    private elementOffset: any;
    private scrollTop: number;
    private beginParsed: number;
    private endParsed: number;
    private tweenPogress: number;
    private started = 0;
    private completed = 0;
    private revStarted = 0;
    private revCompleted = 0;

    private errors = {
        'error': 'ngx-scrollo Settings Error.',
        'formToDontMatch': 'tweenFrom and tweenTo values don\'t match.',
        'beginEndDontMatch': 'tweenBegin and tweenEnd values don\'t match.'
    };

    constructor(
        @Inject(DOCUMENT) document,
        public elementRef: ElementRef,
        private tinTween: TinTween
    ) {
        this.tinTween = tinTween;
        this.el = elementRef;
        this.tag = this.el.nativeElement.tagName;

        if (this.duration === undefined) {
            this.duration = 1000;
        }
    }

    ngOnInit() {
        this.begin = parseInt(this.tweenBegin, 10) || null;
        this.end = parseInt(this.tweenEnd, 10) || null;
        this.from = this.tweenFrom;
        this.to = this.tweenTo;
        this.easing = this.tweenEasing;
        this.onBegin = this.tweenOnBegin;
        this.onEnd = this.tweenOnEnd;
        this.onReverseBegin = this.tweenOnReverseBegin;
        this.onReverseEnd = this.tweenOnReverseEnd;
        this.onProgress = this.tweenOnProgress;
        this.duration = this.tweenDuration;

        this.vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.elementOffset = this.offset(this.el.nativeElement);

        if (!this.end) {
            this.end = this.begin;
        }

        if (this.elementOffset.top > this.vh) {
            this.beginParsed = (((this.begin / 100) * this.vh) + this.elementOffset.top) - this.vh;
            this.endParsed = (((this.end / 100) * this.vh) + this.elementOffset.top + this.elementOffset.height) - this.vh;
        } else {
            this.beginParsed = (this.begin / 100) * this.vh;
            this.endParsed = (this.end / 100) * this.vh;
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
                const body: HTMLElement = document.documentElement;

                this.tinTween.tween({
                    'element': body,
                    'property': 'scrollTop',
                    'from': currentScrollTop,
                    'to': anchorOffset.top,
                    'duration': this.duration,
                    'onComplete': function () {
                        document.location.hash = anchorId;
                    }
                });
            }
        }
    }

    @HostListener('window:scroll', []) private onscroll() {

        if (!this.begin) {
            return;
        }

        this.scrollTop = window.scrollY;

        this.tweenPogress = (this.scrollTop - this.beginParsed) / (this.endParsed - this.beginParsed);

        if (this.tweenPogress <= 1 && this.completed > 0) {
            this.revStarted++;
            this.completed = 0;
        }

        if (this.tweenPogress >= 1) {
            this.completed++;
            this.revStarted = 0;
        }

        if (this.tweenPogress <= 0 && this.started > 0) {
            this.revCompleted++;
            this.started = 0;
        }

        if (this.tweenPogress > 0) {
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
                let t = that.tweenPogress * d; // Time,
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
            this.addClass(that.el.nativeElement, 'scrolloTweenOnBegin');
            if (this.onBegin !== undefined) {
                this.onBegin(this.el);
            }
        }

        // onEnd

        if (this.completed === 1) {
            this.tweenPogress = 1;
            this.addClass(that.el.nativeElement, 'scrolloTweenOnEnd');
            if (this.onEnd !== undefined) {
                this.onEnd(this.el);
            }
        }

        // onReverseBegin

        if (this.revStarted === 1) {
            this.removeClass(that.el.nativeElement, 'scrolloTweenOnEnd');
            if (this.onReverseBegin !== undefined) {
                this.onReverseBegin(this.el);
            }
            this.revStarted++;
        }

        // onReverseEnd

        if (this.revCompleted === 1) {
            this.tweenPogress = 0;
            this.removeClass(that.el.nativeElement, 'scrolloTweenOnBegin');
            if (this.onReverseEnd !== undefined) {
                this.onReverseEnd(this.el);
            }
            this.revCompleted++;
        }


        // onProgress

        if (this.tweenPogress >= 0 && this.tweenPogress <= 1) {
            if (this.onProgress !== undefined) {
                this.onProgress({
                    progress: this.tweenPogress,
                    element: this.el
                });
            }
        }

    }

    parseValue(val: string) {
        if (val.indexOf('.') > 0) {
            return parseFloat(val);
        } else {
            return parseInt(val, 0);
        }
    }

    // offset

    isWindow(obj: { window: any; }) {
        return obj != null && obj === obj.window;
    }
    getWindow(elem: any) {
        return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    offset(elem: HTMLElement) {
        let docElem: HTMLElement,
            win: any,
            box: any;

        const doc = elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = this.getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft,
            height: box.height,
            width: box.width

        };
    }

    // addClass and removeClass methods

    // Thanks to: http://jaketrent.com/post/addremove-classes-raw-javascript/

    hasClass(el: HTMLElement, className: string) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    addClass(el: HTMLElement, className: string) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!this.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }

    removeClass(el: HTMLElement, className: string) {
        if (el.classList) {
            el.classList.remove(className);
        } else if (this.hasClass(el, className)) {
            const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }
    //
}
