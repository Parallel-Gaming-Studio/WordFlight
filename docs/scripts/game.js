//========================================================================
// DeVry University - New Development
// PROJECT TITLE:   Word Flight
// PROJECT DATE:    03/02/2020
// PROGRAMMERS:     Chris Medeiros
//                  Samantha Harvey
//                  Joanna Blackwell
//                  James Powell
//                  Sumeira Zehra
// FILE NAME:       game.js
// DESCRIPTION:     Controls the heart of Word Flight
// LAST UPDATE:     03/22/2020 - Created main game.js file to work from
//========================================================================

// Initialize game object
game = Object.create(GameObject.prototype);

// Keybindings
game.keys = ['A', 'S', 'D', 'F'];
for (var i = 0; i < game.keys.length - 1; i++) {
    engine.input.bind(engine.key[game.keys[i]], game.keys[i]);
}

// Control bindings for testing purposes
game.controls = ['SPACE'];
for (var i = 0; i < game.controls.length; i++) {
    engine.input.bind(engine.key[game.controls[i]], game.controls[i]);
};

// Mouse bindings
game.mouse = ['LEFT', 'MIDDLE', 'RIGHT', 'WHEELDOWN', 'WHEELUP'];
for (var i = 0; i < game.mouse.length; i++) {
    // engine.input.bind(engine.button.LEFT, 'left_click');
    engine.input.bind(engine.button[game.mouse[i]], game.mouse[i]);
}

// Declare Game Variables
// - Globals
game.scale = 1.0;						// Scale for adjusting object sizes
game.planeScale = 1.0;					// Scale to adjust plane part sizes
game.lastWord = "";						// Previously used word
game.word = "";							// Current word
game.nextWord = "";						// Next word
game.lastSponsor = "";					// Previously used sponsor
game.sponsor = "";						// Current sponsor
game.nextSponsor = "";					// Next sponsor
game.sponsorId = "";					// Current sponsor's ID
game.score = 0;							// Current score
game.readyForNextWord = false;			// Test to identify when to update the word list
game.playTime = (3 * 60 + 30) * 1000; 	// Play time (3:30)
game.timeoutTime = 120;					// Timeout time before returning to landing page

game.lastTimeSized = new Date();

// - Player object information (persists through scenes)
game.player = {
    score: 250,
    initials: "CD",
	// Reset player object variables
    reset: function () {
        this.score = 0;
        this.initials = "";
		// Reset global score
		game.score = 0;
    }
};

// Google Analytics
/*		*** WARNING *** WARNING *** WARNING ***
 *** DO NOT UNCOMMENT THE GTAG() FUNCTIONS BEFORE DEPLOYMENT ***/
game.google = {
    load: function () {
		// Inform Google of Start Scene landing
        // gtag('event', 'screen_view', {'screen_name': 'Menu'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:load>");
    },
    start: function () {
		// Inform Google of Play Scene landing
        // gtag('event', 'screen_view', {'screen_name': 'Start'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:start>");
    },
    finish: function () {
		// Inform Google when player submits their initials (complete play through)
        // gtag('event', 'screen_view', {'screen_name': 'Finish'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:finish>");
    },
    quit: function () {
		// Inform Google of a player quitting the game
        // gtag('event', 'screen_view', {'screen_name': 'Quit'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:quit>");
    },
    timeOut: function () {
		// Inform Google of a game timeout (inactivity)
        // gtag('event', 'screen_view', {'screen_name': 'TimeOut'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:timeOut>");
    },
    leaderboard: function () {
		// Inform Google of players going straight to the leaderboard (from Start Scene)
        // gtag('event', 'screen_view', {'screen_name': 'Leaderboard'});

        // DEBUG ONLY:
        console.log("<GoogleAnalytics:leaderboard>");
    }
};
/*
 *** DO NOT UNCOMMENT THE GTAG() FUNCTIONS BEFORE DEPLOYMENT ***
 *** WARNING *** WARNING *** WARNING ***
 */

// Game functions
// Display an interactive overlay after a period of inactivity
// - Return to landing page upon a lack of interaction
game.timeoutOverlay = {
	// Handle to overlay
    div: document.getElementById("timeoutOverlay"),
	// Handle to header message
    divHeader: document.getElementById("timeoutHeader"),
	// Handle to instructions message
    divInstructions: document.getElementById("timeoutInstructions"),
	// Handle to timer
    divTimer: document.getElementById("timeoutTimer"),
	// Declare variables
    initialTime: null,
    finalTime: null,
    currentTime: null,
    initialTimerExpired: false,
    finalTimerExpired: false,
	// Initialize overlay
    init: function () {
        // Hide the overlay
        this.hideOverlay();

        // Add event listener to the main overlay div element
        this.div.addEventListener("click", function (e) {
            game.timeoutOverlay.refreshTimer();
        });

        // Initialize all variables
        this.resetTimer();
    },
	// Show the overlay and its children
    showOverlay: function () {
        this.div.style.display = "block";
        this.divHeader.style.display = "block";
        this.divInstructions.style.display = "block";
        this.divTimer.style.display = "block";
    },
	// Hide the overlay and its children
    hideOverlay: function () {
        this.div.style.display = "none";
    },
	// Update the overlay and its timers
    update: function (dt) {
        if (this.currentTime != null) {
            // Update the current time
            this.updateTime(dt);

            // Update the active timer (primary/secondary)
            if (!this.initialTimerExpired) {
                this.initialTimer(dt);
            } else if (!this.finalTimerExpired) {
                this.finalTimer(dt);
            }
        } else if (this.initialTimerExpired && this.finalTimerExpired) {
            // All timers expired - redirect
            this.expireTimer();
        }
    },
	// Initialize the primary timer and start its countdown
    initialTimer: function (dt) {
        // Check whether the time is greater than the limit
        if (this.currentTime >= this.initialTime) {
            // Reset the timer to zero
            this.currentTime = 0;
            // Flag the initial timer as complete
            this.initialTimerExpired = true;
            // Display the overlay
            this.showOverlay();
        }
    },
	// Display the secondary timer
    finalTimer: function (dt) {
        // Update the time left
        this.divTimer.innerHTML = ". . . " + Math.ceil(this.finalTime - this.currentTime) + " . . .";

        // Check whether the time is greater than the limit
        if (this.currentTime >= this.finalTime) {
            // Set the timer to null, stopping execution
            this.currentTime = null;
            // Flag the final timer as complete
            this.finalTimerExpired = true;
        }
    },
	// Update the time counter
    updateTime: function (dt) {
        this.currentTime += dt;
    },
	// Refresh the timer upon user interaction
    refreshTimer: function () {
        this.resetTimer();
    },
	// Reset the timer
    resetTimer: function () {
		// Hide the overlay
        this.hideOverlay();
		// Reinitialize all variables
        this.initialTime = game.timeoutTime;
        this.finalTime = game.timeoutTime / 10;
        this.currentTime = 0;
        this.initialTimerExpired = false;
        this.finalTimerExpired = false;
    },
	// Timeout expired
    expireTimer: function () {
		// Notify Google a timeout was reached
        game.google.timeOut();
		// Redirect to the OHare landing page
        window.location.replace("http://www.flywithbutchohare.com/");
    }
};
game.timeoutOverlay.init(); // Force initialization of the timer during script load

// Update words
// - Maintain a short record of words for the user, preventing latency interference
game.updateWords = {
	// Store the current word as the last word
    lastWord: function () {
        game.lastWord = game.word;
        game.lastSponsor = game.sponsor;
    },
	// Get a new word from the next word
    word: function () {
        game.word = game.nextWord;
        game.sponsor = game.nextSponsor;
    },
	// Query the database for a new word/sponsor pair
    nextWord: function () {
        game.databaseQuery();
    },
	// Update the list of words
    update: function () {
        if (game.word == game.lastWord) {
			// Set initial words
            this.nextWord();
            this.word();
            this.nextWord();
        } else {
			// Get new word, set current word, and update last word
            this.lastWord();
            this.word();
            this.nextWord();
        }
    }
}

// Database - Pull random word with its sponsor
game.databaseQuery = function () {
    // AJAX query
    var ajax = new XMLHttpRequest();
	// Await AJAX completion (State: 4)
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
			// Parse the JSON package from PHP
            var selection = JSON.parse(this.responseText);
			// Read through the JSON results
            for (var a = 0; a < selection.length; a++) {
				// Set and format the next word
                game.nextWord = selection[a].word.toUpperCase();
				// Set and format the next sponsor
                game.nextSponsor = selection[a].sponsor_name.toUpperCase();
            }

            // Remove all spaces from the word
            game.nextWord = game.nextWord.replace(/\s+/g, '');
        }

    }
	// Send a request to PHP for a new word
    ajax.open("GET", "scripts/word_generator.php", false);
    ajax.send();
}

// Get the sponsor
game.getSponsor = function () {
    switch (this.sponsor) {
        case "ARGO TEA":
            this.sponsorId = "sponsorArgo";
            break;
        case "AUNTIE ANNES":
            this.sponsorId = "sponsorAuntieAnnes";
            break;
        case "BROOKSTONE":
            this.sponsorId = "sponsorBrookstone";
            break;
        case "BSMOOTH":
            this.sponsorId = "sponsorBSmooth";
            break;
        case "BURRITO BEACH":
            this.sponsorId = "sponsorBurritoBeach";
            break;
        case "CHICAGO SPORTS":
            this.sponsorId = "sponsorChicagoSports";
            break;
        case "CNN":
            this.sponsorId = "sponsorCNN";
            break;
        case "COACH":
            this.sponsorId = "sponsorCoach";
            break;
        case "DUNKIN DONUTS":
            this.sponsorId = "sponsorDunkinDonuts";
            break;
        case "DUTY FREE STORE":
            this.sponsorId = "sponsorDutyFreeStore";
            break;
        case "FIELD":
            this.sponsorId = "sponsorField";
            break;
        case "HUDSON":
            this.sponsorId = "sponsorHudson";
            break;
        case "MAC COSMETICS":
            this.sponsorId = "sponsorMacCosmetics";
            break;
        case "NUTS ON CLARK":
            this.sponsorId = "sponsorNutsOnClark";
            break;
        case "ROCKY MOUNTAIN CHOCOLATE":
            this.sponsorId = "sponsorRockyMountainChocolate";
            break;
        case "SARAHS CANDIES":
            this.sponsorId = "sponsorSarahsCandies";
            break;
        case "SHOE HOSPITAL":
            this.sponsorId = "sponsorShoeHospital";
            break;
        case "SPIRIT OF THE RED HORSE":
            this.sponsorId = "sponsorSpiritOfTheRedHorse";
            break;
        case "TALIE":
            this.sponsorId = "sponsorTalie";
            break;
        default:
            this.sponsorId = "__INVALID__";
            break;
    }
	// Return the sponsor ID
    return this.sponsorId;
}

// Image hooks (Shorthand Object Notation)
// - Start Scene
//   - Images
game.wordFlightTitle = {
	// Get handle to image
    image: document.getElementById("wordFlightTitle"),
	// Declare object transform information
    org_width: 826 * game.scale,
    org_height: 200 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = 20;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.startHangar = {
	// Get handle to image
    image: document.getElementById("startHangar"),
	// Declare object transform information
    org_width: 1920 * game.scale,
    org_heigth: 1080 * game.scale,
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

game.startRunway = {
	// Get handle to image
    image: document.getElementById("startRunway"),
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

game.startScene = {
	// Get handle to image
    image: document.getElementById("startScene"),
	// Declare object transform information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = engine.height / 4 - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//   - Buttons
game.menuButton = {
	// Get handle to image
    image: document.getElementById("wordFlightMenuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.menuButton.clickMe);
    },
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
    },
	// Handle user interaction based on game state
    clickMe: function () {
		// Determine the current game state
        switch (game.currState) {
            case 'start':
				// Inform Google the user quit the game
                game.google.quit();
				// Redirect the user to the O'Hare landing page
                window.location.replace("http://www.flywithbutchohare.com/");
                break;
            default:
				// All but the Start Scene returns to the Start Scene
				// Hide all elements
                game.hideElements.hideAll();
				// Reset the player object
                game.player.reset();
				// Update the words list
                game.updateWords.update();
				// Hide the keypad
                game.inputKeypad.hideKeypad();
				// Hide the letter display spaces
                game.playLetterSpaces.hideKeypad();
				// Set the flag for a new word to false
                game.readyForNextWord = false;
				// Reset the plane manager
                game.planeManager.resetElements();
				// Reset the game's timer
                game.playTimerBox.resetTimer();
                // Reset plane animation
                game.leaderboardAnimation.resetElements();
				// Refresh the timeout timer
                game.timeoutOverlay.refreshTimer();
				// Set the new game state to the Start Scene
                game.currState = game.gameState[0];
				// Redraw all objects
                game.drawOnce();
                break;
        }
    }
}
game.menuButton.init(); // Force object initialization on first script load

game.startButton = {
	// Get handle to image
    image: document.getElementById("startButton"),
	// Declare object transform information
    org_width: 450 * game.scale * 1.4,
    org_height: 120 * game.scale * 1.2,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.startButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 3 - this.height / 2;
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
	// Handle user interaction based on game state
    clickMe: function () {
		// Inform Google the user started playing a game
        game.google.start();
        // Set game score to zero
        game.score = 0;
        // Reset the player object
        game.player.reset();
        // Get the current sponsor
        game.getSponsor();
        // Set the new game state to Play Scene
        game.currState = game.gameState[1];
        // Hide all elements
        game.hideElements.hideAll();
        // Redraw all elements
        game.drawOnce();
    }
};
game.startButton.init(); // Force object initialization on first script load

game.leaderboardButton = {
	// Get handle to image
    image: document.getElementById("leaderboardButton"),
	// Declare object transform information
    org_width: 450 * game.scale * 1.4,
    org_height: 120 * game.scale * 1.2,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.leaderboardButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 2 - this.height / 2;
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
	// Handle user interaction based on game state
    clickMe: function () {
        // Inform Google the user went straight to the leaderboard
        game.google.leaderboard();
        // Clear the player object
        game.player.reset();
        // Update game state to Leaderboard Scene
        game.currState = game.gameState[3];
        // Hide all elements
        game.hideElements.hideAll();
        // Redraw all elements
        game.drawOnce();
    }
};
game.leaderboardButton.init(); // Force object initialization on first script load

game.quitButton = {
	// Get handle to image
    image: document.getElementById("quitButton"),
	// Declare object transform information
    org_width: 450 * game.scale * 1.4,
    org_height: 120 * game.scale * 1.2,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.quitButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 1.5 - this.height / 2;
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
	// Handle user interaction based on game state
    clickMe: function () {
        // Inform Google the user quit the game
        game.google.quit();
        // Redirect the user to the O'Hare landing page
        window.location.replace("http://www.flywithbutchohare.com/");
    }
};
game.quitButton.init(); // Force object initialization on first script load

// - Play Scene
//   - Images
game.playBackground = {
	// Get handle to image
    image: document.getElementById("playBackground"),
	// Declare object transform information
    org_width: 1920,
    org_height: 1080,
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

game.playTitle = {
	// Get handle to image
    image: document.getElementById("wordFlightTitleSmall"),
	// Declare object transform information
    org_width: 488 * game.scale,
    org_height: 110 * game.scale,
    width: 0,
    height: 0,
    org_posX: 10,
    org_posY: 10,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        this.posX = this.org_posX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = Math.min(this.org_posY, this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsor = {
	// Get handle to image
    image: document.getElementById("wordFlightSponsor"),
	// Declare object transform information
    org_width: 290 * game.scale,
    org_height: 295 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1590,
    org_posY: 785,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Bottom Side
        this.posX = engine.width - this.width - (50 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
        this.posY = engine.height - this.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsorLogo = {
	// Get handle to image
    image: function () {
        return document.getElementById(game.getSponsor());
    },
	// Declare object transform information
    org_width: 200 * game.scale,
    org_height: 200 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1590,
    org_posY: 785,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = game.playSponsor.width * 0.95;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.playSponsor.posX + (game.playSponsor.width - this.width) / 2;
        this.posY = game.playSponsor.posY + game.playSponsor.height / 2 - this.height / 3;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image(), this.posX, this.posY, this.width, this.height);
    }
};

game.playTimer = {
	// Get handle to image
    image: document.getElementById("playTimer"),
	// Declare object transform information
    org_width: 814 * game.scale,
    org_height: 218 * game.scale,
    width: 0,
    height: 0,
    org_posX: 0,
    org_posY: 342,
    posX: 0,
    posY: 0,
	// Declare object transform information
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = this.org_posX;
        this.posY = Math.max(engine.height * 0.25, game.playTitle.height + game.playTitle.posY + 40 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
            //Math.max(game.playTitle.height + game.playTitle.posY + 10, engine.height / 2 - this.height);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playLetterSpace = {
	// Get handle to image
    image: document.getElementById("playLetterSpace"),
	// Declare object transform information
    org_width: 110 * game.scale,
    org_height: 142 * game.scale,
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = Math.max(20, Math.min(5, this.org_posX - engine.widthDifference));
        this.posY = Math.max(game.playTimer.height + game.playTimer.posY + 20, engine.height - engine.height / 4 - this.height * 1.2);
    },
	// Draw the object
    draw: function () {
        this.resize();
    }
};

game.playLetterSpaces = {
	// Get handle to div
    div: document.getElementById("letterSpaces"),
	// Declare object transform information
    org_width: 0,
    org_height: 0,
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Declare arrays to hold div and key objects
    divArray: [],
    keyArray: [],
	// Declare member variables
    btnMargin: 5,
    btnWidth: 0,
    btnHeight: 0,
    btnPerRow: 0,
    lettersFound: 0,
	// Dictionary to hold key:value pairs
    dict: {},
	// Add item to dictionary
    add: function (dict, key, value) {
        if (!this.dict[key]) {
			// Add the first pair to the dictionary
            this.dict[key] = [value];
        } else {
			// Add next pair to the dictionary
            this.dict[key].push(value);
        }
    },
	// Adjust the object's transform
    resize: function () {
        this.width = game.playSponsor.posX - 20;
        this.height = game.playLetterSpace.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion)); // + this.btnMargin;

        // Attach Left Side with Buffer
        this.posX = Math.max(20, Math.min(5, this.org_posX - engine.widthDifference));
        this.posY = Math.max(game.playTimer.height + game.playTimer.posY + 20 * (1 - Math.max(engine.widthProportion, engine.heightProportion)), Math.min(game.inputKeypad.posY - this.height - 40), ((game.inputKeypad.posY - (game.playTimer.height + game.playTimer.posY)) / 2));

        this.btnWidth = (this.width - ((2 * this.btnMargin) + ((this.btnPerRow - 1) * (2 * this.btnMargin)))) / (12) - 2;
        this.btnHeight = this.height; //game.playLetterSpace.height;

		// Adjust styles of every child element
        for (var i = 0; i < this.keyArray.length; i++) {
            var domElement = document.getElementById(this.keyArray[i]);
            domElement.style.width = this.btnWidth + "px";
            domElement.style.height = domElement.childNodes[1].style.getPropertyValue('height') + "px";
            domElement.childNodes[1].style.fontSize = this.btnWidth * 0.65 + "px";
        }

    },
	// Apply changes via CSS
    adjustStyle: function () {
        if (this.keyArray.length == 0) this.buildKeypad();
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "inline-block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
    },
	// Hide keypad and reset its member variables
    hideKeypad: function () {
        this.divArray = [];
        this.keyArray = [];
        this.lettersFound = 0;
        this.dict = {};
    },
	// Dynamically construct every keypad feature
    buildKeypad: function () {
        var letter = "";
		
		// Define variables starting DOM definitions
        var divPrefix = '<div id="inputContainerDiv_';
        var btnPrefix = '<img id="inputLetterButton_';
        var innerDivPrefix = '<div id="inputLetterDiv_';
		
		// Build a string to hold all the buttons
        var buttonBuilder = '';
		
		// Find the number of buttons per row
        this.btnPerRow = game.word.length;
		
		// Create all buttons
        for (var i = 0; i < this.btnPerRow; i++) {
			// Identify the letter for this button
            letter = game.word.substr(i, 1).toUpperCase();

            // Open outer div
            buttonBuilder += divPrefix + i + '" class="word-spaces-container" style="width:' + (this.div.width / 12) + 'px">';

            // Inner Image
            buttonBuilder += btnPrefix + i + '" class="word-spaces-image" src="images/play_scene/play_empty_space.png">';

            // Open inner div
            buttonBuilder += innerDivPrefix + i + '" class="word-spaces-center-letter">';

            // Write letter
            buttonBuilder += letter;

            // Close inner div
            buttonBuilder += "</div>";

            // Close outer div
            buttonBuilder += "</div>";
			
			// Add this button to the array and dictionary
            this.keyArray.push("inputContainerDiv_" + i);
            this.add(this.dict, "inputContainerDiv_" + i, letter);
            this.divArray.push(this.dict);
        }
		// Add all the buttons to the primary container
        this.div.innerHTML = buttonBuilder;
    },
	// Display all the buttons in the array
    showLetters: function () {
        for (var i = 0; i < this.keyArray.length; i++) {
            var domElement = document.getElementById(this.keyArray[i]).childNodes[1];
            domElement.style.display = "block";
        }
    },
	// Check if the letter matches the current word
    testLetter: function (input) {
		// Declare score variable
        var increaseBy = 0;
		
		// Check all the buttons in the array
        for (var i = 0; i < this.keyArray.length; i++) {
			// Check if the input matches a letter in the current word
            if (input == this.dict[this.keyArray[i]]) {

                // Increment the number of letters found
                this.lettersFound++;

                // Unhide the discovered letter
                var domElement = document.getElementById(this.keyArray[i]).childNodes[1];
                domElement.style.display = "block";

                // Draw plane parts
                game.planeManager.draw();

                // Increment score
                if (this.lettersFound == this.keyArray.length) {
                    increaseBy = Math.floor(16 / Math.max(16 - this.lettersFound, 1)) * 3;
                    game.playScoreBox.updateScore("Plane", increaseBy);
                } else {
                    increaseBy = 10;
                    game.playScoreBox.updateScore("Letter", increaseBy);
                }
                game.score += increaseBy;
				
				// Update the score
                game.playScore.updateScore();
            }
        }

        // Notify the game that all letters have been found
        if (this.lettersFound >= this.keyArray.length) {
            game.readyForNextWord = true;
        }
    }
};

//   - Plane Parts
game.planeCanvasBG = {
	// Get handle to image
    image: document.getElementById("letterButton_"),
	// Declare object transform information
    org_width: 110 * game.scale,
    org_height: 142 * game.scale,
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Animation transform
    animPosX: 0,
    animPosY: 0,
	// Adjust the object's transform
    resize: function () {
        this.height = Math.max(engine.height * 0.5, (game.playSponsor.posY - 20) - (game.playMenuButton.posY + game.playMenuButton.height + 20));
        this.width = Math.min(this.height, (engine.width - 20) - (game.playTimer.width + 20));
        this.height = this.width;

        this.posX = engine.width - this.width - 20;
        this.posY = ((game.playSponsor.posY - 20) + (game.playMenuButton.posY + game.playMenuButton.height + 20)) / 2 - this.height / 2;

        // Check for animation
        this.posX = Math.max(this.posX, this.posX + this.animPosX);
        this.posY = Math.max(this.posY, this.posY + this.animPosY);
    },
	// Draw the object
    draw: function () {
        this.resize();
    }
};

game.playPlaneDorsalFin = {
	// Get handle to image
    image: document.getElementById("playPlaneDorsalFin"),
	// Declare object transform information
    org_width: 186 * game.scale * game.planeScale,
    org_height: 30 * game.scale * game.planeScale,
    description: "Dorsal Fin",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneTail.posX - this.width / 4;
        this.posY = (game.playPlaneTail.posY + game.playPlaneTail.height / 2) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneLeftInnerEngine = {
	// Get handle to image
    image: document.getElementById("playPlaneEngine"),
	// Declare object transform information
    org_width: 80 * game.scale * game.planeScale,
    org_height: 50 * game.scale * game.planeScale,
    description: "Left Inner Engine",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneLeftWing.posX + (game.playPlaneLeftWing.width / 1.5) - this.width / 2;
        this.posY = (game.playPlaneLeftWing.posY + game.playPlaneLeftWing.height * 0.625) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneLeftOuterEngine = {
	// Get handle to image
    image: document.getElementById("playPlaneEngine"),
	// Declare object transform information
    org_width: 80 * game.scale * game.planeScale,
    org_height: 50 * game.scale * game.planeScale,
    description: "Left Outer Engine",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneLeftWing.posX + (game.playPlaneLeftWing.width / 2) - this.width / 3;
        this.posY = (game.playPlaneLeftWing.posY + game.playPlaneLeftWing.height * 0.45) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneRightInnerEngine = {
	// Get handle to image
    image: document.getElementById("playPlaneEngine"),
	// Declare object transform information
    org_width: 80 * game.scale * game.planeScale,
    org_height: 50 * game.scale * game.planeScale,
    description: "Right Inner Engine",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneRightWing.posX + (game.playPlaneRightWing.width / 1.5) - this.width / 2;
        this.posY = (game.playPlaneRightWing.posY + game.playPlaneRightWing.height * 0.375) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneRightOuterEngine = {
	// Get handle to image
    image: document.getElementById("playPlaneEngine"),
	// Declare object transform information
    org_width: 80 * game.scale * game.planeScale,
    org_height: 50 * game.scale * game.planeScale,
    description: "Right Outer Engine",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneRightWing.posX + (game.playPlaneRightWing.width / 2) - this.width / 3;
        this.posY = (game.playPlaneRightWing.posY + game.playPlaneRightWing.height * 0.55) - this.height / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneFuselage = {
	// Get handle to image
    image: document.getElementById("playPlaneFuselage"),
	// Declare object transform information
    org_width: 401 * game.scale * game.planeScale,
    org_height: 130 * game.scale * game.planeScale,
    description: "Fuselage",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = game.playPlaneNose.posX - this.width;
        this.posY = (game.playPlaneNose.posY);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneLeftRearWing = {
	// Get handle to image
    image: document.getElementById("playPlaneLeftRearWing"),
	// Declare object transform information
    org_width: 186 * game.scale * game.planeScale,
    org_height: 130 * game.scale * game.planeScale,
    description: "Left Rear Wing",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneTail.posX - this.width / 4;
        this.posY = (game.playPlaneTail.posY + game.playPlaneTail.height / 2) - this.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneLeftWing = {
	// Get handle to image
    image: document.getElementById("playPlaneLeftWing"),
	// Declare object transform information
    org_width: 286 * game.scale * game.planeScale,
    org_height: 360 * game.scale * game.planeScale,
    description: "Left Wing",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneFuselage.posX + (game.playPlaneFuselage.width * 0.2);
        this.posY = (game.playPlaneFuselage.posY + game.playPlaneFuselage.height / 2) - this.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneNose = {
	// Get handle to image
    image: document.getElementById("playPlaneNose"),
	// Declare object transform information
    org_width: 160 * game.scale * game.planeScale,
    org_height: 130 * game.scale * game.planeScale,
    description: "Nose",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.planeCanvasBG.posX + game.planeCanvasBG.width - 20 - this.width;
        this.posY = (game.planeCanvasBG.posY + game.planeCanvasBG.height) / 2;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneRightRearWing = {
	// Get handle to image
    image: document.getElementById("playPlaneRightRearWing"),
	// Declare object transform information
    org_width: 186 * game.scale * game.planeScale,
    org_height: 130 * game.scale * game.planeScale,
    description: "Right Rear Wing",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneTail.posX - this.width / 4;
        this.posY = (game.playPlaneTail.posY + game.playPlaneTail.height / 2);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneRightWing = {
	// Get handle to image
    image: document.getElementById("playPlaneRightWing"),
	// Declare object transform information
    org_width: 289 * game.scale * game.planeScale,
    org_height: 360 * game.scale * game.planeScale,
    description: "Right Wing",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneFuselage.posX + (game.playPlaneFuselage.width * 0.2);
        this.posY = (game.playPlaneFuselage.posY + game.playPlaneFuselage.height / 2);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playPlaneTail = {
	// Get handle to image
    image: document.getElementById("playPlaneTail"),
	// Declare object transform information
    org_width: 138 * game.scale * game.planeScale,
    org_height: 130 * game.scale * game.planeScale,
    description: "Tail",
    width: 0,
    height: 0,
    org_posX: 20,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.playPlaneFuselage.posX - this.width;
        this.posY = (game.playPlaneFuselage.posY);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//   - Plane Manager
game.planeManager = {
	// Declare member variables
    initialized: false,
    planeParts: [],
    partsDisplayed: 0,
    animVelocity: 0.0,
    animAcceleration: 0.01,
    animNewX: 0.0,
	// Initialize the object
    initialize: function () {
        if (!this.initialized) {
			// Push all plane parts to the array container
            this.planeParts.push(game.playPlaneLeftInnerEngine);
            this.planeParts.push(game.playPlaneLeftOuterEngine);
            this.planeParts.push(game.playPlaneRightInnerEngine);
            this.planeParts.push(game.playPlaneRightOuterEngine);
            this.planeParts.push(game.playPlaneLeftRearWing);
            this.planeParts.push(game.playPlaneRightRearWing);
            this.planeParts.push(game.playPlaneLeftWing);
            this.planeParts.push(game.playPlaneRightWing);
            this.planeParts.push(game.playPlaneNose);
            this.planeParts.push(game.playPlaneFuselage);
            this.planeParts.push(game.playPlaneTail);
            this.planeParts.push(game.playPlaneDorsalFin);
            this.initialized = true;
        }
    },
	// Draw the object
    draw: function () {

        // Redraw background images
        game.playBackground.draw();
        game.playTitle.draw();
        game.playSponsor.draw();
        game.playSponsorLogo.draw();
        game.playTimer.draw();
        game.playLetterSpace.draw();
        game.planeCanvasBG.draw();

        // Get the number of parts to render
        var parts = Math.round((game.playLetterSpaces.lettersFound / game.playLetterSpaces.keyArray.length) * this.planeParts.length);

        // Draw all necessary parts
        for (var i = 0; i < parts; i++) {
            if (i < this.planeParts.length) {
                this.planeParts[i].draw();
            }
        }
    },
    // Animate elements
    animate: function (dt) {
        var deltaTime = dt;

        // Increase acceleration every frame
        this.animAcceleration += 0.1 + Math.min(dt * this.animAcceleration, 0.9);
        // Increase velocity every frame based on acceleration * time
        this.animVelocity += this.animAcceleration * deltaTime;
        // Increase position every fame based on velocity * time
        this.animNewX += this.animVelocity * deltaTime;

        // Animate each plane part every frame
        game.planeCanvasBG.animPosX += this.animNewX;

		// Draw all objects
        this.draw();
		
		// After the plane is out of site, notify the game of completion
        if (game.playPlaneTail.posX > engine.width + 100) {
            return true;
        } else {
            return false;
        }
    },
	// Reset all elements
    resetElements: function () {
        // Reset plane manager
        this.initialized = false;
        this.planeParts = [];
        this.animAcceleration = 0.01;
        this.animVelocity = 0.0;
        this.animNewX = 0.0;

        // Reset plane canvas
        game.planeCanvasBG.posX = 0;
        game.planeCanvasBG.posY = 0;
        game.planeCanvasBG.animPosX = 0;
        game.planeCanvasBG.animPosY = 0;

        // Reset position of all plane parts
        game.planeManager.planeParts.forEach(function (item, index) {
            item.posX = 0.0;
        })
    }
};

game.playTimerBox = {
	// Get handle to div
    div: document.getElementById("timerBox"),
	// Declare object transform information
    org_width: 200 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 150,
    org_posY: 82,
    posX: 0,
    posY: 0,
	// Declare member variables
    org_font_size: 74,
    font_size: 0,
    timeStart: null,
    timeEnd: null,
    timeSeconds: null,
    timerStarted: false,
    timerExpired: false,
    timerDisplay: '',
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTimer.posY + this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion));

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
    update: function () {
        // Handle timer events
        if (!this.timerStarted) {
            // Start the timer if it hasn't been started yet
            this.startTimer();
        } else {
            // Update the time
            this.updateTime();
            // Display the timer
            this.displayTimer();
            // Expire the timer if less than 0 seconds remain
            if ((this.timeSeconds) <= 0) {
                this.expireTimer();
            }
        }
    },
    startTimer: function () {
        // Flag timer as started
        this.timerStarted = true;
        // Set the start time
        this.timeStart = Date.now();
        // Set the end time
        this.timeEnd = Date.now() + game.playTime;
    },
    displayTimer: function () {
        // Display time in MM:SS format
        if ((this.timeSeconds) >= 0) {
            this.timerDisplay = "0" + Math.floor(this.timeSeconds / 60) + ":" + ((this.timeSeconds % 60) < 10 ? "0" : "") + (this.timeSeconds % 60);
        } else {
            this.timerDisplay = "00:00";
        }
        // Display the time
        this.div.innerHTML = this.timerDisplay;

        // Flash the timer when less than 10 seconds are left
        if ((this.timeSeconds) <= 10) {
            this.div.classList.remove("pulse");
            this.div.classList.add("glow");
        } else if (this.div.getAttribute("class") === 'glow') {
            this.div.classList.remove("glow");
        }
    },
    updateTime: function () {
        // Set the countdown in seconds
        this.timeSeconds = Math.round((this.timeEnd - Date.now()) / 1000);
    },
    resetTimer: function () {
        // Reset all timer variables
        this.timeStart = null;
        this.timeEnd = null;
        this.timeSeconds = null;
        this.timerStarted = false;
        this.timerExpired = false;
        this.timerDisplay = '';
    },
    expireTimer: function () {
        // Flag the timer as expired
        this.timerExpired = true;
    }
};

game.playScore = {
	// Get handle to div
    div: document.getElementById("scoreBox"),
	// Declare object transform information
    org_width: 325 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 450,
    org_posY: 82,
    posX: 0,
    posY: 0,
	// Declare member variables
    org_font_size: 74,
    font_size: 0,
    score: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTimer.posY + this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion));

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
    // Update and display the game score
    updateScore: function () {
        this.score = Math.max(0, game.score);
        this.div.innerHTML = this.score;
        game.player.score = this.score;
    }
};

game.playScoreBox = {
	// Get handle to div
    div: document.getElementById("newScore"),
	// Declare object transform information
    org_width: 325 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 450,
    org_posY: 82,
    posX: 0,
    posY: 0,
    org_destX: 550,
    org_destY: 240,
    // Declare member variables
    org_font_size: 74,
    font_size: 0,
    // Animation transforms
    animSpeed: 0,
    animStartX: 0,
    animStartY: 0,
    animEndX: 0,
    animEndY: 0,
    animActive: false,
	animOpacity: 1.0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTimer.posY - this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Adjust font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Animation adjustments
        this.animStartX = game.playTimer.posX + this.org_posX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.animStartY = game.playTimer.posY - this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.animEndX = game.playTimer.posX + this.org_destX * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.animEndY = game.playTimer.posY - this.org_destY * (1 - Math.max(engine.widthProportion, engine.heightProportion));

    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "pt";
		this.div.style.opacity = this.animOpacity;
        this.div.style.zIndex = 4;
    },
    // Update and display the score
    updateScore: function (type, value) {
        var displayString = "";
        displayString += type + "<br>";
        if (value > 0) {
            displayString += "+" + value;
        } else {
            displayString += value;
        }
        this.div.innerHTML = displayString;
        this.div.style.display = "block";
        this.animActive = true;
    },
    // Reset and hide all elements
    resetElements: function () {
        this.resize();
        this.animSpeed = 0;
		this.animOpacity = 1.0;
        this.div.style.display = "none";
    },
    // Animate the popup
    animate: function (dt) {
        this.animSpeed += dt / (this.animEndX - this.animStartX);
        this.posX += (this.animEndX - this.animStartX) * this.animSpeed;
        this.posY += (this.animEndY - this.animStartY) * this.animSpeed;
		this.animOpacity -= 1 * this.animSpeed;

        // Force redraw
        this.draw();
        // Deactivate animation
        if (this.posX > this.animEndX) {
            this.animActive = false;
            this.resetElements();
        }
    }
};

//   - Buttons
game.playMenuButton = {
	// Get handle to image
    image: document.getElementById("wordFlightMenuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1645,
    org_posY: 942,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Top-Right Side
        this.posX = engine.width - this.width;
        this.posY = Math.max(5, Math.min(5, this.org_posY - engine.heightDifference));
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

game.playKeyPadSpace = {
	// Get handle to image
    image: document.getElementById("letterButton_"),
	// Declare object transform information
    org_width: 94 * game.scale,
    org_height: 102 * game.scale,
    width: 0,
    height: 0,
    org_posX: 60,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion)); //Math.min(, (this.org_width + 5) * 13);
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = Math.max(60, Math.min(60, this.org_posX - engine.widthDifference));
        this.posY = Math.max(game.playLetterSpace.height + game.playLetterSpace.posY + 40, engine.height - this.height * 2.2);
    },
	// Draw the object
    draw: function () {
        this.resize();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
    }
};

game.inputKeypad = {
	// Get handle to div
    div: document.getElementById("inputKeypad"),
    // Get handle to initials
	initials: document.getElementById("endPlayerInitials"),
	// Declare object transform information
    org_width: 0,
    org_height: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Declare member variables
    divArray: [],
    keyArray: [],
    btnMargin: 5,
    btnWidth: 0,
    btnHeight: 0,
    btnPerRow: 0,
	// Adjust the object's transform
    resize: function () {
        // Adjust based on game state
        switch (game.currState) {
            case 'play':
                this.width = game.playSponsor.posX - 40;
                this.height = (game.playKeyPadSpace.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion)) + this.btnMargin * 4) * 2;

                // Attach Left Side with Buffer
                this.posX = Math.max(10, (game.playSponsor.posX - this.width) / 2);
                this.posY = engine.height - this.height - 50 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
                //Math.min(game.playLetterSpace.height + game.playLetterSpace.posY + 40, engine.height - this.height - 40);

                this.btnWidth = this.width / 14;

                // Update CSS for all children
                for (var i = 0; i < this.keyArray.length; i++) {
                    var domElement = document.getElementById(this.keyArray[i]);
                    domElement.style.width = this.btnWidth + "px";
                    domElement.style.height = domElement.childNodes[1].style.getPropertyValue('height') + "px";
                    domElement.childNodes[1].style.fontSize = this.btnWidth * 0.50 + "px";
                }
                break;
            case 'end':
                this.width = game.endKeyboardBackground.width - 40 - game.endSubmitButton.width;
                this.height = engine.height - game.endKeyboardBackground.posY - 20;

                // Attach to Top-Left of Keyboard Background
                this.posX = game.endKeyboardBackground.posX + 10;
                this.posY = game.endKeyboardBackground.posY + 10;

                this.btnWidth = this.width / 13.1;

                // Update CSS for all children
                for (var i = 0; i < this.keyArray.length; i++) {
                    var domElement = document.getElementById(this.keyArray[i]);
                    domElement.style.width = this.btnWidth + "px";
                    domElement.style.height = domElement.childNodes[1].style.getPropertyValue('height') + "px";
                    domElement.childNodes[1].style.fontSize = this.btnWidth * 0.50 + "px";
                }
                break;
            default:
                break;
        }
    },
	// Apply changes via CSS
    adjustStyle: function () {
        if (this.keyArray.length == 0) this.buildKeypad();
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "inline-block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
    },
    // Hide keypad and clear arrays
    hideKeypad: function () {
        this.divArray = [];
        this.keyArray = [];
    },
    // Build the keypad
    buildKeypad: function () {
        var letter = "";

        // Define variables starting DOM definitions
        var divPrefix = '<div id="containerDiv_';
        var btnPrefix = '<img id="letterButton_';
        var innerDivPrefix = '<div id="letterDiv_';
        
        // Build a string to hold all the buttons
        var buttonBuilder = '';

        // Create all buttons
        for (var i = 0; i < 26; i++) {
            // Identify the letter for this button
            letter = String.fromCharCode(65 + i);

            // Open outer div based on game state
            switch (game.currState) {
                case 'play':
                    buttonBuilder += divPrefix + letter + '" class="keypad-container" style="width:' + (this.width / 13) + 'px">';
                    break;
                case 'end':
                    buttonBuilder += divPrefix + letter + '" class="keypad-container" style="width:' + (this.width / 13) + 'px">';
                    break;
            }

            // Inner Image
            buttonBuilder += btnPrefix + letter + '" class="keypad-image" src="images/key_blank.png">';

            // Open inner div
            buttonBuilder += innerDivPrefix + letter + '" class="keypad-center-letter">';

            // Write letter
            buttonBuilder += letter;

            // Close inner div
            buttonBuilder += "</div>";

            // Close outer div
            buttonBuilder += "</div>";

            // Insert a break after the 13th button
            if (i == 12) {
                buttonBuilder += "<br>";
            }

            // Add the button to the array
            this.keyArray.push("containerDiv_" + String.fromCharCode(65 + i));
        }
        // Define the number of buttons per row
        this.btnPerRow = Math.ceil(this.keyArray.length / 2);

        // Display the buttons in the container
        this.div.innerHTML = buttonBuilder;

        // Apply user interaction to the inner elements of each button
        // Get a list of all the images
        var imgElement = this.div.getElementsByTagName("img");
        for (var i = 0; i < imgElement.length; i++) {
            // Check the element's name
            if (imgElement[i].id.substring(0, 13) == "letterButton_") {
                for (var j = 0; j < 26; j++) {
                    // Create an identity matching string
                    var letter = "letterButton_" + String.fromCharCode(65 + j);
                    if (imgElement[i].id == letter) {
                        // Give the element a name for easy identification
                        imgElement[i].name = String.fromCharCode(65 + j);
                        // Add a click event to the element
                        imgElement[i].addEventListener("click", function (e) {

                            // Reset timeout overlay timer
                            game.timeoutOverlay.refreshTimer();

                            // Apply actions based on the game state
                            switch (game.currState) {
                                case 'play':
                                    if (e.srcElement.parentNode.childNodes[1].getAttribute("class") === 'keypad-center-letter') {

                                        // Set key letter to inactve
                                        e.srcElement.parentNode.childNodes[1].classList.remove("keypad-center-letter");
                                        e.srcElement.parentNode.childNodes[1].classList.add("keypad-center-letter-inactive");

                                        // Set key image to inactive
                                        e.srcElement.classList.remove("keypad-image");
                                        e.srcElement.classList.add("keypad-image-inactive");

                                        // Test letter with chosen word
                                        game.playLetterSpaces.testLetter(e.srcElement.name);
                                    }
                                    break;
                                case 'end':
                                    // Add letter to the player's initials
                                    game.endPlayerInitials.updateInitials(e.srcElement.parentNode.childNodes[1].name);
                                    break;
                            }
                        });
                        continue;
                    }
                }
            }
        }

        // Get a list of all the divs
        var divElement = this.div.getElementsByTagName("div");
        for (var i = 0; i < divElement.length; i++) {
            // Check the element's name
            if (divElement[i].id.substring(0, 10) == "letterDiv_") {
                for (var j = 0; j < 26; j++) {
                    // Create an identity matching string
                    var letter = "letterDiv_" + String.fromCharCode(65 + j);
                    if (divElement[i].id == letter) {
                        // Give the element a name for easy identification
                        divElement[i].name = String.fromCharCode(65 + j);
                        // Add a click event to the element
                        divElement[i].addEventListener("click", function (e) {

                            // Reset timeout overlay timer
                            game.timeoutOverlay.refreshTimer();

                            // Apply actions based on the game state
                            switch (game.currState) {
                                case 'play':
                                    if (e.srcElement.getAttribute("class") === 'keypad-center-letter') {

                                        // Set key letter to inactve
                                        e.srcElement.classList.remove("keypad-center-letter");
                                        e.srcElement.classList.add("keypad-center-letter-inactive");

                                        // Set key image to inactive
                                        e.srcElement.parentNode.childNodes[0].classList.remove("keypad-image");
                                        e.srcElement.parentNode.childNodes[0].classList.add("keypad-image-inactive");

                                        // Test letter with chosen word
                                        game.playLetterSpaces.testLetter(e.srcElement.name);
                                    }
                                    break;
                                case 'end':
                                    // Add letter to the player's initials
                                    game.endPlayerInitials.updateInitials(e.srcElement.parentNode.childNodes[0].name);
                                    break;
                            }
                        });
                        continue;
                    }
                }
            }
        }
    }
};

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
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
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
    }
};

game.endPlayerInitials = {
	// Get handle to div
    div: document.getElementById("endPlayerInitials"),
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
    }
};

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
        this.width = this.org_width * (1 - engine.dimensionProportion);
        this.height = this.org_height * (1 - engine.dimensionProportion);
        this.posX = engine.width - this.width; // this.org_posX - engine.widthDifference;
        this.posY = 50 * (1 - engine.dimensionProportion);
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

// - Leaderboard Scene
//   - Images
game.leaderboardBackground = {
	// Get handle to image
    image: document.getElementById("leaderboardBackground"),
	// Declare object transform information
    org_width: 1923 * game.scale,
    org_height: 1093 * game.scale,
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

game.leaderboardPlane = {
	// Get handle to image
    image: document.getElementById("leaderboardPlane"),
	// Declare object transform information
    org_width: 1096 * game.scale,
    org_height: 456 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Animation transforms
    animPosX: 0,
    animPosY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width - (3000 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
        this.posY = engine.height - (550 * (1 - engine.heightProportion));

        // Check for animation
        this.posX = Math.max(this.posX, this.posX + this.animPosX);
        this.posY = Math.max(this.posY, this.posY + this.animPosY);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardTitle = {
	// Get handle to image
    image: document.getElementById("wordFlightTitleSmall"),
	// Declare object transform information
    org_width: 488 * game.scale,
    org_height: 118 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardClipboard = {
	// Get handle to image
    image: document.getElementById("leaderboardClipboard"),
	// Declare object transform information
    org_width: 845 * game.scale,
    org_height: 1018 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * .90 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * .90 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width - this.width - (375 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
        this.posY = 25;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardPlayerScore = {
	// Get handle to image
    image: document.getElementById("leaderboardScore"),
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
        this.posX = 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = 230 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardSponsor = {
	// Get handle to image
    image: document.getElementById("wordFlightSponsor"),
	// Declare object transform information
    org_width: 290 * game.scale,
    org_height: 295 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1550,
    org_posY: 825,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - engine.dimensionProportion);
        this.height = this.org_height * (1 - engine.dimensionProportion);
        this.posX = engine.width - this.width - (50 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
        this.posY = engine.height - this.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardSponsorLogo = {
	// Get handle to image
    image: function () {
        return document.getElementById(game.getSponsor());
    },
	// Declare object transform information
    org_width: 200 * game.scale,
    org_height: 200 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1590,
    org_posY: 785,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = game.leaderboardSponsor.width * 0.95;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.leaderboardSponsor.posX + (game.leaderboardSponsor.width - this.width) / 2;
        this.posY = game.leaderboardSponsor.posY + game.leaderboardSponsor.height / 2 - this.height / 3;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image(), this.posX, this.posY, this.width, this.height);
    }
};

game.finalPlayerScore = {
	// Get handle to div
    div: document.getElementById("finalPlayerScore"),
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
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width / 2 - this.width / 2;
        this.posY = game.leaderboardPlayerScore.posY + game.leaderboardPlayerScore.height / 2 - this.height / 2;

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
    // Update and display the score
    updateScore: function () {
        this.score = Math.max(0, game.player.score);
        this.div.innerHTML = this.score;
    }
};

//LeaderboardAnimation
game.leaderboardAnimation = {
    animStartX: game.leaderboardPlane.posX,
    animEndX: engine.width - (2300 * (1 - Math.max(engine.widthProportion, engine.heightProportion))),
    animStartY: game.leaderboardPlane.posY,
    animEndY: game.leaderboardPlane.posY,
    animDistance: 0,
    animVelocity: 20,
    animAcceleration: 1,
    animNewX: 0.0,
    animActive: true,
    draw: function () {
        // Redraw background images
        game.leaderboardBackground.draw();
        
        // Draw plane
		game.leaderboardPlane.draw();
        
        // Continue drawing images
        game.leaderboardTitle.draw();
        game.leaderboardSponsor.draw();
        game.leaderboardSponsorLogo.draw();
        game.leaderboardPlayerScore.draw();
        game.finalPlayerScore.draw();
        game.leaderboardClipboard.draw();
    },
    // Animate elements
    animate: function (dt) {
        var deltaTime = dt;
        
        // Decelerate into position
        this.animDistance = this.animEndX - this.animStartX;
        this.animAcceleration = this.animDistance * dt * 4;
        this.animVelocity = Math.max(this.animVelocity + this.animAcceleration * dt, dt);
        this.animNewX += this.animVelocity * dt;

        // Animate plane every frame
        game.leaderboardPlane.animPosX += this.animNewX;

        this.draw();
        if (game.leaderboardPlane.posX < this.animEndX) {
            this.animActive = true;
        } else {
            this.animActive = false;
        }
    },
    // Reset all elements
    resetElements: function () {
        //reset plane
		game.leaderboardPlane.posX = 0;
		game.leaderboardPlane.posY = 0;
		game.leaderboardPlane.animPosX = 0;
		game.leaderboardPlane.animPosY = 0;
            
        // Reset plane animation
        this.animStartX = game.leaderboardPlane.posX;
        this.animEndX = engine.width - (2300 * (1 - Math.max(engine.widthProportion, engine.heightProportion)));
        this.animStartY = game.leaderboardPlane.posY;
        this.animEndY = game.leaderboardPlane.posY;
        this.animDistance = 0;
        this.animVelocity = 20;
        this.animAcceleration = 1;
        this.animNewX = 0.0;
        this.animActive = true;
    }
};

//Leaderboard Table
game.top10players = {
	// Get handle to div
    div: document.getElementById("top10table"),
	// Declare object transform information
    org_width: 0,
    org_height: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_font_size: 36,
    font_size: 0,
    // Array to hold displayable items
    divArray: [],
    // Flag for the table's completion
    tableBuilt: false,
	// Adjust the object's transform
    resize: function () {
        this.width = game.leaderboardClipboard.width * .80;
        this.height = game.leaderboardClipboard.height - 280 * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side with Buffer
        this.posX = game.leaderboardClipboard.posX + (game.leaderboardClipboard.width - this.width) / 2;
        this.posY = game.leaderboardClipboard.posY + 250 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
            // game.leaderboardClipboard.height / 2 - (this.height * .28);

        // Update font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Apply changes via CSS
    adjustStyle: function () {
        if (!this.tableBuilt) {
            this.buildTable();
        }
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "px";
        this.div.style.zIndex = 1;
    },
    // Hide the table and clear the array
    hideTable: function () {
        this.divArray = [];
        this.tableBuilt = false;
    },
    // Build the table
    buildTable: function () {
        var place = "";
        var divPrefix = '<div id="containerDiv_';
        var tablePrefix = '<table>';
        var rowPrefix = '<tr>';
        var dataPrefix = '<td class="top-10-data"';
        var tableBuilder = '';
        var placeHolder = '';
        var scoreHolder = '';

        //AJAX query
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "scripts/leaderboard.php", true);
        ajax.send();

        // Perform actions when AJAX completes (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Parse and store the JSON message from PHP
                var leaders = JSON.parse(this.responseText);

                for (var i = 0; i < leaders.length; i++) {
                    place = i + 1;

                    placeHolder = leaders[i].user.toString();
                    scoreHolder = leaders[i].score.toString();

                    //open div
                    tableBuilder += divPrefix + place + '" class="table-container" style="width:' + (game.top10players.width) + 'px">';

                    if (game.player.initials.toString() == placeHolder && game.player.score.toString() == scoreHolder) {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + " style='background-color: #f41c63;'>" + place + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + leaders[i].user + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + scoreHolder + "</td></tr>";
                    } else {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + ">" + place + "</td>" + dataPrefix + ">" + leaders[i].user + "</td>" + dataPrefix + ">" + scoreHolder + "</td></tr>";
                    }

                    tableBuilder += "</div>";
                }
                //close table
                tableBuilder += "</table>"

                //close div
                tableBuilder += "</div>"

                game.top10players.divArray.push("containerDiv_" + place);
                game.top10players.div.innerHTML = tableBuilder;
                
                game.top10players.tableBuilt = true;
            }
        }
    }
};

//   - Buttons
game.leaderboardMenuButton = {
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
        this.width = this.org_width * (1 - engine.dimensionProportion);
        this.height = this.org_height * (1 - engine.dimensionProportion);
        this.posX = engine.width - this.width; // this.org_posX - engine.widthDifference;
        this.posY = 50 * (1 - engine.dimensionProportion);
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

game.leaderboardRetryButton = {
	// Get handle to image
    image: document.getElementById("leaderboardRetryButton"),
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
        this.image.addEventListener("click", game.leaderboardRetryButton.retry);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 100 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = engine.height - this.height - (50 * (1 - engine.dimensionProportion));
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
    // Actions when clicking this button
    retry: function () {
        // Inform Google the player is starting a new game
        game.google.start();
        // Set the game state to Play Scene
        game.currState = game.gameState[1];
        // Reset the player object
        game.player.reset();
        // Reset plane animation
        game.leaderboardAnimation.resetElements();
        // Hide all elements
		game.hideElements.hideAll();
        // Redraw all elements
		game.drawOnce();
    }
};
game.leaderboardRetryButton.init(); // Force initialize object on first script load

/* Game States and transitions
 ** -- Start Scene
 ** |\ - Play Scene
 ** |  \ - End Scene
 ** \____\ - Leaderboard Scene
 **        \ - Start Scene
 */
game.gameState = ['start', 'play', 'end', 'leaderboard'];
game.currState = game.gameState[0];

// Clear the screen of all elements
game.hideElements = {
    // Hide images
    images: function () {
		// Hide all <img> elements
        var y = document.getElementsByTagName("img");
        for (var i = 0; i < y.length; i++) {
            y[i].style.display = "none";
        }
		// Hide all <div> elements
        var z = document.getElementsByTagName("div");
        for (var i = 0; i < z.length; i++) {
            z[i].style.display = "none";
        }
    },
    // Hide canvas drawings
    canvas: function () {
        engine.context.clearRect(0, 0, engine.width, engine.height);
    },
    // Hide everything
    hideAll: function () {
        this.images();
        this.canvas();
    }
};

// Maintain live game data (timers, scores, etc.)
game.gameController = {
    gsStart: function (dt) {
        // Start Scene

        // Initialize word/sponsor pairs from database
        if (game.word === "") {
            game.updateWords.update();
        }

        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
				// Set game score to zero
                game.score = 0;
				// Reset the player object
                game.player.reset();
				// Get the current sponsor
                game.getSponsor();
				// Set the new game state to Play Scene
                game.currState = game.gameState[1];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
            }
        }
    },
    gsPlay: function (dt) {
        // Play Scene

        // Run the timer
        if (!game.playTimerBox.timerExpired) {
            game.playTimerBox.update();
        } else {
			// Once the timer expires...
            // Update the player object's score
            game.player.score = game.score;

            // Reset Play Scene objects
            game.updateWords.update();
            game.inputKeypad.hideKeypad();
            game.playLetterSpaces.hideKeypad();
            game.readyForNextWord = false;
            game.planeManager.resetElements();
            game.playTimerBox.resetTimer();

            // Clear the initials on the End Scene
            game.endPlayerInitials.clearInitials();

            // Change to the End Scene state
            game.currState = game.gameState[2];

            // Wipe the canvas
            game.hideElements.hideAll();

            // Draw new objects
            game.drawOnce();
        }

        // Check whether a word is complete
        if (game.readyForNextWord) {
			// Check if the plane is animating
            if (game.planeManager.animate(dt)) {
				// During animation, perform the following
                // Query new word and sponsor
                game.updateWords.update();

                // Hide all elements - prepare for redraw
                game.hideElements.hideAll();

                // Reset keypad
                game.inputKeypad.hideKeypad();
                game.inputKeypad.adjustStyle();

                // Reset letter spaces
                game.playLetterSpaces.hideKeypad();
                game.playLetterSpaces.adjustStyle();

                // Reset plane
                game.planeManager.resetElements();

                // Prepare for the next word
                game.readyForNextWord = false;

				// Redraw all assets
                game.drawOnce();
            }
        }

        // Animate score box
        if (game.playScoreBox.animActive) {
            game.playScoreBox.animate(dt);
        }

		// DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
				// Update words list
                game.updateWords.update();
				// Hide keypad
                game.inputKeypad.hideKeypad();
				// Hide letter spaces
                game.playLetterSpaces.hideKeypad();
				// Clear flag for next word
                game.readyForNextWord = false;
				// Reset all elements in the plane manager
                game.planeManager.resetElements();
				// Reset the play timer
                game.playTimerBox.resetTimer();
				// Clear the player initials div
                game.endPlayerInitials.clearInitials();
				// Update game state to End Scene
                game.currState = game.gameState[2];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
            }
        }
    },
    gsEnd: function (dt) {
        // End Scene

		// DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
				// Hide keypad
                game.inputKeypad.hideKeypad();
				// Update game state to Leaderboard Scene
                game.currState = game.gameState[3];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
            }
        }
    },
    gsLeaderboard: function (dt) {
        // Leaderboard Scene

        //Animate Scene
        if (game.leaderboardAnimation.animActive) {
            game.leaderboardAnimation.animate(dt);            
        }
        
		// DEBUG
        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
				// Reset player object
                game.player.reset();
                // Reset plane animation
                game.leaderboardAnimation.resetElements();
				// Update game state to Start Scene
                game.currState = game.gameState[0];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
            }
        }
    }
};

// Update
// - Heavy performance impact
// - Limit actions that do not require real-time updates
// - Executes every frame
game.update = function (dt) {
    // Monitor game states
    switch (game.currState) {
        case 'start':
            this.gameController.gsStart(dt);
            break;
        case 'play':
            this.gameController.gsPlay(dt);
            break;
        case 'end':
            this.gameController.gsEnd(dt);
            break;
        case 'leaderboard':
            this.gameController.gsLeaderboard(dt);
            break;
        default:
            this.gameController.gsStart(dt);
            break;
    };
    
    // Force a draw when the window resizes
    if (this.lastTimeSized < (engine.timeSizing)) {
        this.drawOnce();
        this.lastTimeSized = Date.now();
    }

    // Maintain Game Timeout
    game.timeoutOverlay.update(dt);

    // Handle mouse clicks
    for (var i = 0; i < game.mouse.length; i++) {
        if (engine.input.pressed(game.mouse[i])) {
			// Refresh the overlay's timer
            game.timeoutOverlay.refreshTimer();
        }
    }
};

// Draw functions
// - Static
//   - Draw static assets once, if they are active
//   - Light performance impact
//   - Useful during scene transitions and small animations
game.drawOnce = function () {
    // Draw based on the GameState
    switch (this.currState) {
        case 'start':
            // Draw images on the canvas
            this.startRunway.draw();
            this.startHangar.draw();
            this.wordFlightTitle.draw();
			
            // Display buttons
            this.startButton.adjustStyle();
            this.leaderboardButton.adjustStyle();
            this.quitButton.adjustStyle();
            this.menuButton.adjustStyle();
            break;
        case 'play':
            // Draw images on the canvas
            this.playBackground.draw();
            this.playTitle.draw();
            this.playSponsor.draw();
            this.playSponsorLogo.draw();
            this.playTimer.draw();
            this.playLetterSpace.draw();
            this.playTimerBox.draw();
            this.playScore.draw();
            this.playScoreBox.resize();
			
            // Display plane parts
            this.planeCanvasBG.draw();
            this.playPlaneNose.resize();
            this.playPlaneFuselage.resize();
            this.playPlaneTail.resize();
            this.playPlaneDorsalFin.resize();
            this.playPlaneLeftRearWing.resize();
            this.playPlaneLeftWing.resize();
            this.playPlaneRightRearWing.resize();
            this.playPlaneRightWing.resize();
            this.playPlaneLeftInnerEngine.resize();
            this.playPlaneLeftOuterEngine.resize();
            this.playPlaneRightInnerEngine.resize();
            this.playPlaneRightOuterEngine.resize();

            // Initialize plane manager
            this.planeManager.initialize();
            this.planeManager.draw();
			
            // Display buttons
            this.playMenuButton.adjustStyle();
            this.playKeyPadSpace.adjustStyle();
            this.inputKeypad.adjustStyle();
            this.playLetterSpaces.adjustStyle();
            this.inputKeypad.adjustStyle();
            break;
        case 'end':
            // Draw images on the canvas
            this.endBackground.draw();
            this.endKeyboardBackground.draw();
            this.endGamePoints.draw();
            this.endInitials.draw();
            this.wordFlightTitleSmall.draw();
            this.endPlayerScore.draw();
            this.endPlayerInitials.draw();
            this.endGameOver.draw();
			
            // Display buttons
            this.endSubmitButton.adjustStyle();
            this.endMenuButton.adjustStyle();
            this.inputKeypad.adjustStyle();
            break;
        case 'leaderboard':
            // Draw images on the canvas
            this.leaderboardBackground.draw();
            this.leaderboardTitle.draw();
            this.leaderboardSponsor.draw();
            this.leaderboardClipboard.draw();
            this.leaderboardPlayerScore.draw();
            this.leaderboardPlane.draw();
            this.leaderboardSponsorLogo.draw();
            this.top10players.adjustStyle();
            this.finalPlayerScore.draw();
			
            // Display buttons
            this.leaderboardMenuButton.adjustStyle();
            this.leaderboardRetryButton.adjustStyle();
            
            // Animations
            this.leaderboardAnimation.draw();
            break;
        default:
            break;
    }
    // DEBUG
    console.log("<GAME> Loaded Scene: " + this.currState);
};
//   - First draw event
window.onload = function () {
    game.drawOnce();
}

// - Animation
//   - Draw animations
//     - Heavy performance impact
//     - Only use when animating the full screen
//     - Draws every frame
game.draw = function () {
    // Draw based on the GameState
    switch (this.currState) {
        case 'start':
            break;
        case 'play':
            break;
        case 'end':
            break;
        case 'leaderboard':
            break;
        default:
            break;
    }
};

// Window loses focus
window.onblur = function () {
	// Pause the game
    return game.stop();
};

// Window gains focus
window.onfocus = function () {
	// Force redraw of all elements
    game.run();
    // Unpause the game
    return game.drawOnce();
};

// Run Game
game.run(); // Force game to start on first script load