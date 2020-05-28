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
window.game = Object.create(GameObject.prototype);

// Keybindings
game.keys = ['A', 'S', 'D', 'F', 'O', 'P', 'T', 'C'];
for (var i = 0; i < game.keys.length; i++) {
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
game.scale = 1.0; // Scale for adjusting object sizes
game.planeScale = 1.0; // Scale to adjust plane part sizes
game.lastWord = ""; // Previously used word
game.word = ""; // Current word
game.nextWord = ""; // Next word
game.lastSponsor = ""; // Previously used sponsor
game.sponsor = ""; // Current sponsor
game.nextSponsor = ""; // Next sponsor
game.sponsorId = ""; // Current sponsor's ID
game.score = 0; // Current score
game.readyForNextWord = false; // Test to identify when to update the word list
game.playTime = (3 * 60 + 30) * 1000; // Play time (3:30)
game.timeoutTime = 120; // Timeout time before returning to landing page
game.difficulty = "medium"; //Current difficulty level
game.firstPlayThrough = true; // Flag for the first play through

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

game.difficultyOverlay = {
    div: document.getElementById("difficultyOverlay"),
    divContent: document.getElementById("difficultyContent"),
    divHeader: document.getElementById("difficultyHeader"),
    aEasy: document.getElementById("difficultyEasy"),
    aMedium: document.getElementById("difficultyMedium"),
    aHard: document.getElementById("difficultyHard"),
    aPlay: document.getElementById("difficultyPlay"),
    divFooter: document.getElementById("difficultyPlay"),
    closeButton: document.getElementById("difficultyCloseButton"),
    org_header_size: 90,
    org_select_size: 53,
    org_action_size: 80,
    org_closer_size: 60,
    init: function () {
        // Initialize the easy menu option
        this.aEasy.addEventListener("click", function (e) {
            console.log("<Game:Difficulty> Set to easy");
            // Reset timeout overlay timer
            game.timeoutOverlay.refreshTimer();
            // Set difficulty to easy
            game.difficulty = "easy";
            // Update difficulty styles
            game.difficultyOverlay.updateStyles();
            // Reset words
            game.updateWords.reset();
            //re initialize words and sponsors
            game.updateWords.update();
        });

        // Initialize the medium menu option
        this.aMedium.addEventListener("click", function (e) {
            console.log("<Game:Difficulty> Set to medium");
            // Reset timeout overlay timer
            game.timeoutOverlay.refreshTimer();
            // Set difficulty to medium
            game.difficulty = "medium";
            // Update difficulty styles
            game.difficultyOverlay.updateStyles();
            // Reset words
            game.updateWords.reset();
            //re initialize words and sponsors
            game.updateWords.update();
        });

        // Initialize the hard menu option
        this.aHard.addEventListener("click", function (e) {
            console.log("<Game:Difficulty> Set to hard");
            // Reset timeout overlay timer
            game.timeoutOverlay.refreshTimer();
            // Set difficulty to hard
            game.difficulty = "hard";
            // Update difficulty styles
            game.difficultyOverlay.updateStyles();
            // Reset words
            game.updateWords.reset();
            // Re initialize words and sponsors
            game.updateWords.update();
        });

        // Initialize the play menu option
        this.aPlay.addEventListener("click", function (e) {
            console.log("<Game:Difficulty> Play");
            // Reset timeout overlay timer
            game.timeoutOverlay.refreshTimer();
            // Perform scene transition test
            game.difficultyOverlay.sceneTransition();
        });

        // Initialize the close menu option
        this.closeButton.addEventListener("click", function (e) {
            console.log("<Game:Difficulty> Close button");
            // Reset timeout overlay timer
            game.timeoutOverlay.refreshTimer();
            // Close the overlay
            game.difficultyOverlay.close();
        });

    },
    open: function () {
        // Reset words
        game.updateWords.reset();
        this.updateStyles();
        this.div.style.display = "block";
        this.divContent.style.display = "block";
        this.div.style.height = "100%";
        console.log("<Game:Difficulty> Open Overlay");
    },
    close: function () {
        this.div.style.height = "0%";
        console.log("<Game:Difficulty> Close Overlay");
    },
    tester: (key) => {
        console.log(`Key: ${key}`);
    },
    updateStyles: function () {
        this.deactivateAll();
        switch (game.difficulty) {
            case "easy":
                // Set element to active
                this.aEasy.classList.add("active");
                break;
            case "medium":
                // Set element to active
                this.aMedium.classList.add("active");
                break;
            case "hard":
                // Set element to active
                this.aHard.classList.add("active");
                break;
            default:
                game.difficulty = "medium";
                this.updateStyles();
                break;
        }
    },
    deactivateAll: function () {
        // Remove the active class from aEasy
        if (this.aEasy.getAttribute("class") === 'active') {
            this.aEasy.classList.remove("active");
            console.log("<Game:DifficultyOverlay> Removed active from Easy");
        }
        // Remove the active class from aMedium
        if (this.aMedium.getAttribute("class") === 'active') {
            this.aMedium.classList.remove("active");
            console.log("<Game:DifficultyOverlay> Removed active from Medium");
        }
        // Remove the active class from aHard
        if (this.aHard.getAttribute("class") === 'active') {
            this.aHard.classList.remove("active");
            console.log("<Game:DifficultyOverlay> Removed active from Hard");
        }
    },
    sceneTransition: function () {
        console.log("<Game:DifficultyOverlay> Transition Scenes");
        // Display the tutorial overlay if this is the first playthrough
        if (game.firstPlayThrough) {
            console.log("<Game:DifficultyOverlay> Display the tutorial");
            // Close difficulty overlay to maintain proper functionality
            game.difficultyOverlay.close();
            // Open tutorial overlay
            game.tutorialOverlay.open();
        } else {
            // Otherwise, start the game
            console.log("<Game:DifficultyOverlay> Transition to the Play Scene");
            // Activate tutorial helper
            game.playTutorial.play();
            // Inform Google the user started playing a game
            game.google.start();
            // Set game score to zero
            game.score = 0;
            // Reset the player object
            game.player.reset();
            // Get the current sponsor
            game.getSponsor();
            // Refresh the timeout timer
            game.timeoutOverlay.refreshTimer();
            // Set the new game state to Play Scene
            game.currState = game.gameState[1];
            // Hide all elements
            game.hideElements.hideAll();
            // Redraw all elements
            game.drawOnce();
            // Close difficulty overlay to maintain proper functionality
            game.difficultyOverlay.close();
        }
    },
    resize: function () { }
};
game.difficultyOverlay.init() // Force initialize all objects in the difficulty overlay

//Tutorial Overlay
game.tutorialOverlay = {
    div: document.getElementById("tutorialOverlay"),
    divContent: document.getElementById("tutorialContent"),
    closeButton: document.getElementById("tutorialCloseButton"),
    img01: document.getElementsByName("tutImg1"),
    img02: document.getElementsByName("tutImg2"),
    img03: document.getElementsByName("tutImg3"),
    img04: document.getElementsByName("tutImg4"),
    tutImg1: document.getElementById("tutorialImage01"),
    tutImg2: document.getElementById("tutorialImage02"),
    tutImg3: document.getElementById("tutorialImage03"),
    tutImg4: document.getElementById("tutorialImage04"),
    tutTxt1: document.getElementById("tutorialText01"),
    tutTxt2: document.getElementById("tutorialText02"),
    tutTxt3: document.getElementById("tutorialText03"),
    tutTxt4: document.getElementById("tutorialText04"),
    tutorialPages: document.getElementById("tutorialPages"),
    org_header_size: 90,
    org_select_size: 53,
    org_action_size: 80,
    org_closer_size: 60,
    activeE: 0,
    altOpen: false,
    orgTimeStart: null,
    init: function() {
        // Images
        this.tutImg1.addEventListener("click", this.nextSlide);
        this.tutImg2.addEventListener("click", this.nextSlide);
        this.tutImg3.addEventListener("click", this.nextSlide);
        this.tutImg4.addEventListener("click", this.nextSlide);
        // Text
        this.tutTxt1.addEventListener("click", this.nextSlide);
        this.tutTxt2.addEventListener("click", this.nextSlide);
        this.tutTxt3.addEventListener("click", this.nextSlide);
        this.tutTxt4.addEventListener("click", this.nextSlide);
        // Pagination
        $("#tutorialPages a:nth-child(1)").on("click", function() { game.tutorialOverlay.pagesUpdate(0);});
        $("#tutorialPages a:nth-child(2)").on("click", function() { game.tutorialOverlay.pagesUpdate(1);});
        $("#tutorialPages a:nth-child(3)").on("click", function() { game.tutorialOverlay.pagesUpdate(2);});
        $("#tutorialPages a:nth-child(4)").on("click", function() { game.tutorialOverlay.pagesUpdate(3);});
        // Close Button
        this.closeButton.addEventListener("click", this.close);
    },
    // Open the tutorial overlay
    open: function() {
        // Reset the height
        this.div.style.height = "0%";
        game.tutorialOverlay.div.style.display = "block";
        game.tutorialOverlay.divContent.style.display = "block";
        game.tutorialOverlay.div.style.height = "100%";
        
        for (var i = 0; i < game.tutorialOverlay.img01.length; i++) {
            game.tutorialOverlay.img01[i].style.display = "block";
        }
        for (var i = 0; i < game.tutorialOverlay.img02.length; i++) {
            game.tutorialOverlay.img02[i].style.display = "none";
        }
        for (var i = 0; i < game.tutorialOverlay.img03.length; i++) {
            game.tutorialOverlay.img03[i].style.display = "none";
        }
        for (var i = 0; i < game.tutorialOverlay.img04.length; i++) {
            game.tutorialOverlay.img04[i].style.display = "none";
        }
        
        $("#tutorialPages").css("display", "inline-block");
        
        console.log("<Game:Tutorial> Open");
    },
    openAlternate: function() {
        // Reset the overlay
        game.tutorialOverlay.tutorialPages.childNodes[1].classList.add("active");
        game.tutorialOverlay.tutorialPages.childNodes[3].classList.remove("active");
        game.tutorialOverlay.tutorialPages.childNodes[5].classList.remove("active");
        game.tutorialOverlay.tutorialPages.childNodes[7].classList.remove("active");
        // Reset the counter
        game.tutorialOverlay.activeE = 0;
        // Open the overlay
        game.tutorialOverlay.open();
        console.log("<Game:Tutorial> Open Alternate");
        // Notify of alternate opening
        game.tutorialOverlay.altOpen = true;
        // Get the player's current play time
        game.tutorialOverlay.orgTimeStart = Date.now() - game.playTimerBox.timeStart;
    },
    // Close the tutorial overlay
    close: function() {
        game.tutorialOverlay.div.style.height = "0%";
        console.log("<Game:Tutorial> Close");
        game.tutorialOverlay.startGame();
    },
    resize: function() {
        this.divContent.style.fontSize = this.org_select_size * (1 - Math.max(engine.widthProportion, engine.heightProportion)) + "px";
        this.closeButton.style.fontSize = this.org_closer_size * (1 - Math.max(engine.widthProportion, engine.heightProportion)) + "px";
    },
    pagesUpdate: (key) => {
        game.tutorialOverlay.activeE = key - 1;
        game.tutorialOverlay.nextSlide();
    },
    nextSlide: function() {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
        // Get the active slide
        game.tutorialOverlay.activeE += 1;
        // Update the slide
        switch(game.tutorialOverlay.activeE) {
            case 0:
                game.tutorialOverlay.tutorialPages.childNodes[1].classList.add("active");
                game.tutorialOverlay.tutorialPages.childNodes[3].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[5].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[7].classList.remove("active");
                for (var i = 0; i < game.tutorialOverlay.img01.length; i++) {
                    game.tutorialOverlay.img01[i].style.display = "block";
                }
                for (var i = 0; i < game.tutorialOverlay.img02.length; i++) {
                    game.tutorialOverlay.img02[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img03.length; i++) {
                    game.tutorialOverlay.img03[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img04.length; i++) {
                    game.tutorialOverlay.img04[i].style.display = "none";
                }
                break;
            case 1:
                game.tutorialOverlay.tutorialPages.childNodes[1].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[3].classList.add("active");
                game.tutorialOverlay.tutorialPages.childNodes[5].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[7].classList.remove("active");
                for (var i = 0; i < game.tutorialOverlay.img01.length; i++) {
                    game.tutorialOverlay.img01[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img02.length; i++) {
                    game.tutorialOverlay.img02[i].style.display = "block";
                }
                for (var i = 0; i < game.tutorialOverlay.img03.length; i++) {
                    game.tutorialOverlay.img03[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img04.length; i++) {
                    game.tutorialOverlay.img04[i].style.display = "none";
                }
                break;
            case 2:
                game.tutorialOverlay.tutorialPages.childNodes[1].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[3].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[5].classList.add("active");
                game.tutorialOverlay.tutorialPages.childNodes[7].classList.remove("active");
                for (var i = 0; i < game.tutorialOverlay.img01.length; i++) {
                    game.tutorialOverlay.img01[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img02.length; i++) {
                    game.tutorialOverlay.img02[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img03.length; i++) {
                    game.tutorialOverlay.img03[i].style.display = "block";
                }
                for (var i = 0; i < game.tutorialOverlay.img04.length; i++) {
                    game.tutorialOverlay.img04[i].style.display = "none";
                }
                break;
            case 3:
                game.tutorialOverlay.tutorialPages.childNodes[1].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[3].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[5].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[7].classList.add("active");
                for (var i = 0; i < game.tutorialOverlay.img01.length; i++) {
                    game.tutorialOverlay.img01[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img02.length; i++) {
                    game.tutorialOverlay.img02[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img03.length; i++) {
                    game.tutorialOverlay.img03[i].style.display = "none";
                }
                for (var i = 0; i < game.tutorialOverlay.img04.length; i++) {
                    game.tutorialOverlay.img04[i].style.display = "block";
                }
                break;
            default:
                // Exit tutorial (aka. start game)
                game.tutorialOverlay.close();
                // Start the game
                game.tutorialOverlay.startGame();
                // Reset the overlay
                game.tutorialOverlay.tutorialPages.childNodes[1].classList.add("active");
                game.tutorialOverlay.tutorialPages.childNodes[3].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[5].classList.remove("active");
                game.tutorialOverlay.tutorialPages.childNodes[7].classList.remove("active");
                break;
        }
    },
    clickMe: () => {
        console.log("Clicked!");
    },
    startGame: () => {
        // If tutorial opened from the play scene...
        if (game.tutorialOverlay.altOpen) {
            // Set the new end time based on time within the tutorial
            game.playTimerBox.startTimerAlternate(Date.now() + (game.playTime - game.tutorialOverlay.orgTimeStart));
            // Reset altOpen
            game.tutorialOverlay.altOpen = false;
            // Refresh the timeout timer
            game.timeoutOverlay.refreshTimer();
            // Display keypads
            game.playLetterSpaces.adjustStyle();
            game.inputKeypad.adjustStyle();
            // Redraw all elements
            game.drawOnce();
        } else {
            // Otherwise, start the game
            console.log("<Game:TutorialOverlay> Transition to the Play Scene");
            // No longer the first play through...
            game.firstPlayThrough = false;
            // Inform Google the user started playing a game
            game.google.start();
            // Set game score to zero
            game.score = 0;
            // Reset the player object
            game.player.reset();
            // Get the current sponsor
            game.getSponsor();
            // Refresh the timeout timer
            game.timeoutOverlay.refreshTimer();
            // Set the new game state to Play Scene
            game.currState = game.gameState[1];
            // Hide all elements
            game.hideElements.hideAll();
            // Reset the keypads
            game.inputKeypad.hideKeypad();
            game.playLetterSpaces.hideKeypad();
            // Redraw all elements
            game.drawOnce();
        }
    },
    tester: (key) => {
        console.log(`Key: ${key}`);
    }
};
game.tutorialOverlay.init(); // Force initialize all event listeners

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
        if (game.word == "") {
            // Set initial words
            this.nextWord();
            this.word();
        } else {
            // Get new word, set current word, and update last word
            this.lastWord();
            this.word();
            this.nextWord();
        }
    },
    // Reset the list of words (difficulty changes)
    reset: function() {
        game.word = "";
        game.nextWord = "";
        game.lastSponsor = "";
        game.sponsor = "";
        game.nextSponsor = "";
        game.sponsorId = "";
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
        }
    }
    // Send a request to PHP for a new word
    ajax.open("GET", "scripts/word_generator.php?d=" + game.difficulty, true);
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
            this.sponsorId = "sponsorTalie";
            this.word = "snacks";
            break;
    }
    // Return the sponsor ID
    return this.sponsorId;
}

async function loadScripts() {
    // Load scripts synchronously
    const scr1 = await $.cachedScript("scripts/scene_start.js").done((script, textStatus) => {
        console.log(`<Game>[Start:Cache] ${textStatus}`);
    });
    const scr2 = await $.cachedScript("scripts/scene_play.js").done((script, textStatus) => {
        console.log(`<Game>[Play:Cache] ${textStatus}`);
    });
    const scr3 = await $.cachedScript("scripts/scene_end.js").done((script, textStatus) => {
        console.log(`<Game>[End:Cache] ${textStatus}`);
    });
    const scr4 = await $.cachedScript("scripts/scene_leaderboard.js").done((script, textStatus) => {
        console.log(`<Game>[Leaderboard:Cache] ${textStatus}`);
    });
    const scr5 = await $.cachedScript("scripts/game_manager.js").done((script, textStatus) => {
        console.log(`<Game>[Game Manager:Cache] ${textStatus}`);
    });
};
loadScripts();
