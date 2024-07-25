// Function to fetch poem data from the JSON file
async function loadPoemLines() {
    try {
      const response = await fetch('poemLines.json'); // Fetch the JSON file
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json(); // Parse and return JSON data
    } catch (error) {
      console.error('Error fetching the poem lines:', error);
      return {}; // Return an empty object in case of error
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
      // Randomly select a line pair from the theme
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
    if (!isPinned) {
      displayPoem(poemLines, theme);
    }
  }
  
  // Function to handle refresh button click
  function handleRefreshButtonClick() {
    const themeSelect = document.getElementById('theme');
    const selectedTheme = themeSelect.value;
    if (selectedTheme) {
      displayPoem(poemLines, selectedTheme);
    }
  }
  
  // Function to handle pin button click
  function handlePinButtonClick() {
    isPinned = !isPinned;
    const pinButton = document.getElementById('pin-button');
    pinButton.textContent = isPinned ? 'Unpin Poem' : 'Pin Poem';
  }
  
  // Main function to initialize the page
  let poemLines = {}; // Declare poemLines globally to access in handleThemeChange
  let isPinned = false; // Track whether the poem is pinned
  
  async function init() {
    poemLines = await loadPoemLines(); // Load poem lines from JSON
    populateThemeOptions(poemLines); // Populate dropdown with themes
  
    // Event listener to update poem display when theme is changed
    document.getElementById('theme').addEventListener('change', handleThemeChange);
  
    // Event listener for the refresh button
    document.getElementById('refresh-button').addEventListener('click', handleRefreshButtonClick);
  
    // Event listener for the pin button
    document.getElementById('pin-button').addEventListener('click', handlePinButtonClick);
  }
  
  // Initialize the page when the document is fully loaded
  document.addEventListener('DOMContentLoaded', init);
  