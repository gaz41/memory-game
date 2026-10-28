// Get references to DOM elements
const playGame = document.getElementById("playBtn");
const boxContainer = document.getElementById("boxContainer");
const gameStatusMsg = document.getElementById("gameStatusMsg");
const timerDisplay = document.getElementById("timerDisplay");
const copyright = document.getElementById("copy");
const newBtn = document.getElementById("newBtn");

let grid; // Variable to hold grid dimensions
let timerStarted = false; // Flag to check if timer has started
let elapsedTime = 0; // Variable to track elapsed time
let gameTimer; // Variable to hold the timer interval

// Adding event listeners to buttons
playGame.addEventListener("click", startGame); // Start game on button click

// Function to start the game
function startGame() {
  const gameMode = document.getElementById("mode").value; // Get selected game mode

  // Call function to hide initial UI elements
  hideInitialElements();

  // Call function to reset elapsed time and timer flag
  resetGameState();

  // Hide initial UI elements
  function hideInitialElements() {
    label.style.display = "none";
    mode.style.display = "none";
    playBtn.style.display = "none";
  }

  // Reset elapsed time and timer flag
  function resetGameState() {
    elapsedTime = 0;
    timerStarted = false;
  }

  // Create and display difficulty message
  const difficultyMsg = createEle(
    "div",
    title,
    `DIFFICULTY: <span class="selectedDifficultyMsg">${gameMode}</span>`,
    "difficultyMsg",
  );

  // Define the grid dimensions based on selected difficulty
  switch (gameMode) {
    case "super easy":
      grid = { x: 2, y: 2 };
      break;
    case "easy":
      grid = { x: 4, y: 3 };
      break;
    case "medium":
      grid = { x: 6, y: 3 };
      break;
    case "hard":
      grid = { x: 6, y: 4 };
      break;
    case "harder":
      grid = { x: 8, y: 4 };
      break;
    case "super hard":
      grid = { x: 10, y: 4 };
      break;
    default:
      console.error("Invalid game mode selected.");
      return;
  }

  // Define available colors for the boxes
  const arr = [
    "lime",
    "skyblue",
    "coral",
    "wheat",
    "fuchsia",
    "pink",
    "orange",
    "teal",
    "tan",
    "plum",
    "olive",
    "crimson",
    "hotpink",
    "gold",
    "cyan",
    "salmon",
    "gray",
    "yellow",
    "linen",
    "lavender",
  ];

  // Initialize the game state object
  const game = {
    score: 0, // Player's score / pairs found
    total: 0, // Total pairs to find
    game: [], // Array to hold game items
    flip: [], // Array to hold flipped boxes
    timer: {}, // Timer object
    pause: false, // Game pause state
  };

  // Function toinitialize the game state object
  function initializeGame(colors) {
    return {
      score: 0,
      // total: Math.min(colors.length * 2, grid.x * grid.y),
      total: 0,
      game: [],
      flip: [],
      timer: {},
      pause: false,
    };
  }

  // Create the progress message element / x of y pairs found
  pairsFoundMsg = createEle("div", progress, "", "pairsFoundMsg");
  pairsFoundMsg.innerHTML = `${game.score} of ${game.total} pairs found`;

  // Initial game status message
  gameStatusMsg.innerHTML = "click any box to start";

  // Create the progress display
  const progressDisplay = createEle(
    "progress",
    progress,
    "",
    "progressDisplay",
  );

  // Function for timer
  function startTimer() {
    const timerDisplay = createEle("div", progress, "", "timerDisplay");
    let elapsedTime = 0; // Variable to track elapsed time
    gameTimer = setInterval(() => {
      elapsedTime += 0.1; // Increment elapsed time
      timerDisplay.innerHTML = `Time: <span class="seconds">${elapsedTime.toFixed(1)}</span> seconds`;
    }, 100); // Update timer every 100 milliseconds
  }

  // Calculate the total number of boxes based on grid size
  let total = grid.x * grid.y; // Total boxes based on grid dimensions
  total = arr.length * 2 < total ? arr.length * 2 : total; // Ensure total does not exceed available colors
  game.total = total / 2; // Each color appears twice

  // Call function to create the game grid
  makeGrid();

  // Function to create the grid of boxes
  function makeGrid() {
    // Create box elements in the grid
    for (let i = 0; i < total; i++) {
      const boxes = createEle("div", boxContainer, "", "box"); // Create a box element
      boxes.onclick = flipBox; // Assign click event to each box
    }

    // Set the grid layout based on the defined dimensions
    boxContainer.style.setProperty(
      `grid-template-columns`,
      `repeat(${grid.y}, 1fr)`,
    );
    addboxes(); // Populate boxes with colors
  }

  // Function to toggle the visibility of box sides
  function toggleFlip(parent, boo) {
    const backEle = parent.querySelector(".back"); // Back of the box
    const frontEle = parent.querySelector(".front"); // Front of the box
    backEle.style.display = boo ? "none" : "block"; // Show/hide back
    frontEle.style.display = boo ? "block" : "none"; // Show/hide front
  }

  // Function to check if flipped boxes match
  function checkCards() {
    game.pause = true; // Pause the game while checking
    let match = false; // Variable to track match status
    let found = false; // Variable to track if a match is found

    // Check if the flipped boxes match
    game.flip.forEach((ele) => {
      if (ele.val === match) {
        found = true; // A match is found
      } else {
        match = ele.val; // Update match value
      }
    });

    if (!found) {
      game.timer = setTimeout(flipBack, 750); // Flip back if no match
    } else {
      game.score++; // Increment score for a match
      game.flip.forEach((ele) => {
        ele.found = true; // Mark boxes as found
      });
      game.pause = false; // Resume game
      game.flip.length = 0; // Clear flipped boxes

      // Update the existing slider message
      pairsFoundMsg.style.display = "block";
      pairsFoundMsg.innerHTML = `${game.score} of ${game.total} pairs found`;

      progressDisplay.style.display = "block"; // Display progress element
      progressDisplay.value = game.score; // Set current value of progress element
      progressDisplay.max = game.total; // Set max value of progress element

      // Check if the game is over and create a button to restart game
      if (game.score >= game.total) {
        clearInterval(gameTimer); // Stop the timer
        gameStatusMsg.innerHTML = `<span class="gameOverMsg">GAME OVER</span>`;
        const newGameBtn = document.createElement("button"); // Create 'START NEW GAME' button
        newGameBtn.textContent = "START NEW GAME"; // Button to restart the game
        newGameBtn.classList.add("startGameBtn");
        newBtn.appendChild(newGameBtn);
        newGameBtn.addEventListener("click", () => window.location.reload()); // Reload for new game
        window.location.href = "#gameStatusMsg"; // scroll to see results
      }
    }
  }

  // Function to flip back boxes if no match
  function flipBack() {
    game.flip.forEach((ele) => {
      toggleFlip(ele, false); // Flip back the boxes
      ele.classList.remove("active"); // Remove active class
    });
    game.pause = false; // Resume game
    game.flip.length = 0; // Clear flipped boxes
  }

  // Function to handle box flipping
  function flipBox(e) {
    const parent = e.target.parentNode; // Get parent box
    const isActive = parent.classList.contains("active"); // Check if already active

    if (!timerStarted) {
      startTimer(); // Start the timer on the first box click
      timerStarted = true; // Set the flag to true
    }

    // Proceed if game is not paused and box is not active
    if (!game.pause && !isActive) {
      if (parent.found) {
        gameStatusMsg.textContent = "Already Found"; // Notify if already found
      } else {
        parent.classList.add("active"); // Mark box as active
        if (game.flip.length >= 2) {
          toggleFlip(parent, false); // Flip back if two boxes are active
        } else {
          toggleFlip(parent, true); // Flip the current box
        }
        game.flip.push(parent); // Add to flipped boxes

        // Display the 2 selected boxes side by side to give a visual check to see if they match
        if (game.flip.length >= 2) {
          let matchFound =
            game.flip[0].innerText === game.flip[1].innerText
              ? '<span class="matchFoundMsg">&nbsp;&#10003;</span>'
              : "";
          gameStatusMsg.innerHTML = `
          <span class="flippedBox" style="background-color: ${game.flip[0].innerText};">box1</span>      
          <span class="flippedBox" style="background-color: ${game.flip[1].innerText};">box2</span> ${matchFound}`;
        } else {
          gameStatusMsg.innerHTML = "Flip second box ...";
        }
        clearMsg(); // Call clear message

        if (game.flip.length >= 2) {
          game.pause = true; // Pause game for checking
          checkCards(); // Check for matches
        }
      }
    } else {
      gameStatusMsg.textContent = "GAME PAUSED"; // Notify if game is paused
    }
  }

  // Function to clear message only if the second box has been flipped AND is NOT the last pair to be found
  function clearMsg() {
    if (game.flip.length === 2 && game.score + 1 < game.total) {
      setTimeout(() => {
        gameStatusMsg.innerHTML = "Flip first box ..."; // Replace message after 1 second
      }, 1000);
    }
  }

  // Function to add colors to boxes
  function addboxes() {
    const gameItems = total / 2; // Calculate number of unique items
    const temp = [];

    arr.sort(() => Math.random() - 0.5); // Shuffle colors

    for (let i = 0; i < gameItems; i++) {
      temp.push(arr[i]); // Add unique colors to temp
    }

    // Duplicate colors for pairs and shuffle
    game.game = [...temp, ...temp].sort(() => Math.random() - 0.5);

    const boxes = boxContainer.querySelectorAll(".box"); // Get all box elements
    boxes.forEach((ele, index) => {
      ele.val = game.game[index]; // Assign color value to each box
      ele.found = false; // Mark as not found
      const front = createEle("div", ele, game.game[index], "front"); // Create front side
      front.style.backgroundColor = game.game[index]; // Set front background color
      front.style.display = "none"; // Hide front initially
      const back = createEle("div", ele, index + 1, "back"); // Create back side
      back.style.display = "block"; // Show back side
    });
  }

  // Utility function to create and append elements
  function createEle(eleType, parent, html, cla) {
    const ele = document.createElement(eleType); // Create new element
    ele.classList.add(cla); // Add class
    ele.innerHTML = html; // Set inner HTML
    return parent.appendChild(ele); // Append to parent
  }
}

// Sliding menu
document.getElementById("menuToggle").addEventListener("click", function () {
  // Get the sliding menu and the toggle icon
  const menu = document.getElementById("slidingMenu");
  const toggleIcon = this;

  // Toggle the 'active' class on the menu
  menu.classList.toggle("active");

  // Check if the menu is currently active
  const isActive = menu.classList.contains("active");

  // Define styles based on the active state of the menu
  const iconStyles = {
    icon: isActive ? "&#10006;" : "&#9776;", // Change icon based on state
    color: isActive ? "#eeeeee" : "#111111", // Change text color
    backgroundColor: isActive ? "#333333" : "#99a3a3", // Change background color
    position: isActive ? "fixed" : "absolute", // Change position
    defaultColor: isActive ? "#333333" : "#99a3a3", // Default background color
    hoverColor: isActive ? "#444444" : "#788b8b ", // Change hover background color
  };

  // Apply the defined styles to the toggle icon
  toggleIcon.innerHTML = iconStyles.icon; // Update icon
  toggleIcon.style.color = iconStyles.color; // Update text color
  toggleIcon.style.backgroundColor = iconStyles.backgroundColor; // Update background color
  toggleIcon.style.position = iconStyles.position; // Update position
  toggleIcon.style.transition = "background-color 0.3s"; // Smooth transition

  // Add event listener for mouseover to change background color
  toggleIcon.addEventListener("mouseover", function () {
    this.style.backgroundColor = iconStyles.hoverColor; // Change to hover background color
  });

  // Add event listener for mouseout to revert background color
  toggleIcon.addEventListener("mouseout", function () {
    this.style.backgroundColor = iconStyles.defaultColor; // Revert to default background color
  });
});

// Dynamically generate newGameBtn information
copyright.innerHTML =
  "Copyright &copy; " + // Start of the copyright string
  new Date().getFullYear() + // Get the current year
  ` <a href="https://www.gaz41.com">gaz41.com</a>. <span class="copy2">All Rights Reserved</span>`;
