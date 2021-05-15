// TinTween previously CsTween
// Part of ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { Injectable } from '@angular/core';

@Injectable()
export class TinTween {

    tween(opt: {
        element: any;
        property: any;
        from: any;
        to: any;
        duration: any;
        easing?: any;
        onComplete: any;
        onProgress?: any;
    }) {

        const start = performance.now();
        const that = this;

        function tw() {

            let progress: number,
                value: number;

            const e = opt.to,
                t = performance.now() - start,
                b = opt.from,
                c = e - b,
                d = opt.duration,
                easing = opt.easing || that.Easing['def'];

            value = that.Easing[easing](null, t, b, c, d);
            progress = 100 - Math.round(((value - e) / (b - e)) * 100);

            if (progress <= 0) {
                progress = 0;
                value = b;
            }

            if (progress >= 100) {
                progress = 100;
                value = e;
            }

            if (opt.onProgress !== undefined) {
                opt.onProgress({
                    'progress': progress,
                    'value': value
                });
            }

            let f: any;

            if (t <= d) {
                f = window.requestAnimationFrame(tw);
            } else {
                window.cancelAnimationFrame(f);

                if (opt.onComplete !== undefined) {
                    opt.onComplete({
                        'progress': progress,
                        'value': value
                    });
                }

                progress = 0;
            }

            opt.element[opt.property] = value;
        }

        tw();
    }

    //    Easing

    /*
     * This is based on jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/ by George McGinley Smith
     * His license is provided below.
    */

    /*
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Uses the built in easing capabilities added In jQuery 1.1
     * to offer multiple easing options
     *
     * TERMS OF USE - jQuery Easing
     *
     * Open source under the BSD License.
     *
     * Copyright 2008 George McGinley Smith
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

    // t: current time, b: begInnIng value, c: change In value, d: duration

    // tslint:disable-next-line:member-ordering
    public Easing: {[key: string]: Function} = {
        linear: function (x: number, t: number, b: number, c: number, d:number) {
            return c * t / d + b;
        },
        swing: function (x: number, t: number, b: number, c: number, d:number) {
            return this['easeOutQuad'](x, t, b, c, d);
        },
        easeInQuad: function (x: number, t: number, b: number, c: number, d:number) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (x: number, t: number, b: number, c: number, d:number) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (x: number, t: number, b: number, c: number, d:number) {
            // tslint:disable-next-line:curly
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function (x: number, t: number, b: number, c: number, d:number) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x: number, t: number, b: number, c: number, d:number) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x: number, t: number, b: number, c: number, d:number) {
            // tslint:disable-next-line:curly
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (x: number, t: number, b: number, c: number, d:number) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (x: number, t: number, b: number, c: number, d:number) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (x: number, t: number, b: number, c: number, d:number) {
            // tslint:disable-next-line:curly
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (x: number, t: number, b: number, c: number, d:number) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (x: number, t: number, b: number, c: number, d:number) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (x: number, t: number, b: number, c: number, d:number) {
            if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (x: number, t: number, b: number, c: number, d:number) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x: number, t: number, b: number, c: number, d:number) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x: number, t: number, b: number, c: number, d:number) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (x: number, t: number, b: number, c: number, d:number) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (x: number, t: number, b: number, c: number, d:number) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (x: number, t: number, b: number, c: number, d:number) {
            if (t === 0) { return b; }
            if (t === d) { return b + c; }
            if ((t /= d / 2) < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b; }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x: number, t: number, b: number, c: number, d:number) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (x: number, t: number, b: number, c: number, d:number) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (x: number, t: number, b: number, c: number, d:number) {
            if ((t /= d / 2) < 1) { return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (x: number, t: number, b: number, c: number, d:number) {
            let s = 1.70158; let p = 0; let a = c;
            if (t === 0) { return b; } if ((t /= d) === 1) { return b + c; } if (!p) { p = d * 0.3; }
            if (a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (x: number, t: number, b: number, c: number, d:number) {
            let s = 1.70158; let p = 0; let a = c;
            if (t === 0) { return b; } if ((t /= d) === 1) { return b + c; } if (!p) { p = d * 0.3; }
            if (a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (x: number, t: number, b: number, c: number, d:number) {
            let s = 1.70158; let p = 0; let a = c;
            if (t === 0) { return b; } if ((t /= d / 2) === 2) { return b + c; } if (!p) { p = d * (0.3 * 1.5); }
            if (a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }
            if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        easeInBack: function (x: number, t: number, b: number, c: number, d:number, s:number) {
            if (s === undefined) { s = 1.70158; }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (x: number, t: number, b: number, c: number, d:number, s:number) {
            if (s === undefined) { s = 1.70158; }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (x: number, t: number, b: number, c: number, d:number, s:number) {
            if (s === undefined) { s = 1.70158; }
            if ((t /= d / 2) < 1) { return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function (x: number, t: number, b: number, c: number, d:number) {
            return c - this.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function (x: number, t: number, b: number, c: number, d:number) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        easeInOutBounce: function (x: number, t: number, b: number, c: number, d:number) {
            if (t < d / 2) { return this.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b; }
            return this.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    };

    /*
     *
     * TERMS OF USE - EASING EQUATIONS
     *
     * Open source under the BSD License.
     *
     * Copyright 2001 Robert Penner
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */
}
