window.onresize = function () {
	console.log("resize");

	const canvas = document.querySelector("canvas");

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

setTimeout(function () {
	console.log("initialized");
	const canvas = document.querySelector("canvas");
	const body = document.querySelector("body");

	var bodyRect = body.getBoundingClientRect();

	canvas.width  = bodyRect.width;
	canvas.height = bodyRect.height;
}, 2000);

window.initGame = function (dotNetObject) {
	const gameDiv = document.getElementById("game");
	gameDiv.innerHTML = "";

	const canvas = document.createElement("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	gameDiv.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;

	const phoneColor = localStorage.getItem("phoneColor");
	if (!phoneColor) {
		dotNetObject.invokeMethodAsync('getPhoneColor')
			.then(data => {
				console.log("a", data)
				const phoneColor = localStorage.setItem("phoneColor", data);
				document.body.style.backgroundColor = data;
			});
	} else {
		document.body.style.backgroundColor = phoneColor;
		dotNetObject.invokeMethodAsync('setPhoneColor', phoneColor)
			.then(data => {
				console.log("a", data)
			});
	}

	const playerId = localStorage.getItem("playerid");
	if (!playerId) {
		dotNetObject.invokeMethodAsync('getPlayerId')
			.then(data => {
				console.log("b", data);
				localStorage.setItem("playerid", data);
			});
	} else {
		dotNetObject.invokeMethodAsync('setPlayerId', playerId)
			.then(data => {
				console.log("b", data)
			});
	}


	var swiping = false;
	var mousePos = { x:0, y:0 };
	var currentSwipeStartX = 0;
	var currentSwipeStartY = 0;
	var currentSwipeStopX = 0;
	var currentSwipeStopY = 0;
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
		swiping = true;
		console.log("x", mousePos.x, "y", mousePos.y);
		lastPos = getMousePos(canvas, e);
		currentSwipeStartX = lastPos.x / canvas.width;
		currentSwipeStartY = lastPos.y / canvas.height;
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		swiping = false;
		currentSwipeStopX = mousePos.x / canvas.width;
		currentSwipeStopY = mousePos.y / canvas.height;
		const diffX = currentSwipeStopX - currentSwipeStartX;
		const diffY = currentSwipeStopY - currentSwipeStartY;
		console.log("diffX", diffX);
		console.log("diffY", diffY);
		if (Math.abs(diffY) < 0.05) {
			console.log("too sm0l");
			return
		}
		dotNetObject.invokeMethodAsync('sendXY', diffX, diffY)
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
		if (e.target == canvas) {
			e.preventDefault();
		}
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
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
