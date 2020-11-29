'use strict'

var states = new Array(2);
// [resize, drag]
const resize = 0;
const drag = 1;
const locale = "es_ES";

function loadExternalData() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            let data = JSON.parse(request.responseText);
            let list = document.querySelector(".algorithms-links > .hidden-menu");
            data[locale].forEach(link => {
                list.innerHTML += '<li><a href="' + link["Link"] + '" />' + link["Title"] + '</a></li>';
            })
        }
    };
    request.open("GET", "https://zihaohong.github.io/data/links/algorithms.json", true);
    request.send();
}

function makeResizableDiv(div, action = "mousedown") {
    const element = document.querySelector(div);
    const style = window.getComputedStyle(element);
    const resizers = document.querySelectorAll(div + ' .resizer')

    let measures = element.getBoundingClientRect();

    // dict containing methods for resizing
    let resizing = {
        'top': (e) => {
            element.style.height = measures.height - (e.pageY - measures.y) + 'px';
            if (style.getPropertyValue('position') == 'absolute') {
                element.style.top = Math.min(measures.top + (e.pageY - measures.y), measures.bottom) + 'px';
            }
        },
        'right': (e) => {
            element.style.width = measures.width + (e.pageX - measures.x) + 'px';
        },
        'bottom': (e) => {
            element.style.height = measures.height + (e.pageY - measures.y) + 'px';
        },
        'left': (e) => {
            element.style.width = measures.width - (e.pageX - measures.x) + 'px';
            if (style.getPropertyValue('position') == 'absolute') {
                element.style.left = Math.min(measures.left + (e.pageX - measures.x), measures.right) + 'px';
            }
        },
        'top-left': (e) => {
            element.style.width = measures.width - (e.pageX - measures.x) + 'px';
            element.style.height = measures.height - (e.pageY - measures.y) + 'px';
            if (style.getPropertyValue('position') == 'absolute') {
                element.style.top = Math.min(measures.top + (e.pageY - measures.y), measures.bottom) + 'px';
                element.style.left = Math.min(measures.left + (e.pageX - measures.x), measures.right) + 'px';
            }
        },
        'top-right': (e) => {
            element.style.width = measures.width + (e.pageX - measures.x) + 'px';
            element.style.height = measures.height - (e.pageY - measures.y) + 'px';
            if (style.getPropertyValue('position') == 'absolute') {
                element.style.top = Math.min(measures.top + (e.pageY - measures.y), measures.bottom) + 'px';
            }
        },
        'bottom-right': (e) => {
            element.style.width = measures.width + (e.pageX - measures.x) + 'px';
            element.style.height = measures.height + (e.pageY - measures.y) + 'px';
        },
        'bottom-left': (e) => {
            element.style.height = measures.height + (e.pageY - measures.y) + 'px';
            element.style.width = measures.width - (e.pageX - measures.x) + 'px';
            if (style.getPropertyValue('position') == 'absolute') {
                element.style.left = Math.min(measures.left + (e.pageX - measures.x), measures.right) + 'px';
            }
        }
    }

    resizers.forEach(resizer => {

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();

            measures = element.getBoundingClientRect();
            measures.x = e.pageX; // overwriting what x originately means
            measures.y = e.pageY; // overwriting what y originately means

            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });

        function resize(e) {
            resizing[resizer.id](e);

            states[resize] = true;
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
        }
    });
}

function makeDraggableDiv(selector, action = "mousedown") {
    let x, y;

    const element = document.querySelector(selector);

    element.addEventListener(action, dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();

        x = e.clientX;
        y = e.clientY;

        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();

        element.style.left = (element.offsetLeft - (x - e.clientX)) + "px";
        element.style.top = (element.offsetTop - (y - e.clientY)) + "px";

        x = e.clientX;
        y = e.clientY;

        states[drag] = true;
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
    }
}

function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

Object.defineProperty(Object.prototype, 'recursiveValues', {
    value: function () {
        return Object.values(this).map(value =>
            (value instanceof Object) ? value.recursiveValues() : value
        ).flat();
    }
});

class Notifier {
    constructor() {
        this.lastNotification = new Date().getTime();
        this.element = null;
    }

    info(text) {
        this.notify(text, "info");
    }

    success(text) {
        this.notify(text, "success");
    }

    warning(text) {
        this.notify(text, "warning");
    }

    error(text) {
        this.notify(text, "error");
    }

    notify(text, type) {
        let self = this;
        self.element = $('#notification');
        self.lastNotification = new Date().getTime();
        self.element.text(text);
        self.element.removeClass();
        self.element.addClass(type);
        window.setTimeout(function () {
            if (self.lastNotification + 3000 <= new Date().getTime()) {
                self.element.fadeOut("slow", function () {
                    self.element[0].innerHTML = '';
                    self.element[0].removeAttribute('style');
                });
            }
        }, 3000);
    }
}