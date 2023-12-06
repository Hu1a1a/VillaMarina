const MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var monthday;
function GetDay(year, month, day) {
  if (day) {
    monthday = 0;
    for (let i = 0; i < month; i++) monthday = monthday + MonthDays[i];
    return Math.round((year - 1900) * 365 + (year - 1900) / 4 + monthday + day - 2);
  }
  return 0;
}

function Chequeo(body, iReserva, iPaying, iConfig) {
  const Today = GetDay(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  if (isNaN(body.Inicial) || isNaN(body.Final)) return "Error 1";
  else if (body.Final < body.Inicial) return "Error 2";
  else if (body.Inicial % 1 != 0 || body.Final % 1 != 0) return "Error 3";
  else if (Today >= body.Inicial || Today >= body.Final) return "Error 4";
  else if (Today + 180 <= body.Inicial || Today + 180 <= body.Final) return "Error 5";
  else if (body.Final - body.Inicial < iConfig - 1) return "Error 6";
  else {
    for (let i = body.Inicial; i <= body.Final; i++) if (iReserva.find((a) => parseFloat(a.Date) === i)) return "Error 7";
    for (let i = body.Inicial; i < body.Final; i++) {
      const find = iPaying.find((a) => {
        if (parseFloat(a.Date) === i)
          if (Today * 24 * 60 + new Date().getHours() * 60 + new Date().getMinutes() <= a.ExpireDate * 24 * 60 + a.ExpireHour * 60 + a.ExpireMin)
            return true;
      });
      if (find) return "Error 8";
    }
  }
  return null;
}

function getDate(day) {
  const dt = new Date(1900, 1, 1);
  return new Date(dt.setDate(dt.getDate() + day - 31)).toDateString();
}

module.exports = {
  GetDay,
  Chequeo,
  getDate,
};
