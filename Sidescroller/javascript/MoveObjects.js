﻿var canvasWidth;

// Damit dies wirklich funnktioniert, muss StartX beim Aufruf durch eine Variable erfolgen.
// Dieser Variablen muss auch jedes mal das Ergebnis dieser Funktion zugewiesen werden. Siehe Bsp. unten.
//  startXCloudTwo = paintMovingObject(startXCloudTwo, startYCloudTwo, wolkenformatZwei, startXCloudTwoCopy, shiftCloudTwo);
function paintMovingObject(startX, startY, objectImage, startXCopy, speed) {
    canvasWidth = countBlocksX * blockSizeX;
    ctx.drawImage(objectImage, startX, startY);

    if ((startX + objectImage.width) >= canvasWidth) {
        startXCopy = startX - canvasWidth;
        ctx.drawImage(objectImage, startXCopy, startY);
        if (startX >= 1600) {
            startX = startXCopy;
        }
    }
    startX += speed;
    return startX;
}