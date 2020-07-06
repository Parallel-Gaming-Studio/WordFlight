// JavaScript Document

// - Play Scene
//   - Tutorial Snackbar
game.playTutorial = {
    div: document.getElementById("playSnackbar"),
    init: function() {
        game.playTutorial.div.style.display = "block";
        this.div.addEventListener("click", game.tutorialOverlay.openAlternate)
    },
    draw: function() {
        this.div.style.display = "block";
    },
    play: function() {
        game.playTutorial.div.className = "show";
        setTimeout(function(){
            game.playTutorial.div.className = game.playTutorial.div.className.replace("show", "");
        }, 5000);
    }
};
game.playTutorial.init(); // Force the play tutorial snackbar to initialize

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
    org_height: 118 * game.scale,
    width: 0,
    height: 0,
    org_posX: 10,
    org_posY: 10,
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Bottom Side
        this.posX = engine.width - this.width - (50 * engine.preserveAspectRatio);
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side
        this.posX = this.org_posX;
        this.posY = Math.max(engine.height * 0.25, game.playTitle.height + game.playTitle.posY + 40 * engine.preserveAspectRatio);
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
    org_posX: 30,
    org_posY: 0,
    posX: 30,
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
        this.height = game.playLetterSpace.org_height * engine.preserveAspectRatio; // + this.btnMargin;

        // Attach Left Side with Buffer
        this.posX = Math.max(20, Math.min(30, this.org_posX - engine.widthDifference));
        this.posY = Math.max(game.playTimer.height + game.playTimer.posY + 20 * engine.preserveAspectRatio, Math.min(game.inputKeypad.posY - this.height - 40), ((game.inputKeypad.posY - (game.playTimer.height + game.playTimer.posY)) / 2));

        this.btnWidth = (this.width - ((2 * this.btnMargin) + ((this.btnPerRow - 1) * (2 * this.btnMargin)))) / (14) - 2;
        this.btnHeight = this.height; //game.playLetterSpace.height;

		// Adjust styles of every child element
        for (var i = 0; i < this.keyArray.length; i++) {
            var domElement = document.getElementById(this.keyArray[i]);
            domElement.style.display = "inline-block";
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
            
            if (letter == " ") {
                // Open outer div "SPACE"
                buttonBuilder += divPrefix + i + '" class="word-spaces-container" style="width:' + (this.div.width / 12) + 'px;opacity:0.0;">';
                this.lettersFound++;
            } else {
                // Open outer div
                buttonBuilder += divPrefix + i + '" class="word-spaces-container" style="width:' + (this.div.width / 12) + 'px">';
            }

            // Inner Image
            buttonBuilder += btnPrefix + i + '" class="word-spaces-image" src="images/play_scene/play_empty_space.png">';

            if (letter == "-" || letter == "'") {
                // Open inner div with hyphen or apostrophe
                buttonBuilder += innerDivPrefix + i + '" class="word-spaces-center-letter" style="display:block">';
                this.lettersFound++;
            } else {
                // Open inner div
                buttonBuilder += innerDivPrefix + i + '" class="word-spaces-center-letter">';
            }

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
        var increaseBy, decreaseBy, myIndex = 0;
        var foundLetter = false;
		
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

                // Track the number of letters found with this key press
                myIndex++;
                
                // Identify that letters were found
                foundLetter = true;
            }
        }
        
        // Scoring
        if (foundLetter) {
            // Calculate Score
            if (this.lettersFound == this.keyArray.length) {
                // Plane Completion Points
                increaseBy = Math.max(20 - this.keyArray.length, 1) * 4 * myIndex;
                increaseBy += Math.max(20 - this.keyArray.length, 1) * 12;
                
                // Points Indicator
                game.playScoreBox.updateScore("Plane", increaseBy);
            } else {
                // Letter(s) Found Points
                increaseBy = Math.max(20 - this.keyArray.length, 1) * 4 * myIndex;
                
                // Points Indicator
                game.playScoreBox.updateScore("Letter", increaseBy);
            }
            // Increase Score
            game.score += increaseBy;

            // Update the scoreboard
            game.playScore.updateScore();
        } else {
            // If the player guesses incorrectly, decrease the score (floor: 0)
            decreaseBy = Math.floor(Math.max(20 - this.keyArray.length, 1) * -1.5);
            decreaseBy = ((game.score + decreaseBy) < 0) ? (game.score * -1) : decreaseBy;
            
            // Points Indicator
            game.playScoreBox.updateScore("Letter", decreaseBy);
            
            // Decrease Score
            game.score += decreaseBy;
            
            // Update the score
            game.playScore.updateScore();
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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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
        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

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

        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * engine.preserveAspectRatio;
        this.posY = game.playTimer.posY + this.org_posY * engine.preserveAspectRatio;

        // Adjust font size
        this.font_size = this.org_font_size * engine.preserveAspectRatio;
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
    startTimerAlternate: function (newTime) {
        // Update the new end time
        this.timeEnd = newTime;
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

        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * engine.preserveAspectRatio;
        this.posY = game.playTimer.posY + this.org_posY * engine.preserveAspectRatio;

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

        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side
        this.posX = game.playTimer.posX + this.org_posX * engine.preserveAspectRatio;
        this.posY = game.playTimer.posY - this.org_posY * engine.preserveAspectRatio;

        // Adjust font size
        this.font_size = this.org_font_size * engine.preserveAspectRatio;

        // Animation adjustments
        this.animStartX = game.playTimer.posX + this.org_posX * engine.preserveAspectRatio;
        this.animStartY = game.playTimer.posY - this.org_posY * engine.preserveAspectRatio;
        this.animEndX = game.playTimer.posX + this.org_destX * engine.preserveAspectRatio;
        this.animEndY = game.playTimer.posY - this.org_destY * engine.preserveAspectRatio;

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
    org_posY: 50,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * engine.preserveAspectRatio;
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Top-Right Side
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

        this.width = this.org_width * engine.preserveAspectRatio; //Math.min(, (this.org_width + 5) * 13);
        this.height = this.org_height * engine.preserveAspectRatio;

        // Attach Left Side with Buffer
        this.posX = Math.max(60, Math.min(40, this.org_posX - engine.widthDifference));
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
    org_posX: 30,
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
                this.height = (game.playKeyPadSpace.org_height * engine.preserveAspectRatio + this.btnMargin * 4) * 2;

                // Attach Left Side with Buffer
                this.posX = Math.max(20, Math.min(30, this.org_posX - engine.widthDifference));
                this.posY = engine.height - this.height - 50 * engine.preserveAspectRatio;

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