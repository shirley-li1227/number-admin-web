"use strict";

const addCSS3 = function(element, type, value) {
	element.style[type] = value;
	element.style["-moz-" + type] = value;
	element.style["-webkit-" + type] = value;
	element.style["-o-" + type] = value;
};

let TurnTable = function({ element }) {
	this.element = element;
	this.ctx = null;
	this.startAngle = 0;
	this.baseAngle = 0;

	this.canvas = null;
	this.rotate = 0;

	this.options = {};

	const init = () => {
		let container = document.createElement("div");
		container.style.width = "100%";
		container.style.height = "100%";
		container.style.position = "relative";

		let canvas = document.createElement("canvas");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		addCSS3(canvas, "transition", "transform 3s ease-out");
		canvas.addEventListener("webkitTransitionEnd", () => {
			console.log("动画结束");
			this.options.onEnd && this.options.onEnd();
		});

		let bnPointer = document.createElement("img");
		bnPointer.style.position = "absolute";
		bnPointer.style.left = "50%";
		bnPointer.style.top = "50%";
		addCSS3(bnPointer, "transform", "translate(-50%, -50%)");

		let bnPointerArea = document.createElement("div");
		bnPointerArea.style.position = "absolute";
		bnPointerArea.style.left = "50%";
		bnPointerArea.style.top = "50%";
		bnPointerArea.style.width = "20%";
		bnPointerArea.style.height = "20%";
		addCSS3(bnPointerArea, "transform", "translate(-50%, -50%)");
		bnPointerArea.onclick = event => {
			this.options.onStart && this.options.onStart();
		};

		container.appendChild(canvas);
		container.appendChild(bnPointer);
		container.appendChild(bnPointerArea);

		this.container = container;
		this.canvas = canvas;
		this.bnPointer = bnPointer;
		this.ctx = canvas.getContext("2d");

		this.element.appendChild(this.container);
	};

	this.setOptions = async function({
		element,
		backgroundImage,
		width = 750,
		height = 750,
		rewardList = [],
		pointer,
		scale = 1,
		lineWidth = 5,
		lineColor = "#ffffff",
		textColor = "#79232b",
		circleColor = "#79232b",
		circleRadius = 278,
		textRadius = 130,
		iconTop = 130,
		onStart,
		onEnd,
		rotateCount = 3600,
		iconWidth = 100,
		iconHeight = 100
	}) {
		try {
			this.options = {
				element,
				backgroundImage,
				width,
				height,
				rewardList,
				pointer,
				scale,
				lineWidth,
				lineColor,
				textColor,
				circleColor,
				circleRadius,
				textRadius,
				iconTop,
				onStart,
				onEnd,
				rotateCount,
				iconWidth,
				iconHeight
			};

			this.canvas.width = width;
			this.canvas.height = height;
			this.bnPointer.style.width = pointer.style.width;
			this.bnPointer.style.height = pointer.style.height;
			this.bnPointer.src = pointer.url;

			// 计算每块占的角度，弧度制
			this.baseAngle = (Math.PI * 2) / rewardList.length;
			this.ctx.strokeStyle = lineColor; //设置画图线的颜色
			this.ctx.lineWidth = lineWidth;
			this.ctx.font = "26px Microsoft YaHei"; //设置字号字体

			//清除画布
			this.ctx.clearRect(0, 0, width, height);

			// 画背景
			await dragBackgroundImage();
			await dragRewardList();
			dragCircleColor();
		} catch (err) {
			console.log("错误信息", err);
		}
	};

	// 画背景图片
	const dragBackgroundImage = async () => {
		const { backgroundImage, width, height } = this.options;
		const img = await loadImage(backgroundImage);
		if (img) this.ctx.drawImage(img, 0, 0, width, height);
	};

	// 画所有奖品信息
	const dragRewardList = async () => {
		const {
			textRadius,
			scale,
			width,
			height,
			lineColor,
			circleRadius,
			textColor,
			iconTop,
			iconWidth,
			iconHeight
		} = this.options;
		const newRewards = await loadAllRewardImages();
		const textTop = textRadius;
		const originX = width * 0.5;
		const originY = height * 0.5;
		newRewards.forEach((obj, index) => {
			// 当前的弧度
			let angle = this.startAngle + index * this.baseAngle;

			// 开始画内容
			// ---------基本的背景颜色----------
			/*
			 * 画圆弧，和IOS的Quartz2D类似
			 * context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			 * x :圆的中心点x
			 * y :圆的中心点x
			 * sAngle,eAngle :起始角度、结束角度
			 * counterclockwise : 绘制方向,可选，False = 顺时针，true = 逆时针
			 * */
			this.ctx.beginPath();
			this.ctx.strokeStyle = lineColor; //设置画图线的颜色
			this.ctx.arc(
				originX,
				originY,
				circleRadius,
				angle,
				angle + this.baseAngle,
				false
			);
			this.ctx.arc(
				originX,
				originY,
				10,
				angle + this.baseAngle,
				angle,
				true
			);
			this.ctx.stroke();
			this.ctx.closePath();

			//保存画布的状态，和图形上下文栈类似，后面可以Restore还原状态（坐标还原为当前的0，0），
			this.ctx.save();

			/*----绘制奖品内容----重点----*/
			// 红色字体
			// translate方法重新映射画布上的 (0,0) 位置
			// context.translate(x,y);
			// 见PPT图片，
			let translateX =
				originX + Math.cos(angle + this.baseAngle / 2) * textTop;
			let translateY =
				originY + Math.sin(angle + this.baseAngle / 2) * textTop;
			this.ctx.translate(translateX, translateY);

			// rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
			// angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
			this.ctx.rotate(angle + this.baseAngle / 2 + Math.PI / 2);

			/** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
			// canvas 的 measureText() 方法返回包含一个对象，该对象包含以像素计的指定字体宽度。
			// fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色. fillStyle 属性以另一种颜色/渐变来渲染文本
			/*
			 * context.fillText(text,x,y,maxWidth);
			 * 注意！！！y是文字的最底部的值，并不是top的值！！！
			 * */
			//在画布上绘制填色的文本
			this.ctx.fillStyle = textColor;
			this.ctx.scale(scale, scale);

			if (obj.name.length > 5) {
				let text;
				text = obj.name.substring(0, 4);
				this.ctx.fillText(
					text,
					-this.ctx.measureText(text).width / 2,
					0
				);

				text = obj.name.substring(4, obj.name.length - 1);
				this.ctx.fillText(
					text,
					-this.ctx.measureText(text).width / 2,
					30
				);
			} else {
				this.ctx.fillText(
					obj.name,
					-this.ctx.measureText(obj.name).width / 2,
					0
				);
			}

			//添加对应图标
			if (obj.img) {
				this.ctx.drawImage(
					obj.img,
					0,
					0,
					obj.img.width,
					obj.img.height,
					-(iconWidth / 2),
					-iconTop,
					iconWidth,
					iconHeight
				);
			}
			//还原画板的状态到上一个save()状态之前
			this.ctx.restore();
		});
	};

	const dragCircleColor = () => {
		const { circleColor, width, height, circleRadius } = this.options;
		this.ctx.beginPath();
		this.ctx.strokeStyle = circleColor; //设置画图线的颜色
		this.ctx.arc(width * 0.5, height * 0.5, circleRadius, 0, 2 * Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
	};

	// 加载图片 返回img 标签
	const loadImage = url => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;
			img.onload = function() {
				resolve(img);
			};
			img.onerror = function() {
				console.log("图片加载失败: " + url);
				resolve();
			};
		});
	};

	// 加载所有奖品图片
	const loadAllRewardImages = () => {
		const { rewardList } = this.options;
		return Promise.all(
			rewardList.map(
				obj =>
					new Promise(async (resolve, reject) => {
						const img = await loadImage(obj.url);
						resolve({
							...obj,
							img
						});
					})
			)
		);
	};

	init();
};

TurnTable.prototype.startRound = function(prizeId) {
	const { rotateCount, rewardList } = this.options;
	let index = rewardList.findIndex(obj => Number(obj.id) === Number(prizeId));
	if (index < 0) index = rewardList.findIndex(obj => Number(obj.id) === 0);
	if (index < 0) index = 0;

	// 当前奖项的旋转角度 - 上一次的旋转角度 = 当前需要旋转的角度
	let deg =
		(360 * 3) / 4 -
		(180 / Math.PI) * (index * this.baseAngle + this.baseAngle / 2) -
		(this.rotate % 360);
	this.rotate = rotateCount + deg + this.rotate;
	addCSS3(this.canvas, "transform", `rotate(${this.rotate}deg)`);
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = TurnTable;
} else {
	if (typeof define === "function" && define.amd) {
		define([], function() {
			return TurnTable;
		});
	} else {
		window.TurnTable = TurnTable;
	}
}
