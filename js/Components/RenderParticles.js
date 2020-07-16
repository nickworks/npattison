class Particle {
	constructor(){
		this.position=vec2(0,0);
		this.scale=vec2(1,1);
		this.angle=0;
		this.dead=false;
		this.age=0;
		this.lifespan=1;
	}
	update(){
		this.age+=game.time.dt;
		if(this.age>=this.lifespan)this.die();
	}
	draw(img){
		gfx.drawImage(this.img, this.position.x, this.position.y);
	}
	die(){
		this.dead=true;
	}
}
class RenderParticles extends GameComponent {
	constructor(url){
		super();
		this.particleType=Particle;
		this.particles=[];
		this.rate=10;
		this.countdown=0;
		this.img=new Image();
		this.img.addEventListener("load", e=>{

		});
		this.load(url);
	}
	load(url){
    	this.img.src = url;
    }
	update(){
		this.countdown-=game.time.dt;
		if(this.countdown<=0){
			this.countdown=1/this.rate;
			this.spawn();
		}
		for(var i = this.particles.length-1;i>=0;i--){
			this.particles[i].update();
			if(this.particles[i].dead) this.particles.splice(i,1);
		}
	}
	draw(){
		this.particles.forEach(p=>p.draw(this.img));
	}
	spawn(){
		const p = new this.particleType();
		this.particles.push(p);
	}
}