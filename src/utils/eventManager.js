class ResizeEventManager {
	constructor() {
		this.eventMap = {};

		this.init();
	}

	init(){
		window.onresize = () => {
			const eventList = this.eventMap['resize'] || [];
			eventList.forEach(func => {
				func && func();
			});
		};

		window.addEventListener('filterHeight', (event) => {
			const eventList = this.eventMap['filterHeight'] || [];
			eventList.forEach(func => {
				func && func(event.detail);
			});
		});
	}

	addEventListener(type, func) {
		if(!this.eventMap[type]) this.eventMap[type] = [];
		this.eventMap[type].push(func);
	}

	removeEventListener(type, func) {
		if(!this.eventMap[type]) this.eventMap[type] = [];
		this.eventMap[type] = this.eventMap[type].filter(obj => obj !== func);
	}
}

const resizeEventManager = new ResizeEventManager();
export default resizeEventManager;
