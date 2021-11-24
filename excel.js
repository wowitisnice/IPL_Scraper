let fs=require("fs");
let buffer=require("./dheta.json");
let XLSX=require("xlsx");
// let data=JSON.parse(buffer);
// console.log(typeof(buffer));
// buffer.push(45);
// buffer=JSON.stringify(buffer);
// fs.writeFileSync("dheta.json",buffer);
// var wb = XLSX.utils.book_new();
// var ws=XLSX.utils.json_to_sheet(buffer);
// XLSX.utils.book_append_sheet(wb, ws, "kho");
// XLSX.writeFile(wb,"kho.xlsx");
// let wb=XLSX.readFile("kho.xlsx");
// let data=wb.Sheets["kho"];
// console.log(XLSX.utils.sheet_to_json(data));
// excelRead("./kho.xlsx","kho");
function excelRead(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=XLSX.readFile(filePath);
    let json=wb.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(json);
}
function excelWrite(filePath,json,sheetName){
    let wb=XLSX.utils.book_new();
    let data=XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(wb,data,sheetName);
    XLSX.writeFile(wb,filePath);
}
module.exports={er:excelRead,ew:excelWrite};
