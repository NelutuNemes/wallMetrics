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

const heightInput = document.getElementById("height-input");
const widthInput = document.getElementById("width-input");
let addBtn = document.getElementById("add-btn");
let recordsList = document.getElementById("records-list");

let displayResult = document.getElementById("display-result");
let totalAreaTitle = document.getElementById("total-area-title");
let totalAreaValue = document.getElementById("total-area-value");

let correctionField = document.getElementById("correction-field");

const materialSelect = document.getElementById("material-select");
const thicknessSelect = document.getElementById("thickness-select");
const calculateBtn = document.getElementById("calculate-bricks-btn");
const resetBtn = document.getElementById("reset-btn");
const brickResultBody = document.getElementById("brick-result-text");

displayResult.classList.add("isHidden");
let records = [];
log(`Start list of records is: "\n" ${JSON.stringify(records)} `);
let grandTotalArea;

const materials = {
    "Caramida": [24, 29, 12],
    "BCA": [10, 15, 20, 25, 30]
};

function populateMaterials() {
    materialSelect.innerHTML = '<option value=""></option>';
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

function checkFormCompletion() {
    calculateBtn.disabled = !(materialSelect.value && thicknessSelect.value && grandTotalArea > 0);
}

function calculateBricks() {
    let thickness = parseFloat(thicknessSelect.value);
    let volume = grandTotalArea * (thickness / 100);

    let brickData = {
        "Caramida": {
            24: { size: "24x29x19", volume: 24 * 29 * 19 / 1000000 },
            29: { size: "24x29x19", volume: 24 * 29 * 19 / 1000000 },
            12: { size: "48x12x19", volume: 48 * 12 * 19 / 1000000 }
        },
        "BCA": {
            10: { size: "10x25x62.4", volume: 10 * 25 * 62.4 / 1000000 },
            15: { size: "15x25x62.4", volume: 15 * 25 * 62.4 / 1000000 },
            20: { size: "20x25x62.4", volume: 20 * 25 * 62.4 / 1000000 },
            25: { size: "25x25x62.4", volume: 25 * 25 * 62.4 / 1000000 },
            30: { size: "30x25x62.4", volume: 30 * 25 * 62.4 / 1000000 }
        }
    };

    let selectedMaterial = materialSelect.value;
    
    // Verifică dacă grosimea selectată există pentru materialul ales
    if (brickData[selectedMaterial] && brickData[selectedMaterial][thickness]) {
        let brick = brickData[selectedMaterial][thickness];
        let numarBucati = Math.ceil(volume / brick.volume);

        document.getElementById("brick-result-text").textContent = 
            `Material: ${selectedMaterial}\nDimensiune ${brick.size}: ${numarBucati} bucăți`;
    } else {
        document.getElementById("brick-result-text").textContent = 
            "Nu există dimensiunea corespunzătoare pentru această grosime!";
    }
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
}



addBtn.addEventListener("click", addRecord);
correctionField.addEventListener("input", applyCorrection);
calculateBtn.addEventListener("click", calculateBricks);
resetBtn.addEventListener("click", resetAll);
materialSelect.addEventListener("change", updateThicknessOptions);
populateMaterials();


function addRecord() {
    let wallWidth = Number(widthInput.value.trim().replace(",", "."));
    log(`Lungimea introdusa: ${wallWidth}`)
    let wallHeight = Number(heightInput.value.trim().replace(",", "."));
    log(`Inaltimea introdusa: ${wallHeight}`);


    if (isNaN(wallWidth) || isNaN(wallHeight) ||
        wallWidth <= 0 || wallHeight <= 0) {
        log("Invalid input. Please enter positive numbers.");
        alert("Invalid input. Please enter positive numbers in all fields!");
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
        areaValue.innerText = `Suprafata: ${record.itemArea}m²`;
        
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

    }
}

function totalArea() {
    displayResult.classList.remove("isHidden");
    grandTotalArea = 0;

    records.forEach((record) => {
        let currentArea = record.itemArea;
        grandTotalArea += currentArea;
        log(`Current grandTotalArea is: ${grandTotalArea}`);
    });
    totalAreaTitle.textContent = `Suprafata totala:`;
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
    updateUI();
}

