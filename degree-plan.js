const THEME_KEY = "college-transfer-theme";
const themeButton = document.getElementById("theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
function setTheme(theme, save = false) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeButton.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#171411" : "#211b17";
  if (save) localStorage.setItem(THEME_KEY, theme);
}
setTheme(document.documentElement.dataset.theme || "light");
themeButton.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true));
systemTheme.addEventListener("change", event => {
  if (!localStorage.getItem(THEME_KEY)) setTheme(event.matches ? "dark" : "light");
});

const credits = 54.66;
const degreeTotal = 120;
const estimatedLeft = (degreeTotal - credits).toFixed(2);
const pct = (credits / degreeTotal * 100).toFixed(1);
const reportRows = [
  { school:"Scott Community College", code:"AAS degree", title:"Associate in Applied Science", earned:"0.00", equ:"ELEC-ELE", sau:"16.00", meaning:"Generic elective credit; not a named major course." },
  { school:"Scott Community College", code:"PSY-111", title:"Intro to Psychology", earned:"3.00", equ:"PSYC-105", sau:"3.00", meaning:"Named psychology course; specific degree requirement fit needs an audit." },
  { school:"Scott Community College", code:"CSC-110", title:"Intro to Computers", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"CIS-121", title:"Intro to Programming Logic", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"NET-303", title:"Windows Workstation Operating Systems", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"CIS-606", title:"Visual Basic .NET I", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"CIS-169", title:"C#", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"HUM-183", title:"Living with Space, Time, and Technology", earned:"3.00", equ:"PHIL-100", sau:"3.00", meaning:"Named philosophy course; specific degree requirement fit needs an audit." },
  { school:"Scott Community College", code:"ENG-107", title:"Composition I: Technical Writing", earned:"3.00", equ:"ENGL-ELE", sau:"3.00", meaning:"English elective; SAU must confirm general education fit." },
  { school:"Scott Community College", code:"CIS-210", title:"Web Development I", earned:"3.00", equ:"CSCI-ELE", sau:"3.00", meaning:"Computer Science elective; no specific required course number awarded." },
  { school:"Scott Community College", code:"MAT-110", title:"Math for Liberal Arts", earned:"3.00", equ:"MATH-131", sau:"3.00", meaning:"MATH 131 equivalent; not the calculus courses listed for either major." },
  { school:"Scott Community College", code:"MAT-110", title:"Quantitative core marker", earned:"—", equ:"QNT-CORE", sau:"0.00", meaning:"Zero-credit marker only; adds no transfer credits." },
  { school:"Scott Community College", code:"PSY-111", title:"Humanities core marker", earned:"—", equ:"HMX-CORE", sau:"0.00", meaning:"Zero-credit marker only; adds no transfer credits." },
  { school:"Scott Community College", code:"BUS-167", title:"Leadership and Professionalism", earned:"1.00", equ:"BUS-ELE", sau:"1.00", meaning:"Business elective; specific degree requirement fit needs an audit." },
  { school:"Scott Community College", code:"BUS-168", title:"Leadership and Professionalism II", earned:"1.00", equ:"BUS-ELE", sau:"1.00", meaning:"Business elective; specific degree requirement fit needs an audit." },
  { school:"Purdue University Global", code:"CM-107", title:"College Composition I", earned:"3.33", equ:"ENGL-ELE", sau:"3.33", meaning:"English elective; SAU must confirm general education fit." },
  { school:"Purdue University Global", code:"IT-190", title:"Information Technology Concepts", earned:"3.33", equ:"CSCI-140", sau:"3.33", meaning:"Directly matches CSCI 140, a required Computer Science course." },
  { school:"Purdue University Global", code:"IT-190", title:"Quantitative core marker", earned:"—", equ:"QNT-CORE", sau:"0.00", meaning:"Zero-credit marker only; adds no transfer credits." }
];

const plans = [
  {
    id:"cs", name:"BS Computer Science", total:120,
    breakdown:[["General education", "42 credits"],["Computer Science major", "48–49 credits"],["Electives", "30 credits"]],
    statusText:"The evaluation is for this program. The credit total is official in the report; requirement-by-requirement placement still needs an SAU degree audit.",
    courses:[
      ["CSCI 140","Foundations of Computer Science","matched"],
      ["CSCI 195","Programming I","pending"],
      ["CSCI 270","Networks and Data Communications","pending"],
      ["CSCI 281","Discrete Structures","pending"],
      ["CSCI 294","Contemporary Programming","pending"],
      ["CSCI 295","Programming II","pending"],
      ["CSCI 310","Data Structures","pending"],
      ["CSCI 435","Legal and Ethical Issues in Computing","pending"]
    ],
    choices:["CSCI 300 — Systems Analysis and Design","CSCI 320 — Computer Architecture","CSCI 330 — Web Programming","CSCI 360 — Database Management Systems","CSCI 393 — Algorithm Design and Analysis","CSCI 400 — Programming Language Concepts","CSCI 410 — Operating Systems","MATH 191 — Calculus and Analytic Geometry I"],
    notes:["Choose five courses from the listed options. The report does not award any of these by exact course number.","The major also requires 9 credits of CSCI electives at the 200 level or above. The report has 18 credits labeled CSCI-ELE, but does not identify course levels; ask SAU whether any satisfy this rule.","CSCI 140 is the only course in this list directly named in your transfer equivalency report."]
  },
  {
    id:"ds", name:"BS Data Science and Analytics", total:120,
    breakdown:[["General education", "45 credits"],["Core + concentration", "45 credits (includes the listed capstone)"],["Electives", "30 credits"]],
    statusText:"Your evaluation was prepared for BS.CSCI. The 54.66-credit total is shown for reference, but SAU must confirm both the accepted total and individual course matches for Data Science.",
    courses:[
      ["CSCI 195","Programming I","pending"],
      ["CSCI 295","Programming II","pending"],
      ["CSCI 310","Data Structures","pending"],
      ["CSCI 360","Database Management Systems","pending"],
      ["MATH 191","Calculus and Analytic Geometry I","pending"],
      ["MATH 192","Calculus and Analytic Geometry II","pending"],
      ["MATH 220","Introduction to Logic and Proof","pending"],
      ["MATH/CSCI 281","Discrete Structures","pending"],
      ["MATH 290","Elementary Linear Algebra","pending"],
      ["MATH/STAT 300","Modern Probability and Statistics","pending"],
      ["MATH/STAT 301","Statistical Modeling","pending"],
      ["MATH/STAT 305","Advanced Data Science","pending"],
      ["WI-MATH/STAT 306","Ethics of Data Analysis","pending"],
      ["MATH/STAT 390","Mathematical Programming","pending"],
      ["MATH/STAT 391","Data Science Capstone","pending"]
    ],
    choices:[],
    notes:["None of these named Data Science major courses appears as a direct equivalency on the BS.CSCI report. That does not rule out substitutions or a new evaluation.","The report maps MAT-110 to MATH 131, not to the calculus sequence. It maps several Scott programming courses as CSCI-ELE, not to named Data Science requirements.","The 2026–27 program page groups the 45 major credits into 23 core and 22 concentration credits. The detailed course list here is from the 2025–26 catalog; confirm it against the catalog year on your degree audit."]
  }
];

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
document.getElementById("plan-stats").innerHTML = [
  ["54.66", "equivalent transfer credits in the BS.CSCI report"],
  ["120", "credits listed for each bachelor’s degree"],
  ["65.34", "raw credits to 120, before requirement fit and residency"]
].map(([value,label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");

document.getElementById("degree-progress").innerHTML = plans.map((plan,index) => `<article class="progress-card">
  <h3>${escapeHtml(plan.name)}</h3><p class="progress-subtitle">${index === 0 ? "Evaluation program" : "Transfer fit not yet confirmed"}</p>
  <div class="credit-numbers"><strong>${credits.toFixed(2)} / ${plan.total}</strong><span>${pct}% of degree credits<br>shown in the report</span></div>
  <div class="credit-bar" role="img" aria-label="${pct}% of ${plan.name} total credits shown in the SAU report"><i style="width:${pct}%"></i></div>
  <div class="progress-caption"><span>${estimatedLeft} credits to reach 120 by raw subtraction</span><span>${plan.id === "cs" ? "course placement pending" : "tentative for this major"}</span></div>
</article>`).join("");

function courseList(items) {
  return `<ul class="course-list">${items.map(([code,name,status]) => `<li><div class="course-main"><span class="course-code">${escapeHtml(code)}</span><span class="course-name">${escapeHtml(name)}</span></div><span class="course-state ${status === "matched" ? "matched" : ""}">${status === "matched" ? "Matched in report" : "No direct match shown"}</span></li>`).join("")}</ul>`;
}
document.getElementById("programs").innerHTML = plans.map(plan => `<article class="program-card">
  <h3>${escapeHtml(plan.name)}</h3><p class="program-total">120 credits total · SAU published degree summary</p>
  <p class="program-note">${escapeHtml(plan.statusText)}</p>
  <div class="area-list">${plan.breakdown.map(([label,value]) => `<div class="area-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join("")}</div>
  <h4>${plan.id === "cs" ? "Required Computer Science courses" : "Major courses shown in the catalog"}</h4>
  ${courseList(plan.courses)}
  ${plan.choices.length ? `<h4>Choose five from these courses</h4><ul class="course-list">${plan.choices.map(choice => `<li><div class="course-main"><span class="course-code">${escapeHtml(choice)}</span></div><span class="course-state">No direct match shown</span></li>`).join("")}</ul><h4>Additional major elective rule</h4><p class="program-note">Nine credits of CSCI electives at the 200 level or above. Generic CSCI-ELE credit is possible, but the report does not show course levels.</p>` : ""}
  <h4>Transfer-fit notes</h4><ul class="plan-notes">${plan.notes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
</article>`).join("");

const reportText = reportRows.map(row => {
  const matched = row.equ === "CSCI-140";
  return `<tr><td><strong>${escapeHtml(row.code)}</strong><br><span>${escapeHtml(row.school)}</span></td><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.earned)}</td><td><strong>${escapeHtml(row.equ)}</strong></td><td>${escapeHtml(row.sau)}</td><td>${matched ? '<span class="course-state matched">Named requirement match</span><br>' : ""}${escapeHtml(row.meaning)}</td></tr>`;
}).join("");
document.getElementById("transfer-rows").innerHTML = reportText;
