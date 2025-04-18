//Debug tool
let debug = true;
let log = (message) => {
    if (debug) {
        console.log(message);
    }
    else {
        console.log(`Debug is inactive !`)
    }
}
log(`Debug is active !`);

//Reference to the DOM elements
const heightInput = document.getElementById("height-input");
const widthInput = document.getElementById("width-input");
let addBtn = document.getElementById("add-btn");
let recordsList = document.getElementById("records-list");

let displayResult = document.getElementById("display-result");
let materialSelection = document.getElementById("material-selection")
let totalAreaTitle = document.getElementById("total-area-title");
let totalAreaValue = document.getElementById("total-area-value");
let priceBlock = document.getElementById("price-block");
let correctionField = document.getElementById("correction-field");

const materialSelect = document.getElementById("material-select");
const thicknessSelect = document.getElementById("thickness-select");
const calculateBtn = document.getElementById("calculate-bricks-btn");
const resetBtn = document.getElementById("reset-btn");
const brickResultBody = document.getElementById("brick-result-text");

const palletPrice = document.getElementById("pallet-price");
const unitPrice = document.getElementById("unit-price");
const palleteWarrant = document.getElementById("pallete-warrant");
const calculateBricksBtn = document.getElementById("calculate-bricks-btn");
const calculatePriceBtn = document.getElementById("calculate-price-btn");
const priceResultBody = document.getElementById("price-result-text");


//initial UI state
// displayResult.classList.add("isHidden");
// materialSelection.classList.add("isHidden");
// priceBlock.classList.add("isHidden");

[displayResult, materialSelection, priceBlock, resetBtn].forEach(el => el.classList.add("isHidden"));
document.body.classList.add("withBackgroundImage");

//global variables
let records = [];
log(`Start list of records is: "\n" ${JSON.stringify(records)} `);
let grandTotalArea;
let piecesPerPallet;
let piecesExtraPallet;
let totalNumberOfPallets;


//objects for materials and units thickness
const materials = {
    "Caramida": [24, 29, 12],
    "BCA": [10, 15, 20, 25, 30]
};

    let brickData = {
        "Caramida": {
            24: { size: "24x29x19", volume: 0.24 * 0.29 * 0.19, perPallet: 80 },
            29: { size: "24x29x19", volume: 0.24 * 0.29 * 0.19, perPallet: 80 },
            12: { size: "48x12x19", volume: 0.48 * 0.12 * 0.19, perPallet: 100 }
        },
        "BCA": {
            10: { size: "10x25x62.4", volume: 0.10 * 0.25 * 0.624, perPallet: 112 },
            15: { size: "15x25x62.4", volume: 0.15 * 0.25 * 0.624, perPallet: 72 },
            20: { size: "25x20x62.4", volume: 0.20 * 0.25 * 0.624, perPallet: 56 },
            25: { size: "20x25x62.4", volume: 0.25 * 0.20 * 0.624, perPallet: 56 },
            30: { size: "30x25x62.4", volume: 0.30 * 0.25 * 0.624, perPallet: 40 }
        }
    };


function populateMaterials() {
    materialSelect.innerHTML =  '<option value="">-- Selectează --</option>';
    Object.keys(materials).forEach(material => {
        let option = document.createElement("option");
        option.value = material;
        option.textContent = material;
        materialSelect.appendChild(option);
    });
}

function updateThicknessOptions() {
    let selectedMaterial = materialSelect.value;
    thicknessSelect.innerHTML = '<option value="">-- Selectează --</option>';
    if (selectedMaterial) {
        materials[selectedMaterial].forEach(thickness => {
            let option = document.createElement("option");
            option.value = thickness;
            option.textContent = `${thickness} cm`;
            thicknessSelect.appendChild(option);
        });
    }
}


function calculateBricks() {
    let thickness = parseFloat(thicknessSelect.value);
    log(`Current Thickness is :${thickness}`);
    let volume = grandTotalArea * (thickness / 100);
    log(`Total Volume is:${volume}`);


    let selectedMaterial = materialSelect.value;

    if (brickData[selectedMaterial] && brickData[selectedMaterial][thickness]) {
        let brick = brickData[selectedMaterial][thickness];
        log(`current brick volume: ${brick.volume}`);
        let numarBucati = Math.ceil(volume / brick.volume);
        log(`Nr bucati is :${numarBucati}`)
        piecesPerPallet = Math.floor(numarBucati / brick.perPallet);
        piecesExtraPallet = numarBucati % brick.perPallet;
        log(`Numar bucati extrapalet: ${piecesExtraPallet}`);

        if (piecesExtraPallet > 0) {
            totalNumberOfPallets = piecesPerPallet + 1;
        } else {
            totalNumberOfPallets = piecesPerPallet;
        }

        brickResultBody.innerHTML = 
            `Material ales : ${selectedMaterial}<br>
             Dimensiune piesa : ${brick.size}<br>
             Cantitate necesara : ${numarBucati} buc.  (${(numarBucati * brick.volume).toFixed(2)} mc)<br>
             Număr de paleți intregi : ${piecesPerPallet} pal. <br>
             Numar de bucati extrapalet : ${piecesExtraPallet} buc.<br>
             Numar total paleti : ${ totalNumberOfPallets }.
             `;
        
            priceBlock.classList.remove("isHidden");
    } else {
        brickResultBody.innerHTML =
         `<span style="color:red">
            Te rugam selecteaza corect materialul si grosimea zidariei
         </span>
        `
    }
}







function addRecord() {
    let wallWidth = Number(widthInput.value.trim().replace(",", "."));
    log(`Lungimea introdusa: ${wallWidth}`)
    let wallHeight = Number(heightInput.value.trim().replace(",", "."));
    log(`Inaltimea introdusa: ${wallHeight}`);


    if (isNaN(wallWidth) || isNaN(wallHeight) ||
        wallWidth <= 0 || wallHeight <= 0) {
        log("Invalid input. Please enter positive numbers.");
        alert("Valoare nevalidă. Vă rugăm să introduceți numere pozitive în ambele câmpuri!");
        return;
    }
    else {
        
        const record = {
            id: Date.now(),
            widthItem: wallWidth,
            heightItem: wallHeight,
            itemArea: wallWidth * wallHeight
        }
        records.push(record);

        widthInput.value = "";
        heightInput.value = "";
        totalArea();
        updateUI();
    
    };
}

function updateUI() {
    recordsList.textContent = "";
    let counter = 0;

    records.forEach((record) => {
        counter++;
        
        let recordLiElement = document.createElement("li");
        recordLiElement.setAttribute("id", "recordLiElement");

        let recordIndex = document.createElement("p");
        recordIndex.setAttribute("id", "recordIndex");
        recordIndex.innerText = `${counter} . `

        let heightValue = document.createElement("p");
        heightValue.setAttribute("id", "heightValue");
        heightValue.innerText = `Înălțime: ${record.heightItem}m`;

        let widthValue = document.createElement("p");
        widthValue.setAttribute("id", "widthValue");
        widthValue.innerText = `Lățime: ${record.widthItem}m`;

        let areaValue = document.createElement("p");
        areaValue.setAttribute("id", "areaValue");
        areaValue.innerText = `Aria: ${(record.itemArea.toFixed(2))}m²`;
        
        let deleteRecordBtn = document.createElement("button");
        deleteRecordBtn.setAttribute("id", "deleteRecordBtn");
        deleteRecordBtn.innerText = "Sterge";
        deleteRecordBtn.addEventListener("click", () => deleteRecord(record.id));

        let duplicateBtn = document.createElement("button");
        duplicateBtn.innerText = "Duplica";
        duplicateBtn.setAttribute("id","duplicateBtn" );
        duplicateBtn.addEventListener("click", () => duplicateRecord(record.id));




        recordLiElement.appendChild(recordIndex);
        recordLiElement.appendChild(heightValue);
        recordLiElement.appendChild(widthValue);
        recordLiElement.appendChild(areaValue);
        recordLiElement.appendChild(duplicateBtn);
        recordLiElement.appendChild(deleteRecordBtn);

        recordsList.appendChild(recordLiElement);



    })
};

function deleteRecord(recordId) {
    records = records.filter(record => 
        recordId !== record.id
    );
    totalArea();
    updateUI();
    log(`Current list of records, after delete record is: "\n" ${JSON.stringify(records)} `);
    clearResultFields();
};

function duplicateRecord(recordId) {
    const original = records.find(record => recordId === record.id);
    if (original) {
        const duplicate = {
            id: Date.now(),
            widthItem: original.widthItem,
            heightItem: original.heightItem,
            itemArea:original.itemArea
        }
        records.push(duplicate);
        totalArea();
        updateUI();
        log(`Is a duplicate of record ${recordId}`);
        log(`Current list of records, after duplicate record is: "\n" ${JSON.stringify(records)} `);
        clearResultFields();
    }
}

function totalArea() {
    displayResult.classList.remove("isHidden");
    materialSelection.classList.remove("isHidden");
    grandTotalArea = 0;

    records.forEach((record) => {
        let currentArea = record.itemArea;
        grandTotalArea += currentArea;
        log(`Current grandTotalArea is: ${grandTotalArea}`);
    });
    totalAreaTitle.textContent = `Aria totala:`;
    totalAreaValue.textContent =`${grandTotalArea.toFixed(2)}  m\u00B2`
}

function applyCorrection() {
    let correctionValue = Number(correctionField.value.trim());

    if (isNaN(correctionValue)) {
        alert("Introduceți un număr valid!");
    setTimeout(() => {
        correctionField.value = "";
    }, 1500);
    return;
}
    log(`Correction value is: ${correctionValue}`);
    if (grandTotalArea >= correctionValue) {
        grandTotalArea = grandTotalArea - correctionValue;
        log(`New grandTotalArea value is : ${grandTotalArea}`);
    }
    
    totalAreaValue.textContent = `${grandTotalArea.toFixed(2)}  m\u00B2`;
    setTimeout(() => {
        correctionField.value = "";
    }, 1500);
    clearResultFields();
    updateUI();
}

function calculatePrice() {

    if (!validatePriceInputs()) return;

    const pp = parseFloat(palletPrice.value.replace(",", "."));
    const pu = parseFloat(unitPrice.value.replace(",", "."));
    const pw = parseFloat(palleteWarrant.value.replace(",", "."));

    const fullPalletPrice = pp * piecesPerPallet;
    const extraUnitPrice = pu * piecesExtraPallet;
    const warranty = pw * totalNumberOfPallets;
    const total = fullPalletPrice + extraUnitPrice + warranty;

    priceResultBody.innerHTML = `
        Pret paleti intregi: ${fullPalletPrice.toFixed(2)} RON<br>
        Pret unități extra palet: ${extraUnitPrice.toFixed(2)} RON<br>
        Garantii paleti: ${warranty.toFixed(2)} RON<br>
        Total (material + garantie): ${total.toFixed(2)} RON
    `;
}

function isStrictNumber(value) {
    return /^-?\d+([.,]?\d+)?$/.test(value.trim());
}

function validatePriceInputs() {
    const ppRaw = palletPrice.value.trim();
    const puRaw = unitPrice.value.trim();
    const pwRaw = palleteWarrant.value.trim();

    const errors = [];

    if (!ppRaw || !isStrictNumber(ppRaw)) {
        errors.push("Prețul per palet trebuie să fie un număr valid (ex: 123.45).");
    }

    if (!puRaw || !isStrictNumber(puRaw)) {
        errors.push("Prețul per unitate trebuie să fie un număr valid (ex: 5.50).");
    }

    if (!pwRaw || !isStrictNumber(pwRaw)) {
        errors.push("Valoarea garanției pe palet trebuie să fie un număr valid (ex: 20).");
    }

    if (errors.length > 0) {
        priceResultBody.innerHTML = `<span style="color:red">${errors.join("<br>")}</span>`;
        return false;
    }

    return true;
}



function resetAll() {
    records = [];
    grandTotalArea = 0;
    widthInput.value = "";
    heightInput.value = "";
    correctionField.value = "";
    materialSelect.value = "";
    thicknessSelect.innerHTML = "<option value=''>-- Selectează --</option>";
    brickResultBody.innerHTML = "";
    updateUI();
    totalArea();
    displayResult.classList.add("isHidden");
    materialSelection.classList.add("isHidden");
    priceBlock.classList.add("isHidden");
    palletPrice.value = "";
    unitPrice.value = "";
    palleteWarrant.value = "";
    priceResultBody.innerHTML = ``;
    document.body.classList.remove("withoutBackgroundImage");
    document.body.classList.add("withBackgroundImage");
}

function clearResultFields() {
    palletPrice.value = "";
    unitPrice.value = "";
    palleteWarrant.value = "";
    brickResultBody.innerHTML = "";
    priceResultBody.innerHTML = ``;   
}



//Event listeners
addBtn.addEventListener("click", addRecord);
correctionField.addEventListener("input", applyCorrection);
calculateBtn.addEventListener("click", calculateBricks);
resetBtn.addEventListener("click", resetAll);
materialSelect.addEventListener("change", () => {
    updateThicknessOptions();
    clearResultFields();
}
);
thicknessSelect.addEventListener("change", clearResultFields);
calculatePriceBtn.addEventListener("click", calculatePrice);
heightInput.addEventListener("input", () => {
    document.body.classList.remove("withBackgroundImage");
    document.body.classList.add("withoutBackgroundImage");
    resetBtn.classList.remove("isHidden");
});
widthInput.addEventListener("input", () => {
    document.body.classList.remove("withBackgroundImage");
    document.body.classList.add("withoutBackgroundImage");
    resetBtn.classList.remove("isHidden");

});

//Init
populateMaterials();
