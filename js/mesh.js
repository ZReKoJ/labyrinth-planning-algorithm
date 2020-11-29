'use strict'

class MeshFactory {
    constructor() {
        this.geometry = {
            avatar: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            block: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            flag: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            path: function () {
                return new THREE.SphereGeometry(0.5, 32, 32);
            },
            mobile: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            danger: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            }
        };

        this.material = {
            avatar: function (color = 0x00ff00) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            },
            block: function (color = 0xff0000) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            },
            flag: function (color = 0xffffff) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            },
            path: function (color = 0x00fff0) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            },
            mobile: function (color) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            },
            danger: function (color = 0xffff00) {
                return new THREE.MeshBasicMaterial({
                    color: color
                });
            }
        };
    }

    getGeometry(name) {
        return this.geometry[name]();
    }

    getMaterial(name, color) {
        if (color) {
            return this.material[name](color);
        } else {
            return this.material[name]();
        }
    }
}