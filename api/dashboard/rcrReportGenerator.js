//Credit to: https://docxtemplater.com/docs/get-started-browser/

const exampleRenderMap1 = {
    icaoCode: "VVNB",
    timeInUTC: "10090430",
    rwCode: "11R",
    editor: "Văn Dũng",
    avReport:"X",
    naReport:"",
    '1.6':"O",
    '1.5':"",
    '1.2':"",
    '2.6':"O",
    '2.5':"",
    '2.2':"",
    '3.6':"O",
    '3.5':"",
    '3.2':"",
    '1.rwStatusVN':'KHÔ',
    '2.rwStatusVN':'KHÔ',
    '3.rwStatusVN':'KHÔ',
    '1.rcr':'6',
    '2.rcr':'6',
    '3.rcr':'6',
    '1.waterCoverage':'NR',
    '2.waterCoverage':'NR',
    '3.waterCoverage':'NR',
    '1.waterDepth':'NR',
    '2.waterDepth':'NR',
    '3.waterDepth':'NR',
};
//============ Form Filling ===============
get2DigitsForm=(num)=>num<10? '0'+num:num;
getTimeInUTC=()=>{
    const d = new Date();
    let hour = d.getUTCHours(), hh = get2DigitsForm(hour);
    let minutes = d.getUTCMinutes(), mm = get2DigitsForm(minutes);
    let month = d.getUTCMonth()+1, mo = get2DigitsForm(month);
    let date = d.getUTCDate(), dd = get2DigitsForm(date);
    return `${mo}${dd}${hh}${mm}`;
}

formFilling=(rwCode,editor,rcrObList1rw)=>{ 
    let initRenderMap = {
        icaoCode: "VVNB",
        timeInUTC: getTimeInUTC(),
        rwCode: rwCode,
        editor: "Văn Dũng",
        avReport:"X",
        naReport:"",
    }; 
    const rcrCodeList = [6,5,2];
    const rcrParam = ['rwStatusVN','rcr','waterCoverage','waterDepth'];
    initRenderMap = rcrObList1rw.reduce((rcrOut,rcrOb,idx)=>{
        rcrOut = rcrCodeList.reduce((out,code)=>{out[(idx+1)+'.'+code]=(rcrOb.rcr==code)?'O':''; return out;},rcrOut);
        return rcrParam.reduce((out,param)=>{out[(idx+1)+'.'+param]=rcrOb[param]; return out;},rcrOut);
    }
    ,initRenderMap);
    return initRenderMap;
}
const rwList = { '11L' :['TDZ11L','CTR11L29R','TDZ29R'], '11R' :['TDZ11R','CTR11R29L','TDZ29L']};
genData=(rwCode)=>{
    if(!rwList[rwCode]) throw 'rwCode is undefined'; 
    let rcrObList = rwList[rwCode].map((htmlId)=>uiData.rcrData[htmlId]); 
    return formFilling(rwCode,'Văn Dũng',rcrObList);
}


//============ Form Generator =============
window.generateForm1 = (rwCode)=>{genReport("dashboard/Bieumau1-T05NIA-AT.docx",genData(rwCode),"Bieu mau 1-T05 NIA-AT.docx")}


window.generateForm2 = (rwCode)=>{genReport("dashboard/Bieumau2-T05NIA-AT.docx",genData(rwCode),"Bieu mau 2-T05 NIA-AT.docx")}

loadFile=(url, callback)=>{PizZipUtils.getBinaryContent(url, callback);}
genReport = (templateUrl, renderMap, outputFilename)=> loadFile(
    templateUrl,
    (error, content)=>{
        if (error) {throw error;}

        var zip = new PizZip(content);
        var doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true,});

        // Render the document (Replace {icaoCode} by VVNB, ...)
        doc.render(renderMap);

        var blob = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",// compression: DEFLATE adds a compression step. For a 50MB output document, expect 500ms additional CPU time
        });
        // Output the document using Data-URI
        saveAs(blob, outputFilename);
    }
);