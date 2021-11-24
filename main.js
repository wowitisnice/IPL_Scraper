let request = require("request");
let path = require("path");
let bigObj = require("./big.js");
let cheerio = require("cheerio");
let fs = require("fs");
let XLSX = require("xlsx");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(err, response, body) {
  // console.log(body);
  mainPage(body);
}
function mainPage(response) {
  let $ = cheerio.load(response);
  let allMatchPage = $("a[data-hover='View All Results']").attr("href");
  let allMatchPageUrl = "https://www.espncricinfo.com" + allMatchPage;
  // console.log(allMatchPageUrl);
  request(allMatchPageUrl, function (err, response, body) {
    goToEachMatch(body);
  });
}
function goToEachMatch(body) {
  let $ = cheerio.load(body);
  let matchesArr = $("a.match-info-link-FIXTURES");
  for (let i = 0; i < matchesArr.length; i++) {
    if (i % 4 == 0) {
      request(
        "https://www.espncricinfo.com" + $(matchesArr[i]).attr("href"),
        function (error, response, body) {
          harPagePeJao(body);
        }
      );
    }
  }
}
function harPagePeJao(body) {
  let $ = cheerio.load(body);
  let iplPath = path.join(__dirname, "IPL");
  if (fs.existsSync(iplPath) == false) {
    fs.mkdirSync(iplPath);
  }
  // let allTables=$(".card.content-block.match-scorecard-table");
  // let teamName = $(".card.content-block.match-scorecard-table h5");
  let teamTable = $(".Collapsible");
  for (let k = 0; k <= 1; k++) {
    let allRows = $(teamTable[k]).find("tr");
    let teamName = $(teamTable[k]).find("h5");
    let currteamName = $(teamName).text().split("INNINGS")[0].trim();
    let a = 1;
    if (k == 1) {
      a = 0;
    }
    let oppteamName = $(teamTable[a]).find("h5");
    oppteamName = $(oppteamName).text().split("INNINGS")[0].trim();
    let teamPath = path.join(iplPath, currteamName);
    if (fs.existsSync(teamPath) == false) {
      fs.mkdirSync(teamPath);
    }
    let descriptionArr = $(".header-info .description").text().split(",");
    let result = $(
      ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text"
    ).text();
    let venue = descriptionArr[1];
    let date = descriptionArr[2];
    for (let i = 0; i < allRows.length; i++) {
      let allCols = $(allRows[i]).find("td");
      if ($(allCols[0]).hasClass("batsman-cell text-truncate")) {
        let playerName = $(allCols[0]).text().split(" ");
        playerName = playerName[0]+ " " + playerName[1];
        let json = {
          "player Name": playerName,
          "curr team Name": currteamName,
          "opp team Name": oppteamName,
          "result": result,
          "date": date,
          "venue": venue,
          "Runs":$(allCols[2]).text(),
          "Balls":$(allCols[3]).text(),
          "4s":$(allCols[5]).text(),
          "6s":$(allCols[6]).text(),
          "SR":$(allCols[7]).text()
        };
          var playerPath = path.join(teamPath, playerName + ".xlsx");
        let save = bigObj.er(playerPath, playerName);
        save.push(json);
        bigObj.ew(playerPath,save,playerName);
        }
      }
    }
  }

