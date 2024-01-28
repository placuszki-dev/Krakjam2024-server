var gameReady = false;
var savedDotnet = null;
window.onresize = function () {
  console.log("resize");

  //const canvas = document.querySelector("canvas");

  //canvas.width  = window.innerWidth;
  //canvas.height = window.innerHeight;
}

window.vibrate = function() {
  navigator.vibrate(200);
}

window.setReady = function() {
  if (gameReady) {
    // that's the case when Esc is push
    initGame(savedDotnet);
  }
  const buttonGouda = document.querySelector(".start-game.gouda");
  buttonGouda.innerHTML = "";
  buttonGouda.classList.remove('waiting')

  const buttonCheddar = document.querySelector(".start-game.cheddar");
  buttonCheddar.innerHTML = "";
  buttonCheddar.classList.remove('waiting');
  gameReady = true;
}

window.initGame = function (dotNetObject) {
  savedDotnet = dotNetObject;
  gameReady = false;

  setTimeout(function () {
    console.log("initialized");
    const canvas = document.querySelector("canvas");
    const body = document.querySelector("body");

    var bodyRect = body.getBoundingClientRect();

    if (canvas) {
      canvas.width  = bodyRect.width;
      canvas.height = bodyRect.height;
    }
    
    savedDotnet.invokeMethodAsync('getIsMainMenuOpened')
        .then(data => {
          gameReady = false;
          if (data) {
            setReady();
          }
        });
  }, 2000);

  console.log("INIT GAME");
  const gameDiv = document.getElementById("game");
  const splashDiv = document.getElementById("splash");
  gameDiv.innerHTML = "";

  const overlay = document.querySelector(".splash-overlay");
  overlay.classList.remove('hidden');

  const buttonGouda = document.querySelector(".start-game.gouda");
  buttonGouda.innerHTML = "wait";
  buttonGouda.classList.add('waiting')
  buttonGouda.onclick = function (e) {
    startGame(1);
  };

  const buttonCheddar = document.querySelector(".start-game.cheddar");
  buttonCheddar.innerHTML = "wait";
  buttonCheddar.classList.add('waiting')
  buttonCheddar.onclick = function (e) {
    startGame(2);
  };

  const startGame = function (cheeseType) {
    console.log("start game button click", gameReady);
    if (!gameReady) {
      return
    }
    const overlay = document.querySelector(".splash-overlay");
    overlay.classList.add('hidden');

    dotNetObject.invokeMethodAsync('SendUserInfoToClients', cheeseType)
      .then(data => {
        console.log("a", data)
      });
  }

  const canvas = document.createElement("canvas");
  const body = document.querySelector("body");
  var bodyRect = body.getBoundingClientRect();
  canvas.width  = bodyRect.width;
  canvas.height = bodyRect.height;

  console.log("appending canvas to game div");
  gameDiv.appendChild(canvas);

  const ctx = canvas.getContext("2d");

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


  var sequence = 1;
  var swiping = false;
  var mousePos = { x:0, y:0 };
  var currentSwipeStartX = 0;
  var currentSwipeStartY = 0;
  var currentSwipeStopX = 0;
  var currentSwipeStopY = 0;
  var lastPos = mousePos;
  console.log("Setting up canvas events...");
  canvas.onmousedown = function (e) {
    sequence += 3;
    swiping = true;
    console.log("x", mousePos.x, "y", mousePos.y);
    lastPos = getMousePos(canvas, e);
    currentSwipeStartX = lastPos.x / canvas.width;
    currentSwipeStartY = lastPos.y / canvas.height;
  };
  canvas.onmouseup = function (e) {
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
        canvas.width = canvas.width // clears canv
        sequence = 1;
      });
  };
  canvas.onmousemove = function (e) {
    sequence += 2;
    mousePos = getMousePos(canvas, e);
  };

  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }

  function renderCanvas() {
    if (swiping) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(lastPos.x, lastPos.y, 10 + sequence * 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 10 + sequence * 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      // ctx.lineTo(mousePos.x, mousePos.y);
      // ctx.stroke();
      lastPos = mousePos;
    }
  }

  (function drawLoop () {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

  canvas.ontouchstart = function (e) {
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
  };
  canvas.ontouchend = function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  };
  canvas.ontouchmove = function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  };

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
