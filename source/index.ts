import { Renderer } from './Renderer.js';
import * as sound from './sound.js';

const renderer = new Renderer(document.getElementsByTagName('canvas')[0], 128, 92);

let sounds:sound.Manager|null = null;

import * as blit16 from './blit16.js';

function put_text(x:number, y:number, message:string, colour:boolean, glyphs:string[], glyph_start:number, glyph_width:number, glyph_height:number) {
	let cx = x;
	let cy = y;
	for(let i=0;i<message.length;i++){
		const glyph = glyphs[message.charCodeAt(i)-glyph_start];
		for(let gx=0;gx<glyph_width;gx++){
			for(let gy=0;gy<glyph_height;gy++){
				renderer.put(cx+gx, cy+gy, glyph[gx+gy*glyph_width]!=' '?colour:!colour);
			}
		}
		cx += glyph_width+1;
		if(cx+glyph_width>=renderer.width){
			cx = x;
			cy += glyph_height+1;
		}
	}
}

function print(x:number, y:number, colour:boolean, message:string) {
	put_text(x, y, message, colour, blit16.glyphs, blit16.glyph_start, blit16.width, blit16.height);
}

function get(x:number, y:number):boolean {
	return renderer.get(x, y);
}

function inbounds(x:number, y:number):boolean {
	x = Math.round(x);
	y = Math.round(y);
	if(x>=0&&y>=top&&x<renderer.width&&y<renderer.height-bottom) return true;
	return false;
}

function collide(c:boolean, x:number, y:number):boolean {
	if(!inbounds(x, y)) return true;
	return renderer.get(x, y)==c;
}

function put(x:number, y:number, colour:boolean) {
	renderer.put(x, y, colour);
}

function put_clipped(x:number, y:number, colour:boolean) {
	x = Math.round(x);
	y = Math.round(y);
	if(y<top||y>=renderer.height-bottom) return;

	renderer.put(x, y, colour);
}

async function bigBoom(ox:number, oy:number, colour:boolean, bigDaddy = true) {
	const radius = 10;

	if(bigDaddy){
		for(var i=0;i<3;i++){
			setTimeout(() => {
				bigBoom(ox + Math.random()*(radius*2)-radius, oy + Math.random()*(radius*2)-radius, colour, false);
			}, 200+i*100);
		}
	}

	if(sounds)sounds.playEffect(sound.Effect.boom, bigDaddy?1.0:0.5);

	for(let i=1;i<radius;i+=2){
		for(let x=-i;x<i;x++){
			for(let y=-i;y<i;y++){
				if(Math.sqrt(x*x+y*y)<=i){
					put_clipped(ox+x, oy+y, colour);
				}
			}
		}

		swap();
		await sleep(50);
	}

	for(let i=1;i<radius;i+=2){
		for(let x=-i;x<i;x++){
			for(let y=-i;y<i;y++){
				if(Math.sqrt(x*x+y*y)<=i){
					put_clipped(ox+x, oy+y, !colour);
				}
			}
		}

		swap();
		await sleep(50);
	}
}

function boom(x:number, y:number, colour:boolean) {
	put_clipped(x, y, colour);
	put_clipped(x+1, y, colour);
	put_clipped(x+1, y+1, colour);
	put_clipped(x+1, y-1, colour);
	put_clipped(x, y+1, colour);
	put_clipped(x-1, y, colour);
	put_clipped(x-1, y+1, colour);
	put_clipped(x-1, y-1, colour);
	put_clipped(x, y-1, colour);
	put_clipped(x+2, y, colour);
	put_clipped(x-2, y, colour);
	put_clipped(x, y+2, colour);
	put_clipped(x, y-2, colour);

	if(true){
		put_clipped(x+2, y-1, colour);
		put_clipped(x+2, y+1, colour);
		put_clipped(x-2, y-1, colour);
		put_clipped(x-2, y+1, colour);
		put_clipped(x-1, y+2, colour);
		put_clipped(x+1, y+2, colour);
		put_clipped(x-1, y-2, colour);
		put_clipped(x+1, y-2, colour);
	}
}

function clear(colour:boolean) {
	renderer.clear(colour);
}

function swap() {
	renderer.swap();
}

function segment(active:boolean, ox:number, oy:number, width:number, height:number) {
	for(let y=0;y<height;y++){
		for(let x=height-y;x<width-y;x++){
			put(ox+x, oy+y, active||(x+y)%2==1);
		}
	} 
}

function block(colour:boolean, ox:number, oy:number, width:number, height:number) {
	for(let y=0;y<height;y++){
		for(let x=0;x<width;x++){
			put(ox+x, oy+y, colour);
		}
	} 
}

function normal(c:boolean, x:number, y:number):[number, number] {
	let nx = 0;
	let ny = 0;

	if(x<0||get(x+1,y)!=c) nx += 1;
	if(x>=renderer.width||get(x-1,y)!=c) nx -= 1;
	if(y<0||get(x,y+1)!=c) ny += 1;
	if(y>=renderer.height||get(x,y-1)!=c) ny -= 1;

	return [nx, ny];
}

async function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function clamp(val:number, min:number, max:number) {
	return Math.min(Math.max(val, min), max);
}

class Input {
	up = false;
	down = false;
};

const aiInput = new Input();
const input = new Input();

window.addEventListener("click", (event:MouseEvent) => {
	if(!sounds){
		sounds = new sound.Manager();
		sounds.load().then(() => {
			if(sounds) sounds.playMusic(sound.Music.main);
		});
	}
});

window.addEventListener("keydown", (event:KeyboardEvent) => {
	switch(event.key){
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

window.addEventListener("keyup", (event:KeyboardEvent) => {
	switch(event.key){
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

const top = 10;
const bottom = 10;

class Paddle {
	isAi = false;

	colour:boolean;
	x:number;
	y:number;
	height:number;

	velX = 0;
	velY = 0;

	constructor(colour:boolean, x:number, y:number, height:number) {
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.height = height;
	}

	update() {
		let newX = clamp(this.x + this.velX, 0, renderer.width-1);
		let newY = this.y;

		while(newY-1>=this.y+this.velY){
			if(collide(this.colour, this.x, newY-1)){
				this.velY = Math.abs(this.velY) * 0.8;
				break;
			}else{
				newY-=1;
			}
		}
		while(newY+1<=this.y+this.velY){
			if(collide(this.colour, this.x, newY+this.height)){
				this.velY = -Math.abs(this.velY) * 0.8;
				break;
			}else{
				newY+=1;
			}
		}

		while(newX-1>=this.y+this.velX){
			if(collide(this.colour, this.x, newX-1)){
				this.velX *= -0.5;
				break;
			}else{
				newX-=1;
			}
		}

		for(let y=0;y<this.height;y++){
			put(this.x, this.y+y, !this.colour);
		}

		this.x = newX;
		this.y = newY;

		for(let y=0;y<this.height;y++){
			put(this.x, this.y+y, this.colour);
		}
	}

	collides(x:number, y:number):boolean {
		x = Math.round(x);
		y = Math.round(y);
		return Math.round(x)==Math.round(this.x) && y>=Math.round(this.y) && y<Math.round(this.y)+this.height;
	}
}

class Ball {
	colour:boolean;
	x:number;
	y:number;
	velX = 0;
	velY = 0;
	speed = 1;
	bombCount = 0;

	paddleCombo = 0;

	bombCharge = 0;
	lastBombCharge = 0;
	bombChargeDuration = 0;
	hasBomb = false;

	superCharge = 0;
	lastSuperCharge = 0;
	superChargeDuration = 0;
	isSuper = 0;

	history:[number,number][] = [[0,0]]

	constructor(colour:boolean, x:number, y:number, velX:number, velY:number) {
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;

		this.history.push([x, y]);

		put(x, y, colour);
	}

	moveTo(x:number, y:number) {
		if(x==this.x&&y==this.y) return;

		put(this.x, this.y, !this.colour);

		this.x = x;
		this.y = y;

		put(this.x, this.y, this.colour);
	}

	get_bomb_charge() {
		this.lastBombCharge = this.bombCharge;
		this.bombCharge++;
		if(this.bombCharge==3){
			this.hasBomb = true;
			if(this.colour){
				if(sounds)sounds.playEffect(sound.Effect.hasBomb);
			}
		}
		this.bombChargeDuration = 0;
	}

	reset_bomb_charge() {
		this.lastBombCharge = this.bombCharge;
		this.bombCharge = 0;
		this.bombChargeDuration = 0;
	}

	get_super_charge() {
		this.lastSuperCharge = this.superCharge;
		this.superCharge++;
		if(this.superCharge==4){
			this.superCharge = 0;
			this.go_super();
		}
		this.superChargeDuration = 0;
	}

	reset_super_charge() {
		this.lastSuperCharge = 0;
		this.superCharge = 0;
		this.superChargeDuration = 0;
	}

	async update() {
		await this.update_movement();

		if(this.isSuper>0) this.isSuper--;

		this.bombChargeDuration++;
		this.superChargeDuration++;
	}

	async update_movement() {
		if(!this.velX&&!this.velY) return;

		const trailLength = Math.min(this.speed*2, 20);

		for(const history of this.history){
			put(history[0], history[1], !this.colour);
		}

		for(var i=this.speed;i>0;i--){

			var newX = this.x + this.velX;
			var newY = this.y + this.velY;

			if(Math.round(newX)==Math.round(this.x)&&Math.round(newY)==Math.round(this.y)){
				this.x = newX;
				this.y = newY;

				continue;
			}

			let hitBomb = false;
			let hitPaddle = false;

			for(const bomb of bombs){
				if(bomb.collides(newX, newY)){
					hitBomb = true;
					await bomb.explode(this.colour);

					this.get_super_charge();

					this.velX *= -1;
					this.velY *= -1;

					newX = this.x + this.velX;
					newY = this.y + this.velY;
				}
			}

			if(!hitBomb&&collide(this.colour, newX, newY)){

				const wasScreenEdge = !inbounds(newX, newY);
				const wasFarScreenEdge = newX<=-0.5||newX>renderer.width-0.5;

				const oldVelX = this.velX;
				const oldVelY = this.velY;

				let colX = collide(this.colour, newX, this.y);
				let colY = collide(this.colour, this.x, newY);

				if(!colX&&!colY) colX = colY = true;

				if(colX) this.velX = clamp(this.velX * -1 + Math.random()*0.1-0.05, -1.2, 1.2);
				if(colY) this.velY = clamp(this.velY * -1 + Math.random()*0.1-0.05, -1.2, 1.2);

				for(let i2=0;i2<paddles.length;i2++){
					const paddle = paddles[i2];

					if(paddle.collides(newX, newY)){
						if(paddle.colour==this.colour){
							hitPaddle = true;
							const paddlePhase = clamp((newY-paddle.y)/paddle.height, 0.0, 1.0);

							const length = Math.sqrt(this.velX*this.velX + this.velY*this.velY);

							this.velY = this.velY - 1.5 + paddlePhase * 3.0;

							//renormalise to same length, but keeping the new y velcity
							this.velY = clamp(this.velY, -length*0.9, length*0.8);
							this.velX = Math.sign(this.velX) * Math.sqrt(length*length-this.velY*this.velY);
						
						}else{
							bigBoom(paddle.x, paddle.y, this.colour);
							bigBoom(paddle.x, paddle.y+paddle.height/2, this.colour);
							bigBoom(paddle.x, paddle.y+paddle.height, this.colour);
							paddles.splice(i2, 1);
							i--;
						}
					}
				}

				if(sounds)sounds.playEffect(sound.Effect.blip);

				if(hitPaddle&&this.colour){
					if(sounds)sounds.playEffect(sound.Effect.paddle, 1.0, this.paddleCombo*100);
				}

				if(hitPaddle){
					if(this.colour){
						if(sounds)sounds.playEffect(sound.Effect.paddle, 1.0, this.paddleCombo*100);
					}
					this.paddleCombo++;
					this.get_bomb_charge();

				}else if(wasFarScreenEdge){
					if(this.paddleCombo>0&&this.colour){
						if(sounds)sounds.playEffect(sound.Effect.paddleMiss);
					}
					this.paddleCombo = 0;
					this.reset_bomb_charge();
				}

				if(this.isSuper&&!wasScreenEdge&&!hitPaddle){
					this.velX = oldVelX;
					this.velY = oldVelY;
				}

				newX = this.x + this.velX;
				newY = this.y + this.velY;

				if(wasScreenEdge||hitPaddle){
					newX = this.x;
					newY = this.y;

					if(hitPaddle){
						this.speed = Math.min(this.speed + 0.3, 5);

					}else if(wasFarScreenEdge){
						this.speed = Math.max(this.speed - 0.7, 1);
					}

				}else{
					boom(this.x, this.y, !this.colour);
					
					if(this.hasBomb){
						const x = this.x + (this.colour?4:-4);
						const y = this.y;

						setTimeout(() => {
							bombs.push(new Bomb(x, y));
						}, 200);

						this.hasBomb = false;
						this.bombCharge = 0;
						this.lastBombCharge = 0;
						this.bombChargeDuration = 0;
					}
				}
			}

			this.x = newX;
			this.y = newY;

			this.history.push([this.x, this.y]);
		}

		while(this.history.length>trailLength){
			this.history.shift();
		}

		for(const history of this.history){
			put(history[0], history[1], this.isSuper||this.hasBomb?frame%4<2:this.colour);
		}
	}

	go_super() {
		this.isSuper = Math.max(this.isSuper, 150);
		if(sounds) sounds.playEffect(sound.Effect.debug);
		setTimeout(() => {
			if(sounds) sounds.playEffect(sound.Effect.debug);
		}, 500);
		setTimeout(() => {
			if(sounds) sounds.playEffect(sound.Effect.debug);
		}, 1000);
	}
}

class Bomb {
	x:number;
	y:number;

	frame = 0;

	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}

	update() {
		this.frame++;

		const size = Math.min(this.frame, 5);

		const colour = Math.round(frame/2)%2==0;

		for(var x=0;x<size;x++) {
			for(var y=0;y<size;y++) {
				put(this.x - size/2 + x, this.y - size/2 + y, colour);
			}
		}
	}

	async explode(colour:boolean) {
		bombs = bombs.filter((existing) => existing != this);
		await bigBoom(this.x, this.y, colour);
	}

	collides(x:number, y:number):boolean {
		return Math.abs(Math.round(x)-this.x)<3&&Math.abs(Math.round(y)-this.y)<3;
	}
}

let paddles:Paddle[] = [];
let balls:Ball[] = [];
let bombs:Bomb[] = [];

async function play_intro(fast:boolean) {
	if(!fast)await sleep(1000);
	
	for(let x=0;x<renderer.width/2;x++) {
		for(let y=top;y<renderer.height-bottom;y++) {
			put(x, y, true);
		}

		put(renderer.width-1-x, top-1, true);
		put(renderer.width-1-x, renderer.height-bottom, true);

		if(!fast)await sleep(50);
		swap();
	}

	if(!fast)await sleep(300);

	print(5, 2, true, "Light & Shadow");
	swap();

	if(!fast)await sleep(1500);

	// if(!fast)await sleep(1500);
	// await sleep(1500);
	
	balls.push(new Ball(true, renderer.width/2 + 5, top*0.5 + (renderer.height-bottom)*0.5, 1, 0));
	balls.push(new Ball(false, renderer.width/2 - 5, top*0.5 + (renderer.height-bottom)*0.5, -1, 0));

	const aiPaddle = new Paddle(false, 2, renderer.height/2 - 8, 16);
	aiPaddle.isAi = true;
	paddles.push(aiPaddle);
	paddles.push(new Paddle(true, renderer.width-2, renderer.height/2 - 8, 16));

	swap();
}

play_intro(true);

let frame = 0;

async function run() {
	while(true){
		const doAi = frame%2==0;

		if(doAi){
			aiInput.up = false;
			aiInput.down = false;
		}

		{ // update all balls

			const pending:Promise<void>[] = [];

			for(const ball of balls){
				pending.push(ball.update());
				if(doAi){
					for(const paddle of paddles){
						if(paddle.isAi){
							if(ball.x<renderer.width/2&&ball.velX<0){
								if(ball.y<=paddle.y+paddle.height*0.3){
									aiInput.up = true;
								}else if(ball.y>=paddle.y+paddle.height*0.6){
									aiInput.down = true;
								}else{
									if(Math.random()>0.5){
										aiInput.up = true;
									}else{
										aiInput.down =true;
									}
								}
							}
						}
					}
				}
			}

			await Promise.all(pending);
		}

		for(const paddle of paddles){
			if(paddle.isAi){
				var targetY = (aiInput.up?-8:0)+(aiInput.down?+8:0);
				paddle.velY = paddle.velY*0.7 + targetY*0.3;
			}else{
				var targetY = (input.up?-8:0)+(input.down?+8:0);
				paddle.velY = paddle.velY*0.7 + targetY*0.3;
			}

			paddle.update();
		}

		for(const bomb of bombs){
			bomb.update();
		}

		if(balls.length>0){
			const ball = balls[0];

			{
				let combo = ball.bombChargeDuration<10?(frame%4<2?ball.lastBombCharge:ball.bombCharge):ball.bombCharge;

				if(ball.hasBomb){
					if(frame%4<2){
						combo = 0;
					}
				}

				segment(combo>0, renderer.width-30-15-15, renderer.height-8, 20, 7);
				segment(combo>1, renderer.width-30-15, renderer.height-8, 20, 7);
				segment(combo>2, renderer.width-30, renderer.height-8, 20, 7);
			}
			
			{
				let combo = ball.superChargeDuration<10?(frame%4<2?ball.lastSuperCharge:ball.superCharge):ball.superCharge;

				if(ball.isSuper){
					if(frame%4<2){
						combo = 0;
					}else{
						combo = 4;
					}
				}

				block(combo>0, renderer.width-8, renderer.height-8, 3, 3);
				block(combo>1, renderer.width-4, renderer.height-8, 3, 3);
				block(combo>2, renderer.width-8, renderer.height-4, 3, 3);
				block(combo>3, renderer.width-4, renderer.height-4, 3, 3);
			}
		}

		swap();
		await sleep(50);

		frame++;
	}
}

run();

// print(2,2, true, "Hello");
// swap();
