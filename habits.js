function getToday() {
  return new Date().toLocaleDateString();
}

function loadHabits() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let container = document.getElementById("habitList");
  container.innerHTML = "";

  habits.forEach((habit, index) => {
    let today = getToday();
    let done = (habit.dates || []).includes(today);

    container.innerHTML += `
      <div class="habit-card">
        
        <input 
          type="checkbox" 
          class="habit-checkbox"
          ${done ? "checked" : ""}
          onchange="toggleHabit(${index})"
        >

        <span class="${done ? "done-habit" : ""}">
          ${habit.name}
        </span>

        <button onclick="deleteHabit(${index})">❌</button>

      </div>
    `;
  });
}

function addHabit() {
  let input = document.getElementById("habitInput");
  let name = input.value.trim();

  if (!name) return;

  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  habits.push({
    name: name,
    dates: [],
  });

  localStorage.setItem("habits", JSON.stringify(habits));

  input.value = "";
  loadHabits();
}

function toggleHabit(index) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let today = getToday();

  let dates = habits[index].dates || [];
  habits[index].dates = dates;

  if (dates.includes(today)) {
    habits[index].dates = dates.filter((d) => d !== today);
  } else {
    dates.push(today);
  }

  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function deleteHabit(index) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  habits.splice(index, 1);

  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

window.onload = loadHabits;
