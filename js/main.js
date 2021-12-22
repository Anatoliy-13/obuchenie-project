// 'use strict';
/*jshint esversion: 6 */

let startBtn = document.getElementById("start"),
  budgetValue = document.getElementsByClassName("budget-value")[0],
  dayBudgetValue = document.getElementsByClassName("daybudget-value")[0],
  levelValue = document.getElementsByClassName("level-value")[0],
  expensesValue = document.getElementsByClassName("expenses-value")[0],
  optionalExpensesValue = document.getElementsByClassName(
    "optionalexpenses-value"
  )[0],
  incomeValue = document.getElementsByClassName("income-value")[0],
  monthSavingsValue = document.getElementsByClassName("monthsavings-value")[0],
  yearSavingsValue = document.getElementsByClassName("yearsavings-value")[0],
  expensesItem = document.getElementsByClassName("expenses-item"),
  expensesBtn = document.getElementsByTagName("button")[0],
  optionalExpensesBtn = document.getElementsByTagName("button")[1],
  countBtn = document.getElementsByTagName("button")[2],
  optionalExpensesItem = document.querySelectorAll(".optionalexpenses-item"),
  incomeItem = document.querySelector(".choose-income"),
  checkSavings = document.querySelector("#savings"),
  sumValue = document.querySelector(".choose-sum"),
  percentValue = document.querySelector(".choose-percent"),
  yearValue = document.querySelector(".year-value"),
  monthValue = document.querySelector(".month-value"),
  dayValue = document.querySelector(".day-value");

let money, time;

expensesBtn.disabled = true; // Если программа еще не запущена (не нажали кнопку "Начать расчет") - сделать кнопки неактивными//
optionalExpensesBtn.disabled = true;
countBtn.disabled = true;

startBtn.addEventListener("click", function () {
  // начало работы, кнопка "начать расчет", отображение ввода даты и дохода за месяц//
  time = prompt("Введите дату в формате YYYY-MM-DD", "");
  money = +prompt("Ваш бюджет на месяц?", "");

  while (isNaN(money) || money == "" || money == null) {
    money = prompt("Ваш бюджет на месяц?", "");
  }
  appData.budget = money;
  appData.timeData = time;
  budgetValue.textContent = money.toFixed(); // budgetValue не является input, вод данных пользователя происходит методом .textContent //
  yearValue.value = new Date(Date.parse(time)).getFullYear(); // так как yearValue является input-вводом, то приминяем .value для ввода данных пользователем//
  monthValue.value = new Date(Date.parse(time)).getMonth() + 1; //  +1 появляется ввиду того, что месяц январь будет первым месяцем в году и в явескрипте это "0", поэтому нужно к 0+1=1 первый месяц года//
  dayValue.value = new Date(Date.parse(time)).getDay();

  expensesBtn.disabled = false; //Если программа еще не запущена (не нажали кнопку "Начать расчет") - сделать кнопки неактивными//
  optionalExpensesBtn.disabled = false;
  countBtn.disabled = false;
});

expensesBtn.addEventListener("click", function () {
  //обработка и учет всех обязательных расходов//
  let sum = 0;

  for (let i = 0; i < expensesItem.length; i++) {
    // кол-во обязательных расходов -expensesItem.length, т.е какое кол-во раз пользователь введет свои расходы, это может 3 или 30 раз, программа будет видеть эти расходы и суммировать их все вместе//
    let a = expensesItem[i].value, // prompt("Введите обязательную статью расходов в этом месяце", "") поменяли на expensesItem[i].value, так как наш элемент expenses-Item является input, то применяем .value//
      b = expensesItem[++i].value; //prompt("Во сколько обойдется?", "") поменяли на expensesItem[++i].value,  [++i] показывает, что это следующий элемент после элемента [i] //
    if (
      typeof a != null &&
      typeof b != null &&
      a != "" &&
      b != "" &&
      a.length < 50
    ) {
      console.log("Все верно");
      appData.expenses[a] = b; // в гланый массив будет вводится описание расходов и их ценник //
      sum += +b; // +b знак "+" переводит значения, введенные пользователем в ЧИСЛО, а не в текс или строку// // sum += +b каждый раз к сумме прибавляем значение b //
    } else {
      i = i - 1;
    }
    expensesValue.textContent = sum; //div class="expenses">Обязательные расходы:, (class="expenses-value")  суда вводим сумму всех расходов //
  }
});

optionalExpensesBtn.addEventListener("click", function () {
  //Вводим необязательные расходы
  for (let i = 0; i < optionalExpensesItem.length; i++) {
    let opt = optionalExpensesItem[i].value; //prompt("Статья необязательных расходов?", "") земенили как в прошлый раз, смотри выше //
    appData.optionalExpenses[i] = opt;
    optionalExpensesValue.textContent += appData.optionalExpenses[i] + " ";
  }
});

countBtn.addEventListener("click", function () {
  if (appData.budget != undefined) {
    appData.moneyPerDay = (
      (appData.budget - +expensesValue.textContent) /
      30
    ).toFixed();
    dayBudgetValue.textContent = appData.moneyPerDay;

    if (appData.moneyPerDay < 100) {
      levelValue.textContent = "Минимальный уровень достатка";
    } else if (appData.moneyPerDay > 100 && appData.moneyPerDay < 2000) {
      levelValue.textContent = "Средний уровень достатка";
    } else if (appData.moneyPerDay > 2000) {
      levelValue.textContent = "Высокиий уровень достатка";
    } else {
      levelValue.textContent = "Произошла ошибка";
    }
  } else {
    dayBudgetValue.textContent = "Произошла ошибка";
  }
});

incomeItem.addEventListener("input", function () {
  //Введите статьи возможного дохода через запятую //
  let items = incomeItem.value;
  appData.income = items.split(", ");
  incomeValue.textContent = appData.income;
});

checkSavings.addEventListener("click", function () {
  //Есть ли накопления://
  if (appData.savings == true) {
    //если стоит галочка, значит мы ее отменяем и наоборот//
    appData.savings = false;
  } else {
    appData.savings = true;
  }
});

sumValue.addEventListener("input", function () {
  //Сумма//
  if (appData.savings == true) {
    let sum = +sumValue.value,
      percent = +percentValue.value;

    appData.monthIncome = (sum / 100 / 12) * percent; // расчет на 1 месяц//
    appData.yearIncome = (sum / 100) * percent; // расчет на 1 год//

    monthSavingsValue.textContent = appData.monthIncome.toFixed(1);
    yearSavingsValue.textContent = appData.yearIncome.toFixed(1);
  }
});

percentValue.addEventListener("input", function () {
  // Процент//
  if (appData.savings == true) {
    let sum = +sumValue.value,
      percent = +percentValue.value;

    appData.monthIncome = (sum / 100 / 12) * percent; // расчет на 1 месяц//
    appData.yearIncome = (sum / 100) * percent; // расчет на 1 год//

    monthSavingsValue.textContent = appData.monthIncome.toFixed(1);
    yearSavingsValue.textContent = appData.yearIncome.toFixed(1);
  }
});

let appData = {
  budget: money,
  timeData: time,
  expenses: {},
  optionalExpenses: {},
  income: [],
  savings: false,
};
