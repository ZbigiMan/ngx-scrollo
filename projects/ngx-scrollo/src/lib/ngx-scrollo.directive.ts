/*
    ngx-scrollo previously circus-scroll-2
    Released: December 2016, refactored: 2018, 2019, 2020
    Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman
*/

import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
} from '@angular/core';

import { Easing } from './easing';
import { ScrolloService } from './ngx-scrollo.service';
import { TinTween } from './tin-tween';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngx-scrollo]',
    providers: [TinTween]
})

export class ScrolloDirective implements AfterViewInit, OnChanges {

    @Input() scrolloBegin: string;
    @Input() scrolloEnd: string;
    @Input() scrolloFrom: string;
    @Input() scrolloTo: string;
    @Input() scrolloEasing: string;
    @Input() scrolloOnBegin: any;
    @Input() scrolloOnEnd: any;
    @Input() scrolloOnReverseBegin: any;
    @Input() scrolloOnReverseEnd: any;
    @Input() scrolloOnProgress: any;
    @Input() scrolloDuration: number;
    @Input() setLocationHash: boolean;
    @Input() scrolloUpdate: boolean;

    private begin: number;
    private end: number;
    private from: string;
    private to: string;
    private easing: string;
    private onBegin: any;
    private onEnd: any;
    private onReverseBegin: any;
    private onReverseEnd: any;
    private onProgress: any;
    private duration: number;

    private el: ElementRef;
    private tag: string;
    private vh: number;
    private scrollHeight: number;
    private elementOffset: any;
    private scrollTop: number;
    private beginParsed: number;
    private endParsed: number;
    private tweenPogress: number;
    private started = 0;
    private completed = 0;
    private revStarted = 0;
    private revCompleted = 0;

    private body: HTMLElement;
    private href: string;
    private anchorId: string;
    private anchorOffset: any;

    private errors = {
        error: 'ngx-scrollo Settings Error.',
        formToDontMatch: 'scrolloFrom and scrolloTo values don\'t match.',
        beginEndDontMatch: 'scrolloBegin and scrolloEnd values don\'t match.'
    };

    constructor(
        public elementRef: ElementRef,
        private service: ScrolloService,
    ) {
        this.el = elementRef;
        this.tag = this.el.nativeElement.tagName;

        if (this.duration === undefined) {
            this.duration = 1000;
        }
    }

    ngAfterViewInit() {
        this.init();
    }

    ngOnChanges() {
        // console.log('change', this.scrolloUpdate);
    }

    init() {
        this.begin = parseInt(this.scrolloBegin, 10) || null;
        if (this.scrolloEnd && this.scrolloEnd !== 'auto') {
            this.end = parseInt(this.scrolloEnd, 10) || null;
        }
        this.from = this.scrolloFrom;
        this.to = this.scrolloTo;
        this.easing = this.scrolloEasing;
        this.onBegin = this.scrolloOnBegin;
        this.onEnd = this.scrolloOnEnd;
        this.onReverseBegin = this.scrolloOnReverseBegin;
        this.onReverseEnd = this.scrolloOnReverseEnd;
        this.onProgress = this.scrolloOnProgress;
        this.duration = this.scrolloDuration || 1000;
    }

    @HostListener('window:resize', ['$event']) public onResize(event: Event) {
        setTimeout(() => {
            this.init();
        });
    }

    @HostListener('click', ['$event']) public onClick(event: Event) {
        if (this.tag === 'A') {
            event.preventDefault();

            this.href = this.el.nativeElement.getAttribute('href');

            if (this.href.indexOf('#') !== -1) {

                this.vh = this.service.vh();
                const currentScrollTop: number = this.service.scrollTop();
                const anchorId: string = this.href.split('#')[1];
                const anchor: HTMLElement = document.getElementById(anchorId);

                if (!anchor) {
                    this.service.scrollToPosition({
                        position: currentScrollTop + this.vh,
                        duration: this.duration
                    });
                } else {
                    this.service.scrollTo({
                        elementId: anchor.id,
                        duration: this.duration
                    });
                    if (this.setLocationHash) {
                        document.location.hash = anchor.id;
                    }
                }
            }
        }
    }

    @HostListener('window:scroll', []) public onscroll() {

        if (this.begin === null) {
            return;
        }

        this.vh = this.service.vh();
        this.elementOffset = this.service.offset(this.el.nativeElement);
        let scrollTop = this.service.scrollTop();

        this.beginParsed = this.elementOffset.top + ((this.begin / 100) * this.vh);
        this.endParsed = this.elementOffset.top + ((this.end / 100) * this.vh);

        if (this.beginParsed > this.vh) {
            scrollTop = scrollTop + this.vh;
        }

        this.tweenPogress = (scrollTop - this.beginParsed) / (this.endParsed - this.beginParsed);

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
                    if (Easing[that.easing] === undefined) {
                        that.easing = 'easeOutQuad';
                    }
                    //

                    const newIntVal = Easing[that.easing](null, t, b, c, d);
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
            this.service.addClass(that.el.nativeElement, 'scrolloOnBegin');
            if (this.onBegin !== undefined) {
                this.onBegin({
                    progress: this.tweenPogress,
                    element: this.el
                });
            }
        }

        // onEnd

        if (this.completed === 1) {
            this.tweenPogress = 1;
            this.service.addClass(that.el.nativeElement, 'scrolloOnEnd');
            if (this.onEnd !== undefined) {
                this.onEnd({
                    progress: this.tweenPogress,
                    element: this.el
                });
            }
        }

        // onReverseBegin

        if (this.revStarted === 1) {
            this.service.removeClass(that.el.nativeElement, 'scrolloOnEnd');
            if (this.onReverseBegin !== undefined) {
                this.onReverseBegin({
                    progress: this.tweenPogress,
                    element: this.el
                });
            }
            this.revStarted++;
        }

        // onReverseEnd

        if (this.revCompleted === 1) {
            this.tweenPogress = 0;
            this.service.removeClass(that.el.nativeElement, 'scrolloOnBegin');
            if (this.onReverseEnd !== undefined) {
                this.onReverseEnd({
                    progress: this.tweenPogress,
                    element: this.el
                });
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
}
