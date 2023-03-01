import "date-fns";
import {
  add,
  addMonths,
  getMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getUnixTime,
  fromUnixTime,
} from "date-fns/esm";

const datePickerButton = document.querySelector(".date-picker-button");
const datePicker = document.querySelector(".date-picker");
const datePickerHeaderText = document.querySelector(".current-month");
const dateNodes = document.querySelectorAll(".date");
const nextMonth = document.querySelector(".next-month-button");
const prevMonth = document.querySelector(".prev-month-button");
const grid = document.querySelector(".date-picker-grid-dates");
let prevButton = undefined;

let assumedDate = new Date();
setupDatePicker();


datePickerButton.dataset.date = getUnixTime(assumedDate);

// get list of dates between months

function setupDates(month) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);

  const daysOfMonth = eachDayOfInterval({
    start: new Date(startWeek),
    end: new Date(endWeek),
  });

  // date picker button date
  const btnUnixTime = datePickerButton.dataset.date;
  grid.innerHTML = "";
  daysOfMonth.forEach((date) => {
    const dateBtn = document.createElement("button");
    dateBtn.innerText = date.getDate();
    dateBtn.classList.add("date");
    dateBtn.addEventListener("click", selectDate);
    dateBtn.dataset.dateId = getUnixTime(date);

    if (getUnixTime(date) == btnUnixTime) {
      dateBtn.classList.add("selected");
    }

    if (getMonth(date) !== getMonth(month))
      dateBtn.classList.add("date-picker-other-month-date");
    grid.appendChild(dateBtn);
  });
}

function selectDate(e) {
  const dateBtn = e.target;
  assumedDate = fromUnixTime(dateBtn.dataset.dateId)
  datePickerButton.dataset.date = (dateBtn.dataset.dateId);
  datePickerButton.innerText = format(assumedDate, "MMMM dd, yyyy");

  if (prevButton !== undefined) {
    prevButton.classList.remove("selected");
    prevButton = dateBtn;
  } else {
    console.log("here", dateBtn);
    prevButton = dateBtn;
  }
  dateBtn.classList.add("selected");
  setDate(assumedDate);
}

datePickerButton.addEventListener("click", () => {
  datePicker.classList.toggle("show");
  const dateFromBtn = datePickerButton.dataset.date;
  setupDates(fromUnixTime(dateFromBtn));
  setDate(fromUnixTime(dateFromBtn));
});

function setupDatePicker() {
  prevMonth.addEventListener("click", () => {
    console.log("in prev");
    const newDate = subMonths(new Date(assumedDate), 1);
    assumedDate = newDate;
    setupDates(assumedDate);
    setDate(assumedDate);
  });
  nextMonth.addEventListener("click", (e) => {
    const newDate = addMonths(new Date(assumedDate), 1);
    console.log(newDate.toISOString());
    assumedDate = newDate;
    setupDates(assumedDate);
    setDate(assumedDate);
  });
  setupDates(assumedDate);
  setDate(assumedDate);
}

function setDate(date) {
//   datePickerButton.innerText = format(date, "MMMM dd, yyyy");
  datePickerHeaderText.innerText = format(date, "MMMM - yyyy");
}
