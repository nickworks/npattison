class GameComponent {
	constructor(){
		this.gameObject = null;
	}
	get transform() {
		return this.gameObject?this.gameObject.transform:null;
	}
	getComponent(type){
		return this.gameObject?this.gameObject.getComponent(type):null;
	}
}