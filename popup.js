const slider = document.getElementById("timeslider");
const sliderElem = document.getElementById("sliderValue");
const savebutton = document.getElementById("savebutton");


const setCurrentValue = (val) => {
    sliderElem.innerText = val;
}


const rangeOnChange = (e) =>{
  setCurrentValue(e.target.value);
}

window.onload = async () => {
    slider.addEventListener('input', rangeOnChange); 
    const data = await chrome.storage.local.get("limitMinute")
    if (data.limitMinute) {
        slider.value = data.limitMinute; //前回の値を代入
        setCurrentValue(data.limitMinute);
    } else {
        setCurrentValue(slider.value);
    }
}



savebutton.addEventListener('click',() => {
    const minute = parseInt(slider.value)
    const second = parseInt(slider.value) * 60;
    // 保存されてから閉じる
    chrome.storage.local.set({limitSecond: second,limitMinute: minute}, () => {window.close()});
    //決定を押すとpopupが消える
});


