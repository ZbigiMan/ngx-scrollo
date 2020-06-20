/*
    ngx-scrollo service
    Extracted from ngx-scrollo.directive 2020
    Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman
*/

import { Injectable } from '@angular/core';
import { TinTween } from './tin-tween';

@Injectable({
  providedIn: 'root'
})
export class ScrolloService {

  constructor(public tinTween: TinTween) {}

  resetScrollPositionOnRefresh(options: { callback: any; }) {
    window.onbeforeunload = () => {
      if (options.callback) {
        options.callback();
      }
      document.body.style.display = 'none';
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
  }

  setScrollPosition(position: number) {
    this.documentBody().scrollTop = position;
  }

  scrollTo(
    options: {
      elementId: string,
      duration: number,
      easing?: string,
      onProgress?: any,
      onComplete?: any,
    }) {

    this.tinTween.tween({
      element: this.documentBody(),
      property: 'scrollTop',
      from: this.scrollTop(),
      toElementId: options.elementId,
      duration: options.duration,
      easing: options.easing,
      onProgress: options.onProgress,
      onComplete: options.onComplete
    });
  }

  scrollToPosition(
    options: {
      position: number,
      duration: number,
      easing?: string,
      onProgress?: any,
      onComplete?: any
    }
  ) {
    this.tinTween.tween({
      element: this.documentBody(),
      property: 'scrollTop',
      from: this.scrollTop(),
      to: options.position,
      duration: options.duration,
      easing: options.easing,
      onProgress: options.onProgress,
      onComplete: options.onComplete
    });
  }

  browser() {
    const _navigator = window.navigator.userAgent.toLowerCase();
    return {
      edge: _navigator.indexOf('edge') > -1,
      firefox: _navigator.indexOf('firefox') > -1
    };
  }

  documentBody() {
    let body: HTMLElement = document.documentElement;

    if (this.browser().edge) {
      body = document.body;
    }
    return body;
  }

  scrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  scrollHeight() {
    return document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  windowScrollProgress() {
    return (this.scrollTop() / this.scrollHeight());
  }

  vh() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  offset(el: any) {
    const box = el.getBoundingClientRect();
    let top = 0;
    let left = 0;
    let element = el;

    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top,
      left,
      height: box.height,
      width: box.width
    };
  }

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
}
