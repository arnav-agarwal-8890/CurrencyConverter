let mainBody = document.getElementById("main-body")
mainBody.classList.add("main-body-style")

let container = document.getElementById("main-container")
container.classList.add("main-container-style")

let heading = document.getElementById("main-heading")
heading.textContent = "Currency Converter"

let converterContainer = document.getElementById("converter-container")
converterContainer.classList.add("converter-container-style")

let dropdownSection = document.getElementById("dropdown-section")
dropdownSection.classList.add("dropdown-section-style")

let inputContainer = document.getElementById("input-container")
inputContainer.classList.add("input-container-style")

let inputLabel = document.createElement("label")
inputLabel.textContent = "Enter Amount "
inputLabel.classList.add("amountlabel-style")

inputContainer.appendChild(inputLabel)

let inputField = document.createElement("input")
inputField.placeholder = 100
inputField.classList.add("input-field-style")

inputContainer.appendChild(inputField)

let initialCurrencyDropdown = document.getElementById("initial-currency-dropdown")
let convertedCurrencyDropdown = document.getElementById("converted-currency-dropdown")
initialCurrencyDropdown.classList.add("currency-dropdown")
convertedCurrencyDropdown.classList.add("currency-dropdown")

let toText = document.createElement("label")
toText.textContent = " TO "
toText.classList.add("totext-style")

dropdownSection.insertBefore(toText, convertedCurrencyDropdown)


const initialDropdownButton = document.getElementById("initial-dropdown-button")
const convertDropdownButton = document.getElementById("converted-dropdown-button")
initialDropdownButton.classList.add("currency-dropdown-button");
convertDropdownButton.classList.add("currency-dropdown-button");


const initialDropdownOptions = document.getElementById("initial-currency-options")
const convertDropdownOptions = document.getElementById("converted-currency-options")
initialDropdownOptions.classList.add("currency-options");
convertDropdownOptions.classList.add("currency-options");

initialDropdownButton.addEventListener("click", () => {
    initialDropdownOptions.classList.toggle("show")
})

convertDropdownButton.addEventListener("click", () => {
    convertDropdownOptions.classList.toggle("show")
})

function addOption(optionsContainer, code, text, image, button) {
    const optionArray = Array.from(optionsContainer.children)

    if (optionArray.some(option => option.dataset.currency === code)) return

    const option = document.createElement("div")
    option.className = "currency-option"

    const img = document.createElement("img")
    img.src = `https://flags.restcountries.com/v5/w320/${image.toLowerCase()}.png`

    const span = document.createElement("span")
    span.textContent = `${code} - ${text}`

    option.append(img, span)

    option.addEventListener("click", () => {
        button.replaceChildren(img.cloneNode(), span.cloneNode(true));
        button.dataset.currency = code;
        optionsContainer.classList.remove("show");
    });

    optionsContainer.appendChild(option);
}


let convertButton = document.getElementById("conversion-button")
convertButton.textContent = "Convert"
convertButton.classList.add("convert-button-style")


async function countriesApiIntegration () {
    try{
        const response = await fetch(
            'https://api.restcountries.com/countries/v5?limit=100',
            { headers: { 'Authorization': 'Bearer rc_live_559ec5ebd0f942028079a5c3000d8552' } }
        )

        if(!response.ok) {
            throw new Error("No data from API")
            return
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error:", error)
    }
}

countriesApiIntegration().then(data => {
    function populateDropdown (data) {
        data.forEach(country => {
            if(country.currencies.length > 0) {
                country.currencies.forEach(currency => {
                    addOption(initialDropdownOptions, currency?.code, currency?.name, country?.flag?.emoji, initialDropdownButton)
                    addOption(convertDropdownOptions, currency?.code, currency?.name, country?.flag?.emoji, convertDropdownButton)
                })
            }
        })
    }

    populateDropdown(data.data.objects)
})


async function exchangeApiIntegration (code) {
    try{
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/453822237ad9d19330bdfff9/latest/${code}`
        )

        if(!response.ok) {
            throw new Error("No data from API")
            return
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Error:", error)
    }
}


let outputContainer = document.getElementById("output-container")

function convertCurrency () {
    if(inputField.value === "") return

    exchangeApiIntegration(initialDropdownButton.dataset.currency).then(data => {
        const exchangeRate = data.conversion_rates[convertDropdownButton.dataset.currency]
        const exchangedAmount = (inputField.value * exchangeRate).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})
        outputContainer.textContent = `${inputField.value} ${initialDropdownButton.dataset.currency} = ${exchangedAmount} ${convertDropdownButton.dataset.currency}`
    })
}

convertButton.addEventListener("click", convertCurrency)

inputField.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        convertCurrency()
    }
})
