function setWeatherWidget(data) {

    const time = (new Date).toLocaleTimeString().slice(0, -3);
    if(data.city_info.name !== "NA")
        document.querySelector("#name").innerHTML = data.city_info.name;
    document.querySelector("#condition").innerHTML = data.current_condition.condition;
    document.querySelector("#tmp").innerHTML = toDegrees(data.current_condition.tmp);
    document.querySelector("#date").innerHTML = data.current_condition.date;
    document.querySelector("#hour").innerHTML = time;
    document.querySelector("img#icon").setAttribute("src", data.current_condition.icon_big);
    document.querySelector("#wind").innerHTML = data.current_condition.wnd_spd;
    document.querySelector("#humidity").innerHTML = data.current_condition.humidity + "%";
    document.querySelector("#sunrise").innerHTML = data.city_info.sunrise;
    document.querySelector("#sunset").innerHTML = data.city_info.sunset;
    document.querySelector("#favicon").setAttribute("href", data.current_condition.icon);
}

function setWeekWeatherWidget(data) {
    setDay("#j0", data.fcst_day_0, false);
    const ids = ["#j1", "#j2", "#j3", "#j4"];
    const dataSet = [data.fcst_day_1, data.fcst_day_2, data.fcst_day_3, data.fcst_day_4];
    for (let i = 0; i < ids.length; i++)
        setDay(ids[i], dataSet[i]);
}

function setDay(dayId,dayData, dayShort = true){
    if(dayShort)
        document.querySelector( dayId + " .day-short").innerHTML = removeLastChar(dayData.day_short);
    document.querySelector( dayId + " .day-date").innerHTML = dayData.date.slice(0, -5);
    document.querySelector(dayId + " img").setAttribute("src", dayData.icon);
    document.querySelector( dayId + " .day-tmp-min").innerHTML = toDegrees(dayData.tmin);
    document.querySelector(dayId + " .day-tmp-max").innerHTML = toDegrees(dayData.tmax);
}

function removeLastChar(text) {
    return text.slice(0, -1);
}

function toDegrees(temperature){
    return temperature  + "&#176;";
}
