export enum Effect {
	debug,
	boom,
	blip,
	paddle,
	paddleMiss,
	hasBomb
}

export enum Music {
	main,
	super,
	dnb
}

export class Manager {
	volume:number;
	context:AudioContext;

	effectBuffers = new Map<Effect, {buffer:AudioBuffer, volume:number}[]>();
	musicBuffers = new Map<Music, {buffer:AudioBuffer, volume:number, loopStart:number}[]>();
	musicCompanions = new Map<Music, AudioBufferSourceNode>();

	currentMusic:AudioBufferSourceNode|undefined;
	currentMusicStartTime = 0.0;
	
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
			this.loadEffect(Effect.debug, 'sounds/debug.mp3', .4),
			this.loadEffect(Effect.boom, 'sounds/bomb_0.wav', 0.6),
			this.loadEffect(Effect.boom, 'sounds/bomb_1.wav', 0.6),
			this.loadEffect(Effect.boom, 'sounds/bomb_2.wav', 0.6),
			this.loadEffect(Effect.blip, 'sounds/blip.wav', 0.6),
			this.loadEffect(Effect.paddle, 'sounds/paddle.wav', 1.0),
			this.loadEffect(Effect.paddleMiss, 'sounds/paddle_miss.wav', 1.5),
			this.loadEffect(Effect.hasBomb, 'sounds/bomb_collect.wav', 1.5),

			this.loadMusic(Music.main, 'music/main.mp3', 0.56, 0.0),
			this.loadMusic(Music.super, 'music/super.mp3', 0.56, 0.0),
			this.loadMusic(Music.dnb, 'music/dnb.mp3', 0.56, 0.0)
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
		if(this.currentMusic){
			this.currentMusic.stop();
			this.currentMusic = undefined;
		}

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

		this.currentMusic = source;
		this.currentMusicStartTime = this.context.currentTime;
	}

	playMusicCompanion(music:Music, volumeScale = 1.0) {
		const existing = this.musicCompanions.get(music);
		if(existing) return;

		console.log('music companion!', music);
		const buffers = this.musicBuffers.get(music);
		if(!buffers||buffers.length<1) return;

		let {buffer, volume, loopStart} = buffers[Math.floor(Math.random()*buffers.length)];
		volume *= volumeScale;

		const source = this.context.createBufferSource();
		const gain = this.context.createGain();

		source.buffer = buffer;
		source.loop = true;
		source.loopStart = loopStart;

		let offset = 0.0;

		if(this.currentMusic){
			offset = this.context.currentTime - this.currentMusicStartTime;
		}

		source.connect(gain);
		gain.gain.setValueAtTime(0, this.context.currentTime);
		gain.gain.linearRampToValueAtTime(volume, this.context.currentTime+1.5);
		
		gain.connect(this.context.destination);

		source.start(0, offset % buffer.duration);

		this.musicCompanions.set(music, source);
	}

	stopMusicCompanion(music:Music) {
		console.log('music companion stop!', music);

		const source = this.musicCompanions.get(music);
		if(!source) return;

		this.musicCompanions.delete(music);

		source.stop();
	}
}
