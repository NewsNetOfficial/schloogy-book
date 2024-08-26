let searchable = []; // Initialize the searchable array

// Fetch the words from the txt file
fetch('../woordenlijst.txt')
  .then(response => response.text())  // Read the response as text
  .then(data => {
    // Split the text data by newline characters to get an array of words
    searchable = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

    // Now generate the word list after the words are fetched
    generateWordList();  // Ensure word list is generated after fetching words

    console.log(searchable); // Just to confirm it works
  })
  .catch(error => {
    console.error('Error fetching words:', error);
  });

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
  const pathParts = window.location.pathname.split('/').filter(part => part);
  const currentDirectory = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';

  // Determine the base URL based on the current directory
  const baseURL = currentDirectory === 'woordenboek' ? '' : 'woordenboek/';

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

      return `<a href="${itemUrl}"><li>${capitalizedItem.replace(regex, (match) => 
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

// Function to handle normal sound button click
function handleNormalSoundButtonClick(soundButton, uitspraakSound) {
  const soundSrc = soundButton.getAttribute('data-sound');

  // Check if a new sound is selected
  if (uitspraakSound.src !== soundSrc) {
    uitspraakSound.src = soundSrc;
  }

  if (uitspraakSound.paused) {
    uitspraakSound.play().catch((error) => {
      console.error("Error playing audio: ", error);
      soundButton.classList.remove('active');
      soundButton.style.backgroundImage = "url('../icons/offsound.png')";
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

// Function to handle sanceronies button click
function handleSanceroniesButtonClick(soundButton, uitspraakSound) {
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
  } else {
    uitspraakSound.pause();
    uitspraakSound.currentTime = 0; // Reset sound to start
    soundButton.classList.remove('active');
  }
}

// Add event listener for when sound ends for normal sound button only
function setupSoundEndedListener(uitspraakSound, soundButton) {
  uitspraakSound.addEventListener('ended', () => {
    if (soundButton) {
      soundButton.classList.remove('active');
      soundButton.style.backgroundImage = "url('../icons/offsound.png')";
    }
  });
}

// Generate and display the list of words
function generateWordList() {
  // Ensure we're on the woordenlijst.html page
  if (!window.location.pathname.includes("woordenlijst.html")) {
    return;
  }

  // Get the container where the list will be inserted
  const wordListContainer = document.getElementById('word-list-container');

  if (!wordListContainer) {
    console.error('Container for the word list not found!');
    return;
  }

  // Group words by the first letter
  const groupedWords = groupByFirstLetter(searchable);

  // Create the list of words
  const list = document.createElement('ul');

  // Add sections for each letter
  Object.keys(groupedWords).sort().forEach(letter => {
    // Create a section header
    const sectionHeader = document.createElement('li');
    sectionHeader.classList.add('section-header');
    sectionHeader.textContent = letter;
    list.appendChild(sectionHeader);

    // Sort words within this section alphabetically and create list items
    groupedWords[letter].sort().forEach(word => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      
      // Construct the URL and set the link text
      link.href = `../woordenboek/${word.toLowerCase()}.html`;
      link.textContent = word;

      // Append the link to the list item
      listItem.appendChild(link);

      // Append the list item to the list
      list.appendChild(listItem);
    });
  });

  // Clear any existing content in the container and add the list
  wordListContainer.innerHTML = ''; 
  wordListContainer.appendChild(list);
}

// Function to group words by the first letter
function groupByFirstLetter(words) {
  return words.reduce((acc, word) => {
    const firstLetter = word[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});
}

// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const soundButton = document.querySelector('.soundbutton');
  const uitspraakSound = document.getElementById('uitspraak');
  const sanceroniesButton = document.getElementById('sanceronies'); // Special button for sanceronies

  if (soundButton && uitspraakSound) {
    // Set the default sound file based on the page identifier
    const pageIdentifier = document.body.getAttribute('data-page'); // Get the page identifier
    if (pageIdentifier) {
      const soundSrc = `../woordenboek/uitspraak/${pageIdentifier.toLowerCase()}.mp3`;
      soundButton.setAttribute('data-sound', soundSrc);
      uitspraakSound.src = soundSrc; // Preload the default sound
    }

    // Handle sound button click for normal buttons
    soundButton.addEventListener('click', () => handleNormalSoundButtonClick(soundButton, uitspraakSound));

    // Set up event listener to change the button image when the sound ends (for normal button only)
    setupSoundEndedListener(uitspraakSound, soundButton);
  }

  if (sanceroniesButton) {
    const sanceroniesSoundSrc = '../overig/holysanceronies.mp3'; // Hardcoded path for sanceronies
    sanceroniesButton.setAttribute('data-sound', sanceroniesSoundSrc);
    sanceroniesButton.addEventListener('click', () => handleSanceroniesButtonClick(sanceroniesButton, uitspraakSound));
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
