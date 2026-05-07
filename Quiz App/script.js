//questions
const questions = [
  { question: "How often do you eat junk food?", answers: ["Very often", "Sometimes", "Rarely"], score: [0,1,2], type: "junk" },
  { question: "How often do you eat fruits?", answers: ["Rarely", "Sometimes", "Daily"], score: [0,1,2], type: "food" },
  { question: "How often do you eat vegetables?", answers: ["Rarely", "Sometimes", "Daily"], score: [0,1,2], type: "food" },
  { question: "Do you skip breakfast?", answers: ["Often", "Sometimes", "Never"], score: [0,1,2], type: "food" },
  { question: "How often do you drink sugary drinks?", answers: ["Daily", "Occasionally", "Rarely"], score: [0,1,2], type: "junk" },
  { question: "How much water do you drink daily?", answers: ["Less than 1L", "1-2L", "2-3L+"], score: [0,1,2], type: "water" },
  { question: "Do you eat home-cooked food?", answers: ["Rarely", "Sometimes", "Mostly"], score: [0,1,2], type: "food" },
  { question: "Do you overeat?", answers: ["Often", "Sometimes", "Rarely"], score: [0,1,2], type: "food" },
  { question: "How many hours do you sleep?", answers: ["<5", "6-7", "8+"], score: [0,1,2], type: "sleep" },
  { question: "Phone before sleep?", answers: ["Always", "Sometimes", "Never"], score: [0,1,2], type: "screen" },
  { question: "Feel refreshed after waking?", answers: ["No", "Sometimes", "Yes"], score: [0,1,2], type: "sleep" },
  { question: "Screen time daily?", answers: ["6+ hrs", "3-5 hrs", "<3 hrs"], score: [0,1,2], type: "screen" },
  { question: "Take screen breaks?", answers: ["No", "Sometimes", "Yes"], score: [0,1,2], type: "screen" },
  { question: "Check phone after waking?", answers: ["Always", "Sometimes", "Never"], score: [0,1,2], type: "screen" },
  { question: "Exercise frequency?", answers: ["Rarely", "1-2 times", "3+ times"], score: [0,1,2], type: "exercise" },
  { question: "Sit long hours?", answers: ["Yes", "Sometimes", "No"], score: [0,1,2], type: "exercise" },
  { question: "Stretch daily?", answers: ["Rarely", "Sometimes", "Yes"], score: [0,1,2], type: "exercise" },
  { question: "Stress level?", answers: ["High", "Medium", "Low"], score: [0,1,2], type: "stress" },
  { question: "Take breaks while working?", answers: ["No", "Sometimes", "Yes"], score: [0,1,2], type: "stress" },
  { question: "Follow routine?", answers: ["No", "Somewhat", "Yes"], score: [0,1,2], type: "routine" }
];
//state
let currentQuestion = 0;
let totalScore = 0;
let selectedIndex = null;
let habits = { junk:0, water:0, sleep:0, screen:0, exercise:0, food:0, stress:0, routine:0 };
// element
const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const nextBtn = document.getElementById("next");
const progressEl = document.getElementById("progress");
// load
function loadQuestion() {
  const q = questions[currentQuestion];
  qEl.innerText = q.question;
  aEl.innerHTML = "";
  nextBtn.disabled = true;
  selectedIndex = null;
  progressEl.innerText = `Question ${currentQuestion + 1}/${questions.length}`;
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = ans;
    btn.onclick = () => {
      selectedIndex = i;
      document.querySelectorAll(".answer-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.disabled = false;
    };
    aEl.appendChild(btn);
  });
  document.querySelector(".quiz-card").classList.add("fade-in");
}
//next
nextBtn.onclick = () => {
  const q = questions[currentQuestion];

  totalScore += q.score[selectedIndex];

  if (q.score[selectedIndex] === 0) habits[q.type]++;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};
//result
function showResult() {
  document.getElementById("quiz").classList.add("d-none");
  document.getElementById("result").classList.remove("d-none");
  document.getElementById("score").innerText = totalScore;
  const msg = document.getElementById("message");
  const tips = document.getElementById("tips");
  if (totalScore <= 15) msg.innerText = "⚠️ Time to change your habits!";
  else if (totalScore <= 30) msg.innerText = "🙂 You're doing okay!";
  else msg.innerText = "💪 Great lifestyle!";
  let t = [];
  if (habits.junk) t.push("🍔 Reduce junk food");
  if (habits.food) t.push("🥗 Eat more healthy food");
  if (habits.water) t.push("💧 Drink more water");
  if (habits.sleep) t.push("😴 Improve sleep");
  if (habits.screen) t.push("📵 Reduce screen time");
  if (habits.exercise) t.push("🏃 Exercise more");
  if (habits.stress) t.push("🧘 Manage stress");
  if (habits.routine) t.push("📅 Build routine");
  tips.innerHTML = t.map(x => `<p>${x}</p>`).join("");
  tips.innerHTML += `
    <h5 class="mt-3">🚀 Challenge</h5>
    <p>✔ Drink 2L water</p>
    <p>✔ Walk 20 mins</p>
    <p>✔ Sleep early</p>
  `;
}
//start
loadQuestion();