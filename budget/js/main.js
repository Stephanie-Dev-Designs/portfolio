// budget - expense starts 
const list = document.getElementById("list");

//buttons
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
//errors
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");

//display
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");

//inputs
let totalAmount = document.getElementById("total-amount");
let tempAmount = 0;

const productTitle = document.getElementById("product-title");
let userAmount = document.getElementById("user-amount");
const mandatoryExp = document.getElementById("mandatory-expense");


//Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  //empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    //Set Budget
    amount.innerHTML = tempAmount;
    //Set Balance
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    //Clear Input Box
    totalAmount.value = "";
  }
});

//Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;


  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    let mandText = parentDiv.querySelector(".product-item").getAttribute("data-id");
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    mandatoryExp.checked = mandText;
    disableButtons(true);
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
};

//Function To Create List
const listCreator = (expenseName, expenseValue, mandatory) => {
  let sublistContent = document.createElement("div");

  if(mandatory) {
    sublistContent.classList.add("sublist-content", "flex-space", "mandatory");
  } else {
    sublistContent.classList.add("sublist-content", "flex-space");
  }

  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product" data-id="${mandatory}">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
};

//Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  //empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  } else if(tempAmount== 0) {
    alert("You need to set a budget Amount First");
    return false;
  }

  //Enable buttons
  disableButtons(false);
  modifyElement(editButton, true);
  //Expense
  let expenditure = parseInt(userAmount.value);
  //Total expense (existing + new)
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  //Total balance(budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  //Create list
  listCreator(productTitle.value, userAmount.value, mandatoryExp.checked);
  //Empty inputs
  productTitle.value = "";
  userAmount.value = "";
  mandatoryExp.checked = false;
});

function clearText(event) {
  // access input field
  let input1 = document.getElementById('amount');
  // clear the input field.
  input1.value = "";
}
// budget - expense ends 








