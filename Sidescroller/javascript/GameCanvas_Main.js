﻿/// <reference path="physicalobject.js" />
/// <reference path="physicalobject.js" />
'use strict';

var levelRawData;
var levelRowArray;

var backgroundSpeed = -1;
var backgroundPosition = -100;
var frame = 0;

var shift = 0;
var start = false;

var physicalObjectArray = [];

function init() {


    setConfigs();
    fillImages();
	addListener();
    loadLevel('../level/levelOne.txt');
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
        console.log(evt.keyCode);
        if (evt.keyCode == 39) {
            start = true;
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
			levelRowArray = levelRawData.split("\r\n");
			console.log("level loaded");
			createWorldObjects();
			gameLoop();
		}
	}

	xmlhttp.open("GET", levelName, true);
	xmlhttp.send();
}



function update() {
	for (var i = 0; i < physicalObjectArray.length; i++) {
		physicalObjectArray[i].updateObject(shift);
	} 
	frame += 0.1;
}

function draw() {
	ctx.clearRect(0, 0, 1000, 200);
	ctx.drawImage(background, backgroundPosition, 0);
	for (var i = 0; i < physicalObjectArray.length; i++) {
		ctx.drawImage(physicalObjectArray[i].img, physicalObjectArray[i].minX, physicalObjectArray[i].minY);
	} 
}
/* @TODO
 * Die Welt wird akutell komplett gezeichnet, also über das Canvas hinaus
 * sichtbar ist alles was sich innerhalb von 0 <= x <= 1600 && 0 <= y <= 900 befindet 
 * die Variable shift wird bei jedem drücken der links-rechts tasten größer / kleiner um die Welt zu verschieben
 */
function createWorldObjects() {
	for (var y = 0; y < levelRowArray.length; y++) {
		for (var x = 0; x < levelRowArray[y].length; x++) {	
			switch (levelRowArray[y].charAt(x)) { 
				case 'b':
					physicalObjectArray.push(new PhysicalObject(earthBlock, x * blockSizeX + shift, y * blockSizeY + shift, blockSizeX, blockSizeY));
					break;
				case 'f':
					physicalObjectArray.push(new PhysicalObject(grassBlock, x * blockSizeX + shift, y * blockSizeY + shift, blockSizeX, blockSizeY));
					break;
				case 'l':
					physicalObjectArray.push(new PhysicalObject(lava, x * blockSizeX + shift, y * blockSizeY + shift, blockSizeX, blockSizeY));
				default: 
					break;
			}

		}
    }
    if (start == true) {
        shift -= shiftChange;
        playerNotAutoshifting();
    };
        
    
}

function gameLoop() {

    update();
	draw();
    player_loop();
	//timeout muss man wahrscheinlich noch bearbeiten.....
    setTimeout(gameLoop, 1);
}