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

let initialCurrency = document.getElementById("initial-currency")
let convertedCurrency = document.getElementById("converted-currency")
initialCurrency.classList.add("dropdown-menu-style")
convertedCurrency.classList.add("dropdown-menu-style")

let toText = document.createElement("label")
toText.textContent = " TO "
toText.classList.add("totext-style")

dropdownSection.insertBefore(toText, convertedCurrency)

function addOption(select, option, text) {
    const optionArray = Array.from(select.options)
    if(!optionArray.some(options => options.value === option)) {
        let newOption = document.createElement("option")

        newOption.value = option
        newOption.text = text

        select.appendChild(newOption)
    }
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
            if(country.currencies.length !== 0) {
                for(let i=0; i < country.currencies.length; i++) {
                    addOption(initialCurrency, country.currencies[i]?.code, `${country.flag?.emoji} ${country.currencies[i]?.code} - ${country.currencies[i]?.name}`)
                    addOption(convertedCurrency, country.currencies[i]?.code, `${country.flag?.emoji} ${country.currencies[i]?.code} - ${country.currencies[i]?.name}`)
                }
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

    exchangeApiIntegration(initialCurrency.value).then(data => {
        const exchangeRate = data.conversion_rates[convertedCurrency.value]
        const exchangedAmount = (inputField.value * exchangeRate).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})
        outputContainer.textContent = `${inputField.value} ${initialCurrency.value} = ${exchangedAmount} ${convertedCurrency.value}`
    })
}

convertButton.addEventListener("click", convertCurrency)

inputField.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        convertCurrency()
    }
})