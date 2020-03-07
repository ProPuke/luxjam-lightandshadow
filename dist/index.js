System.register(["./Renderer.js", "./blit16.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Renderer_js_1, renderer, blit16, Input, aiInput, input, top, bottom, Paddle, Ball, paddles, balls, frame;
    var __moduleName = context_1 && context_1.id;
    function put_text(x, y, message, colour, glyphs, glyph_start, glyph_width, glyph_height) {
        var cx = x;
        var cy = y;
        for (var i = 0; i < message.length; i++) {
            var glyph = glyphs[message.charCodeAt(i) - glyph_start];
            for (var gx = 0; gx < glyph_width; gx++) {
                for (var gy = 0; gy < glyph_height; gy++) {
                    renderer.put(cx + gx, cy + gy, glyph[gx + gy * glyph_width] != ' ' ? colour : !colour);
                }
            }
            cx += glyph_width + 1;
            if (cx + glyph_width >= renderer.width) {
                cx = x;
                cy += glyph_height + 1;
            }
        }
    }
    function print(x, y, colour, message) {
        put_text(x, y, message, colour, blit16.glyphs, blit16.glyph_start, blit16.width, blit16.height);
    }
    function get(x, y) {
        return renderer.get(x, y);
    }
    function inbounds(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x >= 0 && y >= top && x < renderer.width && y < renderer.height - bottom)
            return true;
        return false;
    }
    function collide(c, x, y) {
        if (!inbounds(x, y))
            return true;
        return renderer.get(x, y) == c;
    }
    function put(x, y, colour) {
        renderer.put(x, y, colour);
    }
    function put_clipped(x, y, colour) {
        x = Math.round(x);
        y = Math.round(y);
        if (y < top || y >= renderer.height - bottom)
            return;
        renderer.put(x, y, colour);
    }
    function boom(x, y, colour) {
        put_clipped(x, y, colour);
        put_clipped(x + 1, y, colour);
        put_clipped(x + 1, y + 1, colour);
        put_clipped(x + 1, y - 1, colour);
        put_clipped(x, y + 1, colour);
        put_clipped(x - 1, y, colour);
        put_clipped(x - 1, y + 1, colour);
        put_clipped(x - 1, y - 1, colour);
        put_clipped(x, y - 1, colour);
        put_clipped(x + 2, y, colour);
        put_clipped(x - 2, y, colour);
        put_clipped(x, y + 2, colour);
        put_clipped(x, y - 2, colour);
        if (true) {
            put_clipped(x + 2, y - 1, colour);
            put_clipped(x + 2, y + 1, colour);
            put_clipped(x - 2, y - 1, colour);
            put_clipped(x - 2, y + 1, colour);
            put_clipped(x - 1, y + 2, colour);
            put_clipped(x + 1, y + 2, colour);
            put_clipped(x - 1, y - 2, colour);
            put_clipped(x + 1, y - 2, colour);
        }
    }
    function clear(colour) {
        renderer.clear(colour);
    }
    function swap() {
        renderer.swap();
    }
    function normal(c, x, y) {
        var nx = 0;
        var ny = 0;
        if (x < 0 || get(x + 1, y) != c)
            nx += 1;
        if (x >= renderer.width || get(x - 1, y) != c)
            nx -= 1;
        if (y < 0 || get(x, y + 1) != c)
            ny += 1;
        if (y >= renderer.height || get(x, y - 1) != c)
            ny -= 1;
        return [nx, ny];
    }
    function sleep(ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    }
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    function play_intro(fast) {
        return __awaiter(this, void 0, void 0, function () {
            var x, y;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!fast) return [3 /*break*/, 2];
                        return [4 /*yield*/, sleep(1000)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        x = 0;
                        _a.label = 3;
                    case 3:
                        if (!(x < renderer.width / 2)) return [3 /*break*/, 7];
                        for (y = top; y < renderer.height - bottom; y++) {
                            put(x, y, true);
                        }
                        put(renderer.width - 1 - x, top - 1, true);
                        put(renderer.width - 1 - x, renderer.height - bottom, true);
                        if (!!fast) return [3 /*break*/, 5];
                        return [4 /*yield*/, sleep(50)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        swap();
                        _a.label = 6;
                    case 6:
                        x++;
                        return [3 /*break*/, 3];
                    case 7:
                        if (!!fast) return [3 /*break*/, 9];
                        return [4 /*yield*/, sleep(300)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        print(5, 2, true, "Light & Shadow");
                        swap();
                        if (!!fast) return [3 /*break*/, 11];
                        return [4 /*yield*/, sleep(1500)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        print(renderer.width / 2 + 2, renderer.height / 2 - 8, true, "//TODO:put game here");
                        swap();
                        // if(!fast)await sleep(1500);
                        return [4 /*yield*/, sleep(1500)];
                    case 12:
                        // if(!fast)await sleep(1500);
                        _a.sent();
                        balls.push(new Ball(true, renderer.width - 5, top + 10, -1, 1));
                        balls.push(new Ball(false, 5, renderer.height - top - 10, 1, -1));
                        paddles.push(new Paddle(false, 2, renderer.height / 2 - 8, 16));
                        paddles.push(new Paddle(true, renderer.width - 2, renderer.height / 2 - 8, 16));
                        swap();
                        return [2 /*return*/];
                }
            });
        });
    }
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var doAi, _i, balls_1, ball, targetY, targetY, _a, paddles_1, paddle;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        doAi = frame % 2 == 0 && paddles.length > 0;
                        if (doAi) {
                            aiInput.up = false;
                            aiInput.down = false;
                        }
                        for (_i = 0, balls_1 = balls; _i < balls_1.length; _i++) {
                            ball = balls_1[_i];
                            ball.update();
                            if (doAi) {
                                if (ball.x < renderer.width / 2 && ball.velX < 0) {
                                    if (ball.y < paddles[0].y + paddles[0].height / 2) {
                                        aiInput.up = true;
                                    }
                                    else {
                                        aiInput.down = true;
                                    }
                                }
                            }
                        }
                        if (paddles.length > 0) {
                            targetY = (aiInput.up ? -8 : 0) + (aiInput.down ? +8 : 0);
                            paddles[0].velY = paddles[0].velY * 0.7 + targetY * 0.3;
                        }
                        if (paddles.length > 1) {
                            targetY = (input.up ? -8 : 0) + (input.down ? +8 : 0);
                            paddles[1].velY = paddles[1].velY * 0.7 + targetY * 0.3;
                        }
                        for (_a = 0, paddles_1 = paddles; _a < paddles_1.length; _a++) {
                            paddle = paddles_1[_a];
                            paddle.update();
                        }
                        swap();
                        return [4 /*yield*/, sleep(50)];
                    case 1:
                        _b.sent();
                        frame++;
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    return {
        setters: [
            function (Renderer_js_1_1) {
                Renderer_js_1 = Renderer_js_1_1;
            },
            function (blit16_1) {
                blit16 = blit16_1;
            }
        ],
        execute: function () {
            renderer = new Renderer_js_1.Renderer(document.getElementsByTagName('canvas')[0], 128, 92);
            Input = /** @class */ (function () {
                function Input() {
                    this.up = false;
                    this.down = false;
                }
                return Input;
            }());
            ;
            aiInput = new Input();
            input = new Input();
            window.addEventListener("keydown", function (event) {
                switch (event.key) {
                    case 'w':
                    case 'ArrowUp':
                        input.up = true;
                        break;
                    case 's':
                    case 'ArrowDown':
                        input.down = true;
                        break;
                }
            });
            window.addEventListener("keyup", function (event) {
                switch (event.key) {
                    case 'w':
                    case 'ArrowUp':
                        input.up = false;
                        break;
                    case 's':
                    case 'ArrowDown':
                        input.down = false;
                        break;
                }
            });
            top = 10;
            bottom = 10;
            Paddle = /** @class */ (function () {
                function Paddle(colour, x, y, height) {
                    this.velX = 0;
                    this.velY = 0;
                    this.colour = colour;
                    this.x = x;
                    this.y = y;
                    this.height = height;
                }
                Paddle.prototype.update = function () {
                    var newX = clamp(this.x + this.velX, 0, renderer.width - 1);
                    var newY = this.y;
                    while (newY - 1 >= this.y + this.velY) {
                        if (collide(this.colour, this.x, newY - 1)) {
                            this.velY = Math.abs(this.velY) * 0.8;
                            break;
                        }
                        else {
                            newY -= 1;
                        }
                    }
                    while (newY + 1 <= this.y + this.velY) {
                        if (collide(this.colour, this.x, newY + this.height)) {
                            this.velY = -Math.abs(this.velY) * 0.8;
                            break;
                        }
                        else {
                            newY += 1;
                        }
                    }
                    while (newX - 1 >= this.y + this.velX) {
                        if (collide(this.colour, this.x, newX - 1)) {
                            this.velX *= -0.5;
                            break;
                        }
                        else {
                            newX -= 1;
                        }
                    }
                    for (var y = 0; y < this.height; y++) {
                        put(this.x, this.y + y, !this.colour);
                    }
                    this.x = newX;
                    this.y = newY;
                    for (var y = 0; y < this.height; y++) {
                        put(this.x, this.y + y, this.colour);
                    }
                };
                return Paddle;
            }());
            Ball = /** @class */ (function () {
                function Ball(colour, x, y, velX, velY) {
                    this.velX = 0;
                    this.velY = 0;
                    this.speed = 2;
                    this.history = [[0, 0]];
                    this.colour = colour;
                    this.x = x;
                    this.y = y;
                    this.velX = velX;
                    this.velY = velY;
                    put(x, y, colour);
                }
                Ball.prototype.moveTo = function (x, y) {
                    if (x == this.x && y == this.y)
                        return;
                    put(this.x, this.y, !this.colour);
                    this.x = x;
                    this.y = y;
                    put(this.x, this.y, this.colour);
                };
                Ball.prototype.update = function () {
                    if (!this.velX && !this.velY)
                        return;
                    var trailLength = Math.min(this.speed, 20);
                    for (var i = this.speed; i > 0; i--) {
                        this.history.push([this.x, this.y]);
                        // put(this.x, this.y, !this.colour);
                        var newX = this.x + this.velX;
                        var newY = this.y + this.velY;
                        if (collide(this.colour, newX, newY)) {
                            for (var _i = 0, _a = this.history; _i < _a.length; _i++) {
                                var history_1 = _a[_i];
                                put(history_1[0], history_1[1], !this.colour);
                            }
                            var colX = collide(this.colour, newX, this.y);
                            var colY = collide(this.colour, this.x, newY);
                            for (var _b = 0, _c = this.history; _b < _c.length; _b++) {
                                var history_2 = _c[_b];
                                put(history_2[0], history_2[1], this.colour);
                            }
                            if (colX)
                                this.velX = clamp(this.velX * -1 + Math.random() * 0.1 - 0.05, -1.2, 1.2);
                            if (colY)
                                this.velY = clamp(this.velY * -1 + Math.random() * 0.1 - 0.05, -1.2, 1.2);
                            if (colX && colY) {
                                for (var _d = 0, _e = this.history; _d < _e.length; _d++) {
                                    var history_3 = _e[_d];
                                    put(history_3[0], history_3[1], !this.colour);
                                }
                                this.history = [];
                            }
                            if (!inbounds(newX, newY)) {
                                newX = this.x;
                                newY = this.y;
                            }
                            else {
                                boom(this.x, this.y, !this.colour);
                            }
                            // this.speed = Math.min(this.speed + 0.5, 10);
                        }
                        this.x = newX;
                        this.y = newY;
                        put(this.x, this.y, this.colour);
                    }
                    while (this.history.length > trailLength) {
                        put(this.history[0][0], this.history[0][1], !this.colour);
                        this.history.shift();
                    }
                };
                return Ball;
            }());
            paddles = [];
            balls = [];
            play_intro(true);
            frame = 0;
            run();
        }
    };
});
