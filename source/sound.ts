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

	effectBuffers = new Map<Effect, {buffer:AudioBuffer, volume:number}[]>();
	
	constructor() {
		try {
			this.context = new AudioContext();
		} catch(error) {
			throw Error('you no have sound :( bad browser!');
		}

		this.load(Effect.debug, 'sounds/debug.mp3', 1.0);
		this.load(Effect.boom, 'sounds/explosion1.wav', 0.6);
		this.load(Effect.boom, 'sounds/explosion2.wav', 0.6);
		this.load(Effect.boom, 'sounds/explosion3.wav', 0.6);
		this.load(Effect.blip, 'sounds/blip1.wav', 0.2);
		this.load(Effect.blip, 'sounds/blip2.wav', 0.2);
		this.load(Effect.blip, 'sounds/blip3.wav', 0.2);
		this.load(Effect.blip, 'sounds/blip4.wav', 0.2);
		this.load(Effect.paddle, 'sounds/paddle.wav', 1.0);
		this.load(Effect.paddleMiss, 'sounds/paddleMiss.wav', 1.0);
		this.load(Effect.hasBomb, 'sounds/hasBomb.wav', 1.0);
	}

	load(key:Effect, path:string, volume:number) {
		const request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			const audioData = request.response;
			this.context.decodeAudioData(audioData, (buffer) => {
				if(this.effectBuffers.has(key)){
					var sources = this.effectBuffers.get(key) as {buffer:AudioBuffer, volume:number}[];
					sources.push({buffer, volume});
				}else{
					this.effectBuffers.set(key, [{buffer, volume}]);
				}

				console.log('loaded', path, 'as', key);

			}, function(error){
				throw Error(`cannot comprehend '${path}' - ${error.message}`);
			});
		}
		request.send();
	}

	playEffect(effect:Effect, volumeScale = 1.0, pitchShift = 0.0) {
		console.log('sound!', effect);
		const buffers = this.effectBuffers.get(effect);
		if(!buffers||buffers.length<1) return;

		let {buffer, volume} = buffers[Math.floor(Math.random()*buffers.length)];
		volume *= volumeScale;

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
