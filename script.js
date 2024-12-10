// script.js
// Function to fetch poem data from the JSON file
async function loadPoemLines() {
    try {
        const response = await fetch('poemLines.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching the poem lines:', error);
        return {};
    }
}

// Function to populate the theme dropdown
function populateThemeOptions(themes) {
    const themeSelect = document.getElementById('theme');
    for (const theme in themes) {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        themeSelect.appendChild(option);
    }
}

// Function to display the poem based on the selected theme
function displayPoem(poemLines, theme) {
	const poemElement = document.getElementById("poem");
	const downloadButton = document.getElementById("download-button");

	if (poemLines[theme] && poemLines[theme].length > 0) {
		const randomIndex = Math.floor(Math.random() * poemLines[theme].length);
		const [line1] = poemLines[theme][randomIndex];
		poemElement.textContent = `${line1}`;
		downloadButton.disabled = false;
	} else {
		poemElement.textContent = "No poems available. Please select a theme.";
		downloadButton.disabled = true;
	}
}

// Function to handle theme selection
function handleThemeChange(event) {
    const theme = event.target.value;
    displayPoem(poemLines, theme);
}

// Function to handle refresh button click
function handleRefreshButtonClick() {
    const themeSelect = document.getElementById('theme');
    const selectedTheme = themeSelect.value;
    if (selectedTheme) {
        displayPoem(poemLines, selectedTheme);
    }
}

// Function to download the poem with the selected background
function handleDownloadButtonClick() {
    const poemContainer = document.getElementById('poem-container');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to match container
    const width = poemContainer.offsetWidth;
    const height = poemContainer.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Apply current background and text color
    const isDarkMode = poemContainer.classList.contains('dark-mode');
    context.fillStyle = isDarkMode ? '#333' : '#f9f9f9';
    context.fillRect(0, 0, width, height);

    const text = document.getElementById('poem').textContent.trim();
    const maxWidth = width * 0.8;
    const lineHeight = 24;
    const fontSize = 20;
    context.font = `${fontSize}px Georgia`;
    context.fillStyle = isDarkMode ? '#f9f9f9' : '#333';
    context.textAlign = 'center';

    // Function to calculate total text height
    function calculateTextHeight(text, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        words.forEach((word) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth && line.length > 0) {
                line = word + ' ';
                lineCount++;
            } else {
                line = testLine;
            }
        });

        if (line.length > 0) lineCount++;
        return lineCount * lineHeight;
    }

    // Function to wrap and draw text
    function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth && line.length > 0) {
                context.fillText(line.trim(), x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }

            if (index === words.length - 1) {
                context.fillText(line.trim(), x, y);
            }
        });
    }

    // Calculate the total text height
    const textHeight = calculateTextHeight(text, maxWidth, lineHeight);

    // Determine the starting Y-coordinate to vertically center the text block
    const startY = (height - textHeight) / 2;

    // Draw the wrapped and centered text
    wrapText(text, width / 2, startY, maxWidth, lineHeight);

    // Create and trigger download
    const link = document.createElement('a');
    link.download = 'poem.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Function to toggle between light and dark backgrounds
function toggleBackground() {
    const poemContainer = document.getElementById('poem-container');
    const toggleButton = document.getElementById('background-toggle');

    // Toggle classes for dark/light mode
    poemContainer.classList.toggle('dark-mode');
    const isDarkMode = poemContainer.classList.contains('dark-mode');

    // Update button text
    toggleButton.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    // Apply corresponding styles
    poemContainer.style.backgroundColor = isDarkMode ? '#333' : '#f9f9f9';
    poemContainer.style.color = isDarkMode ? '#f9f9f9' : '#333';
}

// Function to generate random poem cards
function generatePoemCards(poemLines) {
    const container = document.getElementById('poem-cards-container');
    container.innerHTML = '';
    const themes = Object.keys(poemLines);

    for (let i = 0; i < 6; i++) {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const randomIndex = Math.floor(Math.random() * poemLines[randomTheme].length);
        const poemLine = poemLines[randomTheme][randomIndex][0];

        // Create card
        const card = document.createElement('div');
        card.className = 'poem-card';

        // Add content
        const cardText = document.createElement('p');
        cardText.textContent = `"${poemLine}"`;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => downloadCard(poemLine));

        card.appendChild(cardText);
        card.appendChild(downloadButton);
        container.appendChild(card);
    }
}

// Function to download individual poem cards with wrapped and centered text
function downloadCard(poemText) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = 400;
    const height = 200;
    const padding = 20; 

    canvas.width = width;
    canvas.height = height;

    // Style for the card
    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, width, height);

    context.font = '15px Georgia';
    context.fillStyle = '#333'; 
    context.textAlign = 'center';

    const maxWidth = width - padding * 2;
    const lineHeight = 20;
    const x = width / 2;

    // Function to calculate the total height of the text block
    function calculateTextHeight(context, text, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        words.forEach((word) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth && line.length > 0) {
                line = word + ' ';
                lineCount++;
            } else {
                line = testLine;
            }
        });

        // Add the last line
        if (line.length > 0) lineCount++;

        return lineCount * lineHeight;
    }

    // Function to wrap and draw the text
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth && line.length > 0) {
                context.fillText(line.trim(), x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }

            if (index === words.length - 1) {
                context.fillText(line.trim(), x, y);
            }
        });
    }

    // Calculate total text height for centering
    const textHeight = calculateTextHeight(context, poemText, maxWidth, lineHeight);
    const startY = (height - textHeight) / 2;

    // Draw the wrapped and centered text
    wrapText(context, poemText, x, startY, maxWidth, lineHeight);

    // Create and trigger download
    const link = document.createElement('a');
    link.download = 'poem-card.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Main function to initialize the page
let poemLines = {};
async function init() {
    poemLines = await loadPoemLines();
    populateThemeOptions(poemLines);

    document.getElementById('theme').addEventListener('change', handleThemeChange);
    document.getElementById('refresh-button').addEventListener('click', handleRefreshButtonClick);
    document.getElementById('download-button').addEventListener('click', handleDownloadButtonClick);

    // Add background toggle button listener
    document.getElementById('background-toggle').addEventListener('click', toggleBackground);

    // Generate random poem cards
    generatePoemCards(poemLines);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
