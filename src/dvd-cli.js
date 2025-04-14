#!/usr/bin/env node

/*
dvd-cli made by @douxxtech
npmjs.com/package/dvd-cli
github.com/douxxtech/dvd-cli

Licensed under GPL-3.0

*/

const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');

const dvdLogo = [
    "⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⡀",
    "⠀⢠⣿⣿⡿⠀⠀⠈⢹⣿⣿⡿⣿⣿⣇⠀⣠⣿⣿⠟⣽⣿⣿⠇⠀⠀⢹⣿⣿⣿",
    "⠀⢸⣿⣿⡇⠀⢀⣠⣾⣿⡿⠃⢹⣿⣿⣶⣿⡿⠋⢰⣿⣿⡿⠀⠀⣠⣼⣿⣿⠏",
    "⠀⣿⣿⣿⣿⣿⣿⠿⠟⠋⠁⠀⠀⢿⣿⣿⠏⠀⠀⢸⣿⣿⣿⣿⣿⡿⠟⠋⠁⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣸⣟⣁⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⣠⣴⣶⣾⣿⣿⣻⡟⣻⣿⢻⣿⡟⣛⢻⣿⡟⣛⣿⡿⣛⣛⢻⣿⣿⣶⣦⣄⡀⠀",
    "⠉⠛⠻⠿⠿⠿⠷⣼⣿⣿⣼⣿⣧⣭⣼⣿⣧⣭⣿⣿⣬⡭⠾⠿⠿⠿⠛⠉⠀"
];

//logo dims
const logoHeight = dvdLogo.length;
const logoWidth = dvdLogo[0].length;

let posX = 0;
let posY = 1;
let dirX = 1;
let dirY = 1;

//stats
let bounceCount = 0;
let startTime = Date.now();
let distanceTraveled = 0;
let fps = 0;
let frameCount = 0;
let lastFrameTime = Date.now();

//ansi colors
const colors = [
    "\x1b[31m",
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m"
];

//banner colors
const bannerBg = "\x1b[44m";
const bannerFg = "\x1b[97m";

let currentColor = colors[Math.floor(Math.random() * colors.length)];
const resetColor = "\x1b[0m";

let animationInterval = null;

const args = process.argv.slice(2);
let commandToExecute = null;
let customSpeed = null;
let showBanner = true;
let showUser = true;
let monochromeMode = false;
let customTitle = null;
let customRows = null;
let customCols = null;
let invertColors = false;
let fireworksMode = false;
let slowMode = false;
let fastMode = false;
let explosionMode = false;
let debugMode = false;
let statsFile = null;

const argDefinitions = [
    { short: '-c', long: '--command', hasValue: true, description: 'Execute a command when the logo hits the perfect corner' },
    { short: '-s', long: '--speed', hasValue: true, description: 'Set a custom speed for the animation (in ms)' },
    { short: '-b', long: '--no-banner', hasValue: false, description: 'Disable the banner' },
    { short: '-u', long: '--no-user', hasValue: false, description: 'Hide the current user in the banner' },
    { short: '-m', long: '--monochrome', hasValue: false, description: 'Enable monochrome mode (no colors)' },
    { short: '-t', long: '--title', hasValue: true, description: 'Set a custom title for the banner' },
    { short: '-r', long: '--rows', hasValue: true, description: 'Set a custom number of rows for the terminal' },
    { short: '-w', long: '--cols', hasValue: true, description: 'Set a custom number of columns for the terminal' },
    { short: '-i', long: '--invert', hasValue: false, description: 'Invert the colors of the logo' },
    { short: '-f', long: '--fireworks', hasValue: false, description: 'Enable fireworks mode (random colors every frame)' },
    { short: '-l', long: '--slow', hasValue: false, description: 'Enable slow mode (halve the animation speed)' },
    { short: '-a', long: '--fast', hasValue: false, description: 'Enable fast mode (double the animation speed)' },
    { short: '-e', long: '--explosion', hasValue: false, description: 'Enable explosion mode (explosion effect on collision)' },
    { short: '-d', long: '--debug', hasValue: false, description: 'Enable debug mode (show debug information) (laggy)' },
    { short: '-o', long: '--output', hasValue: true, description: 'Save statistics to a file' },
    { short: '-h', long: '--help', hasValue: false, description: 'Show this help message' }
];

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const definition = argDefinitions.find(def => def.short === arg || def.long === arg);
    if (definition) {
        if (definition.hasValue && i + 1 < args.length) {
            switch (definition.short) {
                case '-c':
                    commandToExecute = args[++i];
                    break;
                case '-s':
                    customSpeed = parseInt(args[++i], 10);
                    break;
                case '-t':
                    customTitle = args[++i];
                    break;
                case '-r':
                    customRows = parseInt(args[++i], 10);
                    break;
                case '-w':
                    customCols = parseInt(args[++i], 10);
                    break;
                case '-o':
                    statsFile = args[++i];
                    break;
            }
        } else {
            switch (definition.short) {
                case '-b':
                    showBanner = false;
                    break;
                case '-u':
                    showUser = false;
                    break;
                case '-m':
                    monochromeMode = true;
                    break;
                case '-i':
                    invertColors = true;
                    break;
                case '-f':
                    fireworksMode = true;
                    break;
                case '-l':
                    slowMode = true;
                    break;
                case '-a':
                    fastMode = true;
                    break;
                case '-e':
                    explosionMode = true;
                    break;
                case '-d':
                    debugMode = true;
                    break;
                case '-h':
                    showHelp();
                    process.exit(0);
            }
        }
    }
}

if (statsFile && !showBanner) {
    console.error('--stats isn\'t compatible with --no-banner, sorry ;)');
    process.exit(1);
}


function clearScreen() {
    process.stdout.write("\x1b[2J");
    process.stdout.write("\x1b[0;0H");
}

function getTerminalSize() {
    return {
        width: customCols || process.stdout.columns || 80,
        height: customRows || process.stdout.rows || 24
    };
}

// the more a term is big, the faster is the dvd going to move
function calculateSpeed() {
    const { width, height } = getTerminalSize();
    const terminalArea = width * height;

    // Reference values
    const minArea = 500;    //small terminal size
    const maxArea = 10000;  //large terminal size
    const slowSpeed = 150;  //slow speed (ms)
    const fastSpeed = 30;   //fast speed (ms)

    let speed = slowSpeed - ((terminalArea - minArea) / (maxArea - minArea)) * (slowSpeed - fastSpeed);

    speed = Math.max(fastSpeed, Math.min(slowSpeed, speed));

    return Math.floor(speed);
}

function getCurrentUser() {
    return os.userInfo().username;
}

function drawBanner() {
    if (!showBanner) return;

    const { width } = getTerminalSize();
    const runTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(runTime / 60);
    const seconds = runTime % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const currentTime = Date.now();
    const elapsed = (currentTime - lastFrameTime) / 1000;
    if (elapsed > 1) {
        fps = Math.round(frameCount / elapsed);
        frameCount = 0;
        lastFrameTime = currentTime;
    }

    const speedSection = `SPEED: ${customSpeed || calculateSpeed()}ms`;
    const timeSection = `TIME: ${formattedTime}`;
    const fpsSection = `FPS: ${fps}`;
    const userSection = showUser ? `USER: ${getCurrentUser()}` : '';
    const titleSection = customTitle ? `TITLE: ${customTitle}` : '';
    const commandSection = commandToExecute ? `CMD: ${commandToExecute}` : '';

    const stats = ` ${speedSection} | ${timeSection} | ${fpsSection} ${userSection ? '| ' + userSection : ''} ${titleSection ? '| ' + titleSection : ''} ${commandSection ? '| ' + commandSection : ''} `;

    const padding = Math.max(0, Math.floor((width - stats.length) / 2));
    const banner = ' '.repeat(padding) + stats + ' '.repeat(Math.max(0, width - stats.length - padding));

    //draw the banner
    process.stdout.write("\x1b[1;1H"); //moves cursor to top left   
    process.stdout.write(bannerBg + bannerFg + banner + resetColor);

    if (statsFile) {
        fs.appendFileSync(statsFile, `${stats}\n`);
    }
}

function drawDVD() {
    const { width, height } = getTerminalSize();

    if (logoWidth > width || logoHeight > height - 1) {
        console.error("The terminal is too small to display the logo.");
        process.exit(1);
    }

    const buffer = Array(height).fill().map(() => Array(width).fill(' '));

    for (let y = 0; y < logoHeight; y++) {
        for (let x = 0; x < logoWidth; x++) {
            const termY = posY + y;
            const termX = posX + x;

            if (termY >= 1 && termY < height && termX >= 0 && termX < width) {
                buffer[termY][termX] = dvdLogo[y][x];
            }
        }
    }

    for (let y = 1; y < height; y++) {
        process.stdout.write("\x1b[" + (y + 1) + ";1H");
        process.stdout.write((monochromeMode ? resetColor : (invertColors ? resetColor : currentColor)) + buffer[y].join('') + resetColor);
    }

    frameCount++;
}

function update() {
    const { width, height } = getTerminalSize();

    const oldX = posX;
    const oldY = posY;

    posX += dirX;
    posY += dirY;

    distanceTraveled += Math.sqrt(Math.pow(posX - oldX, 2) + Math.pow(posY - oldY, 2));

    let hasCollided = false;

    if (posX <= 0) {
        dirX = 1;
        posX = 0;
        hasCollided = true;
    } else if (posX + logoWidth >= width) {
        dirX = -1;
        posX = width - logoWidth;
        hasCollided = true;
    }

    if (posY <= 1) {
        dirY = 1;
        posY = 1;
        hasCollided = true;
    } else if (posY + logoHeight >= height) {
        dirY = -1;
        posY = height - logoHeight;
        hasCollided = true;
    }

    //change logo color on collision
    if (hasCollided && !monochromeMode) {
        bounceCount++;

        let newColorIndex;
        do {
            newColorIndex = Math.floor(Math.random() * colors.length);
        } while (colors[newColorIndex] === currentColor);

        currentColor = colors[newColorIndex];
    }

    //check if its a perfect bounce (logo in the corner)
    if (posX === 0 && posY === 1 && commandToExecute) {
        exec(commandToExecute, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                return;
            }
            console.log(`Command output: ${stdout}`);
        });
    }

    if (fireworksMode) {
        currentColor = colors[Math.floor(Math.random() * colors.length)];
    }

    if (explosionMode && hasCollided) {
        explode();
    }

    if (debugMode) {
        console.log(`Pos: (${posX}, ${posY}), Dir: (${dirX}, ${dirY}), Bounces: ${bounceCount}, Distance: ${distanceTraveled.toFixed(2)}px`);
    }
}

function adjustSpeed() {
    let speed = customSpeed || calculateSpeed();

    if (slowMode) {
        speed *= 2;
    }

    if (fastMode) {
        speed /= 2;
    }

    if (animationInterval !== null) {
        clearInterval(animationInterval);
    }

    animationInterval = setInterval(() => {
        update();
        drawDVD();
        drawBanner();
    }, speed);

    return speed;
}

//to handle term resize
process.stdout.on('resize', () => {
    const { width, height } = getTerminalSize();

    if (posX + logoWidth >= width) {
        posX = width - logoWidth - 1;
    }

    if (posY + logoHeight >= height) {
        posY = height - logoHeight - 1;
    }

    if (posY < 1) {
        posY = 1;
    }

    adjustSpeed();

    clearScreen();
    drawBanner();
    drawDVD();
});

//explosion effect, tho i'm not a big fan of it, maybe going to redo it
let explosionFrames = 0;
const maxExplosionFrames = 5;

function explode() {
    const { width, height } = getTerminalSize();
    const explosionRadius = 5;
    const explosionChars = ['*', '+', '.', ':', '*'];
    const explosionColors = ['\x1b[31m', '\x1b[33m', '\x1b[32m', '\x1b[34m', '\x1b[35m', '\x1b[36m'];

    explosionFrames = maxExplosionFrames;

    const explosionInterval = setInterval(() => {
        if (explosionFrames <= 0) {
            clearInterval(explosionInterval);
            return;
        }

        for (let y = -explosionRadius; y <= explosionRadius; y++) {
            for (let x = -explosionRadius; x <= explosionRadius; x++) {
                const termY = posY + y;
                const termX = posX + x;

                if (termY >= 1 && termY < height && termX >= 0 && termX < width) {
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance <= explosionRadius) {
                        const color = explosionColors[Math.floor(Math.random() * explosionColors.length)];
                        process.stdout.write("\x1b[" + (termY + 1) + ";" + (termX + 1) + "H");
                        process.stdout.write(color + explosionChars[Math.floor(Math.random() * explosionChars.length)] + resetColor);
                    }
                }
            }
        }

        explosionFrames--;
    }, 100);
}

process.stdout.write("\x1b[?25l"); //hides the cursor
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

// handle clean exit otherwise it break ur terminal
process.stdin.on('data', (key) => {
    if (key === '\u0003' || key === 'q') { //\u0003 is ^C
        if (animationInterval !== null) {
            clearInterval(animationInterval);
        }
        process.stdout.write("\x1b[?25h"); //shows the cursor
        process.stdout.write(resetColor);
        clearScreen();
        process.exit(0);
    }
});

function generateHelpMessage() {
    let helpMessage = `
ASCII DVD Bouncer

Usage: dvd-cli [options]

Options:
`;

    argDefinitions.forEach(def => {
        helpMessage += `  ${def.short}, ${def.long.padEnd(20)} ${def.description}\n`;
    });

    helpMessage += `
Example:
  dvd-cli --command "echo Hello" --speed 50 --no-banner --no-user --monochrome --title "My Title" --rows 30 --cols 100 --invert --fireworks --slow --fast --explosion --debug --output stats.txt
    `; //huge W to 'lechat' that has generated me this thing in 0.5 second

    return helpMessage;
}

function showHelp() {
    console.log(generateHelpMessage());
}

adjustSpeed();
clearScreen();
drawBanner();