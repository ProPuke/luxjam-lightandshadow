System.register([], function (exports_1, context_1) {
    "use strict";
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
            })(Effect || (Effect = {}));
            exports_1("Effect", Effect);
            (function (Music) {
                Music[Music["main"] = 0] = "main";
            })(Music || (Music = {}));
            exports_1("Music", Music);
            Manager = /** @class */ (function () {
                function Manager() {
                    this.effectBuffers = new Map();
                    this.musicBuffers = new Map();
                    try {
                        this.context = new AudioContext();
                    }
                    catch (error) {
                        throw Error('you no have sound :( bad browser!');
                    }
                    this.loadEffect(Effect.debug, 'sounds/debug.mp3', 1.0);
                    this.loadEffect(Effect.boom, 'sounds/explosion1.wav', 0.6);
                    this.loadEffect(Effect.boom, 'sounds/explosion2.wav', 0.6);
                    this.loadEffect(Effect.boom, 'sounds/explosion3.wav', 0.6);
                    this.loadEffect(Effect.blip, 'sounds/blip1.wav', 0.2);
                    this.loadEffect(Effect.blip, 'sounds/blip2.wav', 0.2);
                    this.loadEffect(Effect.blip, 'sounds/blip3.wav', 0.2);
                    this.loadEffect(Effect.blip, 'sounds/blip4.wav', 0.2);
                    this.loadEffect(Effect.paddle, 'sounds/paddle.wav', 1.0);
                    this.loadEffect(Effect.paddleMiss, 'sounds/paddleMiss.wav', 1.0);
                    this.loadEffect(Effect.hasBomb, 'sounds/hasBomb.wav', 1.0);
                    this.loadMusic(Music.main, 'music/main.mp3', 1.0, 0.0);
                }
                Manager.prototype.loadEffect = function (key, path, volume) {
                    var _this = this;
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
                        }, function (error) {
                            throw Error("cannot comprehend '" + path + "' - " + error.message);
                        });
                    };
                    request.send();
                };
                Manager.prototype.loadMusic = function (key, path, volume, loopStart) {
                    var _this = this;
                    if (loopStart === void 0) { loopStart = 0.0; }
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
                        }, function (error) {
                            throw Error("cannot comprehend '" + path + "' - " + error.message);
                        });
                    };
                    request.send();
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
                };
                return Manager;
            }());
            exports_1("Manager", Manager);
        }
    };
});
