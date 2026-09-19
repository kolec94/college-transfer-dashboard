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
let data;
const fields = [
  ["program", "Degree / program"],
  ["actualFormat", "Confirmed format"],
  ["creditsAccepted", "Credits accepted"],
  ["creditsRemaining", "Credits remaining"],
  ["eiccCourses", "EICC courses still worth taking"],
  ["aaAsBenefit", "AA / AS benefit"],
  ["residencyRequirement", "Residency requirement"],
  ["estimatedCost", "Estimated tuition / cost"],
  ["nextAction", "Next action"]
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
  const feesRequired = count(s => s.applicationFeeUsd > 0);
  const feesPaid = count(s => s.applicationFeeStatus === "Paid");
  document.getElementById("summary").innerHTML = [
    ["Schools", data.schools.length],
    ["Applications submitted", submitted],
    ["Both transcripts received", transcripts],
    ["Evaluations received", evaluations],
    ["Application fees paid", feesPaid + " of " + feesRequired]
  ].map(([label, value]) => '<div class="stat"><strong>' + value + '</strong><span>' + label + '</span></div>').join("") +
    '<div class="progress"><span>Evaluation progress</span><div role="progressbar" aria-label="Evaluations received" aria-valuenow="' + evaluations + '" aria-valuemin="0" aria-valuemax="' + data.schools.length + '"><i style="width:' + (evaluations / data.schools.length * 100) + '%"></i></div><small>' + evaluations + ' of ' + data.schools.length + '</small></div>';
  document.getElementById("schools").innerHTML = data.schools.map(s => '<article class="card">' +
    '<div class="card-head"><div><p class="location">' + escapeHtml(s.location) + '</p><h3>' + escapeHtml(s.name) + '</h3><p class="requirement">' + escapeHtml(s.formatRequirement) + '</p></div></div>' +
    '<div class="badges">' + badge("Application: " + s.applicationStatus, ["Submitted", "Admitted"].includes(s.applicationStatus)) +
    badge("Fee: " + (s.applicationFeeUsd === 0 ? "Free" : "$" + s.applicationFeeUsd + " · " + s.applicationFeeStatus), ["Paid", "Not required", "Waived"].includes(s.applicationFeeStatus)) +
    badge("FAFSA: " + s.fafsaCode + " · " + s.fafsaStatus, s.fafsaStatus === "Added") +
    badge("EICC: " + s.eiccTranscript, s.eiccTranscript === "Received") +
    badge("Purdue: " + s.purdueTranscript, s.purdueTranscript === "Received") +
    badge("Evaluation: " + s.evaluationStatus, s.evaluationStatus === "Received") + '</div>' +
    '<dl class="details">' + fields.map(([key, label]) => '<div><dt>' + label + '</dt><dd>' + display(s[key]) + '</dd></div>').join("") + '</dl></article>').join("");

}

fetch("data/schools.json?v=fafsa-status-1").then(response => {
  if (!response.ok) throw new Error("Could not load school data");
  return response.json();
}).then(json => {
  data = json;
  render();
}).catch(error => {
  document.getElementById("schools").textContent = error.message + ". Serve this folder through a local web server or GitHub Pages.";
});
