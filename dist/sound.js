System.register([], function (exports_1, context_1) {
    "use strict";
    var Effect, Manager;
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
            Manager = /** @class */ (function () {
                function Manager() {
                    this.effectBuffers = new Map();
                    try {
                        this.context = new AudioContext();
                    }
                    catch (error) {
                        throw Error('you no have sound :( bad browser!');
                    }
                    this.load(Effect.debug, 'sounds/debug.mp3');
                    this.load(Effect.boom, 'sounds/explosion1.wav');
                    this.load(Effect.boom, 'sounds/explosion2.wav');
                    this.load(Effect.boom, 'sounds/explosion3.wav');
                    this.load(Effect.blip, 'sounds/blip1.wav');
                    this.load(Effect.blip, 'sounds/blip2.wav');
                    this.load(Effect.blip, 'sounds/blip3.wav');
                    this.load(Effect.blip, 'sounds/blip4.wav');
                    this.load(Effect.paddle, 'sounds/paddle.wav');
                    this.load(Effect.paddleMiss, 'sounds/paddleMiss.wav');
                    this.load(Effect.hasBomb, 'sounds/hasBomb.wav');
                }
                Manager.prototype.load = function (key, path) {
                    var _this = this;
                    var request = new XMLHttpRequest();
                    request.open('GET', path, true);
                    request.responseType = 'arraybuffer';
                    request.onload = function () {
                        var audioData = request.response;
                        _this.context.decodeAudioData(audioData, function (buffer) {
                            if (_this.effectBuffers.has(key)) {
                                var sources = _this.effectBuffers.get(key);
                                sources.push(buffer);
                            }
                            else {
                                _this.effectBuffers.set(key, [buffer]);
                            }
                            console.log('loaded', path, 'as', key);
                        }, function (error) {
                            throw Error("cannot comprehend '" + path + "' - " + error.message);
                        });
                    };
                    request.send();
                };
                Manager.prototype.playEffect = function (effect, volume, pitchShift) {
                    if (pitchShift === void 0) { pitchShift = 0.0; }
                    console.log('sound!', effect);
                    var buffers = this.effectBuffers.get(effect);
                    if (!buffers || buffers.length < 1)
                        return;
                    var buffer = buffers[Math.floor(Math.random() * buffers.length)];
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
                return Manager;
            }());
            exports_1("Manager", Manager);
        }
    };
});
