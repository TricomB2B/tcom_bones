/**
 * Detects whether or not the user's device has touch capabilities and
 * adds a class to the main html element for easy usage by the CSS.
 * @author Todd Miller <todd.miller@tricomb2b.com>
 */

(function () {
  'use strict';

  if (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)) {
    document.querySelector('html').classList.add('touchevents');
  } else {
    document.querySelector('html').classList.add('no-touchevents');
  }
})();
