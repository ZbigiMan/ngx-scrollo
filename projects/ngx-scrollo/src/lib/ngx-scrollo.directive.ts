// ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019, 2021
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { Directive, ElementRef, HostListener, Input, Inject, AfterViewInit } from '@angular/core';
import { TinTween } from './tin-tween';
import { DOCUMENT } from '@angular/common';

import { CssProps, ElementOffset, AnchorOffset, Browser } from './ngx-scrollo.interfaces';
import { ERROR_MESSAGES } from './ngx-scrollo.constants';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngx-scrollo]',
    providers: [TinTween]
})

export class NgxScrolloDirective implements AfterViewInit {

    @Input() tweenBegin: number;
    @Input() tweenEnd: number;
    @Input() tweenFrom: CssProps;
    @Input() tweenTo: CssProps;
    @Input() tweenEasing: string; // TODO Add easing types interface
    @Input() tweenOnBegin: Function;
    @Input() tweenOnEnd: Function;
    @Input() tweenOnReverseBegin: Function;
    @Input() tweenOnReverseEnd: Function;
    @Input() tweenOnProgress: Function;
    @Input() tweenDuration: number;
    @Input() setLocationHash: boolean;

    private begin: number | null;
    private end: number | null;
    private from: CssProps;
    private to: CssProps;
    private easing: string;
    private onBegin: Function;
    private onEnd: Function;
    private onReverseBegin: Function;
    private onReverseEnd: Function;
    private onProgress: Function;
    private duration: number;
    private locationHash: boolean;

    private browser: Browser;
    private document: HTMLDocument;
    private body: HTMLElement;
    private href: string;
    private anchorId: string;
    private anchorOffset: AnchorOffset;
    private el: ElementRef;
    private tag: string;
    private vh: number;
    private elementOffset: ElementOffset;
    private scrollTop: number;
    private beginParsed: number;
    private endParsed: number;
    private tweenPogress: number;
    private started = 0;
    private completed = 0;
    private revStarted = 0;
    private revCompleted = 0;

    constructor(
        @Inject(DOCUMENT) document: HTMLDocument,
        public elementRef: ElementRef,
        private tinTween: TinTween
    ) {
        this.document = document;
        this.tinTween = tinTween;
        this.el = elementRef;
        this.tag = this.el.nativeElement.tagName;

        if (this.duration === undefined) {
            this.duration = 1000;
        }
    }

    ngAfterViewInit() {
        this.doInit();
    }

    doInit() {
        setTimeout(() => {
            this.init();
        }, 0);
    }

    init() {
        const _navigator = window.navigator.userAgent.toLowerCase();
        this.browser = {
            edge: _navigator.indexOf('edge') > -1,
            firefox: _navigator.indexOf('firefox') > -1
        };

        if (this.browser.edge) {
            this.body = this.document.body;
        }
        this.body = this.document.documentElement;

        this.body.scrollTop = 0;
        
        this.begin = this.tweenBegin;
        this.end = this.tweenEnd;
        this.from = this.tweenFrom;
        this.to = this.tweenTo;
        this.easing = this.tweenEasing;
        this.onBegin = this.tweenOnBegin;
        this.onEnd = this.tweenOnEnd;
        this.onReverseBegin = this.tweenOnReverseBegin;
        this.onReverseEnd = this.tweenOnReverseEnd;
        this.onProgress = this.tweenOnProgress;
        this.duration = this.tweenDuration || 1000;

        this.vh = Math.max(this.document.documentElement.clientHeight, window.innerHeight || 0);

        this.elementOffset = this.offset(this.el.nativeElement);

        if (!this.end && this.begin) {
            this.end = this.begin + 1;
        }

        if (this.end && this.begin) {
            if (this.elementOffset.top > this.vh) {
                this.beginParsed = (((this.begin / 100) * this.vh) + this.elementOffset.top) - this.vh;
                this.endParsed = (((this.end / 100) * this.vh) + this.elementOffset.top) - this.vh;
            } else {
                this.beginParsed = (this.begin / 100) * this.vh;
                this.endParsed = (this.end / 100) * this.vh;
            }
        }

        if (this.tag === 'A') {

            this.locationHash = this.setLocationHash === undefined ? true : this.setLocationHash;

            this.href = this.el.nativeElement.href;
            this.anchorId = this.href.split('#')[1];
            const anchor: HTMLElement | null = this.document.getElementById(this.anchorId);

            if (!anchor) {
                this.anchorOffset = {
                    top: this.vh
                };
            } else {
                this.anchorOffset = this.offset(anchor);
            }

            if (this.anchorOffset.top > this.vh) {
                this.anchorOffset.top = this.anchorOffset.top - this.vh;
            }
        }
    }

    @HostListener('window:resize', ['$event']) public onResize(event: Event) {
        this.doInit();
    }

    @HostListener('click', ['$event']) public onClick(event: Event) {
        if (this.tag === 'A') {
            event.preventDefault();

            if (this.href.indexOf('#') !== -1) {

                const currentScrollTop: number = this.document.documentElement.scrollTop || this.document.body.scrollTop;

                this.tinTween.tween({
                    'element': this.body,
                    'property': 'scrollTop',
                    'from': currentScrollTop,
                    'to': this.anchorOffset.top,
                    'duration': this.duration,
                    'easing': this.easing,
                    'onComplete': () => {
                        if (this.locationHash) {
                            this.document.location.hash = this.anchorId;
                        }
                    },
                    'onProgress': () => {
                    }
                });
            }
        }
    }

    @HostListener('window:scroll', []) public onscroll() {

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
                console.error(ERROR_MESSAGES.ERROR);
                console.error(ERROR_MESSAGES.FORM_TO_DONT_MATCH);
                console.error(this.el);
                return;
            }
            //

            Object.keys(this.to).forEach(function (prop: any, i: number) {

                // Checking if 'from' and 'to' property match
                if (prop !== Object.keys(that.from)[i]) {
                    console.error(ERROR_MESSAGES.ERROR);
                    console.error(ERROR_MESSAGES.FORM_TO_DONT_MATCH);
                    console.error(that.el);
                    return;
                }

                // Easing function parameters
                const value = that.to[prop];
                const e = that.parseValue(value); // End
                const b = that.parseValue(that.from[prop]); // Begin;
                const c = e - b; // Change
                const d = that.endParsed - that.beginParsed; // Duration
                let t = that.tweenPogress * d; // Time,
                let unit = ''; // px for example

                if (that.completed === 1) {
                    t = d;
                }

                if (that.revCompleted === 1) {
                    t = 0;
                }

                if (e.toString() !== value) {
                    unit = value.split(e.toString()).join('');
                }

                if (t >= 0 && t <= d) {

                    // Checking 'easing'
                    if (that.tinTween.Easing[that.easing] === undefined) {
                        that.easing = 'easeOutQuad';
                    }
                    //

                    const newIntVal = that.tinTween.Easing[that.easing](null, t, b, c, d);
                    let newVal: string;

                    if (unit !== '') {
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

    offset(elem: HTMLElement) {
        const box = elem.getBoundingClientRect();

        return <ElementOffset>{
            top: box.top,
            left: box.left,
            height: box.height,
            width: box.width
        }
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
