const LIMIT_SECONDS = 10 * 60; // 上限10分

let today = new Date().toDateString();

//Youtubeかどうかを判定
function isYoutube() {
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

  showHUD(time) // HUDを更新

  const REMAIN_SECONDS = LIMIT_SECONDS - seconds

  if(REMAIN_SECONDS <= 60) {

    hud.classList.add("blink");
  }
  else{
    hud.classList.add("blink");
  }

  
}

async function tick() {
  if (!isYoutube() || document.hidden) return;

  let data = await getData();
  let time = data.time || 0;

  if (data.date !== today) time = 0;

  time += 1;
  await setData(time);

  updateHUD(time)

  if (time >= LIMIT_SECONDS) {
    showWarning(time);
  }
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

  hud.textContent = `Shorts: ${format(seconds)} / 10:00`;
}

function showWarning(seconds) {
  let warn = document.getElementById("shorts-warning");

  if (!warn) {
    warn = document.createElement("div");
    warn.id = "shorts-warning";
    warn.style = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(5px);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 22px;
      z-index: 9999999;
    `;
    document.body.appendChild(warn);
  }

  warn.innerHTML = `
    ⚠ Shorts見すぎ<br><br>
    今日: ${format(seconds)}<br><br>
    もうやめよう
  `;
}

setInterval(tick, 1000); //一秒ごとにtickを行う