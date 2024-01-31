const HIDDEN_CLASS = "hidden";
const MARK_AS_DONE_CLASS = "checkbox-done";

// Notification Alert Variables
const notificationBtn = document.querySelector(
  ".tag .notification .notification-btn"
);
const notificationAlert = document.querySelector(
  ".tag .notification .notification-alert"
);

// Profile Dropdown Variables
const dropdownBtn = document.querySelector(".tag .dropdown .dropdown-btn");
const dropdownMenu = document.querySelector(".tag .dropdown .dropdown-menu");

const menuItems = document.querySelectorAll(
  ".tag .dropdown .dropdown-menu .menu-item"
);
const firstMenuItem = menuItems[0];
const lastMenuItem = menuItems[menuItems.length - 1];

// Alert Bar Variables
const alertBar = document.querySelector("main .alert-bar");
const alertBarCloseBtn = document.querySelector("main .alert-bar .close");

// Guide & Progress bar Variables
let indexOfOpenStep = 0;
let checkedCount = 0;
const minimizeGuideBtn = document.querySelector("#guide-header .minimize-btn");
const guideBody = document.querySelector("#guide-body");
const guideSteps = document.querySelectorAll("#guide-body .guide-step");
const progressBar = document.querySelector(".progress-bar");
const progressBarCount = document.querySelector(".progress-bar .count");
const progressBarRect = document.querySelector(".progress-bar .progress-rect");
const checkboxBtns = document.querySelectorAll(".checkbox");

// Functions
function toggleNotificationBtn() {
  notificationBtn.addEventListener("click", () => {
    notificationAlert.classList.toggle(HIDDEN_CLASS);
  });
}
const isDropdownMenuHidden = () =>
  dropdownMenu.classList.contains(HIDDEN_CLASS);

function openProfileDropdown() {
  dropdownMenu.classList.remove(HIDDEN_CLASS);
  firstMenuItem.focus();
}
function closeProfileDropdown() {
  dropdownMenu.classList.add(HIDDEN_CLASS);
  dropdownBtn.focus();
}

function toggleProfileDropdownBtn() {
  dropdownBtn.addEventListener("click", () => {
    // Unhide menu and put focus on the first menu-item (when hidden)
    if (isDropdownMenuHidden()) {
      openProfileDropdown();
    } // Hide menu and return focus to the dropdown-menu btn (when not hidden)
    else {
      closeProfileDropdown();
    }
  });
}

function closeMenusWithEscapeKey() {
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      if (!isDropdownMenuHidden()) closeProfileDropdown();
      notificationAlert.classList.add(HIDDEN_CLASS);
    }
  });
}

function navMenuItemsWithArrowKeys(e, index) {
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    index === 0 ? lastMenuItem.focus() : menuItems[index - 1].focus();
  }
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    index === menuItems.length - 1
      ? firstMenuItem.focus()
      : menuItems[index + 1].focus();
  }
}

function closeAlertBar() {
  alertBarCloseBtn.addEventListener("click", (e) =>
    alertBar.classList.toggle(HIDDEN_CLASS)
  );
}

function minimizeOrMaximizeGuide() {
  minimizeGuideBtn.addEventListener("click", (e) => {
    const isMinimized = guideBody.classList.contains(HIDDEN_CLASS);
    guideBody.classList.toggle(HIDDEN_CLASS);

    minimizeGuideBtn.style.transform = isMinimized
      ? "rotate(0deg)"
      : "rotate(180deg)";

    collapseGuideStep(indexOfOpenStep);
    expandGuideStep(0);
  });
}

function expandGuideStep(index) {
  const step = guideSteps[index];
  const details = step.querySelector(".details");
  const btnContainer = step.querySelector(".btn-container");
  const heroImg = step.querySelector(".desktop-hero");

  if (!step.classList.contains("active")) {
    [heroImg, details, btnContainer].forEach((el) =>
      el.classList.remove(HIDDEN_CLASS)
    );
    step.classList.add("active");
  }
  indexOfOpenStep = index;
}

function collapseGuideStep(index) {
  const step = guideSteps[index];
  const details = step.querySelector(".details");
  const btnContainer = step.querySelector(".btn-container");
  const heroImg = step.querySelector(".desktop-hero");

  if (step.classList.contains("active")) {
    [heroImg, details, btnContainer].forEach((el) =>
      el.classList.add(HIDDEN_CLASS)
    );
    step.classList.remove("active");
  }
}

function handleMarkAsDone(
  checkboxBtn,
  notCompletedIcon,
  completedIcon,
  loadingSpinnerIcon,
  checkboxBtnStatus,
  ariaLabel
) {
  notCompletedIcon.classList.add(HIDDEN_CLASS);
  loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);
  checkboxBtnStatus.setAttribute("aria-label", "Loading. Please wait...");

  setTimeout(() => {
    loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
    completedIcon.classList.remove(HIDDEN_CLASS);

    checkboxBtnStatus.setAttribute("aria-label", `${ariaLabel} successful.`);
    checkboxBtn.setAttribute("aria-checked", "true");
    progressBarCount.textContent = ++checkedCount;
    progressBar.setAttribute("aria-valuenow", `${checkedCount}`);
    progressBarRect.setAttribute("width", `${(checkedCount * 72) / 5}`);
    checkboxBtn.classList.add(MARK_AS_DONE_CLASS);
  }, 3000);
}

function handleMarkAsNotDone(
  checkboxBtn,
  notCompletedIcon,
  completedIcon,
  loadingSpinnerIcon,
  checkboxBtnStatus,
  ariaLabel
) {
  completedIcon.classList.add(HIDDEN_CLASS);
  loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);
  checkboxBtnStatus.setAttribute("aria-label", "Loading. Please wait...");

  setTimeout(() => {
    loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
    notCompletedIcon.classList.remove(HIDDEN_CLASS);

    checkboxBtnStatus.setAttribute(
      "aria-label",
      `${ariaLabel.replace("done", "not done")} successful.`
    );
    checkboxBtn.setAttribute("aria-checked", "false");
    progressBarCount.textContent = --checkedCount;
    progressBar.setAttribute("aria-valuenow", `${checkedCount}`);
    progressBarRect.setAttribute("width", `${(checkedCount * 72) / 5}`);
    checkboxBtn.classList.remove(MARK_AS_DONE_CLASS);
  }, 3000);
}

function handleMarkDoneOrNotDone(index) {
  const checkboxBtn = checkboxBtns[index];
  const notCompletedIcon = checkboxBtn.querySelector("#not-completed-icon");
  const completedIcon = checkboxBtn.querySelector("#completed-icon");
  const loadingSpinnerIcon = checkboxBtn.querySelector("#loading-spinner-icon");
  const checkboxBtnStatus = guideSteps[index].querySelector(".checkbox-status");
  const ariaLabel = checkboxBtn.getAttribute("aria-label");
  const isMarkedDone = checkboxBtn.classList.contains(MARK_AS_DONE_CLASS);

  if (isMarkedDone)
    handleMarkAsNotDone(
      checkboxBtn,
      notCompletedIcon,
      completedIcon,
      loadingSpinnerIcon,
      checkboxBtnStatus,
      ariaLabel
    );
  else
    handleMarkAsDone(
      checkboxBtn,
      notCompletedIcon,
      completedIcon,
      loadingSpinnerIcon,
      checkboxBtnStatus,
      ariaLabel
    );
}

(() => {
  toggleNotificationBtn();
  toggleProfileDropdownBtn();
  closeMenusWithEscapeKey();
  closeAlertBar();
  minimizeOrMaximizeGuide();

  // Navigate menu with arrow keys feature
  menuItems.forEach((menuItem, index) =>
    menuItem.addEventListener("keydown", (e) =>
      navMenuItemsWithArrowKeys(e, index)
    )
  );

  guideSteps.forEach((step, index) => {
    step.addEventListener("click", (e) => {
      collapseGuideStep(indexOfOpenStep);
      expandGuideStep(index);
    });

    step.addEventListener("keydown", (e) => {
      if (e.key === "Enter") step.click();
    });
  });

  checkboxBtns.forEach((checkboxBtn, index) => {
    checkboxBtn.addEventListener("click", () => handleMarkDoneOrNotDone(index));
  });
})();
