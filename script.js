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
    const poemElement = document.getElementById('poem');
    if (poemLines[theme] && poemLines[theme].length > 0) {
        const randomIndex = Math.floor(Math.random() * poemLines[theme].length);
        const [line1] = poemLines[theme][randomIndex];
        poemElement.textContent = `${line1}`;
    } else {
        poemElement.textContent = 'No poems available. Please select a theme.';
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

// Function to download the poem with a background
function handleDownloadButtonClick() {
    const poemContainer = document.getElementById('poem-container');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = poemContainer.offsetWidth;
    const height = poemContainer.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, width, height);

    const text = document.getElementById('poem').textContent;
    context.font = '20px Georgia';
    context.fillStyle = '#333';
    context.fillText(text, 20, 40);

    const link = document.createElement('a');
    link.download = 'poem.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Function to generate random poem cards
function generatePoemCards(poemLines) {
    const container = document.getElementById('poem-cards-container');
    container.innerHTML = ''; // Clear existing cards
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

// Function to download individual poem cards
function downloadCard(poemText) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = 400;
    const height = 200;

    canvas.width = width;
    canvas.height = height;

    // Style for the card
    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, width, height);

    context.font = '16px Georgia';
    context.fillStyle = '#333';
    context.textAlign = 'center';
    context.fillText(poemText, width / 2, height / 2);

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

    // Generate random poem cards
    generatePoemCards(poemLines);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
