const container = document.querySelector(".container");
const startGame = document.getElementById("startGame");
const resetGame = document.getElementById("resetGame");
const gridContainer = document.getElementById("gameArea");
let previousClickedElement = null;
let numSelected = 0


// resetGame.classList.add("hide");

resetGame.addEventListener('click',function(){
   localStorage.removeItem('setPrice')
   localStorage.removeItem('selectedCases')
   window.location.reload()
})
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
        resetGame.classList.add("show");
        
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
  const saveButton = document.getElementById("openButton");
  const changeButton = document.getElementById("changeButton");

  // Show the popup
  popupContainer.style.display = "flex";
  // Show the selected chest number in the card
  const selectedChestNumberElement = document.querySelector('#open');
  const selectedChestNumberContent = document.querySelector('#content');
  const selectedChestNumberPrice = document.querySelector('#price');
  const selectedPrice = document.querySelector('#priceInput')
  selectedChestNumberContent.textContent = selectedNumber.dataset.id;


  numSelected = selectedNumber.dataset.id
  // Event listener for the "Open" button
  saveButton.addEventListener("click", function onOpenButtonClick() {
    // User chose "save," so display the case number and amount
    if (numSelected != 0) {
      // alert(`You opened Case ${selectedNumber.dataset.id}`);
       // static for now
      selectedChestNumberContent.textContent = ''
    //   selectedChestNumberPrice.src = `./img/${selectedNumber.dataset.id}.png`
      selectedChestNumberPrice.style.display = 'block'
      selectedChestNumberElement.classList.add('show')
      console.log(selectedPrice)
    //   selectedNumber.classList.add('sparkle-open')
      // Retrieve the array of selected cases from local storage or create an empty array if it doesn't exist
      const selectedCases =
        JSON.parse(localStorage.getItem("setPrice")) || [];

      // Add the current selected case to the array of selected cases
      selectedCases.push({ caseNumber: selectedNumber.dataset.id, price: selectedPrice.value });

      // Save the updated array of selected cases to local storage
      localStorage.setItem("setPrice", JSON.stringify(selectedCases));
      numSelected = selectedNumber.dataset.id

      activeNumber()
      closePopup()
      selectedChestNumberPrice.style.display = 'none'
    }

    // Remove the event listener for the "Open" button after it's clicked
    saveButton.removeEventListener("click", onOpenButtonClick);
  });

  // Event listener for the "Change" button
  changeButton.addEventListener("click", function onChangeButtonClick() {
    // If there is a previously clicked element, remove the class from it
    if (previousClickedElement) {
      previousClickedElement.classList.remove("sparkle-effect");
    }

    // Apply the sparkle effect to the currently selected element
    const selectedElement = gridContainer.querySelector(
      `[data-id="${selectedNumber.dataset.id}"]`
    );
    selectedElement.classList.add("sparkle-effect");
    numSelected = 0; // Reset the selectedCaseNumber after applying the sparkle effect
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
};

const activeNumber = async()=>{
  const activeNumber = JSON.parse(localStorage.getItem('setPrice'))
  console.log(activeNumber)
  const cases = document.querySelectorAll('.grid-item')
  if(activeNumber != null){
    cases.forEach(active => {
        const caseNumber = parseInt(active.dataset.id);
        // console.log(active)

        // Check if the current case number is an activeNumber (selected case)
        const isActiveNumber = activeNumber.some(
            (selectedCase) => parseInt(selectedCase.caseNumber) === caseNumber
        );
          // Check if the current case number is in the array of selected cases
          if (isActiveNumber) {
            // The current case number is an activeNumber (selected case)
            const selectedCase = activeNumber.find(
                (selectedCase) => parseInt(selectedCase.caseNumber) === caseNumber
            );
            // The current case number is an activeNumber (selected case)
              console.log(`Case ${caseNumber} is an activeNumber. Price: ${selectedCase.price}`);
              
                 //   // set the price display
                active.style.backgroundImage = `url(./img/${selectedCase.price.toLowerCase()}.png)`;
                
        
                
              

              active.style.backgroundSize = 'contain';
                active.style.backgroundRepeat = 'no-repeat';
                active.style.backgroundPosition = 'center';
              active.classList.add('sparkle-open')
    
           
              active.textContent = ''
    
          } else {
            // The current case number is not an activeNumber
            console.log(`Case ${caseNumber} is not an activeNumber.`);
          }
      });
  }
}

