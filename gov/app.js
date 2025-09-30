let DATA = [];
let filtered = [], current = 0, order = "ordered";
const el = id => document.getElementById(id);
const flashcard = el("flashcard"),
      termText = el("termText"),
      defText = el("defText"),
      simDef = el("simDefText"),
      img = el("cardImg"),
      unitBadge = el("unitBadge"),
      counter = el("cardCounter");

async function loadData() {
  try {
    const res = await fetch("data.json");
    DATA = (await res.json()).terms;
  } catch (e) {
    console.error("Could not load data.json", e);
    DATA = [];
  }
  refreshFilter();
}

function refreshFilter() {
  const u = el("unitSelect").value;
  filtered = (u === "all" ? DATA : DATA.filter(t => t.unit === u));
  if (order === "shuffled") filtered = shuffle(filtered);
  current = 0;
  render();
}

function render(reset = true) {
  if (!filtered.length) {
    termText.textContent = "No cards";
    defText.textContent = "";
    simDef.textContent = "";
    img.src = "";
    unitBadge.textContent = "-";
    counter.textContent = "0/0";
    return;
  }
  let c = filtered[current];
  termText.textContent = c.term;
  defText.textContent = c.def;
  simDef.textContent = c.simdef;
  img.src = c.img;
  unitBadge.textContent = "U" + c.unit;
  counter.textContent = `${current+1}/${filtered.length}`;
  if (reset) flashcard.classList.remove("is-flipped");
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function next(){ if(filtered.length){ current=(current+1)%filtered.length; render(); } }
function prev(){ if(filtered.length){ current=(current-1+filtered.length)%filtered.length; render(); } }
function flip(){ flashcard.classList.toggle("is-flipped"); }

// Keyboard navigation
document.addEventListener("keydown", e=>{
  if(e.code==="Space"){e.preventDefault();flip();}
  if(e.code==="ArrowRight")next();
  if(e.code==="ArrowLeft")prev();
});

flashcard.onclick = flip;
el("nextBtn").onclick = next;
el("prevBtn").onclick = prev;
el("shuffleBtn").onclick = () => { filtered = shuffle(filtered); order = "shuffled"; render(); };
el("unitSelect").onchange = refreshFilter;

// Theme
el("themeToggle").onchange = () => {
  document.body.classList.toggle("theme-light", el("themeToggle").checked);
  el("themeLabel").textContent = el("themeToggle").checked ? "Light" : "Dark";
};

// === Quiz & Study Mode ===
let MODE="quiz", QUIZ=null, qIndex=0, score=0;
el("quizBtn").onclick = () => openModal("quiz");
el("studyBtn").onclick = () => openModal("study");

function openModal(mode) {
  MODE = mode;
  el("modalTitle").textContent = mode==="quiz" ? "Quiz" : "Study Mode";
  el("modal").classList.remove("hidden");
  el("setupArea").classList.remove("hidden");
  el("quizArea").classList.add("hidden");
}
el("closeModal").onclick = () => el("modal").classList.add("hidden");

el("begin").onclick = () => startQuiz();

function startQuiz() {
  let u = el("optUnit").value;
  let n = Math.max(1, Math.min(50, Number(el("optCount").value) || 5));
  let pool = (u==="all" ? DATA : DATA.filter(t => t.unit === u));
  if (!pool.length) { alert("No terms in this unit"); return; }
  let qs = shuffle(pool.slice()).slice(0, n);
  let allTerms = DATA.map(t=>t.term);
  QUIZ = qs.map(q => {
    let choices = shuffle([q.term, ...shuffle(allTerms.filter(t=>t!==q.term)).slice(0,4)]);
    return {...q, choices};
  });
  qIndex = 0; score = 0;
  el("setupArea").classList.add("hidden");
  el("quizArea").classList.remove("hidden");
  showQ();
}

function showQ() {
  let q = QUIZ[qIndex];
  el("quizProgress").textContent = `Q${qIndex+1}/${QUIZ.length}`;
  el("quizDef").textContent = q.def;
  el("quizFeedback").textContent = "";
  el("choices").innerHTML = "";
  el("studyInput").classList.add("hidden");

  if (MODE === "quiz") {
    q.choices.forEach(c=>{
      let b=document.createElement("button");
      b.textContent=c;
      b.className="choice-btn";
      b.onclick=()=>evalChoice(c,q.term,b);
      el("choices").appendChild(b);
    });
  } else {
    el("studyInput").classList.remove("hidden");
    el("studyInput").value="";
    el("studyInput").focus();
    el("studyInput").onkeydown = e=>{
      if(e.key==="Enter")checkStudy(q);
    };
  }
  el("nextQ").disabled=true;
}

function evalChoice(pick, correct, btn) {
  [...el("choices").children].forEach(b=>b.disabled=true);
  if (pick===correct) {
    btn.classList.add("correct"); score++;
    el("quizFeedback").textContent="Correct!";
  } else {
    btn.classList.add("wrong");
    [...el("choices").children].forEach(b=>{
      if(b.textContent===correct)b.classList.add("correct");
    });
    el("quizFeedback").textContent="Wrong — "+correct;
  }
  el("nextQ").disabled=false;
}

function checkStudy(q) {
  let ans = el("studyInput").value.trim().toLowerCase();
  if (ans === q.term.toLowerCase()) {
    score++;
    el("quizFeedback").innerHTML=`<span class="correctText">Correct!</span>`;
  } else {
    el("quizFeedback").innerHTML=`<span class="wrongText">Wrong</span> — correct: ${q.term}`;
  }
  el("studyInput").disabled=true;
  el("nextQ").disabled=false;
}

el("nextQ").onclick=()=>{
  qIndex++;
  if(qIndex<QUIZ.length){
    el("studyInput").disabled=false;
    showQ();
  } else {
    el("quizFeedback").textContent=`Finished! Score ${score}/${QUIZ.length}`;
    el("nextQ").disabled=true;
  }
};
el("endQ").onclick=()=>el("modal").classList.add("hidden");

// start
loadData();
