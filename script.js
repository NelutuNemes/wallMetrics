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

displayResult.classList.add("isHidden");

let records = [];
log(`Start list of records is: "\n" ${JSON.stringify(records)} `);


addBtn.addEventListener("click", addRecord);



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
        deleteRecordBtn.innerText = "Delete";
        deleteRecordBtn.addEventListener("click", () => deleteRecord(record.id));

        let duplicateBtn = document.createElement("button");
        duplicateBtn.innerText = "Duplicate";
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
    let grandTotalArea = 0;

    records.forEach((record) => {
        let currentArea = record.itemArea;
        grandTotalArea += currentArea;
        log(`Current grandTotalArea is: ${grandTotalArea}`);
    });
    totalAreaTitle.textContent = `Suprafata totala:`;
    totalAreaValue.textContent =`${grandTotalArea.toFixed(2)}  m\u00B2`
}

