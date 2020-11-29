'use strict'

var notifier = new Notifier();
var scene = new Scene();
var meshFactory = new MeshFactory();

$(() => {
    loadExternalData();
    
    makeResizableDiv('.setting-panel');

    let drawFunctions = drawPanel('.draw-panel');
    let settingFunctions = settingPanel('.setting-panel>.setting');

    scene.init(drawFunctions.canvas)
        .setPlane(20, 20)
        .setCameraMode(CONFIG.CAMERA.MODE.GOD)
        .resize(drawFunctions.dimension.width(), drawFunctions.dimension.height());

    function animate() {
        requestAnimationFrame(animate);
        scene.animate();
    }

    animate();

    infoMessages();
});

function drawPanel(div) {
    let draw = $(div);
    let event;
    let canvas = draw.find('canvas')[0];

    let pointer = function (event) {
        let rect = canvas.getBoundingClientRect();
        return new Coordinate(
            ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1,
            -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1
        );
    };

    new ResizeSensor(draw, () => {
        scene.resize(draw.width(), draw.height());
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) {
            scene.cameraBackwards();
        } else {
            scene.cameraForwards();
        }
    });

    canvas.addEventListener('click', (e) => {
        try {
            if (e.which == CONFIG.MOUSE.LEFT_BUTTON) {
                scene.canvasClickedOn(pointer(e));
            }
        } catch (err) {
            notifier.error(err.message);
        }
        e.preventDefault();
    });

    canvas.addEventListener('mousedown', (e) => {
        CONFIG.MOUSE.VALUES[CONFIG.MOUSE.DRAG] = true;
        CONFIG.MOUSE.VALUES[e.which] = true;
        event = e;
        e.preventDefault();
    });

    canvas.addEventListener('mousemove', (e) => {
        try {
            if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.DRAG]) {
                let width = event.clientX - e.clientX;
                let height = event.clientY - e.clientY;
                if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.LEFT_BUTTON]) {
                    scene.canvasClickedOn(pointer(e));
                } else if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.RIGHT_BUTTON]) {
                    if (Math.abs(width) > Math.abs(height)) {
                        scene.cameraViewRight(width);
                    } else {
                        scene.cameraViewDown(height);
                    }
                }
                event = e;
            }
        } catch (err) {
            notifier.error(err.message);
        }
        e.preventDefault();
    });

    canvas.addEventListener('mouseup', (e) => {
        CONFIG.MOUSE.VALUES.fill(false);
        e.preventDefault();
    });

    canvas.addEventListener('mouseout', (e) => {
        CONFIG.MOUSE.VALUES.fill(false);
        e.preventDefault();
    });

    window.addEventListener('keydown', (e) => {
        CONFIG.KEYBOARD.VALUES[e.which] = true;
        Object.keys(CONFIG.KEYBOARD)
            .filter(element => element != "VALUES")
            .forEach(element => {
                if (CONFIG.KEYBOARD.VALUES[CONFIG.KEYBOARD[element]]) {
                    e.preventDefault();
                    switch (element) {
                        case 'ARROW_UP':
                            scene.cameraViewUp();
                            break;
                        case 'ARROW_DOWN':
                            scene.cameraViewDown();
                            break;
                        case 'ARROW_LEFT':
                            scene.cameraViewLeft();
                            break;
                        case 'ARROW_RIGHT':
                            scene.cameraViewRight();
                            break;
                        case 'SPACE':
                            if (e.ctrlKey) {
                                scene.cameraBackwards();
                            } else {
                                scene.cameraForwards();
                            }
                            break;
                    }
                }
            });
    });

    window.addEventListener('keyup', (e) => {
        CONFIG.KEYBOARD.VALUES[e.which] = false;
    });

    return {
        canvas: canvas,
        dimension: {
            width: function () {
                return draw.width()
            },
            height: function () {
                return draw.height()
            }
        }
    };
}

function settingPanel(div) {
    let setting = $(div);

    let mouseScrollInput = setting.find("input[type='number'].mouse-scroll");
    mouseScrollInput.on("change", (e) => {
        mouseScrollInput.val(Math.max(mouseScrollInput.val(), mouseScrollInput.attr("min")));
        mouseScrollInput.val(Math.min(mouseScrollInput.val(), mouseScrollInput.attr("max")));
        CONFIG.MOUSE_SCROLL_RELATION = Number(mouseScrollInput.val()) * 0.1;
    });

    let cameraLookAtInput = setting.find("input[type='number'].camera-look-at");
    cameraLookAtInput.on("change", (e) => {
        cameraLookAtInput.val(Math.max(cameraLookAtInput.val(), cameraLookAtInput.attr("min")));
        cameraLookAtInput.val(Math.min(cameraLookAtInput.val(), cameraLookAtInput.attr("max")));
        CONFIG.CAMERA_LOOK_AT_RELATION = Number(cameraLookAtInput.val()) * 0.001;
    });

    let fileInput = setting.find("input[type='file'].image");
    fileInput.on("change", (e) => {
        let reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    let resizeButton = setting.find("button.resize");
    resizeButton.on("click", () => {
        perspectiveButton.text("Vista Perspectiva");
        scene.resetScene()
            .setPlane(widthInput.val(), heightInput.val())
            .setCameraMode(CONFIG.CAMERA.MODE.GOD);
    });

    let perspectiveButton = setting.find("button.perspective");
    perspectiveButton.on("click", () => {
        switch (perspectiveButton.text()) {
            case "Vista Aérea":
                scene.setCameraMode(CONFIG.CAMERA.MODE.GOD);
                perspectiveButton.text("Vista Perspectiva");
                break;
            case "Vista Perspectiva":
                scene.setCameraMode(CONFIG.CAMERA.MODE.PERSPECTIVE);
                perspectiveButton.text("Vista Aérea");
                break;
        }
    });

    let stateButton = setting.find("button.state");
    stateButton.on("click", () => {
        try {
            switch (stateButton.text()) {
                case "Ejecutar":
                    stateButton.text("Parar");
                    scene.run(() => {
                        stateButton.text("Ejecutar");
                    });
                    break;
                case "Parar":
                    stateButton.text("Ejecutar");
                    scene.stop();
                    break;
            }
        } catch (err) {
            stateButton.text("Ejecutar");
            notifier.error(err.message);
        }
    });

    let dataSelect = setting.find(".data");
    dataSelect.on("change", (e) => {
        //$(".draw-panel").empty();
        getData(dataSelect.val());
    });
}

function loadDataFile(link, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            callback(request.responseText);
        }
    };
    request.open("GET", link, true);
    request.send();
}

function getData(filename) {
    loadDataFile("https://zrekoj.github.io/labyrinth-planning-algorithm/resources/" + filename + ".png", (data) => {
        console.log(data)
    });
}

function infoMessages() {
    let allInfoMessages = messages.info.uses.recursiveValues();
    setInterval(() => {
        notifier.info(allInfoMessages[
            Math.floor(Math.random() * allInfoMessages.length)
        ]);
    }, CONFIG.SHOW_MESSAGES_INTERVAL);
}