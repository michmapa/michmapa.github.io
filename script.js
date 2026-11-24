// =========================================================
// 1. Moving between the title screen and the menu
// =========================================================
const startScreen = document.getElementById('start-screen');
const menuScreen = document.getElementById('menu-screen');

function startGame() {
    startScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    document.body.classList.add('in-menu');      // hides clouds and stars behind the menu
}

function backToTitle() {
    menuScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    document.body.classList.remove('in-menu');
}

// =========================================================
// 2. Switching sections when a menu item is clicked
// =========================================================
function showSection(id, button) {
    // Hide every section
    const panels = document.querySelectorAll('.panel');
    for (const panel of panels) {
        panel.classList.add('hidden');
    }

    // Show only the one that was clicked
    document.getElementById(id).classList.remove('hidden');

    // Move the "active" highlight (and blinking arrows) to the clicked item
    const items = document.querySelectorAll('.menu-item');
    for (const item of items) {
        item.classList.remove('active');
    }
    button.classList.add('active');

    // Scroll the content box back to the top
    document.querySelector('.panel-box').scrollTop = 0;
}

// =========================================================
// 3. Keyboard controls, like a real game
// =========================================================
document.addEventListener('keydown', function (event) {

    // On the title screen, Enter or Space starts the game
    if (!startScreen.classList.contains('hidden')) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startGame();
        }
        return;
    }

    // On the menu screen, the up/down arrows move through the menu
    const items = Array.from(document.querySelectorAll('.menu-item'));
    const current = items.findIndex(item => item.classList.contains('active'));
    let next = current;

    if (event.key === 'ArrowDown') {
        next = (current + 1) % items.length;               // wraps from bottom back to top
    } else if (event.key === 'ArrowUp') {
        next = (current - 1 + items.length) % items.length; // wraps from top to bottom
    } else if (event.key === 'Escape') {
        backToTitle();
        return;
    } else {
        return;   // any other key: do nothing
    }

    event.preventDefault();   // stop the page itself from scrolling
    items[next].click();      // pretend the user clicked that item
});

// =========================================================
// 4. Pixel art drawn from text patterns
//    Each letter in a pattern is one "pixel"; '.' means empty.
// =========================================================
const art = {
    cloud: {
        size: 8,   // each pixel is 8px x 8px
        colours: { W: '#ffffff', L: '#c9b8f0' },
        pattern: [
            '......WWW..........',
            '....WWWWWWW..WWW...',
            '...WWWWWWWWWWWWWWW.',
            '.WWWWWWWWWWWWWWWWWW',
            'WWWWWWWWWWWWWWWWWWW',
            'LLLWWWWLLLLWWWWLLLL',
            '.LLLLLLLLLLLLLLLLL.',
        ],
    },
    star: {
        size: 4,
        colours: { Y: '#ffd34d', W: '#fff6c9' },
        pattern: [
            '...Y...',
            '...Y...',
            '..YWY..',
            'YYWWWYY',
            '..YWY..',
            '...Y...',
            '...Y...',
        ],
    },
};

function drawPixelArt(element, design) {
    const shadows = [];

    // Go through every row (y) and every character in that row (x)
    design.pattern.forEach(function (row, y) {
        for (let x = 0; x < row.length; x++) {
            const colour = design.colours[row[x]];
            if (colour) {
                // One box-shadow per pixel, offset to its position
                shadows.push(`${x * design.size}px ${y * design.size}px 0 ${colour}`);
            }
        }
    });

    // The element itself is one invisible pixel; its shadows draw the picture
    element.style.width = design.size + 'px';
    element.style.height = design.size + 'px';
    element.style.boxShadow = shadows.join(', ');
}

for (const element of document.querySelectorAll('[data-art]')) {
    drawPixelArt(element, art[element.dataset.art]);
}

// =========================================================
// 5. Language stat bars (data-level="3" = 3 of 10 blocks filled)
// =========================================================
for (const bar of document.querySelectorAll('.bar')) {
    const level = Number(bar.dataset.level);

    for (let i = 1; i <= 10; i++) {
        const block = document.createElement('span');
        block.classList.add('block');
        if (i <= level) {
            block.classList.add('filled');
        }
        bar.appendChild(block);
    }
}