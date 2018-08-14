let clicked = document.getElementById("runner");

let cashFlowArray = [];
let year = 2018;
let retirementAge = 65;
let lifeExpectancy = 90;

let salaryInput = document.getElementById("salaryinput");
let ageInput = document.getElementById("ageinput");
let savingsInput = document.getElementById("savingsinput");
let pensionInput = document.getElementById("pensioninput");
let retirementAgeInput = document.getElementById("retirementageinput");
let lifeExpectencyInput = document.getElementById("lifeinput");
let yearlySavingsInput = document.getElementById("yearlysavingsinput");

clicked.onclick = run;

function run() {
  let salaryInputToNum = parseInt(salaryInput.value);
  let ageInputToNum = parseInt(ageInput.value);
  let savingsInputToNum = parseInt(savingsInput.value);
  let pensionInputToNum = parseInt(pensionInput.value);
  let retirementAgeInputToNum = parseInt(retirementAgeInput.value);
  retirementAge = retirementAgeInputToNum;
  let lifeExpectencyInputToNum = parseInt(lifeExpectencyInput.value);
  lifeExpectancy = lifeExpectencyInputToNum;
  let yearlySavingsInputToNum = parseInt(yearlySavingsInput.value);

  projectionMaker(savingsInputToNum, salaryInputToNum, yearlySavingsInputToNum, .0375, ageInputToNum, pensionInputToNum);
  renderTable();
}

function projectionMaker(initialSavings, salary, yearlySavings, rate, age, desiredRetirementPension) {
  let timeLeftAlive = lifeExpectancy - age;
  for (let i=0; i<=timeLeftAlive; i++) {
    let obj = new Object();

    if (age >= retirementAge) {
      obj.retiredStatus = true;
    }
    else {
      obj.retiredStatus = false;
    }

    obj.age = age;
    age++;
    obj.year = year++;

    if (i === 0) {
      let begBal = initialSavings;
      let interest = (begBal * rate)
      let acc = begBal + interest + yearlySavings;

      obj.begBalance = initialSavings;
      obj.salary = salary;
      obj.interest = interest;
      obj.yearlySavings = yearlySavings;

      if (obj.retiredStatus) {
        obj.desiredRetirementPension = desiredRetirementPension;
      }
      else {
        obj.desiredRetirementPension = 0;
      }

      obj.endBal = acc;
    }
    else if (obj.retiredStatus === true) {
      let pensionInflation;
      let pensionAdjustedForInflation;

      if (cashFlowArray[i-1].desiredRetirementPension > 0) {
        pensionInflation = (cashFlowArray[i-1].desiredRetirementPension * 0.03)
        pensionAdjustedForInflation = pensionInflation + cashFlowArray[i-1].desiredRetirementPension;
      }
      else {
        pensionAdjustedForInflation = desiredRetirementPension;
      }

      let begBal = cashFlowArray[i-1].endBal;
      let interest = (begBal * rate)
      let acc = begBal + interest;
      let dec = acc - pensionAdjustedForInflation;
      dec = Math.round(dec * 100) / 100;

      obj.begBalance = cashFlowArray[i-1].endBal;
      obj.salary = 0;
      obj.interest = Math.round(interest * 100) / 100;
      obj.yearlySavings = 0;
      obj.desiredRetirementPension = Math.round(pensionAdjustedForInflation * 100) / 100;
      obj.endBal = dec;

    }
    else if (obj.retiredStatus === false) {
      let salaryInterest = (cashFlowArray[i-1].salary * 0.025)
      let salaryAdjustedForInflation = salaryInterest + cashFlowArray[i-1].salary;

      let begBal = cashFlowArray[i-1].endBal;
      let interest = (begBal * rate)
      let acc = begBal + interest + yearlySavings;
      acc = Math.round(acc * 100) / 100;

      obj.begBalance = cashFlowArray[i-1].endBal;
      obj.salary = Math.round(salaryAdjustedForInflation * 100) / 100;
      obj.interest = Math.round(interest * 100) / 100;;
      obj.yearlySavings = yearlySavings;
      obj.desiredRetirementPension = 0;
      obj.endBal = acc;
    }
    cashFlowArray.push(obj)
  }
}

let tableRef = document.getElementById("tbody");

function renderTable() {
  for(let i = 0; i < cashFlowArray.length; i++) {
    let newRow = tableRef.insertRow();

    for (var key in cashFlowArray[i]) {
      var cell = document.createElement("td");

      if (key === 'begBalance' || key === 'salary' || key === 'interest' || key === 'yearlySavings' || key === 'desiredRetirementPension' || key === 'endBal') {
        cell.innerText = accounting.formatMoney(cashFlowArray[i][key]);
      }
      else {
        cell.innerText = cashFlowArray[i][key];
      }
      var newRowHolder = newRow.insertCell();
      newRowHolder.appendChild(cell);
    }
    newRow = null;
  }
}
