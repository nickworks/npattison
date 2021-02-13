class Particle {
	constructor(){

		const w = game.view.size.w/2;

		this.position=vec2(Maths.rand(-w,w),Maths.rand(-200, 100));
		this.scale=vec2(1,1);
		this.angle=0;
		this.dead=false;
		this.age=0;
		this.lifespan=3;
		this.speed = 1;
		this.vel=vec2(0,0);//Maths.randDir(1);
		this.mass=10000;
		
	}
	update(){
		this.age+=game.time.dt;
		if(this.age>=this.lifespan)this.die();


		this.mass *= .95;
		const accel = (1000 / this.mass);
		this.speed += accel * game.time.dt;

		if(this.position.x < 0) this.vel.x -= 5 * game.time.dt;
		if(this.position.x > 0) this.vel.x += 5 * game.time.dt;

		if(this.position.y < 0) this.vel.y -= 2 * game.time.dt;
		if(this.position.y > 0) this.vel.y += 2 * game.time.dt;


		this.position.x += this.vel.x * this.speed * game.time.dt;
		this.position.y += this.vel.y * this.speed * game.time.dt;

	}
	draw(img){
		gfx.drawImage(img, this.position.x, this.position.y);
	}
	drawPt(){
		gfx.fillStyle = Color.HSV(200,50+this.speed,25 + this.speed * 1);
		gfx.fillCircle(this.position.x, this.position.y, 2 + (this.speed * this.speed) / 300);
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
			console.log("image loaded");
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
		this.particles.forEach(p=>p.drawPt());
	}
	spawn(){
		const p = new this.particleType();
		this.particles.unshift(p);
	}
}