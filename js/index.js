(() => {
  let e = [];
  const upSound = document.getElementById("upSound");
  const loseSound = document.getElementById("loseSound");
  const self = this;
  self.globalBird;
  self.counter = [];

  const flappyBird = {
    totalHeight: screen.height,
    pathPipeDownImage: "./images/pipes/PipeDown.png",
    pathPipeUpImage: "./images/pipes/PipeUp.png",
    spaceBetweenPipe: 300,
    referenceBody: document.getElementsByTagName("body")[0],
    pathImageBird: "./images/birds/bird.png",
    pipeWidth: 80,
  };

  const upBird = () => {
    upSound.play();
    self.globalBird.style.top = `${self.globalBird.offsetTop - 200}px`;
  };

  const downBird = () => {
    self.globalBird.style.top = `${self.globalBird.offsetTop + 60}px`;
  };

  const keyAction = (key) => {
    const keys = {
      ArrowUp: () => upBird(),
      ArrowDown: () => downBird(),
    };
    return keys[key] ? keys[key]() : void 0;
  };

  const keyMoves = () => {
    document.addEventListener("keydown", (event) => {
      keyAction(event.key);
    });
  };

  const findImpactTop = (pipe) => {
    const impactTop = pipe.height > self.globalBird.offsetTop;
    return impactTop;
  };

  const findImpactDown = (pipe) => {
    const impactDown = self.globalBird.offsetTop >= pipe.offsetTop - 40;
    return impactDown;
  };

  const pauseGame = () => {
    clearInterval(addNewPipe);
    clearInterval(controlPipeLeft);
    clearInterval(controlBirdDown);
  };

  const loseGame = () => {
    const screenLose = document.createElement("div");
    screenLose.classList.add("screen-lose");
    screenLose.innerHTML += "<p class='text-lose'> se deu mal <p>";
    screenLose.innerHTML +=
      "<div class='restart'> <p> Pressione a barra de espaço para jogar novamente </p> </div>";
    loseSound.play();
    flappyBird.referenceBody.appendChild(screenLose);
    pauseGame();
    document.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        document.location.reload(true);
      }
    });
  };

  const findImpact = (pipe, isTop = false) => {
    const impactX =
      self.globalBird.offsetLeft >= pipe.offsetLeft &&
      self.globalBird.offsetLeft <= pipe.offsetLeft + flappyBird.pipeWidth;
    const impactY = isTop ? findImpactTop(pipe) : findImpactDown(pipe);

    if (impactX && impactY) {
      loseGame();
    }
  };

  const addNewPipe = setInterval(() => {
    e.push(positionPipe());
  }, 2000);

  const addCounter = (index, element) => {
    if (
      !self.counter.includes(index) &&
      self.globalBird.offsetLeft >= element.offsetLeft + flappyBird.pipeWidth
    ) {
      self.counter.push(index);
      document.getElementById("counter").innerHTML = self.counter.length;
    }
  };

  const controlPipeLeft = setInterval(() => {
    e.forEach((element, index) => {
      element.pipeDown.style.left = `${element.pipeDown.offsetLeft - 30}px`;
      element.pipeUp.style.left = `${element.pipeUp.offsetLeft - 30}px`;
      findImpact(element.pipeUp, true);
      findImpact(element.pipeDown);
      addCounter(index, element.pipeDown);
    });
  }, 100);

  const controlBirdDown = setInterval(() => {
    self.globalBird.style.top = `${self.globalBird.offsetTop + 20}px`;
  }, 100);

  const generatorHeightDown = () => {
    const maxHeight = flappyBird.totalHeight / 2;
    return Math.floor(Math.random() * maxHeight + 25);
  };

  const buildBird = () => {
    const bird = document.createElement("img");
    bird.src = flappyBird.pathImageBird;
    bird.classList.add("bird");
    flappyBird.referenceBody.appendChild(bird);
    self.globalBird = bird;
  };

  const buildBasicPipe = () => {
    const pipe = document.createElement("img");
    pipe.classList.add("pipe");
    return pipe;
  };

  const buildPipeDirection = (type, pathImage) => {
    const pipe = buildBasicPipe();
    pipe.src = pathImage;
    pipe.classList.add(type);
    flappyBird.referenceBody.appendChild(pipe);
    return pipe;
  };

  const calculateHeight = () => {
    const heightDown = generatorHeightDown();
    const heightUp =
      flappyBird.totalHeight - heightDown - flappyBird.spaceBetweenPipe;
    return {
      down: heightDown,
      up: heightUp,
    };
  };

  const positionPipe = () => {
    const pipeDown = buildPipeDirection(
      "pipeDown",
      flappyBird.pathPipeDownImage
    );
    const pipeUp = buildPipeDirection("pipeUp", flappyBird.pathPipeUpImage);
    const positions = calculateHeight();
    pipeDown.height = positions.down;
    pipeUp.height = positions.up;
    return {
      pipeDown,
      pipeUp,
    };
  };

  const init = () => {
    e.push(positionPipe());
    buildBird();
    keyMoves();
  };

  init();
})();
