'use strict';
(function (w) {
    // Define our constructor
    w.adRock = function() {
        // Define option defaults
        var args = arguments[0] ? arguments[0] : {};
        var defaults = {
            urls: location.href,
            counters:{
                'example.com': '666666'
            }, //host
            insertElement: 'div',
            insertPosition: 'afterbegin',          
            datePoint: '02-09-2020 00:45', //hours
            wrapperClass:'counter',
            html: '<h1>This is advertising!</h1>',
            css: 'h1 {text-align: center;}'
        };

        // Create options by extending defaults with the passed in arugments
        if (args && typeof args === "object") {
            this.options = Object.assign(defaults, args);
        }
    };

    /** Private methods */

    // chek URLS
    var checkUrl = function (urls) {
        // convert all urls paramets to Array
        var arrUrls = new Array(urls).join().split(',');

        // get pathname from browser for compare
        // var urlEtalon = '/metody-lecheniya/test.html'; // for testing
        var urlEtalon = location.pathname;

        // separate url form browser with '/'
        var urlEtlSplit = urlEtalon.split('/');
        var lastUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 1];
        var prevUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 2];

        // create API for string urls
        var url = document.createElement('a');
        var arrUrlsPath = arrUrls.map(function(href) {
            url.href = href;

            var urlSplit = url.pathname.split('/');
            var lastSplitElm = urlSplit[urlSplit.length - 1];
            var prevSplitElm = urlSplit[urlSplit.length - 2];

            // compare urls from settinfs with browser url
            var flagOne = !prevUrlEtlSplitElm.toLowerCase()
                                .localeCompare(prevSplitElm.toLowerCase());
            var flagTwo = false;

            // conditions for hostname, category level, all files
            if (lastSplitElm === lastUrlEtlSplitElm) {
                flagTwo = true;
            } else if (!lastSplitElm.search('.') && !lastUrlEtlSplitElm.search('.')) {
                flagTwo = true;
            } else {
                flagTwo = false;
            }
            
            return flagOne && flagTwo;
        }).filter(function(elm) {
            return elm;
        }).join();      

        return arrUrlsPath;
    };

    // return element from settings 
    var getElm = function (selector) {
        return selector.indexOf(':') !== -1
                ? document.querySelectorAll(selector.split(':')[0])[selector.split(':')[1]]
                : document.querySelector(selector);
    };

    // return Yandex counter from settings
    var getCounter = function(host, options) {
        return options.counters[host];
    };

    // insert HTML to browser
    var insertHtml = function (options) {//insertElement, html, wrapperClass
        var host = location.host;

        // get element for inserting
        var insertElement = getElm(options.insertElement);

        // create wrapper for counting with Yandex
        var div = document.createElement('div');
        var divWrap = document.createElement('div');
        div.innerHTML = options.html;

        // marker selectors for Yandex counters
        var dataCounter = div.querySelectorAll('[data-counter]');

        // conditions of existence Yandex counters
        if (dataCounter.length > 0 && insertElement) {
            // create wrapper elements: <span> for clickable items
            for (var i = dataCounter.length - 1; i >= 0 ; --i) {
                var elm = dataCounter[i];
                var elmCopy = elm.cloneNode(true);

                var data = elm.dataset.counter;
                var idYandexCounter = getCounter(host, options)
                var yandexCounter = 'yaCounter' + idYandexCounter;
                var spanString = '<span class="' + options.wrapperClass +  '" onclick="' 
                                    + yandexCounter + 
                                    '.reachGoal(' + "'" + data + "'" + '); return true;">';

                divWrap.innerHTML = spanString;
                divWrap.firstElementChild.appendChild(elmCopy);

                elm.insertAdjacentHTML('afterend', divWrap.innerHTML);
                elm.remove();
            }
            insertElement.insertAdjacentHTML(options.insertPosition, div.innerHTML);
        } else if(insertElement) {
            insertElement.insertAdjacentHTML(options.insertPosition, options.html);
        } else {
            console.error('Value of insert: ' + options.insertElement + '. Check this value!');
        }
    };

    // insert <style> element to browser with styles
    var insertCss = function(options) { // css, marker
        var style = document.createElement('style');
        var scopeMarker = document.querySelectorAll('[data-scope]');
        var css = options.css;
        var marker = options.insertElement;
        var flag = true;

        // checking for duplicate style tags
        if (scopeMarker.length) {
            for (var i = 0; i < scopeMarker.length; i++) {
                var elm = scopeMarker[i];
                elm.dataset.scope === marker ? flag = false : flag = true;
            }
        }

        style.dataset.scope = marker;
        style.innerText = css;
        flag ? document.head.append(style) : true;
    };

    // the time of advertising end 
    var timer = function (time) {
        var dates = time.split(' ')[0];
        var hours = time.split(' ')[1];

        var date = dates.split('-')[0];
        var month = dates.split('-')[1] - 1;
        var year = dates.split('-')[2];

        var hour = hours.split(':')[0];
        var minutes = hours.split(':')[1];

        var dateTempl = new Date(year, month, date, hour, minutes);

        return dateTempl.getTime() > Date.now();
    };

    /**Public method */
    // start plugin
    w.adRock.prototype.start = function() {
        var flagTimer = timer(this.options.datePoint);
        var flagUrl = !!checkUrl(this.options.urls);
        var flagElement = !!getElm(this.options.insertElement);

        if (flagTimer && flagUrl && flagElement) {
            // add async
            setTimeout(function() {
                // insert CSS
                insertCss(this.options);
                // insert HTML
                insertHtml(this.options);
              }.bind(this), 0);
        }
    };

    // stop plugin
    w.adRock.prototype.stop = function() {
        var css = document.querySelectorAll('[data-scope]');
        var elm = getElm(this.options.insertElement);
        var marker = this.options.insertElement;

        if (elm) {
            // remove css
            css.forEach(function (elm) {
                if (elm.dataset.scope === marker) {
                    elm.remove();
                }
            });
            // remove html
            elm.remove();
        }
    };
} (window));