/* =====================================================================
   HackerTurtles :: Writeups
   Sicherer Upload OHNE Token im Client:
   Das Formular baut eine fertige .md-Datei und leitet auf GitHubs
   eigenen "new file"-Editor um (mit Login des jeweiligen Nutzers).
   ===================================================================== */

/* ------- KONFIG: hier eure Repo-Daten eintragen ------- */
const REPO_OWNER  = "DEIN-GITHUB-NAME";   // z.B. "hackerturtles"
const REPO_NAME   = "hackerturtles";      // Repo-Name (wo diese Seite liegt)
const REPO_BRANCH = "main";               // Ziel-Branch
const WRITEUP_DIR = "writeups";           // Ordner im Repo für die .md-Files
/* ------------------------------------------------------ */

const $ = (id) => document.getElementById(id);

function slugify(s){
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')   // Umlaute etc. entschärfen
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,60) || 'writeup';
}
function today(){ return new Date().toISOString().slice(0,10); }

function buildMarkdown(){
  const title = $('f-title').value.trim() || 'Unbenannt';
  const cat   = $('f-cat').value;
  const diff  = $('f-diff').value;
  const autor = $('f-author').value.trim() || 'anon';
  const body  = $('f-body').value.trim();
  const date  = today();
  const md =
`---
title: ${title}
category: ${cat}
difficulty: ${diff}
author: ${autor}
date: ${date}
---

# ${title}

${body}
`;
  const filename = `${WRITEUP_DIR}/${date}-${slugify(title)}.md`;
  return { md, filename };
}

/* --- 1) Committen via GitHub-eigenen Editor (kein Token!) --- */
function commitOnGitHub(){
  const { md, filename } = buildMarkdown();
  const base = `https://github.com/${REPO_OWNER}/${REPO_NAME}/new/${REPO_BRANCH}`;
  const url  = `${base}?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(md)}`;

  if(url.length > 7500){
    setMsg('WARN: Writeup ist sehr lang – der GitHub-Link könnte gekürzt werden. '
         + 'Nutze lieber "Als .md herunterladen" und lade die Datei manuell hoch.', 'warn');
    return;
  }
  if(REPO_OWNER === 'DEIN-GITHUB-NAME'){
    setMsg('Bitte zuerst REPO_OWNER/REPO_NAME oben in writeups.js eintragen.', 'warn');
    return;
  }
  window.open(url, '_blank', 'noopener');
  setMsg('GitHub-Editor geöffnet. Dort nur noch "Commit changes" klicken. '
       + 'Ohne Schreibrechte legt GitHub automatisch Fork + Pull Request an.', 'ok');
}

/* --- 2) Download als .md --- */
function downloadMd(){
  const { md, filename } = buildMarkdown();
  const blob = new Blob([md], {type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.split('/').pop();
  a.click();
  URL.revokeObjectURL(a.href);
  setMsg('Datei heruntergeladen: ' + a.download, 'ok');
}

/* --- 3) In Zwischenablage --- */
async function copyMd(){
  const { md } = buildMarkdown();
  try{ await navigator.clipboard.writeText(md); setMsg('Markdown in die Zwischenablage kopiert.', 'ok'); }
  catch(e){ setMsg('Kopieren nicht möglich – bitte manuell aus der Vorschau markieren.', 'warn'); }
}

function setMsg(text, kind){
  const el = $('f-msg');
  el.textContent = '[' + (kind==='ok'?'OK':'!') + '] ' + text;
  el.style.color = kind==='ok' ? 'var(--green)' : 'var(--amber)';
}

/* --- Vorhandene Writeups aus dem Repo listen (read-only, public API) --- */
async function loadWriteups(){
  const list = $('wu-list');
  if(REPO_OWNER === 'DEIN-GITHUB-NAME'){
    list.innerHTML = placeholderList();
    return;
  }
  const api = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${WRITEUP_DIR}?ref=${REPO_BRANCH}`;
  try{
    const res = await fetch(api, {headers:{'Accept':'application/vnd.github+json'}});
    if(!res.ok) throw new Error(res.status);
    const files = (await res.json())
      .filter(f => f.name.endsWith('.md'))
      .sort((a,b) => b.name.localeCompare(a.name));
    if(!files.length){ list.innerHTML = '<div class="wu-item frame"><span class="m">noch keine writeups – sei der/die erste.</span></div>'; return; }
    list.innerHTML = files.map(f => {
      const nice = f.name.replace(/\.md$/,'').replace(/^\d{4}-\d{2}-\d{2}-/,'').replace(/-/g,' ');
      return `<div class="wu-item frame">
        <span class="t">&gt; ${nice}</span>
        <a class="m" href="${f.html_url}" target="_blank" rel="noopener">[ansehen]</a>
      </div>`;
    }).join('');
  }catch(e){
    list.innerHTML = '<div class="wu-item frame"><span class="m">liste konnte nicht geladen werden ('
      + e.message + ') – repo ggf. privat oder rate-limit.</span></div>' + placeholderList();
  }
}
function placeholderList(){
  return `
    <div class="wu-item frame"><span class="t">&gt; Codify – User & Root</span><span class="m">easy · @handle_02</span></div>
    <div class="wu-item frame"><span class="t">&gt; Manager – AD to DA</span><span class="m">hard · @handle_03</span></div>
    <div class="wu-item frame"><span class="t">&gt; Sandworm – full chain</span><span class="m">insane · team</span></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  $('btn-commit').addEventListener('click', commitOnGitHub);
  $('btn-download').addEventListener('click', downloadMd);
  $('btn-copy').addEventListener('click', copyMd);
  loadWriteups();
});
