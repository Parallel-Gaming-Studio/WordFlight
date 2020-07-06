// JavaScript Document

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = engine.width - (3000 * engine.preserveAspectRatio);
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
    org_posY: 50,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = 20;
        this.posY = Math.max(40, Math.min(50, this.org_posY * engine.preserveAspectRatio));
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
        this.width = this.org_width * .90 * engine.preserveAspectRatio;
        this.height = this.org_height * .90 * engine.preserveAspectRatio;
        this.posX = engine.width - this.width - (375 * engine.preserveAspectRatio);
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = 10 * engine.preserveAspectRatio;
        this.posY = 230 * engine.preserveAspectRatio;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

/*game.leaderboardSponsor = {
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = engine.width - this.width - (50 * engine.preserveAspectRatio);
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
};*/

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
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.finalPlayerScore.clickMe);
    },
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side
        this.posX = game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width / 2 - this.width / 2;
        this.posY = game.leaderboardPlayerScore.posY + game.leaderboardPlayerScore.height / 2 - this.height / 2;

        // Adjust font size
        this.font_size = this.org_font_size * engine.preserveAspectRatio;
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
    },
	// Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
    }
};
game.finalPlayerScore.init(); // Force object initialization on first script load

//LeaderboardAnimation
game.leaderboardAnimation = {
    animStartX: game.leaderboardPlane.posX,
    animEndX: engine.width - (2300 * engine.preserveAspectRatio),
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
        /*game.leaderboardSponsor.draw();
        game.leaderboardSponsorLogo.draw();*/
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
        this.animEndX = engine.width - (2300 * engine.preserveAspectRatio);
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
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.top10players.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = game.leaderboardClipboard.width * .80;
        this.height = game.leaderboardClipboard.height - 280 * engine.preserveAspectRatio;

        // Attach Left Side with Buffer
        this.posX = game.leaderboardClipboard.posX + (game.leaderboardClipboard.width - this.width) / 2;
        this.posY = game.leaderboardClipboard.posY + 250 * engine.preserveAspectRatio;
            // game.leaderboardClipboard.height / 2 - (this.height * .28);

        // Update font size
        this.font_size = this.org_font_size * engine.preserveAspectRatio;
        
        // Update CSS for all children
        $("#lbContainerDiv").width(this.width);
        
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
        var divPrefix = '<div id="lbContainerDiv';
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

                //open div
                tableBuilder += divPrefix + place + '" class="table-container" style="width:' + (game.top10players.width) + 'px">';
                
                for (var i = 0; i < leaders.length; i++) {
                    place = i + 1;

                    placeHolder = leaders[i].user.toString();
                    scoreHolder = leaders[i].score.toString();

                    if (game.player.initials.toString() == placeHolder && game.player.score.toString() == scoreHolder) {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + " style='background-color: #f41c63;'>" + place + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + leaders[i].user + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + scoreHolder + "</td></tr>";
                    } else {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + ">" + place + "</td>" + dataPrefix + ">" + leaders[i].user + "</td>" + dataPrefix + ">" + scoreHolder + "</td></tr>";
                    }

                }
                //close table
                tableBuilder += "</table>"

                //close div
                tableBuilder += "</div>";

                game.top10players.divArray.push("lbContainerDiv");
                game.top10players.div.innerHTML = tableBuilder;
                
                // Disable extra queries
                game.top10players.tableBuilt = true;
            }
        }
    },
	// Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
    }
};
game.top10players.init(); // Force object initialization on first script load

//   - Buttons
game.leaderboardMenuButton = {
	// Get handle to image
    image: document.getElementById("wordFlightMenuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    org_posY: 50,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = engine.width - this.width;
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference));
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;
        this.posX = 100 * engine.preserveAspectRatio;
        this.posY = engine.height - this.height - (50 * engine.preserveAspectRatio);
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
        game.currState = game.gameState[0];
        // Reset the player object
        game.player.reset();
        // Reset leaderboard table
        game.top10players.hideTable();
        // Reset plane animation
        game.leaderboardAnimation.resetElements();
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
        // Hide all elements
		game.hideElements.hideAll();
        // Redraw all elements
		game.drawOnce();
        // Show the difficulty overlay before starting
        game.difficultyOverlay.open();
    }
};
game.leaderboardRetryButton.init(); // Force initialize object on first script load