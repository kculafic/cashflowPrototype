let clicked = document.getElementById("runner");

let cashFlowArray = [];

let year = 2018;
let retirementAge = 62;
let lifeExpectancy = 90;

clicked.onclick = run;

function run() {
  console.log('clicked');
  projectionMaker(1000000, 100000, 30000, .0375, 55, 50000);
  renderTable();

}

function projectionMaker(initialSavings, salary, yearlySavings, rate, age, desiredRetirementPension) {
  let timeLeftAlive = lifeExpectancy - age;

    for (let i=0; i<=timeLeftAlive; i++) {
    let obj = new Object();

      if (age >= retirementAge) {
        obj.retiredStatus = true;
      } else {
        obj.retiredStatus = false;
      }

      obj.age = age;
      age++;
      obj.year = year++;

      if (i === 0) {
        let begBal = initialSavings;
        let interest = (begBal * rate)
        let acc = begBal + interest + yearlySavings;
        // let dec = acc - desiredRetirementPension;
        // dec = Math.round(dec * 100) / 100;

        obj.begBalance = initialSavings;
        obj.salary = salary;
        obj.interest = interest;
        obj.yearlySavings = yearlySavings;

        if (obj.retiredStatus) {
          obj.desiredRetirementPension = desiredRetirementPension;
        } else {
          obj.desiredRetirementPension = 0;
        }

        obj.endBal = acc;

      } else if (obj.retiredStatus === true) {

        let pensionInflation;
        let pensionAdjustedForInflation;

        if (cashFlowArray[i-1].desiredRetirementPension > 0) {
          pensionInflation = (cashFlowArray[i-1].desiredRetirementPension * 0.03)
          pensionAdjustedForInflation = pensionInflation + cashFlowArray[i-1].desiredRetirementPension;
        } else {
          pensionAdjustedForInflation = desiredRetirementPension;
        }

        let begBal = cashFlowArray[i-1].endBal;
        let interest = (begBal * rate)
        let acc = begBal + interest;
        let dec = acc - desiredRetirementPension;
        dec = Math.round(dec * 100) / 100;

        obj.begBalance = dec;
        obj.salary = 0;
        obj.interest = Math.round(interest * 100) / 100;
        obj.yearlySavings = 0;
        obj.desiredRetirementPension = Math.round(pensionAdjustedForInflation * 100) / 100;
        obj.endBal = dec;

      } else if (obj.retiredStatus === false) {
        let salaryInterest = (cashFlowArray[i-1].salary * 0.03)
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
      cell.innerText = cashFlowArray[i][key];
      var newRowHolder = newRow.insertCell();
      newRowHolder.appendChild(cell);
    }
    newRow = null;
  }
}
