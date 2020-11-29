'use strict'

var CONFIG = {
    MOUSE : {
        VALUES: new Array(4).fill(false),
        DRAG: 0,
        LEFT_BUTTON: 1,
        MID_BUTTON: 2,
        RIGHT_BUTTON: 3
    },
    KEYBOARD: {
        VALUES: new Array(104).fill(false),
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        SPACE: 32
    },
    SHOW_MESSAGES_INTERVAL: 30000,
    INTERVAL_SPEED: 100,
    MOUSE_SCROLL_RELATION : 0.1,
    CAMERA_LOOK_AT_RELATION: 0.001,
    CAMERA : {
        MODE: {
            GOD: 0,
            PERSPECTIVE: 1
        }
    }
}