function getStreak() {
  let s = JSON.parse(localStorage.getItem("streak")) || { count: 0 };
  return s.count;
}
