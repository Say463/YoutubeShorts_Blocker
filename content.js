let LIMIT_SECONDS;
let today = new Date().toDateString();
let limitExceeded = false;

//Youtubeshortかどうかを判定
function isYoutubeshort() {
  return location.pathname.startsWith("/shorts");
}

// chrome storageからtimeを取得
async function getData() {
  return new Promise(resolve => {
    chrome.storage.local.get(["time", "date"], resolve);
  });
}

// chrome storageからtimeを保存
async function setData(time) { 
  chrome.storage.local.set({ time, date: today });
}

//時計UI
function format(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s.toString().padStart(2,"0")}`;
}

function updateHUD(seconds) {
  showHUD(seconds) // HUDを更新

  const hud = document.getElementById("shorts-hud") //DOMからHUDを取得
  if(!hud) return; // HUDがなければreturn

  const REMAIN_SECONDS = LIMIT_SECONDS - seconds
  if(REMAIN_SECONDS <= 60 && REMAIN_SECONDS > 0) {
    hud.classList.add("blink");
  }
  else { 
    if(hud.classList.contains("blink")) {
      hud.classList.remove("blink");
    }  
  }
}

async function tick() {
  if (!isYoutubeshort() || document.hidden || limitExceeded) return;

  let data = await getData();
  let time = data.time || 0; //初期値は0
  if (data.date !== today) time = 0;

  time += 1;
  await setData(time);

  updateHUD(time)

  if (time >= LIMIT_SECONDS) {
    limitExceeded = true; 
    showWarning(time);
  }
}

// LIMIT_SECOND をpopup.jsから受け取って、tickに設定
async function setting() {
  const data = await new Promise(resolve => {
    chrome.storage.local.get({limitSecond:600}, resolve)
  } );
  LIMIT_SECONDS = data.limitSecond // LIMIT_SECONDSはlimitSecond値を格納

}

function showHUD(seconds) {
  let hud = document.getElementById("shorts-hud");

  // hudがなければ作成
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "shorts-hud";
    hud.classList.add("short-hud")
    document.body.appendChild(hud);
  }

  hud.textContent = `Shorts: ${format(seconds)} / ${format(LIMIT_SECONDS)}`;
}

function showWarning(seconds) {
  let warn = document.getElementById("shorts-warning");

  if (!warn) {
    warn = document.createElement("div");
    warn.id = "shorts-warning";
    warn.classList.add("warning")
    document.body.appendChild(warn);
  }

  warn.innerHTML = `
    ⚠ Shortsの制限時間を超過<br><br>
    今日: ${format(seconds)}<br><br>
    終了
  `;
}

(async () => {await setting();setInterval(tick, 1000);})();