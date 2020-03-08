System.register([], function (exports_1, context_1) {
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
    var Effect, Music, Manager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (Effect) {
                Effect[Effect["debug"] = 0] = "debug";
                Effect[Effect["boom"] = 1] = "boom";
                Effect[Effect["blip"] = 2] = "blip";
                Effect[Effect["paddle"] = 3] = "paddle";
                Effect[Effect["paddleMiss"] = 4] = "paddleMiss";
                Effect[Effect["hasBomb"] = 5] = "hasBomb";
                Effect[Effect["win"] = 6] = "win";
            })(Effect || (Effect = {}));
            exports_1("Effect", Effect);
            (function (Music) {
                Music[Music["main"] = 0] = "main";
                Music[Music["super"] = 1] = "super";
                Music[Music["dnb"] = 2] = "dnb";
            })(Music || (Music = {}));
            exports_1("Music", Music);
            Manager = /** @class */ (function () {
                function Manager(volume) {
                    this.effectBuffers = new Map();
                    this.musicBuffers = new Map();
                    this.musicCompanions = new Map();
                    this.currentMusicStartTime = 0.0;
                    this.volume = volume;
                    try {
                        this.context = new AudioContext();
                    }
                    catch (error) {
                        throw Error('you no have sound :( bad browser!');
                    }
                }
                Manager.prototype.load = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all([
                                        this.loadEffect(Effect.debug, 'sounds/debug.mp3', .4),
                                        this.loadEffect(Effect.boom, 'sounds/bomb_0.wav', 0.6),
                                        this.loadEffect(Effect.boom, 'sounds/bomb_1.wav', 0.6),
                                        this.loadEffect(Effect.boom, 'sounds/bomb_2.wav', 0.6),
                                        this.loadEffect(Effect.blip, 'sounds/blip.wav', 0.6),
                                        this.loadEffect(Effect.paddle, 'sounds/paddle.wav', 1.0),
                                        this.loadEffect(Effect.paddleMiss, 'sounds/paddle_miss.wav', 1.5),
                                        this.loadEffect(Effect.hasBomb, 'sounds/bomb_collect.wav', 1.5),
                                        this.loadEffect(Effect.win, 'sounds/win.wav', 1.5),
                                        this.loadMusic(Music.main, 'music/main.mp3', 0.56, 0.0),
                                        this.loadMusic(Music.super, 'music/super.mp3', 0.56, 0.0),
                                        this.loadMusic(Music.dnb, 'music/dnb.mp3', 0.56, 0.0)
                                    ])];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                Manager.prototype.loadEffect = function (key, path, volume) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            volume *= this.volume;
                            return [2 /*return*/, new Promise(function (fulfill) {
                                    var request = new XMLHttpRequest();
                                    request.open('GET', path, true);
                                    request.responseType = 'arraybuffer';
                                    request.onload = function () {
                                        var audioData = request.response;
                                        _this.context.decodeAudioData(audioData, function (buffer) {
                                            if (_this.effectBuffers.has(key)) {
                                                var sources = _this.effectBuffers.get(key);
                                                sources.push({ buffer: buffer, volume: volume });
                                            }
                                            else {
                                                _this.effectBuffers.set(key, [{ buffer: buffer, volume: volume }]);
                                            }
                                            console.log('loaded effect', path, 'as', key);
                                            fulfill(true);
                                        }, function (error) {
                                            throw Error("cannot comprehend '" + path + "' - " + error.message);
                                            fulfill(false);
                                        });
                                    };
                                    request.onerror = function (error) {
                                        throw Error("error getting '" + path + "'");
                                    };
                                    request.send();
                                })];
                        });
                    });
                };
                Manager.prototype.loadMusic = function (key, path, volume, loopStart) {
                    if (loopStart === void 0) { loopStart = 0.0; }
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            volume *= this.volume;
                            return [2 /*return*/, new Promise(function (fulfill) {
                                    var request = new XMLHttpRequest();
                                    request.open('GET', path, true);
                                    request.responseType = 'arraybuffer';
                                    request.onload = function () {
                                        var audioData = request.response;
                                        _this.context.decodeAudioData(audioData, function (buffer) {
                                            if (_this.musicBuffers.has(key)) {
                                                var sources = _this.musicBuffers.get(key);
                                                sources.push({ buffer: buffer, volume: volume, loopStart: loopStart });
                                            }
                                            else {
                                                _this.musicBuffers.set(key, [{ buffer: buffer, volume: volume, loopStart: loopStart }]);
                                            }
                                            console.log('loaded music', path, 'as', key);
                                            fulfill(true);
                                        }, function (error) {
                                            throw Error("cannot comprehend '" + path + "' - " + error.message);
                                            fulfill(false);
                                        });
                                    };
                                    request.onerror = function (error) {
                                        throw Error("error getting '" + path + "'");
                                    };
                                    request.send();
                                })];
                        });
                    });
                };
                Manager.prototype.playEffect = function (effect, volumeScale, pitchShift) {
                    if (volumeScale === void 0) { volumeScale = 1.0; }
                    if (pitchShift === void 0) { pitchShift = 0.0; }
                    var buffers = this.effectBuffers.get(effect);
                    if (!buffers || buffers.length < 1)
                        return;
                    var _a = buffers[Math.floor(Math.random() * buffers.length)], buffer = _a.buffer, volume = _a.volume;
                    volume *= volumeScale;
                    var source = this.context.createBufferSource();
                    var gain = this.context.createGain();
                    source.buffer = buffer;
                    source.detune.value = pitchShift;
                    source.loop = false;
                    source.connect(gain);
                    gain.gain.value = volume;
                    gain.connect(this.context.destination);
                    source.start();
                };
                Manager.prototype.playMusic = function (music, volumeScale) {
                    if (volumeScale === void 0) { volumeScale = 1.0; }
                    if (this.currentMusic) {
                        this.currentMusic.stop();
                        this.currentMusic = undefined;
                    }
                    console.log('music!', music);
                    var buffers = this.musicBuffers.get(music);
                    if (!buffers || buffers.length < 1)
                        return;
                    var _a = buffers[Math.floor(Math.random() * buffers.length)], buffer = _a.buffer, volume = _a.volume, loopStart = _a.loopStart;
                    volume *= volumeScale;
                    var source = this.context.createBufferSource();
                    var gain = this.context.createGain();
                    source.buffer = buffer;
                    source.loop = true;
                    source.loopStart = loopStart;
                    source.connect(gain);
                    gain.gain.value = volume;
                    gain.connect(this.context.destination);
                    source.start();
                    this.currentMusic = source;
                    this.currentMusicStartTime = this.context.currentTime;
                };
                Manager.prototype.stopMusic = function () {
                    if (this.currentMusic) {
                        this.currentMusic.stop();
                        this.currentMusic = undefined;
                    }
                };
                Manager.prototype.playMusicCompanion = function (music, volumeScale) {
                    if (volumeScale === void 0) { volumeScale = 1.0; }
                    var existing = this.musicCompanions.get(music);
                    if (existing)
                        return;
                    console.log('music companion!', music);
                    var buffers = this.musicBuffers.get(music);
                    if (!buffers || buffers.length < 1)
                        return;
                    var _a = buffers[Math.floor(Math.random() * buffers.length)], buffer = _a.buffer, volume = _a.volume, loopStart = _a.loopStart;
                    volume *= volumeScale;
                    var source = this.context.createBufferSource();
                    var gain = this.context.createGain();
                    source.buffer = buffer;
                    source.loop = true;
                    source.loopStart = loopStart;
                    var offset = 0.0;
                    if (this.currentMusic) {
                        offset = this.context.currentTime - this.currentMusicStartTime;
                    }
                    source.connect(gain);
                    gain.gain.setValueAtTime(0, this.context.currentTime);
                    gain.gain.linearRampToValueAtTime(volume, this.context.currentTime + 1.5);
                    gain.connect(this.context.destination);
                    source.start(0, offset % buffer.duration);
                    this.musicCompanions.set(music, source);
                };
                Manager.prototype.stopMusicCompanion = function (music) {
                    console.log('music companion stop!', music);
                    var source = this.musicCompanions.get(music);
                    if (!source)
                        return;
                    this.musicCompanions.delete(music);
                    source.stop();
                };
                return Manager;
            }());
            exports_1("Manager", Manager);
        }
    };
});
