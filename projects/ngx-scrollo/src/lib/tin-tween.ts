// TinTween previously CsTween
// Part of ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019, 2020
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { Injectable } from '@angular/core';

import { Easing } from './easing';

@Injectable()
export class TinTween {

    tween(opt: {
        element: any;
        property: any;
        from: any;
        to?: any;
        toElementId?: string;
        duration: any;
        easing?: any;
        onComplete?: any;
        onProgress?: any;
    }) {

        const start = performance.now();
        const that = this;

        function tw() {

            let progress: number;
            let value: number;

            if (opt.toElementId) {
                const element: HTMLElement = document.getElementById(opt.toElementId);
                opt.to = element.offsetTop;
            }

            const e = opt.to;
            const t = performance.now() - start;
            const b = opt.from;
            const c = e - b;
            const d = opt.duration;
            const easing = opt.easing || Easing.def;

            value = Easing[easing](null, t, b, c, d);
            progress = Math.round((value / e) * 100);

            if (opt.onProgress !== undefined) {
                opt.onProgress({
                    progress,
                    value
                });
            }

            let f: any;

            if (t <= d) {
                f = window.requestAnimationFrame(tw);
            } else {
                window.cancelAnimationFrame(f);
                value = opt.to;

                if (opt.onComplete !== undefined) {
                    opt.onComplete({
                        progress,
                        value
                    });
                }
            }

            opt.element[opt.property] = value;
        }

        tw();
    }
}