import { Renderer } from './Renderer.js';

const renderer = new Renderer(document.getElementsByTagName('canvas')[0], 128, 92);

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
}

class Ball {
	colour:boolean;
	x:number;
	y:number;
	velX = 0;
	velY = 0;
	speed = 2;
	history:[number,number][] = [[0,0]]

	constructor(colour:boolean, x:number, y:number, velX:number, velY:number) {
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;

		put(x, y, colour);
	}

	moveTo(x:number, y:number) {
		if(x==this.x&&y==this.y) return;

		put(this.x, this.y, !this.colour);

		this.x = x;
		this.y = y;

		put(this.x, this.y, this.colour);
	}

	update() {
		if(!this.velX&&!this.velY) return;

		const trailLength = Math.min(this.speed, 20);

		for(var i=this.speed;i>0;i--){

			this.history.push([this.x, this.y]);
			// put(this.x, this.y, !this.colour);

			var newX = this.x + this.velX;
			var newY = this.y + this.velY;

			if(collide(this.colour, newX, newY)){
				for(const history of this.history){
					put(history[0], history[1], !this.colour);
				}

				const colX = collide(this.colour, newX, this.y);
				const colY = collide(this.colour, this.x, newY);

				for(const history of this.history){
					put(history[0], history[1], this.colour);
				}

				if(colX) this.velX = clamp(this.velX * -1 + Math.random()*0.1-0.05, -1.2, 1.2);
				if(colY) this.velY = clamp(this.velY * -1 + Math.random()*0.1-0.05, -1.2, 1.2);

				if(colX&&colY){
					for(const history of this.history){
						put(history[0], history[1], !this.colour);
					}
					this.history = [];
				}

				if(!inbounds(newX, newY)){
					newX = this.x;
					newY = this.y;

				}else{
					boom(this.x, this.y, !this.colour);
				}

				// this.speed = Math.min(this.speed + 0.5, 10);
			}

			this.x = newX;
			this.y = newY;

			put(this.x, this.y, this.colour);
		}

		while(this.history.length>trailLength){
			put(this.history[0][0], this.history[0][1], !this.colour);
			this.history.shift();
		}
	}
}

const paddles:Paddle[] = [];
const balls:Ball[] = [];

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
	print(renderer.width/2+2, renderer.height/2-8, true, "//TODO:put game here");
	swap();

	// if(!fast)await sleep(1500);
	await sleep(1500);
	
	balls.push(new Ball(true, renderer.width - 5, top + 10, -1, 1));
	balls.push(new Ball(false, 5, renderer.height - top - 10, 1, -1));

	paddles.push(new Paddle(false, 2, renderer.height/2 - 8, 16));
	paddles.push(new Paddle(true, renderer.width-2, renderer.height/2 - 8, 16));

	swap();
}

play_intro(true);

let frame = 0;

async function run() {
	while(true){
		const doAi = frame%2==0&&paddles.length>0;

		if(doAi){
			aiInput.up = false;
			aiInput.down = false;
		}

		for(const ball of balls){
			ball.update();
			if(doAi){
				if(ball.x<renderer.width/2&&ball.velX<0){
					if(ball.y<paddles[0].y+paddles[0].height/2){
						aiInput.up = true;
					}else{
						aiInput.down = true;
					}
				}
			}
		}

		if(paddles.length>0){
			var targetY = (aiInput.up?-8:0)+(aiInput.down?+8:0);
			paddles[0].velY = paddles[0].velY*0.7 + targetY*0.3;
		}

		if(paddles.length>1){
			var targetY = (input.up?-8:0)+(input.down?+8:0);
			paddles[1].velY = paddles[1].velY*0.7 + targetY*0.3;
		}

		for(const paddle of paddles){
			paddle.update();
		}

		swap();
		await sleep(50);

		frame++;
	}
}

run();

// print(2,2, true, "Hello");
// swap();
