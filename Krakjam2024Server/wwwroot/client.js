window.initGame = function (dotNetObject) {
	const gameDiv = document.getElementById("game");
	gameDiv.innerHTML = "";

	const canvas = document.createElement("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	gameDiv.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	ctx.rect(10, 20, 150, 100);
	ctx.fill();

	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;

	var swiping = false;
	var mousePos = { x:0, y:0 };
	var currentSwipeStartX = 0;
	var currentSwipeStartY = 0;
	var currentSwipeStopX = 0;
	var currentSwipeStopY = 0;
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
		swiping = true;
		lastPos = getMousePos(canvas, e);
		currentSwipeStartX = lastPos.x
		currentSwipeStartY = lastPos.y
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		swiping = false;
		currentSwipeStopX = mousePos.x
		currentSwipeStopY = mousePos.y
		dotNetObject.invokeMethodAsync('sendXY', currentSwipeStopX - currentSwipeStartX, currentSwipeStopY - currentSwipeStartY)
			.then(data => {
				console.log("a", data)
			});
	}, false);
	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	}, false);

	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	function renderCanvas() {
		if (swiping) {
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function (e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchmove", function (e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}
}

window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimaitonFrame ||
		function (callback) {
			window.setTimeout(callback, 1000/60);
		};
})();
