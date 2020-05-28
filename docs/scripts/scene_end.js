// JavaScript Document

// - End Scene
//   - Images
game.wordFlightTitleSmall = {
	// Get handle to image
    image: document.getElementById("wordFlightTitleSmall"),
	// Declare object transform information
    org_width: 488 * game.scale,
    org_height: 118 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 20;
        this.posY = Math.max(40, Math.min(50, this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion))));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endBackground = {
	// Get handle to image
    image: document.getElementById("endBackground"),
	// Declare object transform information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = engine.width;
        this.height = engine.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endGameOver = {
	// Get handle to image
    image: document.getElementById("endGameOver"),
	// Declare object transform information
    org_width: 750 * game.scale,
    org_height: 205 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = engine.width / 2 - this.width / 2;
        this.posY = game.endGamePoints.posY / 3;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endGamePoints = {
	// Get handle to image
    image: document.getElementById("endGamePoints"),
	// Declare object transform information
    org_width: 613 * game.scale,
    org_height: 342 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = (game.endKeyboardBackground.posY * .6) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endInitials = {
	// Get handle to image
    image: document.getElementById("endInitials"),
	// Declare object transform information
    org_width: 811 * game.scale,
    org_height: 103 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = game.endKeyboardBackground.posY - (game.endKeyboardBackground.posY - (game.endGamePoints.posY + game.endGamePoints.height));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endKeyboardBackground = {
	// Get handle to image
    image: document.getElementById("endKeyboardBackground"),
	// Declare object transform information
    org_width: 1557 * game.scale,
    org_height: 283 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = engine.height - this.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endKeyboardKeys = {
	// Get handle to image
    image: document.getElementById("endKeyboardKeys"),
	// Declare object transform information
    org_width: 1222 * game.scale,
    org_height: 221 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = game.endKeyboardBackground.posX + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endKeyboardBackground.posY + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endPlayerScore = {
	// Get handle to div
    div: document.getElementById("endPlayerScore"),
	// Declare object transform information
    org_width: 150 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 325,
    org_posY: 82,
    posX: 0,
    posY: 0,
    // Declare member variables
    org_font_size: 74,
    font_size: 0,
    score: 0,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.endPlayerScore.clickMe);
    },
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.endGamePoints.posX + game.endGamePoints.width / 2 - this.width / 2;
        this.posY = game.endGamePoints.posY + game.endGamePoints.height / 2 - this.height / 2;

        // Adjust font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.updateScore();
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    // Update and display the player's score
    updateScore: function () {
        this.score = Math.max(0, game.player.score);
        this.div.innerHTML = this.score;
    },
	// Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
    }
};
game.endPlayerScore.init(); // Force initialization of the event handler during script load

game.endPlayerInitials = {
	// Get handle to div
    div: document.getElementById("endPlayerInitials"),
    // Initials value
    initialsValue: document.getElementById("endPlayerInitials").innerHTML,
	// Declare object transform information
    org_width: 150 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 325,
    org_posY: 82,
    posX: 0,
    posY: 0,
    // Declare member variables
    org_font_size: 48,
    font_size: 0,
    score: 0,
    initials: "",
    // Animation variables
    lastUpdate: 0,
    toggleUpdate: 0.35,
    showUpdate: false,
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.endPlayerInitials.clickMe);
        // Empty the initials
        this.initialsValue = "";
        // Reset the last update
        this.lastUpdate = 0;
    },
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.endInitials.posX + (game.endInitials.width * .7);
        this.posY = game.endInitials.posY + (game.endInitials.height * .15);

        // Adjust font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    // Update and display the player's initials
    updateInitials: function (letter) {
        // Add to or reset initials, limiting 2 letters
        if (this.initials.length < 2 && this.initials != "") {
            this.initials += letter;
        } else {
            this.initials = letter;
        }
        // Display and set the player's initials
        this.div.innerHTML = this.initials;
        game.player.initials = this.initials;
    },
    // Clear and hid the initials
    clearInitials: function () {
        this.initials = "";
        this.div.innerHTML = this.initials;
    },
    // Animate the initials value
    animateInitials: function (dt) {
        // Update the time since the last update
        this.lastUpdate += dt;
        // Update the visible characters after toggleUpdate milliseconds
        if (this.lastUpdate >= this.toggleUpdate) {
            // Display/hide an underscore in the initials field
            if (this.initials.length < 2) {
                // Display
                if (!this.showUpdate) {
                    this.initialsValue = this.initials + "_";
                } else {
                    // Hide
                    this.initialsValue = this.initials;
                }
                // Toggle the update
                this.showUpdate = !this.showUpdate;
            } else {
                this.initialsValue = this.initials;
            }
            // Reset the last update time
            this.lastUpdate = 0;
        }
        // Write to the div element
        this.div.innerHTML = this.initialsValue;
    },
	// Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
    }
};
game.endPlayerInitials.init(); // Force initialization of the event handler during script load

//   - Buttons
game.endMenuButton = {
	// Get handle to image
    image: document.getElementById("wordFlightMenuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        // Attach Top-Right Side
        this.posX = engine.width - this.width;
        this.posY = 50 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.image.style.position = "absolute";
        this.image.style.display = "block";
        this.image.style.left = this.posX.toString() + "px";
        this.image.style.top = this.posY.toString() + "px";
        this.image.style.width = this.width + "px";
        this.image.style.height = this.height + "px";
        this.image.style.zIndex = 1;
    }
};

game.endSubmitButton = {
	// Get handle to image
    image: document.getElementById("submitButton"),
	// Declare object transform information
    org_width: 265 * game.scale,
    org_height: 107 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.endSubmitButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = game.endKeyboardBackground.posX + (game.endKeyboardBackground.width - this.width) - 10;
        this.posY = game.endKeyboardBackground.posY + (game.endKeyboardBackground.height - this.height) / 2;
    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.image.style.position = "absolute";
        this.image.style.display = "block";
        this.image.style.left = this.posX.toString() + "px";
        this.image.style.top = this.posY.toString() + "px";
        this.image.style.width = this.width + "px";
        this.image.style.height = this.height + "px";
        this.image.style.zIndex = 1;
    },
	clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
        
        //AJAX
        var ajax = new XMLHttpRequest();
		// Send player's initials and score to the database
        ajax.open("GET", "scripts/insert_score.php?u=" + game.player.initials + "&s=" + game.player.score, true);
        ajax.send();

		// Await response completion (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
				// DEBUG
                console.log(this.responseText);
				
				// TRANSITION
				// Hide keypad
				game.inputKeypad.hideKeypad();
				// Change game state to Leaderboard Scene
                game.currState = game.gameState[3];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
				
				// Inform Google the player completed a playthrough
				game.google.finish();
            }
        }
    }
};
game.endSubmitButton.init(); // Force initialize object on first script load