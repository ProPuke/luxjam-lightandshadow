System.register(["./Renderer.js", "./sound.js", "./blit16.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
    var Renderer_js_1, sound, renderer, sounds, blit16, Input, aiInput, input, top, bottom, Paddle, Ball, Bomb, paddles, balls, bombs, frame, gameWinner, is_endgame;
    var __moduleName = context_1 && context_1.id;
    function put_text(x, y, message, colour, glyphs, glyph_start, glyph_width, glyph_height) {
        var cx = x;
        var cy = y;
        for (var i = 0; i < message.length; i++) {
            if (message.charAt(i) == '\n') {
                cx = x;
                cy += glyph_height + 1;
                continue;
            }
            var glyph = glyphs[message.charCodeAt(i) - glyph_start];
            for (var gx = 0; gx < glyph_width; gx++) {
                for (var gy = 0; gy < glyph_height; gy++) {
                    if (glyph[gx + gy * glyph_width] != ' ') {
                        renderer.put(cx + gx, cy + gy, colour);
                    }
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
    function bigBoom(ox, oy, colour, bigDaddy) {
        if (bigDaddy === void 0) { bigDaddy = true; }
        return __awaiter(this, void 0, void 0, function () {
            var radius, i, i_1, x, y, i_2, x, y;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        radius = 10;
                        if (bigDaddy) {
                            for (i = 0; i < 3; i++) {
                                setTimeout(function () {
                                    bigBoom(ox + Math.random() * (radius * 2) - radius, oy + Math.random() * (radius * 2) - radius, colour, false);
                                }, 200 + i * 100);
                            }
                        }
                        if (sounds)
                            sounds.playEffect(sound.Effect.boom, bigDaddy ? 1.0 : 0.5);
                        i_1 = 1;
                        _a.label = 1;
                    case 1:
                        if (!(i_1 < radius)) return [3 /*break*/, 4];
                        for (x = -i_1; x < i_1; x++) {
                            for (y = -i_1; y < i_1; y++) {
                                if (Math.sqrt(x * x + y * y) <= i_1) {
                                    put_clipped(ox + x, oy + y, colour);
                                }
                            }
                        }
                        swap();
                        return [4 /*yield*/, sleep(50)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i_1 += 2;
                        return [3 /*break*/, 1];
                    case 4:
                        i_2 = 1;
                        _a.label = 5;
                    case 5:
                        if (!(i_2 < radius)) return [3 /*break*/, 8];
                        for (x = -i_2; x < i_2; x++) {
                            for (y = -i_2; y < i_2; y++) {
                                if (Math.sqrt(x * x + y * y) <= i_2) {
                                    put_clipped(ox + x, oy + y, !colour);
                                }
                            }
                        }
                        swap();
                        return [4 /*yield*/, sleep(50)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        i_2 += 2;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
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
    function segment(active, ox, oy, width, height) {
        for (var y = 0; y < height; y++) {
            for (var x = height - y; x < width - y; x++) {
                if (active || y == 0 || y == height - 1 || x == height - y || x == width - y - 1) {
                    put(ox + x, oy + y, active || (x + y) % 2 == 1);
                }
                else {
                    put(ox + x, oy + y, false);
                }
            }
        }
    }
    function block(colour, ox, oy, width, height) {
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                put(ox + x, oy + y, colour);
            }
        }
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
    function wait_for_touch() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (fulfill) {
                        var listener = document.addEventListener("click", function () {
                            fulfill();
                        }, {
                            once: true
                        });
                    })];
            });
        });
    }
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    function play_intro(fast) {
        return __awaiter(this, void 0, void 0, function () {
            function printText(colour) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                print(renderer.width / 2 - 28, renderer.height / 2 - 16, !colour, "TOUCH T");
                                print(renderer.width / 2 + 1, renderer.height / 2 - 16, colour, "O START");
                                if (!!fast) return [3 /*break*/, 2];
                                return [4 /*yield*/, sleep(500)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                print(renderer.width / 2 + 16, renderer.height / 2 + 8, colour, "Controls:");
                                if (!!fast) return [3 /*break*/, 4];
                                return [4 /*yield*/, sleep(200)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                print(renderer.width / 2 + 16, renderer.height / 2 + 8 + 10, colour, " UP / W");
                                if (!!fast) return [3 /*break*/, 6];
                                return [4 /*yield*/, sleep(200)];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                print(renderer.width / 2 + 16, renderer.height / 2 + 8 + 10 + 6, colour, " DOWN / S");
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var x, y, aiPaddle;
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
                        if (!(x % 2 == 0)) return [3 /*break*/, 6];
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
                        swap();
                        if (!!fast) return [3 /*break*/, 9];
                        return [4 /*yield*/, sleep(300)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        print(5, 2, true, "Light & Shadow");
                        swap();
                        if (!!fast) return [3 /*break*/, 11];
                        return [4 /*yield*/, sleep(500)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, printText(true)];
                    case 12:
                        _a.sent();
                        swap();
                        return [4 /*yield*/, wait_for_touch()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, printText(false)];
                    case 14:
                        _a.sent();
                        swap();
                        balls.push(new Ball(true, renderer.width / 2 + 5, top * 0.5 + (renderer.height - bottom) * 0.5, 1, Math.random() * 0.3 - 0.15));
                        balls.push(new Ball(false, renderer.width / 2 - 5, top * 0.5 + (renderer.height - bottom) * 0.5, -1, Math.random() * 0.3 - 0.15));
                        swap();
                        return [4 /*yield*/, sleep(300)];
                    case 15:
                        _a.sent();
                        aiPaddle = new Paddle(false, 2, renderer.height / 2 - 8, 16);
                        aiPaddle.isAi = true;
                        paddles.push(aiPaddle);
                        paddles.push(new Paddle(true, renderer.width - 2, renderer.height / 2 - 8, 16));
                        swap();
                        return [2 /*return*/];
                }
            });
        });
    }
    function play_gameover(win) {
        return __awaiter(this, void 0, void 0, function () {
            var i, x, i, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (sounds)
                            sounds.stopMusic();
                        if (sounds)
                            sounds.stopMusicCompanion(sound.Music.super);
                        if (sounds)
                            sounds.stopMusicCompanion(sound.Music.dnb);
                        return [4 /*yield*/, sleep(1000)];
                    case 1:
                        _a.sent();
                        if (sounds)
                            sounds.playEffect(sound.Effect.win);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < 16)) return [3 /*break*/, 5];
                        for (x = 0; x < renderer.width; x++) {
                            put(x, renderer.height / 2 - i, !win);
                            put(x, renderer.height / 2 + i - 1, !win);
                        }
                        swap();
                        return [4 /*yield*/, sleep(100)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, sleep(500)];
                    case 6:
                        _a.sent();
                        print(renderer.width / 2 - 20, renderer.height / 2 - 3, win, win ? "YOU WINNER" : " YOU LOSE ");
                        swap();
                        return [4 /*yield*/, sleep(3000)];
                    case 7:
                        _a.sent();
                        i = 16;
                        _a.label = 8;
                    case 8:
                        if (!(i < renderer.height / 2)) return [3 /*break*/, 11];
                        for (x = 0; x < renderer.width; x++) {
                            put(x, renderer.height / 2 - i, !win);
                            put(x, renderer.height / 2 + i - 1, !win);
                        }
                        swap();
                        return [4 /*yield*/, sleep(100)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 8];
                    case 11: return [4 /*yield*/, sleep(2000)];
                    case 12:
                        _a.sent();
                        clear(!win);
                        swap();
                        return [2 /*return*/];
                }
            });
        });
    }
    function count_wins() {
        var count = 0;
        var total = 0;
        for (var x = 0; x < renderer.width; x++) {
            for (var y = top; y < renderer.height - bottom; y++) {
                count += get(x, y) ? 0 : 1;
                total++;
            }
        }
        for (var x = 0; x < renderer.width / 2; x++) {
            for (var y = renderer.height - 8; y < renderer.height; y++) {
                put(x, y, false);
            }
        }
        return { count: count, total: total };
    }
    function begin_endgame() {
        if (is_endgame)
            return;
        is_endgame = true;
        if (sounds)
            sounds.playMusicCompanion(sound.Music.dnb);
        setTimeout(function () {
            if (sounds)
                sounds.stopMusic();
        }, 10 * 1000);
        setTimeout(function () {
            var _a = count_wins(), count = _a.count, total = _a.total;
            gameWinner = (count / total) > 0.5;
        }, 20 * 1000);
    }
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var doAi, pending, _i, balls_1, ball, _a, paddles_1, paddle, _b, paddles_2, paddle, targetY, targetY, _c, bombs_1, bomb, ball, combo, combo, _d, count, total, percentage;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(gameWinner == undefined)) return [3 /*break*/, 3];
                        doAi = frame % 2 == 0;
                        if (doAi) {
                            aiInput.up = false;
                            aiInput.down = false;
                        }
                        pending = [];
                        for (_i = 0, balls_1 = balls; _i < balls_1.length; _i++) {
                            ball = balls_1[_i];
                            pending.push(ball.update());
                            if (doAi) {
                                for (_a = 0, paddles_1 = paddles; _a < paddles_1.length; _a++) {
                                    paddle = paddles_1[_a];
                                    if (paddle.isAi) {
                                        if (ball.x < renderer.width / 2 && ball.velX < 0) {
                                            if (ball.y <= paddle.y + paddle.height * 0.3) {
                                                aiInput.up = true;
                                            }
                                            else if (ball.y >= paddle.y + paddle.height * 0.6) {
                                                aiInput.down = true;
                                            }
                                            else {
                                                if (Math.random() > 0.5) {
                                                    aiInput.up = true;
                                                }
                                                else {
                                                    aiInput.down = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all(pending)];
                    case 1:
                        _e.sent();
                        for (_b = 0, paddles_2 = paddles; _b < paddles_2.length; _b++) {
                            paddle = paddles_2[_b];
                            if (paddle.isAi) {
                                targetY = (aiInput.up ? -8 : 0) + (aiInput.down ? +8 : 0);
                                paddle.velY = paddle.velY * 0.7 + targetY * 0.3;
                            }
                            else {
                                targetY = (input.up ? -8 : 0) + (input.down ? +8 : 0);
                                paddle.velY = paddle.velY * 0.7 + targetY * 0.3;
                            }
                            paddle.update();
                        }
                        for (_c = 0, bombs_1 = bombs; _c < bombs_1.length; _c++) {
                            bomb = bombs_1[_c];
                            bomb.update();
                        }
                        if (balls.length > 0) {
                            ball = balls[0];
                            {
                                combo = ball.bombChargeDuration < 10 ? (frame % 4 < 2 ? ball.lastBombCharge : ball.bombCharge) : ball.bombCharge;
                                if (ball.hasBomb) {
                                    if (frame % 4 < 2) {
                                        combo = 0;
                                    }
                                }
                                segment(combo > 0, renderer.width - 30 - 15 - 15, renderer.height - 8, 20, 7);
                                segment(combo > 1, renderer.width - 30 - 15, renderer.height - 8, 20, 7);
                                segment(combo > 2, renderer.width - 30, renderer.height - 8, 20, 7);
                            }
                            {
                                combo = ball.superChargeDuration < 10 ? (frame % 4 < 2 ? ball.lastSuperCharge : ball.superCharge) : ball.superCharge;
                                if (ball.isSuper) {
                                    if (frame % 4 < 2) {
                                        combo = 0;
                                    }
                                    else {
                                        combo = 4;
                                    }
                                }
                                block(combo > 0, renderer.width - 8, renderer.height - 8, 3, 3);
                                block(combo > 1, renderer.width - 4, renderer.height - 8, 3, 3);
                                block(combo > 2, renderer.width - 8, renderer.height - 4, 3, 3);
                                block(combo > 3, renderer.width - 4, renderer.height - 4, 3, 3);
                            }
                        }
                        if (frame % 10 == 0) {
                            _d = count_wins(), count = _d.count, total = _d.total;
                            print(3, renderer.height - 8, true, (((total - count) / total) * 100).toFixed(0) + "% vs " + ((count / total) * 100).toFixed(0) + "%");
                            percentage = count / total;
                            if ((sounds && sounds.context.currentTime > 60 * 3.0) || percentage > 0.75 || percentage < 0.25) {
                                begin_endgame();
                            }
                        }
                        swap();
                        return [4 /*yield*/, sleep(50)];
                    case 2:
                        _e.sent();
                        frame++;
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    return {
        setters: [
            function (Renderer_js_1_1) {
                Renderer_js_1 = Renderer_js_1_1;
            },
            function (sound_1) {
                sound = sound_1;
            },
            function (blit16_1) {
                blit16 = blit16_1;
            }
        ],
        execute: function () {
            renderer = new Renderer_js_1.Renderer(document.getElementsByTagName('canvas')[0], 128, 92);
            sounds = null;
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
            window.addEventListener("click", function (event) {
                if (!sounds) {
                    sounds = new sound.Manager(1.0);
                    sounds.load().then(function () {
                        if (sounds)
                            sounds.playMusic(sound.Music.main);
                    });
                }
            });
            window.addEventListener("keydown", function (event) {
                switch (event.key) {
                    case 'w':
                    case 'ArrowUp':
                        input.up = true;
                        event.preventDefault();
                        break;
                    case 's':
                    case 'ArrowDown':
                        input.down = true;
                        event.preventDefault();
                        break;
                    // case '1':
                    // 	if(sounds)sounds.playMusicCompanion(sound.Music.super);
                    // break;
                    // case '2':
                    // 	if(sounds)sounds.stopMusicCompanion(sound.Music.super);
                    // break;
                    // case '3':
                    // 	if(sounds)sounds.playMusicCompanion(sound.Music.dnb);
                    // break;
                    // case '4':
                    // 	if(sounds)sounds.stopMusicCompanion(sound.Music.dnb);
                    // break;
                    // case '5':
                    // 	gameWinner = false;
                    // break;
                    // case '6':
                    // 	gameWinner = true;
                    // break;
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
                    this.isAi = false;
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
                Paddle.prototype.collides = function (x, y) {
                    x = Math.round(x);
                    y = Math.round(y);
                    return Math.round(x) == Math.round(this.x) && y >= Math.round(this.y) && y < Math.round(this.y) + this.height;
                };
                return Paddle;
            }());
            Ball = /** @class */ (function () {
                function Ball(colour, x, y, velX, velY) {
                    this.velX = 0;
                    this.velY = 0;
                    this.minSpeed = 1;
                    this.speed = 1;
                    this.bombCount = 0;
                    this.paddleCombo = 0;
                    this.bombCharge = 0;
                    this.lastBombCharge = 0;
                    this.bombChargeDuration = 0;
                    this.hasBomb = false;
                    this.superCharge = 0;
                    this.lastSuperCharge = 0;
                    this.superChargeDuration = 0;
                    this.isSuper = 0;
                    this.history = [[0, 0]];
                    this.colour = colour;
                    this.x = x;
                    this.y = y;
                    this.velX = velX;
                    this.velY = velY;
                    this.history.push([x, y]);
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
                Ball.prototype.get_bomb_charge = function () {
                    var _this = this;
                    this.lastBombCharge = this.bombCharge;
                    this.bombCharge++;
                    if (this.bombCharge == 3) {
                        if (this.colour) {
                            setTimeout(function () {
                                if (sounds)
                                    sounds.playEffect(sound.Effect.hasBomb);
                                _this.hasBomb = true;
                            }, 200);
                        }
                    }
                    this.bombChargeDuration = 0;
                };
                Ball.prototype.reset_bomb_charge = function () {
                    this.lastBombCharge = this.bombCharge;
                    this.bombCharge = 0;
                    this.bombChargeDuration = 0;
                };
                Ball.prototype.get_super_charge = function () {
                    this.lastSuperCharge = this.superCharge;
                    this.superCharge++;
                    if (this.superCharge == 4) {
                        this.superCharge = 0;
                        this.go_super();
                    }
                    this.superChargeDuration = 0;
                };
                Ball.prototype.reset_super_charge = function () {
                    this.lastSuperCharge = 0;
                    this.superCharge = 0;
                    this.superChargeDuration = 0;
                };
                Ball.prototype.update = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.update_movement()];
                                case 1:
                                    _a.sent();
                                    if (this.isSuper > 0) {
                                        this.isSuper--;
                                        if (this.colour && !this.isSuper) {
                                            if (sounds)
                                                sounds.stopMusicCompanion(sound.Music.super);
                                        }
                                    }
                                    this.bombChargeDuration++;
                                    this.superChargeDuration++;
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                Ball.prototype.update_movement = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var trailLength, _i, _a, history_1, _loop_1, this_1, newX, newY, i, _b, _c, history_2;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!this.velX && !this.velY)
                                        return [2 /*return*/];
                                    trailLength = Math.min(this.speed * 2, 20);
                                    for (_i = 0, _a = this.history; _i < _a.length; _i++) {
                                        history_1 = _a[_i];
                                        put(history_1[0], history_1[1], !this.colour);
                                    }
                                    _loop_1 = function () {
                                        var hitBomb, hitPaddle, _i, bombs_2, bomb, wasScreenEdge, wasFarScreenEdge, oldVelX, oldVelY, colX, colY, i2, paddle, paddlePhase, length_1, x_1, y_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    newX = this_1.x + this_1.velX;
                                                    newY = this_1.y + this_1.velY;
                                                    if (Math.round(newX) == Math.round(this_1.x) && Math.round(newY) == Math.round(this_1.y)) {
                                                        this_1.x = newX;
                                                        this_1.y = newY;
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    hitBomb = false;
                                                    hitPaddle = false;
                                                    _i = 0, bombs_2 = bombs;
                                                    _a.label = 1;
                                                case 1:
                                                    if (!(_i < bombs_2.length)) return [3 /*break*/, 4];
                                                    bomb = bombs_2[_i];
                                                    if (!bomb.collides(newX, newY)) return [3 /*break*/, 3];
                                                    hitBomb = true;
                                                    return [4 /*yield*/, bomb.explode(this_1.colour)];
                                                case 2:
                                                    _a.sent();
                                                    this_1.get_super_charge();
                                                    this_1.velX *= -1;
                                                    this_1.velY *= -1;
                                                    newX = this_1.x + this_1.velX;
                                                    newY = this_1.y + this_1.velY;
                                                    _a.label = 3;
                                                case 3:
                                                    _i++;
                                                    return [3 /*break*/, 1];
                                                case 4:
                                                    if (!hitBomb && collide(this_1.colour, newX, newY)) {
                                                        wasScreenEdge = !inbounds(newX, newY);
                                                        wasFarScreenEdge = newX <= -0.5 || newX > renderer.width - 0.5;
                                                        oldVelX = this_1.velX;
                                                        oldVelY = this_1.velY;
                                                        colX = collide(this_1.colour, newX, this_1.y);
                                                        colY = collide(this_1.colour, this_1.x, newY);
                                                        if (!colX && !colY)
                                                            colX = colY = true;
                                                        if (colX)
                                                            this_1.velX = clamp(this_1.velX * -1 + Math.random() * 0.1 - 0.05, -1.2, 1.2);
                                                        if (colY)
                                                            this_1.velY = clamp(this_1.velY * -1 + Math.random() * 0.1 - 0.05, -1.2, 1.2);
                                                        for (i2 = 0; i2 < paddles.length; i2++) {
                                                            paddle = paddles[i2];
                                                            if (paddle.collides(newX, newY)) {
                                                                if (paddle.colour == this_1.colour) {
                                                                    hitPaddle = true;
                                                                    paddlePhase = clamp((newY - paddle.y) / paddle.height, 0.0, 1.0);
                                                                    length_1 = Math.sqrt(this_1.velX * this_1.velX + this_1.velY * this_1.velY);
                                                                    this_1.velY = this_1.velY - 1.5 + paddlePhase * 3.0;
                                                                    //renormalise to same length, but keeping the new y velcity
                                                                    this_1.velY = clamp(this_1.velY, -length_1 * 0.9, length_1 * 0.8);
                                                                    this_1.velX = Math.sign(this_1.velX) * Math.sqrt(length_1 * length_1 - this_1.velY * this_1.velY);
                                                                }
                                                                else {
                                                                    bigBoom(paddle.x, paddle.y, this_1.colour);
                                                                    bigBoom(paddle.x, paddle.y + paddle.height / 2, this_1.colour);
                                                                    bigBoom(paddle.x, paddle.y + paddle.height, this_1.colour);
                                                                    paddles.splice(i2, 1);
                                                                    i--;
                                                                }
                                                            }
                                                        }
                                                        if (hitPaddle) {
                                                            if (sounds)
                                                                sounds.playEffect(sound.Effect.blip, 1.0, (Math.random() * 2 - 1) * 50);
                                                            if (this_1.colour) {
                                                                if (sounds)
                                                                    sounds.playEffect(sound.Effect.paddle, 1.0, this_1.paddleCombo * 100);
                                                            }
                                                            this_1.paddleCombo++;
                                                            this_1.get_bomb_charge();
                                                        }
                                                        else if (wasFarScreenEdge) {
                                                            if (this_1.paddleCombo > 0 && this_1.colour) {
                                                                if (sounds)
                                                                    sounds.playEffect(sound.Effect.paddleMiss, 2.0);
                                                                setTimeout(function () {
                                                                    if (sounds)
                                                                        sounds.playEffect(sound.Effect.paddleMiss, 2.0, -300);
                                                                }, 200);
                                                            }
                                                            else {
                                                                if (sounds)
                                                                    sounds.playEffect(sound.Effect.blip, 1.0, (Math.random() * 2 - 1) * 50);
                                                            }
                                                            this_1.paddleCombo = 0;
                                                            this_1.reset_bomb_charge();
                                                        }
                                                        else {
                                                            if (sounds)
                                                                sounds.playEffect(sound.Effect.blip, 1.0, (Math.random() * 2 - 1) * 50);
                                                        }
                                                        if (this_1.isSuper && !wasScreenEdge && !hitPaddle) {
                                                            this_1.velX = oldVelX;
                                                            this_1.velY = oldVelY;
                                                        }
                                                        newX = this_1.x + this_1.velX;
                                                        newY = this_1.y + this_1.velY;
                                                        if (wasScreenEdge || hitPaddle) {
                                                            newX = this_1.x;
                                                            newY = this_1.y;
                                                            if (hitPaddle) {
                                                                this_1.speed = Math.min(this_1.speed + 0.3, 5);
                                                                if (this_1.speed > this_1.minSpeed && this_1.speed <= 2) {
                                                                    this_1.minSpeed = this_1.speed;
                                                                }
                                                            }
                                                            else if (wasFarScreenEdge) {
                                                                //only slow if hitting the wall on your side
                                                                if (this_1.x > 0.5 == this_1.colour) {
                                                                    this_1.speed = Math.max(this_1.speed - 0.7, this_1.minSpeed);
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            boom(this_1.x, this_1.y, !this_1.colour);
                                                            if (this_1.hasBomb) {
                                                                x_1 = this_1.x + (this_1.colour ? 4 : -4);
                                                                y_1 = this_1.y;
                                                                setTimeout(function () {
                                                                    bombs.push(new Bomb(x_1, y_1));
                                                                }, 200);
                                                                this_1.hasBomb = false;
                                                                this_1.bombCharge = 0;
                                                                this_1.lastBombCharge = 0;
                                                                this_1.bombChargeDuration = 0;
                                                            }
                                                        }
                                                    }
                                                    this_1.x = newX;
                                                    this_1.y = newY;
                                                    this_1.history.push([this_1.x, this_1.y]);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    this_1 = this;
                                    i = this.speed;
                                    _d.label = 1;
                                case 1:
                                    if (!(i > 0)) return [3 /*break*/, 4];
                                    return [5 /*yield**/, _loop_1()];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3:
                                    i--;
                                    return [3 /*break*/, 1];
                                case 4:
                                    while (this.history.length > trailLength) {
                                        this.history.shift();
                                    }
                                    for (_b = 0, _c = this.history; _b < _c.length; _b++) {
                                        history_2 = _c[_b];
                                        put(history_2[0], history_2[1], this.isSuper || this.hasBomb ? frame % 4 < 2 : this.colour);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                Ball.prototype.go_super = function () {
                    this.isSuper = Math.max(this.isSuper, 150);
                    if (this.colour) {
                        if (sounds)
                            sounds.playMusicCompanion(sound.Music.super);
                    }
                };
                return Ball;
            }());
            Bomb = /** @class */ (function () {
                function Bomb(x, y) {
                    this.frame = 0;
                    this.x = x;
                    this.y = y;
                }
                Bomb.prototype.update = function () {
                    this.frame++;
                    var size = Math.min(this.frame, 5);
                    var colour = Math.round(frame / 2) % 2 == 0;
                    for (var x = 0; x < size; x++) {
                        for (var y = 0; y < size; y++) {
                            put(this.x - size / 2 + x, this.y - size / 2 + y, colour);
                        }
                    }
                };
                Bomb.prototype.explode = function (colour) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    bombs = bombs.filter(function (existing) { return existing != _this; });
                                    return [4 /*yield*/, bigBoom(this.x, this.y, colour)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                Bomb.prototype.collides = function (x, y) {
                    return Math.abs(Math.round(x) - this.x) < 3 && Math.abs(Math.round(y) - this.y) < 3;
                };
                return Bomb;
            }());
            paddles = [];
            balls = [];
            bombs = [];
            frame = 0;
            is_endgame = false;
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, play_intro(false)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, run()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, play_gameover(gameWinner == true)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
    };
});
