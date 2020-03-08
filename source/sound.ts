export enum Effect {
	debug,
	boom,
	blip,
	paddle,
	paddleMiss,
	hasBomb
}

export enum Music {
	main
}

export class Manager {
	volume:number;
	context:AudioContext;

	effectBuffers = new Map<Effect, {buffer:AudioBuffer, volume:number}[]>();
	musicBuffers = new Map<Music, {buffer:AudioBuffer, volume:number, loopStart:number}[]>();
	
	constructor(volume:number) {
		this.volume = volume;
		try {
			this.context = new AudioContext();
		} catch(error) {
			throw Error('you no have sound :( bad browser!');
		}
	}

	async load():Promise<undefined> {
		await Promise.all([
			this.loadEffect(Effect.debug, 'sounds/debug.mp3', 1.0),
			this.loadEffect(Effect.boom, 'sounds/explosion1.mp3', 0.6),
			this.loadEffect(Effect.boom, 'sounds/explosion2.mp3', 0.6),
			this.loadEffect(Effect.boom, 'sounds/explosion3.mp3', 0.6),
			this.loadEffect(Effect.blip, 'sounds/blip1.mp3', 0.2),
			this.loadEffect(Effect.blip, 'sounds/blip2.mp3', 0.2),
			this.loadEffect(Effect.blip, 'sounds/blip3.mp3', 0.2),
			this.loadEffect(Effect.blip, 'sounds/blip4.mp3', 0.2),
			this.loadEffect(Effect.paddle, 'sounds/paddle.mp3', 1.0),
			this.loadEffect(Effect.paddleMiss, 'sounds/paddleMiss.mp3', 1.0),
			this.loadEffect(Effect.hasBomb, 'sounds/hasBomb.mp3', 1.0),
	
			this.loadMusic(Music.main, 'music/main.mp3', 1.0, 0.0)
		]);

		return;
	}

	async loadEffect(key:Effect, path:string, volume:number):Promise<boolean> {
		volume *= this.volume;
		return new Promise<boolean>((fulfill) => {
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

					console.log('loaded effect', path, 'as', key);
					fulfill(true);

				}, function(error){
					throw Error(`cannot comprehend '${path}' - ${error.message}`);
					fulfill(false);
				});
			}
			request.onerror = (error) => {
				throw Error(`error getting '${path}'`);
			};
			request.send();
		});
	}

	async loadMusic(key:Music, path:string, volume:number, loopStart = 0.0):Promise<boolean> {
		volume *= this.volume;
		return new Promise<boolean>((fulfill) => {
			const request = new XMLHttpRequest();
			request.open('GET', path, true);
			request.responseType = 'arraybuffer';
			request.onload = () => {
				const audioData = request.response;
				this.context.decodeAudioData(audioData, (buffer) => {
					if(this.musicBuffers.has(key)){
						var sources = this.musicBuffers.get(key) as {buffer:AudioBuffer, volume:number, loopStart:number}[];
						sources.push({buffer, volume, loopStart});
					}else{
						this.musicBuffers.set(key, [{buffer, volume, loopStart}]);
					}

					console.log('loaded music', path, 'as', key);
					fulfill(true);

				}, function(error){
					throw Error(`cannot comprehend '${path}' - ${error.message}`);
					fulfill(false);
				});
			}
			request.onerror = (error) => {
				throw Error(`error getting '${path}'`);
			};
			request.send();
		});
	}

	playEffect(effect:Effect, volumeScale = 1.0, pitchShift = 0.0) {
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

	playMusic(music:Music, volumeScale = 1.0) {
		console.log('music!', music);
		const buffers = this.musicBuffers.get(music);
		if(!buffers||buffers.length<1) return;

		let {buffer, volume, loopStart} = buffers[Math.floor(Math.random()*buffers.length)];
		volume *= volumeScale;

		const source = this.context.createBufferSource();
		const gain = this.context.createGain();

		source.buffer = buffer;
		source.loop = true;
		source.loopStart = loopStart;

		source.connect(gain);
		gain.gain.value = volume;
		
		gain.connect(this.context.destination);

		source.start();
	}
}
