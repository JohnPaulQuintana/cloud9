const container = document.querySelector(".container");
const startGame = document.getElementById("startGame");
const gridContainer = document.getElementById("gameArea");
let previousClickedElement = null;
let numSelected = 0

// Event listener for "Start Game" button click
startGame.addEventListener("click", async () => {
  await fetch("/play")
    .then((response) => response.json())
    .then((remainingCases) => {
      gridContainer.innerHTML = ""; // Clear previous content

      container.classList.add("faded");
      // Remove the 'faded' class after 1 second

      remainingCases.forEach(({ caseNumber, amount }) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.textContent = `${caseNumber}`;
        gridItem.setAttribute("data-id", caseNumber);

        const imgPrices = document.createElement('img')
        imgPrices.classList.add('price')
        imgPrices.setAttribute('src','')

        gridItem.appendChild(imgPrices)
        gridContainer.appendChild(gridItem);
      });

      setTimeout(() => {
        container.classList.remove("faded");

        // Add the 'up' class after removing the 'faded' class
        container.classList.add("up");
        startGame.classList.add("hide");
        // Add your code to show the new content here, e.g., new game elements

      }, 500); // 1000 milliseconds = 1 second

      gridContainer.classList.add("faded");
      setTimeout(() => {
        gridContainer.classList.remove("faded");
        gridContainer.classList.add("show");
        activeNumber()
      }, 1000);
    })
    .catch((error) => console.error("Error fetching remaining cases:", error));
});

// Event delegation for grid items
gridContainer.addEventListener("click", (event) => {

  const clickedElement = event.target;
  if (clickedElement.classList.contains("grid-item")) {
      
    // If there is a previously clicked element, remove the class from it
    if (previousClickedElement) {
      previousClickedElement.classList.remove("sparkle-effect");
    }

    // Add the class to the currently clicked element
    clickedElement.classList.add("sparkle-effect");

    // Show the custom popup for "Open" or "Change" choice with the selected case number
    showPopup(clickedElement);
  }
});

// Function to show the custom popup
const showPopup = (selectedNumber) => {
  const popupContainer = document.getElementById("popupContainer");
  const openButton = document.getElementById("openButton");
  const changeButton = document.getElementById("changeButton");

  // Show the popup
  popupContainer.style.display = "flex";
  // Show the selected chest number in the card
  const selectedChestNumberElement = document.querySelector('#open');
  const selectedChestNumberContent = document.querySelector('#content');
  const selectedChestNumberPrice = document.querySelector('#price');
  const selectedChestNumberMessage = document.querySelector('#message');
  const winner = document.querySelector('.confetti');
  const setNumber = JSON.parse(localStorage.getItem('setPrice')) || []

  console.log(setNumber)
  winner.style.display = 'none'
  selectedChestNumberContent.textContent = selectedNumber.dataset.id;
  selectedChestNumberElement.classList.add('sparkle-effect')

  numSelected = selectedNumber.dataset.id
  // Event listener for the "Open" button
  openButton.addEventListener("click", function onOpenButtonClick() {
    console.log(numSelected)
    // User chose "Open," so display the case number and amount
    if (numSelected == selectedNumber.dataset.id) {
      // alert(`You opened Case ${selectedNumber.dataset.id}`);
       // static for now
      selectedChestNumberContent.textContent = ''

      const selectedCase = setNumber.find(
        (setPrice) => parseInt(setPrice.caseNumber) === parseInt(numSelected)
      );
      console.log(selectedCase)
        // console.log(`Case ${selectedCase.price} is an activeNumber.`);
        if(selectedCase){
          // set the price display
          // selectedNumber.style.backgroundImage = `url(./img/${selectedCase.price.toLowerCase()}.png)`;
          selectedChestNumberPrice.src = `./img/${selectedCase.price.toLowerCase()}.png`;
          winner.style.display = 'block'
          selectedChestNumberPrice.style.display = 'block'
          selectedChestNumberMessage.textContent = `You Win a ${selectedCase.price.toLowerCase()}!`
        }else{
          selectedChestNumberPrice.src = `./img/epcst.png`;
          winner.style.display = 'none'
          selectedChestNumberPrice.style.display = 'block'
          selectedChestNumberMessage.textContent = 'Better Luck Next Time!'
        }


      // selectedChestNumberPrice.src = `./img/${selectedNumber.dataset.id}.png`
     
      
      selectedChestNumberElement.classList.add('show')
      
      
      selectedNumber.classList.add('sparkle-open')
      // Retrieve the array of selected cases from local storage or create an empty array if it doesn't exist
      const selectedCases =
        JSON.parse(localStorage.getItem("selectedCases")) || [];

      // Add the current selected case to the array of selected cases
      selectedCases.push({ caseNumber: selectedNumber.dataset.id, price: '0' });

      // Save the updated array of selected cases to local storage
      localStorage.setItem("selectedCases", JSON.stringify(selectedCases));
      numSelected = selectedNumber.dataset.id

      activeNumber()
      setTimeout(()=>{
        selectedChestNumberPrice.src = ''
        selectedChestNumberMessage.textContent = ''
        selectedChestNumberPrice.style.display = 'none'
        closePopup();
      },5000)
    }

    // Remove the event listener for the "Open" button after it's clicked
    openButton.removeEventListener("click", onOpenButtonClick);
  }, { once: true });

  // Event listener for the "Change" button
  changeButton.addEventListener("click", function onChangeButtonClick() {
    // If there is a previously clicked element, remove the class from it
    if (previousClickedElement) {
      previousClickedElement.classList.remove("sparkle-effect");
    }

    // console.log(numSelected)
    // Apply the sparkle effect to the currently selected element
    const selectedElement = gridContainer.querySelector(
      `[data-id="${selectedNumber.dataset.id}"]`
    );
    selectedElement.classList.add("sparkle-effect");
    numSelected = 0; // Reset the selectedCaseNumber after applying the sparkle effect
    console.log(numSelected)
    closePopup();

    // Update the reference to the previously clicked element
    previousClickedElement = selectedElement;

    // Remove the event listener for the "Change" button after it's clicked
    changeButton.removeEventListener("click", onChangeButtonClick);
  });
   
};
// Function to close the custom popup
const closePopup = () => {
  const popupContainer = document.getElementById("popupContainer");
  popupContainer.style.display = "none";
  previousClickedElement = null; // Reset the previousClickedElement after closing the popup
  numSelected = 0
};

const activeNumber = async()=>{
  const activeNumber = JSON.parse(localStorage.getItem('selectedCases'))
  const setNumber = JSON.parse(localStorage.getItem('setPrice'))
  
  console.log(activeNumber)
  const cases = document.querySelectorAll('.grid-item')
  if(activeNumber != null){
    cases.forEach(active => {
      const caseNumber = parseInt(active.dataset.id);
      // console.log(active)
        // Check if the current case number is in the array of selected cases
        if (activeNumber.some(selectedCase => parseInt(selectedCase.caseNumber) === caseNumber)) {
          active.classList.add('sparkle-open')
          // The current case number is an activeNumber (selected case)
            // if(setNumber.some(setPrice => parseInt(setPrice.caseNumber) === caseNumber)){
              // The current case number is an activeNumber (selected case)
            const selectedCase = setNumber.find(
              (setPrice) => parseInt(setPrice.caseNumber) === caseNumber
            );
              // console.log(`Case ${selectedCase.price} is an activeNumber.`);
              if(selectedCase){
    
                // set the price display
                active.style.backgroundImage = `url(./img/${selectedCase.price.toLowerCase()}.png)`;
              }else{
                active.style.backgroundImage = `url(./img/epcst.png)`;
              }
            // }
            
              active.style.backgroundSize = 'contain';
              active.style.backgroundRepeat = 'no-repeat';
              active.style.backgroundPosition = 'center';
    
              active.textContent = ''
        }
    });
  }
}

