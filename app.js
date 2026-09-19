const STORAGE_KEY = "college-transfer-dashboard-v1";
const THEME_KEY = "college-transfer-theme";
const themeButton = document.getElementById("theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
function setTheme(theme, save = false) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeButton.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#101d25" : "#142b38";
  if (save) localStorage.setItem(THEME_KEY, theme);
}
setTheme(document.documentElement.dataset.theme || "light");
themeButton.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true));
systemTheme.addEventListener("change", event => {
  if (!localStorage.getItem(THEME_KEY)) setTheme(event.matches ? "dark" : "light");
});
let source;
let data;
const fields = [
  ["applicationStatus", "Application", "select", ["Not started", "In progress", "Submitted", "Admitted", "Declined"]],
  ["eiccTranscript", "EICC transcript", "select", ["Not sent", "Requested", "Sent", "Received"]],
  ["purdueTranscript", "Purdue transcript", "select", ["Not sent", "Requested", "Sent", "Received"]],
  ["evaluationStatus", "Transfer evaluation", "select", ["Not received", "Requested", "Received"]],
  ["program", "Degree / program", "text"],
  ["actualFormat", "Confirmed format", "text"],
  ["creditsAccepted", "Credits accepted", "number"],
  ["creditsRemaining", "Credits remaining", "number"],
  ["eiccCourses", "EICC courses still worth taking", "text"],
  ["aaAsBenefit", "AA / AS benefit", "text"],
  ["residencyRequirement", "Residency requirement", "text"],
  ["estimatedCost", "Estimated tuition / cost", "text"],
  ["nextAction", "Next action", "text"]
];
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const display = value => value === null || value === "" ? "—" : escapeHtml(value);
const badge = (value, complete) => '<span class="badge ' + (complete ? "done" : "pending") + '">' + escapeHtml(value) + '</span>';
const count = predicate => data.schools.filter(predicate).length;

function render() {
  const b = data.baseline;
  document.getElementById("baseline").innerHTML =
    '<div><strong>' + escapeHtml(b.degree) + '</strong><span>Completed degree</span></div>' +
    '<div><strong>' + escapeHtml(b.eiccSemesterCredits) + '</strong><span>EICC semester credits</span></div>' +
    '<div><strong>' + escapeHtml(b.eiccGpa) + '</strong><span>EICC GPA</span></div>' +
    '<div><strong>' + escapeHtml(b.purdueAdditionalQuarterCredits) + '</strong><span>Additional Purdue quarter credits</span></div>';
  const submitted = count(s => ["Submitted", "Admitted"].includes(s.applicationStatus));
  const transcripts = count(s => s.eiccTranscript === "Received" && s.purdueTranscript === "Received");
  const evaluations = count(s => s.evaluationStatus === "Received");
  document.getElementById("summary").innerHTML = [
    ["Schools", data.schools.length],
    ["Applications submitted", submitted],
    ["Both transcripts received", transcripts],
    ["Evaluations received", evaluations]
  ].map(([label, value]) => '<div class="stat"><strong>' + value + '</strong><span>' + label + '</span></div>').join("") +
    '<div class="progress"><span>Evaluation progress</span><div role="progressbar" aria-label="Evaluations received" aria-valuenow="' + evaluations + '" aria-valuemin="0" aria-valuemax="' + data.schools.length + '"><i style="width:' + (evaluations / data.schools.length * 100) + '%"></i></div><small>' + evaluations + ' of ' + data.schools.length + '</small></div>';
  document.getElementById("schools").innerHTML = data.schools.map((s, index) => '<article class="card" data-index="' + index + '">' +
    '<div class="card-head"><div><p class="location">' + escapeHtml(s.location) + '</p><h3>' + escapeHtml(s.name) + '</h3><p class="requirement">' + escapeHtml(s.formatRequirement) + '</p></div><button class="edit secondary" type="button" aria-label="Edit ' + escapeHtml(s.name) + '">Edit</button></div>' +
    '<div class="badges">' + badge("Application: " + s.applicationStatus, ["Submitted", "Admitted"].includes(s.applicationStatus)) +
    badge("EICC: " + s.eiccTranscript, s.eiccTranscript === "Received") +
    badge("Purdue: " + s.purdueTranscript, s.purdueTranscript === "Received") +
    badge("Evaluation: " + s.evaluationStatus, s.evaluationStatus === "Received") + '</div>' +
    '<dl class="details">' + fields.slice(4).map(([key, label]) => '<div><dt>' + label + '</dt><dd>' + display(s[key]) + '</dd></div>').join("") + '</dl>' +
    '<form class="editor" hidden><div class="form-grid">' + fields.map(([key, label, type, options]) =>
      '<label>' + label + (type === "select"
        ? '<select name="' + key + '">' + options.map(o => '<option' + (s[key] === o ? ' selected' : '') + '>' + escapeHtml(o) + '</option>').join("") + '</select>'
        : '<input name="' + key + '" type="' + type + '"' + (type === "number" ? ' min="0" step="1"' : '') + ' value="' + escapeHtml(s[key] ?? "") + '">') + '</label>').join("") +
    '</div><div class="form-actions"><button type="submit">Save changes</button><button class="cancel secondary" type="button">Cancel</button></div></form></article>').join("");
}

document.getElementById("schools").addEventListener("click", event => {
  const card = event.target.closest(".card");
  if (!card) return;
  if (event.target.matches(".edit")) {
    card.querySelector(".editor").hidden = false;
    event.target.hidden = true;
  }
  if (event.target.matches(".cancel")) render();
});
document.getElementById("schools").addEventListener("submit", event => {
  if (!event.target.matches(".editor")) return;
  event.preventDefault();
  const card = event.target.closest(".card");
  const school = data.schools[Number(card.dataset.index)];
  const form = new FormData(event.target);
  for (const [key, , type] of fields) {
    const raw = String(form.get(key) ?? "").trim();
    school[key] = type === "number" ? (raw === "" ? null : Number(raw)) : raw;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  render();
});
document.getElementById("download").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "schools.json"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Remove browser-only changes and reload repository data?")) return;
  localStorage.removeItem(STORAGE_KEY);
  data = structuredClone(source);
  render();
});
fetch("data/schools.json").then(response => {
  if (!response.ok) throw new Error("Could not load school data");
  return response.json();
}).then(json => {
  source = json;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data = saved && Array.isArray(saved.schools) && saved.schools.length === json.schools.length ? saved : structuredClone(json);
  } catch {
    data = structuredClone(json);
  }
  render();
}).catch(error => {
  document.getElementById("schools").textContent = error.message + ". Serve this folder through a local web server or GitHub Pages.";
});
