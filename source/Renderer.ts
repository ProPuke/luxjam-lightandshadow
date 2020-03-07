export class Renderer {
	context:CanvasRenderingContext2D;
	buffer:ImageData;

	width:number;
	height:number;

	static white = 192;
	static black = 48;

	constructor(canvas:HTMLCanvasElement, width:number, height:number) {
		const context = canvas.getContext("2d");

		if(!context) throw Error("oh noes, you no has the grafics");

		this.width = canvas.width = width;
		this.height = canvas.height = height;
		this.buffer = context.createImageData(width, height);
		this.context = context;

		this.clear(false);
	}

	get(x:number, y:number):boolean {
		x = Math.round(x);
		y = Math.round(y);
		const index = (x+y*this.width)*4;
		return this.buffer.data[index+0] == Renderer.white;
	}

	put(x:number, y:number, colour:boolean) {
		x = Math.round(x);
		y = Math.round(y);

		if(x<0||y<0||x>=this.width||y>=this.height) return;

		const index = (x+y*this.width)*4;

		this.buffer.data[index+0] =
		this.buffer.data[index+1] =
		this.buffer.data[index+2] = colour?Renderer.white:Renderer.black;
		this.buffer.data[index+3] = 255;
	}

	clear(colour:boolean) {
		for(let x=0;x<this.width;x++)
			for(let y=0;y<this.height;y++)
				this.put(x, y, colour);

		this.swap();
	}

	swap() {
		this.context.putImageData(this.buffer, 0, 0);
	}
}
