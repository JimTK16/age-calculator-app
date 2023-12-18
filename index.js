const submitBtn = document.querySelector(".btn-submit");
const dayInputEle = document.getElementById("input-day");
const monthInputEle = document.getElementById("input-month");
const yearInputEle = document.getElementById("input-year");

const resultYearsEle = document.querySelector(".result-years");
const resultMonthsEle = document.querySelector(".result-months");
const resultDaysEle = document.querySelector(".result-days");

const currentDateObj = new Date();
const currentYear = currentDateObj.getFullYear();
const currentMonth = currentDateObj.getMonth();
const currentDate = currentDateObj.getDate();

// Get the total number of days in a specific month
function getTotalDays(month, year) {
  return new Date(year, month, 0).getDate();
}

//Check the validity of each input, setting the error state and error message depends on each situation
function checkDay(dayInput, monthInput, yearInput) {
  if (dayInput.trim() === "") {
    setErrorState(false, dayInputEle);
    setErrorMessage(dayInputEle, "This field is required");
    return false;
  } else if (dayInput.trim() !== "" && dayInput > 31) {
    setErrorState(false, dayInputEle);
    setErrorMessage(dayInputEle, "Must be a valid day");
    return false;
  } else {
    if (checkMonth(monthInput) && checkYear(yearInput)) {
      // get total days of the month
      const totalDaysofMonth = getTotalDays(monthInput, yearInput);
      if (dayInput > totalDaysofMonth) {
        setErrorState(false, dayInputEle);
        setErrorMessage(dayInputEle, "Must be a valid day");
        return false;
      } else {
        setErrorState(true, dayInputEle);
        return true;
      }
    }

    if (!checkMonth(monthInput) || !checkYear(yearInput)) {
      setErrorState(true, dayInputEle);
      return true;
    }
  }
}

function checkMonth(input) {
  if (input.trim() === "") {
    setErrorState(false, monthInputEle);
    setErrorMessage(monthInputEle, "This field is required");
    return false;
  } else if ((input.trim() !== "") & (input < 1 || input > 12)) {
    setErrorState(false, monthInputEle);
    setErrorMessage(monthInputEle, "Must be a valid month");
    return false;
  } else {
    setErrorState(true, monthInputEle);
    return true;
  }
}

function checkYear(input) {
  if (input.trim() === "") {
    setErrorState(false, yearInputEle);
    setErrorMessage(yearInputEle, "This field is required");
    return false;
  } else if ((input.trim() !== "") & (input > currentYear)) {
    setErrorState(false, yearInputEle);
    setErrorMessage(yearInputEle, "Must be in the past");
    return false;
  } else {
    setErrorState(true, yearInputEle);
    return true;
  }
}

// Setting the error state of each input depends on the validity
function setErrorState(inputIsValid, inputEle) {
  inputWrapperEle = inputEle.parentElement;
  if (!inputIsValid) {
    inputWrapperEle.classList.add("input-wrapper-error");
  } else {
    inputWrapperEle.classList.remove("input-wrapper-error");
  }
}

//Setting the error message for each input
function setErrorMessage(inputEle, message) {
  const errorMessageEle = inputEle.nextElementSibling;
  errorMessageEle.textContent = message;
}

//Animate the change of numbers in result section
function animateResult(ele, result) {
  if (result === 0) {
    ele.textContent = result;
  } else {
    let counter = 0;
    const countdown = setInterval(() => {
      counter++;
      ele.textContent = counter;
      if (counter === result) {
        clearInterval(countdown);
      }
    }, 20);
  }
}

// prevent special character [. , e]
[dayInputEle, monthInputEle, yearInputEle].map((ele) =>
  ele.addEventListener("keydown", (event) => {
    const codes = ["KeyE", "Period", "Minus"];
    if (codes.includes(event.code)) {
      event.preventDefault();
      return;
    }
  })
);

function submitHandler(event) {
  event.preventDefault();
  const dayInput = dayInputEle.value;
  const monthInput = monthInputEle.value;
  const yearInput = yearInputEle.value;

  let formIsValid;

  [dayInputEle, monthInputEle, yearInputEle].map((ele) => {
    if (ele === monthInputEle) {
      checkMonth(monthInput);
    } else if (ele === yearInputEle) {
      checkYear(yearInput);
    } else if (ele === dayInputEle) {
      checkDay(dayInput, monthInput, yearInput);
    }
  });

  formIsValid =
    checkDay(dayInput, monthInput, yearInput) &&
    checkMonth(monthInput) &&
    checkYear(yearInput);

  if (formIsValid) {
    const dobObj = new Date(yearInput, monthInput - 1, dayInput);

    if (currentDateObj < dobObj) {
      setErrorState(false, yearInputEle);
      setErrorMessage(yearInputEle, "Must be in the past");
      return;
    }

    let year = currentDateObj.getFullYear() - dobObj.getFullYear();
    let month = currentDateObj.getMonth() - dobObj.getMonth();
    let day = currentDateObj.getDate() - dobObj.getDate();

    if (day < 0) {
      month--;
      day += new Date(
        currentDateObj.getFullYear(),
        currentDateObj.getMonth(),
        0
      ).getDate();
    }

    if (month < 0) {
      year--;
      month += 12;
    }

    animateResult(resultDaysEle, day);
    animateResult(resultMonthsEle, month);
    animateResult(resultYearsEle, year);
  }
}

submitBtn.addEventListener("click", submitHandler);
