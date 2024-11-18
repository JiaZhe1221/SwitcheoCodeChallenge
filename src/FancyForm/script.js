document.addEventListener("DOMContentLoaded", () => {
  const inputAmount = document.getElementById("input-amount");
  const outputAmount = document.getElementById("output-amount");
  const sendCurrency = document.getElementById("send-currency");
  const receiveCurrency = document.getElementById("receive-currency");
  const swapButton = document.getElementById("swap-button");

  const currencyModal = document.getElementById("currency-modal");
  const modalOptions = document.getElementById("modal-options");
  const closeModal = document.getElementById("close-modal");

  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmationMessage = document.getElementById("confirmation-message");
  const closeConfirmationModal = document.getElementById("close-confirmation-modal");

  let exchangeRates = {}; // To hold the dynamic exchange rates
  let activeDropdown = null; // Track which dropdown is active (send or receive)

  // Fetch token price data from the provided URL
  async function fetchTokenPrices() {
    try {
      const response = await fetch("https://interview.switcheo.com/prices.json");
      const data = await response.json();

      // Populate both dropdowns
      populateDropdown(sendCurrency, data, "ETH");
      populateDropdown(receiveCurrency, data, "USD");

      console.log("Exchange Rates:", exchangeRates); // Log fetched rates
      updateOutput(); // Ensure output is updated based on initial defaults
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  }

  // Populate dropdowns with options
  function populateDropdown(dropdown, data, defaultCurrency) {
    data.forEach((item) => {
      exchangeRates[item.currency] = item.price;

      // Set the default currency
      if (item.currency === defaultCurrency) {
        dropdown.setAttribute("data-selected", defaultCurrency);
        const button = dropdown.querySelector(".dropdown-button");
        button.innerHTML = `
          <img src="images/${defaultCurrency.toLowerCase()}-image.svg" alt="${defaultCurrency}" class="currency-icon" />
          ${defaultCurrency}
        `;
      }
    });
  }

  // Update the output amount dynamically
  function updateOutput() {
    const sendValue = parseFloat(inputAmount.value) || 0;
    const sendCurrencyValue = sendCurrency.getAttribute("data-selected");
    const receiveCurrencyValue = receiveCurrency.getAttribute("data-selected");

    if (exchangeRates[sendCurrencyValue] && exchangeRates[receiveCurrencyValue]) {
      const rate =
        exchangeRates[receiveCurrencyValue] / exchangeRates[sendCurrencyValue];
      outputAmount.value = (sendValue * rate).toFixed(2);
    } else {
      outputAmount.value = "0.00";
    }
  }

  // Show the confirmation modal
  function showConfirmationModal(message) {
    confirmationMessage.textContent = message;
    confirmationModal.classList.remove("hidden");
  }

  // Hide the confirmation modal
  function hideConfirmationModal() {
    confirmationModal.classList.add("hidden");
  }

  // Submit form event
  const swapForm = document.getElementById("swap-form");
  swapForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const amount = inputAmount.value;
    const sendCurrencyValue = sendCurrency.getAttribute("data-selected");
    const receiveCurrencyValue = receiveCurrency.getAttribute("data-selected");

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to swap.");
      return;
    }

    const message = `You swapped ${amount} ${sendCurrencyValue} for ${outputAmount.value} ${receiveCurrencyValue}.`;
    showConfirmationModal(message);
  });

  // Show modal for dropdown options
  function showModal(dropdown) {
    activeDropdown = dropdown;
    modalOptions.innerHTML = ""; 

    // Populate modal with available currencies
    Object.keys(exchangeRates).forEach((currency) => {
      const optionHTML = `
        <div class="currency-option" data-value="${currency}">
          <img src="images/${currency.toLowerCase()}-image.svg" alt="${currency}" class="currency-icon" />
          ${currency}
        </div>
      `;
      modalOptions.innerHTML += optionHTML;
    });

    currencyModal.classList.remove("hidden");
  }

  // Hide the modal
  function hideModal() {
    currencyModal.classList.add("hidden");
    activeDropdown = null;
  }

  // Handle currency selection from the modal
  modalOptions.addEventListener("click", (e) => {
    if (e.target.closest(".currency-option")) {
      const selectedValue = e.target.closest(".currency-option").getAttribute("data-value");

      if (activeDropdown) {
        activeDropdown.setAttribute("data-selected", selectedValue);

        const button = activeDropdown.querySelector(".dropdown-button");
        button.innerHTML = `
          <img src="images/${selectedValue.toLowerCase()}-image.svg" alt="${selectedValue}" class="currency-icon" />
          ${selectedValue}
        `;

        updateOutput(); 
        hideModal(); 
      }
    }
  });

  // Event listener for dropdown buttons
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#send-currency")) {
      showModal(sendCurrency);
    } else if (e.target.closest("#receive-currency")) {
      showModal(receiveCurrency);
    }
  });

  // Close modal
  closeModal.addEventListener("click", hideModal);

  // Close confirmation modal
  closeConfirmationModal.addEventListener("click", hideConfirmationModal);

  // Swap currencies
  swapButton.addEventListener("click", () => {
    const temp = sendCurrency.getAttribute("data-selected");
    sendCurrency.setAttribute(
      "data-selected",
      receiveCurrency.getAttribute("data-selected")
    );
    receiveCurrency.setAttribute("data-selected", temp);

    // Update displayed dropdown values
    const sendButton = sendCurrency.querySelector(".dropdown-button");
    sendButton.innerHTML = `
      <img src="images/${sendCurrency.getAttribute("data-selected").toLowerCase()}-image.svg" 
           alt="${sendCurrency.getAttribute("data-selected")}" 
           class="currency-icon" />
      ${sendCurrency.getAttribute("data-selected")}
    `;

    const receiveButton = receiveCurrency.querySelector(".dropdown-button");
    receiveButton.innerHTML = `
      <img src="images/${receiveCurrency.getAttribute("data-selected").toLowerCase()}-image.svg" 
           alt="${receiveCurrency.getAttribute("data-selected")}" 
           class="currency-icon" />
      ${receiveCurrency.getAttribute("data-selected")}
    `;

    updateOutput();
  });

  // Update output when input changes
  inputAmount.addEventListener("input", updateOutput);

  // Fetch the token prices on page load
  fetchTokenPrices();
  // Handle search functionality
  const searchBar = document.getElementById("currency-search");
  
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const options = modalOptions.querySelectorAll(".currency-option");
  
    options.forEach((option) => {
      const currency = option.getAttribute("data-value").toLowerCase();
      // Show or hide the option based on the search query
      if (currency.includes(query)) {
        option.style.display = "flex"; // Show matching options
      } else {
        option.style.display = "none"; // Hide non-matching options
      }
    });
  });
  
  // Show modal with filtered currencies
  function showModal(dropdown) {
    activeDropdown = dropdown;
    modalOptions.innerHTML = ""; // Clear previous options
    searchBar.value = ""; // Clear search bar input
  
    // Populate modal with available currencies
    Object.keys(exchangeRates).forEach((currency) => {
      const optionHTML = `
        <div class="currency-option" data-value="${currency}">
          <img src="images/${currency.toLowerCase()}-image.svg" alt="${currency}" class="currency-icon" />
          ${currency}
        </div>
      `;
      modalOptions.innerHTML += optionHTML;
    });
  
    currencyModal.classList.remove("hidden");
  }

});
