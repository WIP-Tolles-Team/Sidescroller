﻿var levelRawData;
var levelRowArray;

var backgroundSpeed = 30;
var backgroundPosition = 0;
var frame = 0;

var minimalShift = 0;
var shift = 0;
var start = false;
var win = false;

var physicalObjectArray = [];
var enemyObjectArray = [];

var actualShiftChange;

function init() {
    setConfigs();
    setConfigGameMovingObjects();
    fillImages();
	addListener();
    loadLevel('level/levelOne.txt');
    setPlayerData();
}

function addListener() {
	window.addEventListener('resize', function () {
		//@TODO
		//aktuell Welt und Größen statisch, erfolgt später
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
		
    })
    document.addEventListener('keydown', function (evt) {
        if (evt.keyCode == 39) {
            start = true;
        }
        if (musik == "true") {
            document.getElementById('pirate_music').volume = 0.15;
            document.getElementById('pirate_music').play();
        }
    }, false);
}


function loadLevel(levelName) {
    
	console.log("loadLevel")
	var xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari

	xmlhttp.onreadystatechange = function () {
		console.log("state: " + xmlhttp.readyState + " status: " + xmlhttp.status);

		
		//nachdem das Level geladen ist, beginnt das Spiel (gameloop & draw)
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			levelRawData = xmlhttp.responseText;
			console.log(levelRawData);
			let separator = "\n";
			if (levelRawData.includes("\r\n")) {
				separator = "\r\n";
			} else if (!levelRawData.includes("\n")) {
				separator = "\r";
			}
			levelRowArray = levelRawData.split(separator);
			countBlocksY = levelRowArray.length;
			console.log("levelRowArray:" + levelRowArray.length);
			console.log("level loaded");
			createWorldObjects();
			gameLoop();
		}
	}

	xmlhttp.open("GET", levelName, true);
    xmlhttp.send();
}

var counter = 0;

function update() {

	actualShiftChange = updateShift();
	
	//console.log(shift,main_character.x_position);
	playerNotAutoshifting();
    for (var i = 0; i < physicalObjectArray.length; i++) {
        if (counter++ == 0) {
            console.log("x " + main_character.x_position + " y " + main_character.width)
        }
        physicalObjectArray[i].updateObject(actualShiftChange);
        physicalObjectArray[i].testCollisionPlayer(main_character);
        physicalObjectArray[i].testCollisionEnemy(enemyObjectArray);
    }
    for (var i = 0; i < enemyObjectArray.length; i++) {

        if (enemyObjectArray[i].alive) {
            enemyObjectArray[i].updateObject(actualShiftChange);
            enemyObjectArray[i].testCollisionPlayer(main_character);
        } else {
            enemyObjectArray[i].justShifting(actualShiftChange);
        }
                
    }
    updatePlayer();
}

function updateShift() {
	let pos = main_character.x_position;
	let playerSpeed = main_character.speed;
	if (pos >= 250) {
		let possibleShiftChange = 1 / (750 - 250) * (pos - 250) * playerSpeed;
		shift += possibleShiftChange;
		if (minimalShift - pos < shift + 5) {
			minimalShift += minimalShiftChange;
			return possibleShiftChange;
		}
	}
	minimalShift += minimalShiftChange;
	return minimalShiftChange;

}
function draw() {
	ctx.clearRect(0, 0, 1000, 200);
    ctx.drawImage(background, backgroundPosition, 0);
    drawMovingObjects();
    
    for (var i = 0; i < physicalObjectArray.length; i++) {
        ctx.drawImage(physicalObjectArray[i].img, physicalObjectArray[i].left, physicalObjectArray[i].top, physicalObjectArray[i].right - physicalObjectArray[i].left, physicalObjectArray[i].bottom - physicalObjectArray[i].top);
    }
    for (var i = 0; i < enemyObjectArray.length; i++) {
        enemyObjectArray[i].draw();
    }
    //damit der Pirat nicht gemalt wird wenn man gewonne hat
    if (win) {
        drawWinningScreen();
    } else {
        drawPlayer();
    }
}
/* @TODO
 * Die Welt wird akutell komplett gezeichnet, also über das Canvas hinaus
 * sichtbar ist alles was sich innerhalb von 0 <= x <= 1600 && 0 <= y <= 900 befindet 
 * die Variable shift wird bei jedem drücken der links-rechts tasten größer / kleiner um die Welt zu verschieben
 */
function createWorldObjects() {
	console.log("start creating world")
	console.log(levelRowArray.length);
	for (var y = 0; y < levelRowArray.length; y++) {
		for (var x = 0; x < levelRowArray[y].length; x++) {	
			switch (levelRowArray[y].charAt(x)) { 
				case '1':
					physicalObjectArray.push(new PhysicalObject(sandBlock, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
					break;
				case 'y':
					physicalObjectArray.push(new PhysicalObject(yellowBlock, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
					break;
				case 'e':
					physicalObjectArray.push(new PhysicalObject(endSandBlock, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
					break;
				case 'b':
					physicalObjectArray.push(new PhysicalObject(earthBlock, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
					break;
				case 'f':
					physicalObjectArray.push(new PhysicalObject(grassBlock, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));	
                    break;
                case 'l':
                    physicalObjectArray.push(new PhysicalObject(lava, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
                    break;
                case 's':
                    physicalObjectArray.push(new SpikesObject(spikes, x * blockSizeX, y * blockSizeY, blockSizeX, blockSizeY));
                    break;
                case 'g':
                    enemyObjectArray.push(new MilkBarrelObject(milch_fass_image, x * blockSizeX, (y - 2) * blockSizeY, blockSizeX * 2, blockSizeY * 3, 0, false));
                    break;
                case 'r':
                    enemyObjectArray.push(new MilkBarrelObject(milch_fass_image, x * blockSizeX, (y - 2) * blockSizeY, blockSizeX * 2, blockSizeY * 3, -5, false));
                    break;
                case 'j':
                    enemyObjectArray.push(new MilkBarrelObject(milch_fass_image, x * blockSizeX, (y - 2) * blockSizeY, blockSizeX * 2, blockSizeY * 3, -5, true));
                    break;
                case 'c':
                    enemyObjectArray.push(new CrabObject(crab_image, x * blockSizeX, (y - 1) * blockSizeY, blockSizeX * 3, blockSizeY * 2, -5));
                    break;
                case 'z':
                    physicalObjectArray.push(new GoalObject(goalImage, x * blockSizeX, 0 * blockSizeY, 10 * blockSizeX, (y + 1) * blockSizeY));
                    break;
				default: 
					break;
			}
		}
	}   
	console.log("end creating world");
	console.log(physicalObjectArray.length + " Objects created");
}

function gameLoop() {
    if (start == true) {
        update();
	}    
	//console.log(main_character.y_position);
    draw();   
	//timeout muss man wahrscheinlich noch bearbeiten.....
    if (main_character.alive && !win) {
        setTimeout(gameLoop, 20);
    }
    
}