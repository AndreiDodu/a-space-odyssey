function aSpaceOdyssey() {
    /*******************************************************************************************************************
     * CREATE EVENT
     *******************************************************************************************************************/
    /**
     * Ritorna la dimensione della finestra (larhezza ed altezza).
     * @returns {{w: (Number|number), h: (Number|number)}}
     */
    function getClientWH() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        return {
            w: w.innerWidth || e.clientWidth || g.clientWidth,
            h: w.innerHeight || e.clientHeight || g.clientHeight
        };
    }

    var roomWH = getClientWH();
    var roomWidth = roomWH.w,//800,
        roomHeight = roomWH.h;//640;

    function SpaceShip(x, y, width, height, direction, scaleX, scaleY) {
        this.x = x;
        this.y = y;
        this.width = width; // larghezza
        this.height = height; // altezza
        this.direction = direction;// rotazione dell'oggetto che è pari alla rotazione dell'immagine (rotation)
        this.rotation = direction; // rotazione dell'immagine che è pari alla rotazione dell'oggetto (direction)
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        this.fuel = 300;
        this.fuelMax = 300;
        this.fuelDec = 0.5;

        this.lives = 5;
        this.livesString = "";

        this.flame = false; // indica se l'oggetto viene spostato

        this.speedInc = 0.1;
        this.speed = 0.; // current speed
        this.speedMax = 5;

        this.spaceShipCanvas = document.createElement("canvas");
        this.spaceShipCanvas.id = "spaceShipCanvas";
        this.spaceShipCanvas.textContent = "No canvas, no party.";
        this.spaceShipCanvas.width = width;
        this.spaceShipCanvas.height = height;
        this.spaceShipContext = this.spaceShipCanvas.getContext("2d");
        this.spaceShipSprite = new Image();
        this.spaceShipSprite.src = "./assets/img/rocket.png";
        this.flameImage = new Image();
        this.flameImage.src = "./assets/img/flare.png";
    }

    SpaceShip.prototype.updateLivesString = function () {
        this.livesString = "";
        for (var i = 0; i < this.lives; i++)
            this.livesString += "\uf004 ";
    };

    SpaceShip.prototype.rotate = function () {
        this.rotation = Math.atan2(game.cursor.y - this.y - this.height / 2, game.cursor.x - this.x - this.width / 2);
    };

    SpaceShip.prototype.updateDirection = function (referencePointX, referencePointY) {
        if (game.SpaceShip.flame)
            this.direction = Math.atan2(referencePointY - this.y - this.height / 2, referencePointX - this.x - this.width / 2);
    };

    SpaceShip.prototype.go = function (evt) {
        if (this.fuel > 0)
            this.flame = true;
    };

    SpaceShip.prototype.stop = function (evt) {
        this.flame = false;
    };


    SpaceShip.prototype.updatePosition = function () {
        if (window.utils.getDistance(this.x + this.width / 2, this.y + this.height / 2, game.cursor.x, game.cursor.y) > this.width / 2) {
            var degrees = this.direction * 180 / Math.PI;
            this.x += this.speed * Math.cos(degrees * Math.PI / 180);
            this.y += this.speed * Math.sin(degrees * Math.PI / 180);
        } else {
            this.speed = 0;
        }
        if (this.y + game.enviroment.gravity < game.backgroundCanvas.height - 64)
            this.y += game.enviroment.gravity;

        if (this.y >= game.backgroundCanvas.height - this.spaceShipSprite.height - (this.height - this.spaceShipSprite.height) / 2)
            this.y = game.backgroundCanvas.height - this.spaceShipSprite.height - (this.height - this.spaceShipSprite.height) / 2;
        if (this.x >= game.backgroundCanvas.width - this.spaceShipSprite.width - (this.width - this.spaceShipSprite.width) / 2)
            this.x = game.backgroundCanvas.width - this.spaceShipSprite.width - (this.width - this.spaceShipSprite.width) / 2;
        if (this.x <= -(this.width - this.spaceShipSprite.width) / 2)
            this.x = -(this.width - this.spaceShipSprite.width) / 2;
        if (this.y <= -(this.height - this.spaceShipSprite.height) / 2)
            this.y = -(this.height - this.spaceShipSprite.height) / 2;
    };


    SpaceShip.prototype.draw = function (context) {
        context.drawImage(this.spaceShipCanvas, this.x, this.y);
    };

    SpaceShip.prototype.preRenderSpaceShip = function () {
        if (this.spaceShipSprite.complete) {
            this.spaceShipContext.save();
            this.spaceShipContext.clearRect(0, 0, this.width, this.height);
            this.spaceShipContext.scale(this.scaleX, this.scaleY);
            this.spaceShipContext.translate(this.width / 2, this.height / 2);
            this.spaceShipContext.rotate(this.rotation);
            this.spaceShipContext.translate(-this.width / 2, -this.height / 2);
            this.spaceShipContext.drawImage(this.spaceShipSprite, (this.width - this.spaceShipSprite.width) / 2, (this.height - this.spaceShipSprite.height) / 2);

            if (this.flame && this.flameImage.complete) {
                this.spaceShipContext.translate(this.width / 2, this.height / 2);
                this.spaceShipContext.drawImage(this.flameImage,
                    -this.width / 2 + [-1, 1][Math.floor(Math.random() * 10) % 2],
                    -this.spaceShipSprite.height / 2 + [-1, 1][Math.floor(Math.random() * 10) % 2]);
            }
            this.spaceShipContext.restore();
        }
    };

    var canvasContainer = window.utils.createAppendElement("div", "canvas-container", document.body);
    canvasContainer.style.width = roomWidth + "px";
    canvasContainer.style.height = roomHeight + "px";

    window.game = {
        // canvas a livello 0
        backgroundCanvas: window.utils.createAppendCanvas("background", roomWidth, roomHeight, canvasContainer),
        // canvas a livello 1
        foregroundCanvas: window.utils.createAppendCanvas("foreground", roomWidth, roomHeight, canvasContainer),
        panelCanvas: window.utils.createAppendCanvas("panel", roomWidth, 100, canvasContainer),
        enviroment: {
            gravity: 1
        }
    };

    window.game.backgroundCanvas.mozOpaque = true;
    /*    window.game.backgroundCanvas.style.zIndex = "0";
     window.game.foregroundCanvas.stars.zIndex = "1";*/


    window.game.cursor = window.utils.captureMouse(game.foregroundCanvas);
    game.SpaceShip = new SpaceShip(game.foregroundCanvas.width / 2, game.foregroundCanvas.height / 2, 128, 128, 0, 1, 1);

    game.foregroundCanvas.addEventListener('mouseup', function () {
        game.SpaceShip.stop();
    }, false);
    game.foregroundCanvas.addEventListener('mousedown', function () {
        game.SpaceShip.go();
    }, false);
    game.backgroundContext = game.backgroundCanvas.context;
    game.foregroundContext = game.foregroundCanvas.context;
    game.panelContext = game.panelCanvas.context;

    game.SpaceShip.updateLivesString();

    game.stars = {
        array: [],
        units: 100,
        speed: 0.5,
        resetStar: function (star) {
            star.x = Math.ceil((Math.random()) * game.backgroundCanvas.width);
            star.y = -1;// Math.ceil((Math.random() + 0.1) * game.backgroundCanvas.height);
            star.opacity = 1;
            star.radius = 1;
            star.toString = function () {
                return "[" + star.x + ":" + star.y + "]";
            };
            return star;
        },
        incipit: function (star) {
            star.x = Math.ceil((Math.random()) * game.backgroundCanvas.width);
            star.y = Math.ceil((Math.random()) * game.backgroundCanvas.height);
            star.opacity = 1;
            star.radius = 1;
            star.toString = function () {
                return "[" + star.x + ":" + star.y + "]";
            };
            return star;
        },
        drawCircle: function (ctx, star) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,' + star.opacity + ')';
            ctx.fill();
        },
        drawCircles: function (ctx) {
            ctx.fillStyle = 'rgba(255,255,255, 1)';
            for (var i = 0; i < game.stars.array.length; i++) {
                ctx.beginPath();
                ctx.arc(game.stars.array[i].x, game.stars.array[i].y, 1, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }
    };

    for (var i = 0; i < game.stars.units; i++) {
        game.stars.array.push(game.stars.incipit({}));
    }
    /*******************************************************************************************************************
     * STEP EVENT
     *******************************************************************************************************************/
    (function stepEvent() {
        if (game.SpaceShip.flame && game.SpaceShip.speed < game.SpaceShip.speedMax) {
            game.SpaceShip.speed += game.SpaceShip.speedInc;
        }
        else if (!game.SpaceShip.flame && game.SpaceShip.speed > 0) {
            game.SpaceShip.speed -= game.SpaceShip.speedInc / 4;
        }
        game.SpaceShip.updateDirection(game.cursor.x, game.cursor.y);
        game.SpaceShip.updatePosition();
        game.SpaceShip.rotate();
        game.SpaceShip.preRenderSpaceShip();

        for (var i = 0; i < game.stars.array.length; i++) {
            if (game.stars.array[i].y > game.backgroundCanvas.height) {
                game.stars.array[i] = game.stars.resetStar(game.stars.array[i]);
            } else {
                game.stars.array[i].y += game.stars.speed;
            }
        }
        game.panelContext.clearRect(0, 0, game.panelCanvas.width, game.panelCanvas.height);
        game.panelContext.save();

        game.panelContext.fillStyle = "#ffffff";
        game.panelContext.font = "bold 10px Arial";
        game.panelContext.fillText("FUEL", 5, 15);

        game.panelContext.fillText("LIVES", game.panelCanvas.width - 100, 15);
        game.panelContext.font = "14px FontAwesome";
        game.panelContext.fillText(game.SpaceShip.livesString, game.panelCanvas.width - 100, 35);

        game.panelContext.strokeStyle = "#aaaaaa";
        game.panelContext.strokeRect(5, 25, game.SpaceShip.fuelMax, 10);

        game.panelContext.fillStyle = "#ffffff";
        game.panelContext.fillRect(5, 25, game.SpaceShip.fuel, 10);

        game.panelContext.restore();


        if (game.SpaceShip.flame) {
            game.SpaceShip.fuel -= game.SpaceShip.fuelDec;
            if (game.SpaceShip.fuel < 0) {
                game.SpaceShip.fuel = 0;
                game.SpaceShip.flame = false;
            }
        }
        else if (game.SpaceShip.fuel < game.SpaceShip.fuelMax) {
            game.SpaceShip.fuel += game.SpaceShip.fuelDec / 10;
        }
        window.setTimeout(stepEvent, 33); // 1000/30
    }());
    /*******************************************************************************************************************
     * DRAW EVENT
     *******************************************************************************************************************/
    (function drawEvent() {
        window.requestAnimationFrame(drawEvent);

        game.backgroundContext.clearRect(0, 0, game.backgroundCanvas.width, game.backgroundCanvas.height);

        game.stars.drawCircles(game.backgroundContext);
        game.backgroundContext.drawImage(game.panelCanvas, 0, 0);

        game.foregroundContext.clearRect(0, 0, game.foregroundCanvas.width, game.foregroundCanvas.height);
        game.SpaceShip.draw(game.foregroundContext);
    }());
}

if (typeof window.onload != 'function') {
    window.onload = aSpaceOdyssey;
} else {
    var oldOnLoad = window.onload;
    window.onload = function () {
        oldOnLoad();
        aSpaceOdyssey();
    }
}