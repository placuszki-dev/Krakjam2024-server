window.initGame = function () {
	alert("Dupa.2");

	const canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	const ctx = canvas.getContext("2d");
	ctx.rect(10, 20, 150, 100);
	ctx.fill();

}
