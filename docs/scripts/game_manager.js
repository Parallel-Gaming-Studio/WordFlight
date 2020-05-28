// JavaScript Document

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

        // Toggle difficulty overlay
        for (var i = 0; i < game.keys.length; i++) {
            if (engine.input.pressed(game.keys[i])) {
                game.difficultyOverlay.tester(`Key: ${game.keys[i]}`);
                if (game.keys[i] == 'O') {
                    game.difficultyOverlay.open();
                } else if (game.keys[i] == 'P') {
                    game.difficultyOverlay.close();
                }
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
            }
        }

        //Toggle tutorial overlay
        for (var i = 0; i < game.keys.length; i++) {
            if (engine.input.pressed(game.keys[i])) {
                game.tutorialOverlay.tester(`Key: ${game.keys[i]}`);
                if (game.keys[i] == 'T') {
                    game.tutorialOverlay.open();
                } else if (game.keys[i] == 'C') {
                    game.tutorialOverlay.close();
                }
                //Refresh timeout
                game.timeoutOverlay.refreshTimer();
            }
        }

        // Toggle next state
        for (var i = 0; i < game.controls.length; i++) {
            if (engine.input.pressed(game.controls[i])) {
                game.playTutorial.play();
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
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
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
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
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
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
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
                // Reset leaderboard table
                game.top10players.hideTable();
                // Update game state to Start Scene
                game.currState = game.gameState[0];
                // Hide all elements
                game.hideElements.hideAll();
                // Refresh timeout
                game.timeoutOverlay.refreshTimer();
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

            // Difficulty Overlay
            this.difficultyOverlay.resize();

            //Tutorial Overlay
            this.tutorialOverlay.resize();
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
            
            // Display Snackbar
            this.playTutorial.draw();
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
            this.leaderboardClipboard.draw();
            this.leaderboardPlayerScore.draw();
            this.leaderboardPlane.draw();
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

// First draw event
window.game.drawOnce();

// Fade out the overlay and spinner
$("#fadeOutLoader").delay(1000).fadeOut(1000);
$("#fadeOutOverlay").delay(1000).fadeOut(1000);

// Run Game
game.run(); // Force game to start on first script load
