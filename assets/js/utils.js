if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 17 /*~ 1000ms/60 = 16.7ms*/);
    });
}

window.utils = {};

window.utils.getDistance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

window.utils.isNotCanvasSupported = function () {
    var elem = document.createElement('canvas');
    return !(elem.getContext && elem.getContext('2d'));
};

window.utils.createAppendCanvas = function (id, width, height, father) {
    var element = document.createElement("canvas");
    element.width = width;
    element.height = height;
    element.context = element.getContext("2d");
    element.id = id;
    father.appendChild(element);
    return element;
};

window.utils.createAppendElement = function (type, id, father) {
    var element = document.createElement(type);
    element.id = id;
    father.appendChild(element);
    return element;
};


window.utils.captureMouse = function (element) {
    var cursor = {x: 0, y: 0, event: null},
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    element.addEventListener('mousemove', function (event) {
        var x, y;

        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + body_scrollLeft + element_scrollLeft;
            y = event.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;

        cursor.x = x;
        cursor.y = y;
        cursor.event = event;
    }, false);
    return cursor;
};

