export enum Effect {
	debug,
	boom,
	blip,
	paddle,
	paddleMiss,
	hasBomb
}

export class Manager {
	context:AudioContext;

	effectBuffers = new Map<Effect, AudioBuffer[]>();
	
	constructor() {
		try {
			this.context = new AudioContext();
		} catch(error) {
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

	load(key:Effect, path:string) {
		const request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			const audioData = request.response;
			this.context.decodeAudioData(audioData, (buffer) => {
				if(this.effectBuffers.has(key)){
					var sources = this.effectBuffers.get(key) as AudioBuffer[];
					sources.push(buffer);
				}else{
					this.effectBuffers.set(key, [buffer]);
				}

				console.log('loaded', path, 'as', key);

			}, function(error){
				throw Error(`cannot comprehend '${path}' - ${error.message}`);
			});
		}
		request.send();
	}

	playEffect(effect:Effect, volume:number, pitchShift:number = 0.0) {
		console.log('sound!', effect);
		const buffers = this.effectBuffers.get(effect);
		if(!buffers||buffers.length<1) return;

		const buffer = buffers[Math.floor(Math.random()*buffers.length)];

		const source = this.context.createBufferSource();
		const gain = this.context.createGain();

		source.buffer = buffer;
		source.detune.value = pitchShift;
		source.loop = false;

		source.connect(gain);
		gain.gain.value = volume;
		
		gain.connect(this.context.destination);

		source.start();
	}
}
