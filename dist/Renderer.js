System.register([], function (exports_1, context_1) {
    "use strict";
    var Renderer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Renderer = /** @class */ (function () {
                function Renderer(canvas, width, height) {
                    var context = canvas.getContext("2d");
                    if (!context)
                        throw Error("oh noes, you no has the grafics");
                    this.width = canvas.width = width;
                    this.height = canvas.height = height;
                    this.buffer = context.createImageData(width, height);
                    this.context = context;
                    this.clear(false);
                }
                Renderer.prototype.get = function (x, y) {
                    x = Math.round(x);
                    y = Math.round(y);
                    var index = (x + y * this.width) * 4;
                    return this.buffer.data[index + 0] == Renderer.white;
                };
                Renderer.prototype.put = function (x, y, colour) {
                    x = Math.round(x);
                    y = Math.round(y);
                    if (x < 0 || y < 0 || x >= this.width || y >= this.height)
                        return;
                    var index = (x + y * this.width) * 4;
                    this.buffer.data[index + 0] =
                        this.buffer.data[index + 1] =
                            this.buffer.data[index + 2] = colour ? Renderer.white : Renderer.black;
                    this.buffer.data[index + 3] = 255;
                };
                Renderer.prototype.clear = function (colour) {
                    for (var x = 0; x < this.width; x++)
                        for (var y = 0; y < this.height; y++)
                            this.put(x, y, colour);
                    this.swap();
                };
                Renderer.prototype.swap = function () {
                    this.context.putImageData(this.buffer, 0, 0);
                };
                Renderer.white = 192;
                Renderer.black = 48;
                return Renderer;
            }());
            exports_1("Renderer", Renderer);
        }
    };
});
