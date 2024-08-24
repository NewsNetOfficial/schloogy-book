// Array of searchable terms
let searchable = [
  'Schloogy',
  'Hoppy',
  'Boem',
  'Boemba',
  'Boemy',
  'Skib',
  'Swipe',
  'Sickness',
  'Sancaronies',
  'Drerrieguy',
  'Knuist',
  'Glitch',
  'Blauw',
  'Swipetrooper',
];

// Get references to search elements
const searchInput = document.getElementById('search');
const searchWrapper = document.querySelector('.search-wrapper');
const resultsWrapper = document.querySelector('.results');
const resultsList = document.querySelector('.results ul');

// Variable to track the currently selected index
let currentIndex = -1;

// Handle search input
searchInput.addEventListener('keyup', (event) => {
  let results = [];
  let input = searchInput.value.trim().toLowerCase();

  // Filter searchable items based on input (only show results that start with the input)
  if (input.length) {
    results = searchable.filter((item) => {
      return item.toLowerCase().startsWith(input);
    });
  }
  renderResults(results, input);

  // Handle key navigation if the input is not empty
  if (event.key === 'ArrowDown') {
    navigateResults(1);
  } else if (event.key === 'ArrowUp') {
    navigateResults(-1);
  } else if (event.key === 'Enter') {
    selectResult();
  }
});

// Render search results
function renderResults(results, input) {
  if (!results.length) {
    resultsWrapper.style.display = 'none';
    resultsList.innerHTML = '';
    currentIndex = -1; // Reset the index when there are no results
    return;
  }

  const inputColor = getComputedStyle(searchInput).color;
  const lowerInput = input.toLowerCase(); // Convert input to lowercase
  
  // Get the current directory
  const currentDirectory = window.location.pathname.split('/').pop();

  // Determine the base URL based on the current directory
  const baseURL = currentDirectory === 'woordenboek'
    ? ''
    : 'woordenboek/';

  const content = results
    .map((item) => {
      const lowerItem = item.toLowerCase(); // Convert each item to lowercase
      const regex = new RegExp(`^(${lowerInput})`, 'i'); // Regex to find the input at the start of the item

      // Highlight the input match in the lowercase item
      const highlightedItem = lowerItem.replace(regex, (match) => 
        `<span style="font-weight: bold; color: ${inputColor};">${match}</span>`
      );

      // Capitalize the first letter of the item for display purposes
      const capitalizedItem = lowerItem.charAt(0).toUpperCase() + lowerItem.slice(1);

      // Determine the URL path
      const itemUrl = `${baseURL}${lowerItem}.html`;

      return `<a href="../schloogy-book/woordenboek/${lowerItemUrl}.html"><li>${capitalizedItem.replace(regex, (match) => 
        `<span style="font-weight: bold; color: ${inputColor};">${match}</span>`
      )}</li></a>`;
    })
    .join('');

  resultsWrapper.style.display = 'block';
  resultsList.innerHTML = content;
  currentIndex = -1; // Reset the index when results are rendered
}





// Navigate through results using arrow keys
function navigateResults(direction) {
  const items = resultsList.querySelectorAll('li');
  if (items.length === 0) return;

  // Remove active class from the currently selected item
  if (currentIndex >= 0) {
    items[currentIndex].classList.remove('autocomplete-active');
  }

  // Update the current index
  currentIndex = (currentIndex + direction + items.length) % items.length;

  // Add active class to the newly selected item
  items[currentIndex].classList.add('autocomplete-active');
}

// Select the current result
function selectResult() {
  const items = resultsList.querySelectorAll('li');
  if (currentIndex >= 0 && currentIndex < items.length) {
    const selectedItem = items[currentIndex].textContent;
    searchInput.value = selectedItem;
    resultsWrapper.style.display = 'none';
    currentIndex = -1; // Reset the index after selection
  }
}

// Function to handle sound button click
function handleSoundButtonClick(soundButton, uitspraakSound) {
  const soundSrc = soundButton.getAttribute('data-sound');

  // Check if a new sound is selected
  if (uitspraakSound.src !== soundSrc) {
    uitspraakSound.src = soundSrc;
  }

  if (uitspraakSound.paused) {
    uitspraakSound.play().catch((error) => {
      console.error("Error playing audio: ", error);
    });
    soundButton.classList.add('active');
    soundButton.style.backgroundImage = "url('../icons/onsound.png')";
  } else {
    uitspraakSound.pause();
    uitspraakSound.currentTime = 0; // Reset sound to start
    soundButton.classList.remove('active');
    soundButton.style.backgroundImage = "url('../icons/offsound.png')";
  }
}

// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const soundButton = document.querySelector('.soundbutton');
  const uitspraakSound = document.getElementById('uitspraak');
  const pageIdentifier = document.body.getAttribute('data-page'); // Get the page identifier

  // Object mapping page identifiers to sound files
  const soundMap = {
    schloogy: '../woordenboek/uitspraak/schloogy.mp3',
    hoppy: '../woordenboek/uitspraak/hoppy.mp3',
    boem: '../woordenboek/uitspraak/boem.mp3',
    boemba: '../woordenboek/uitspraak/boemba.mp3',
    boemy: '../woordenboek/uitspraak/boemy.mp3',
    skib: '../woordenboek/uitspraak/skib.mp3',
    swipe: '../woordenboek/uitspraak/swipe.mp3',
    sickness: '../woordenboek/uitspraak/sickness.mp3',
    sancaronies: '../woordenboek/uitspraak/sancaronies.mp3',
    drerrieguy: '../woordenboek/uitspraak/drerrieguy.mp3',
    knuist: '../woordenboek/uitspraak/knuist.mp3',
    glitch: '../woordenboek/uitspraak/glitch.mp3',
    blauw: '../woordenboek/uitspraak/blauw.mp3',
    swipetrooper: '../woordenboek/uitspraak/swipetrooper.mp3',
    // Add any additional words and their corresponding sound files below
  };

  // Set the sound file based on the page identifier
  if (soundButton && uitspraakSound) {
    if (soundMap[pageIdentifier]) {
      soundButton.setAttribute('data-sound', soundMap[pageIdentifier]);

      // Preload the sound to avoid delay when playing
      uitspraakSound.src = soundMap[pageIdentifier];

      // Handle sound button click
      soundButton.addEventListener('click', () => handleSoundButtonClick(soundButton, uitspraakSound));
    } else {
      console.error('Sound file not found for page:', pageIdentifier);
    }
  }
});

// Hide results when clicking outside
document.addEventListener('click', function (event) {
  if (!searchInput.contains(event.target) && !resultsWrapper.contains(event.target)) {
    resultsWrapper.style.display = 'none';
  }
});

// Hamburger menu functionality (if needed)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    overlay.classList.toggle('active');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    navMenu.classList.remove('show');
    overlay.classList.remove('active');
  });
}
