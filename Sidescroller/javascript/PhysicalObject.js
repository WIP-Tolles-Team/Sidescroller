﻿class PhysicalObject extends Image{


	constructor(img, minX, minY, width, height) {
		super();
		this.img = img;
		this.minX = minX;
		this.minY = minY;
		this.maxX = minX + width;
		this.maxY = minY + height;
		console.log(this.img.src + ": 1(" + this.minX + " | " + this.minY + ")" + " 2(" + this.minY + " | " + this.minY + ")" + " 3(" + this.minY + " | " + this.maxX + ")" + " 4(" + this.maxX + " | " + this.maxX + ")");

	} 

	updateObject(shift) {
		this.minX += shift;
		this.maxX += shift;

	}
	/*main_character = {
		height: 0,
		width: 0,
		y_position: 0,
		x_position: 0,
		speed: 0,
		jumpingpower: 0,
		jumping: false
	}'*/

	testCollision(object) {
		var objectMinX = object.x_position;
		var objectMinY = object.y_position;
		var objectMaxX = object.x_position + width;
		var objectMaxY = object.y_position + height;
		//test fromAbove
	
	}

	fromAbove() {

	}

	fromSide() {

	}

	bottomUp
	

	

}