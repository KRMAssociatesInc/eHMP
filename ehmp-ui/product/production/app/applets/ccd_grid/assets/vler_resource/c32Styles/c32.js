function addLoadEvent(theFunc) {
    var oldloadfunc=window.onload;
    if (typeof window.onload!=="function") {
        window.onload=theFunc;
    }
    else {
        window.onload = function() {
            if (oldloadfunc) {
                oldloadfunc();
            }
            theFunc();
        };
    }
}
function addUnloadEvent(theFunc) {
    var oldUnloadFunc=window.onunload;
    if (typeof window.onunload!=="function") {
        window.onunload=theFunc;
    }
    else {
        window.onunload = function() {
            if (oldUnloadFunc) {
                oldUnloadFunc();
            }
            theFunc();
        };
    }
}

function showHelp(aUrl) {
    openNewWindow(aUrl, "Help");
}

function getComponentWithClass(_compType, _className, _container) {
    if (null===_compType || null===_className) return null;
    if (null===_container) _container=document;
    var _comps = _container.getElementsByTagName(_compType);
    if (null===_comps || _comps.length<1) {
        return null;
    }
    for (var i=0;i<_comps.length;i++) {
        if (null!==_comps[i].className && _comps[i].className.indexOf(_className)>-1) {
            return _comps[i];
        }
    }
    return null;
}
var dwidth_default=600;
var dheight_default = 500;

function viewDetail(urlString,dwidth,dheight) {
    if (null===dwidth) {
        dwidth=dwidth_default;
    }
    if (null===dheight) {
        dheight=dwidth_default;
    }
    setupTimeout();
    window.onunload = closeDetailDialog;
    if (null !== dlgDetail) {
        dlgDetail.close();
    }
    dlgDetail = getDialogWindow(urlString,"viewDetail",dwidth,dheight);
}

function getDialogWindow(page,dlgName,dwidth,dheight) {
    if (null===dwidth) {

    } dwidth=dwidth_default;
    if (null===dheight) {
        dheight=dwidth_default;
    }
    if (null===dlgName) {
        dlgName="vwDialog";
    }
    var dlgWindow=null;
    if (window.showModelessDialog) {
        // for IE
        dlgWindow = window.showModelessDialog(page,dlgName,'center=yes;dialogHeight=' + dheight + 'px;dialogWidth=' + dwidth + 'px;help=no;resizable=yes');
    }
    else if (window.openDialog) {
        // for Firefox
        dlgWindow = openAsDialog(page,dlgName,dwidth, dheight);
        dlgWindow.focus();
    }
    else if (window.open) {
        // for Opera and Safari
        dlgWindow = openAsDialog(page,dlgName,dwidth, dheight);
        dlgWindow.focus();
    }
    else {
        alert("Popup dialogs not supported for this browser");
    }
    return dlgWindow;
}

function openAsDialog(urlString,dialogName,dwidth,dheight) {
    if (null===dwidth) {
        dwidth=dwidth_default;
    }
    if (null===dheight) {
        dheight=dwidth_default;
    }
    return window.open(urlString, dialogName, "resizable=yes,scrollbars=yes,status=no,dependent=yes,height="+dheight+",width="+dwidth+",top=100,left=200");
}

function openNewWindow(urlString,windowName,dwidth,dheight) {
    if (null===dwidth) {
        dwidth=dwidth_default;
    }
    if (null===dheight) {
        dheight=dwidth_default;
    }
    return window.open(urlString, windowName, "resizable=yes,scrollbars=yes,status=yes,dependent=no,height="+dheight+",width="+dwidth+",top=100,left=200");
}

function closeDetailDialog() {
    closePrintDlgIfOpen();
    if (null !== dlgDetail) {
        dlgDetail.close();
    }
}

function printReport() {
    closePrintDlgIfOpen();
    dlgDetailPrint=getDialogWindow("blank.htm","printReport");
    if (null === dlgDetailPrint) {
        alert("Print window could not be opened");
        return;
    }

    var aDoc=findDocWithPatientData();

    var doc = dlgDetailPrint.contentDocument;
    if (undefined===doc || null===doc) {
        doc = dlgDetailPrint.document;
    }
    doc.open();
    var all;
    var prtData;
    buildHeader(doc, aDoc);

    var sitesReport = document.getElementById("siteReportsMenu");
    if (!sitesReport) {

        // For most grid reports the gridTable data is in the aDiv element
        var gridTbl=document.getElementById("aDiv");
        if (undefined=== gridTbl || null===gridTbl) {
            // For the flat/tabbed reports the "gridTable" data is in the siteDiv0 element
            prtData = document.getElementById("siteDiv0");
            if (undefined===prtData || null===prtData) {
                // For the Vitals graph, the data is in the GraphPanel element
               prtData = document.getElementById("GraphPanel");
               var lnk = prtData.getElementsByTagName("A");
               prtData.removeChild(lnk[0]);
               }
        } else {
            prtData = gridTbl.cloneNode(true);
            removeAnchors(prtData);
            maybeRemoveColumn(prtData, "View Details");
            maybeRemoveColumn(prtData, "AWIV");
        }
        doc.write(prtData.innerHTML);
    } else {
        if (sitesReport) {
            if (document.all) {
                all = document.all;
            }
            else if (document.getElementsByTagName) {
                all = document.getElementsByTagName("*");
            }
            else {
                all = [];
            }
            for (var i=0; i<all.length; i++) {
                if (all[i].className === "sitePanel") {
                    prtData = all[i];
                    doc.write(prtData.innerHTML);
                }
            }
        }
    }

    buildFooter(doc, aDoc);
    doc.close();
    dlgDetailPrint.focus();
    dlgDetailPrint.print();
}

function findDocWithPatientData() {
    if (null!==getPatientLabel(document)) {
        return document;
    }
    if (null!==parent && null!==getPatientLabel(parent.document)) {
        return parent.document;
    }
}

function removeAnchors(gridTbl) {
    //Remove anchors/links from col headers and replace with text
    var hdrRow = gridTbl.getElementsByTagName("tr")[0];
    var hdrCells = hdrRow.getElementsByTagName("th");
    for (var j = 0; j < hdrCells.length; j++) {
        var colHdr = hdrCells[j];
        var anchr = colHdr.getElementsByTagName("a")[0];
        var hdrText = " ";
        if (anchr) {
            hdrText = anchr.childNodes[0].nodeValue;
            colHdr.removeChild(anchr);
        }
        var myCurrHdrTxt = document.createTextNode(hdrText);
        colHdr.appendChild(myCurrHdrTxt);
    }
}

function maybeRemoveColumn(aTable, colName) {
    var _rows=aTable.getElementsByTagName("tr");
    if (null===_rows || _rows.length<1) {
        return;
    }
    var _allTds=_rows[0].getElementsByTagName("th");
    if (null===_allTds || _allTds.length<1) {
        return;
    }
    var _targetTd=null;
    for (var i=0;i<_allTds.length;i++) {
        if (_allTds[i].innerHTML.indexOf(colName)>-1) {
            removeColumn(_rows, i);
            break;
        }
    }
}

function removeColumn(_rows, _colNum) {
    _rows[0].removeChild(_rows[0].getElementsByTagName("th")[_colNum]);
    for (var i=1;i<_rows.length;i++) {
        _rows[i].removeChild(_rows[i].getElementsByTagName("td")[_colNum]);
    }
}

function getPatientLabel(aComp) {
    return aComp.getElementById("PatientLabel");
}

function buildHeader(doc, aDoc) {
    var ptNode = getPatientLabel(aDoc);
    var ptName = ptNode.innerHTML;
    var ssnIdx = ptName.search(/\d{3}\D\d{2}\D\d{4}/);
    var newName = ptName.substring(0,ssnIdx-2);
    var ptSsn = ptName.substring(ssnIdx+7,ssnIdx+11);
    ptSsn = "***-**-"+ptSsn;

    var tbl = doc.createElement("table");
    var tblBody = doc.createElement("tbody");

    //Create first row of header
    var row1 = doc.createElement("tr");
    var r1c1 = doc.createElement("td");
    var r1c1Text = doc.createTextNode("VistAWeb");
    var r1c1Font = doc.createElement("font");
    //r1c1Font.size="6";
    r1c1Font.appendChild(r1c1Text);
    r1c1.appendChild(r1c1Font);
    r1c1.align="center";
    r1c1.width="40%";
    r1c1.setAttribute("style", "font-size:small");
    var r1c2 = doc.createElement("td");
    var rptImg = getComponentWithClass("IMG", "pageTitleImage", aDoc);
    var	newRptImg = doc.createElement("img");
    if (null!==rptImg) {
        newRptImg.src = rptImg.src;
    }
    else {
        newRptImg.src = "resources/images/blank.gif";
    }
    r1c2.appendChild(newRptImg);
    r1c2.width = "30%";
    var r1c3 = doc.createElement("td");
    var dt = new Date();
    var curMth = dt.getMonth();
    curMth++;
    var r1c3Text = doc.createTextNode(curMth + "/" + dt.getDate() + "/" + dt.getFullYear());
    var r1c3Font = doc.createElement("font");
    r1c3Font.appendChild(r1c3Text);
    r1c3.appendChild(r1c3Font);
    r1c3.align="center";
    r1c3.width="30%";
    r1c3.setAttribute("style", "font-weight:bold");
    row1.appendChild(r1c1);
    row1.appendChild(r1c2);
    row1.appendChild(r1c3);

    //Create second row of header
    var row2 = doc.createElement("tr");
        var r2c1 = doc.createElement("td");
            var r2c1Text = doc.createTextNode(newName);
            r2c1.appendChild(r2c1Text);
            r2c1.align="center";
        var r2c2 = doc.createElement("td");
            var r2c2Text = doc.createTextNode(ptSsn);
            r2c2.appendChild(r2c2Text);
            r2c2.align="center";
        var r2c3 = doc.createElement("td");
            var lblDOB = aDoc.getElementById("lblDOB");
            var r2c3Text = doc.createTextNode("DOB:  " + lblDOB.innerHTML);
            r2c3.appendChild(r2c3Text);
            r2c3.align="center";
    row2.appendChild(r2c1);
    row2.appendChild(r2c2);
    row2.appendChild(r2c3);

    // Create third row of header --  Warning text that columns may be truncated

    var tbl2 = doc.createElement("table");
    var tblBody2 = doc.createElement("tbody");

    var row3 = doc.createElement("tr");
        var r3c2 = doc.createElement("td");
            var r3c2Text = doc.createTextNode("***WARNING: Printed grid reports may not show all columns.  Check printouts carefully.");
            r3c2.appendChild(r3c2Text);
            r3c2.align="center";
            r3c2.width = "100%";
    row3.appendChild(r3c2);

    tblBody.appendChild(row1);
    tblBody.appendChild(row2);
    tbl.appendChild(tblBody);
    tbl.setAttribute("width", "100%");
    tbl.setAttribute("border", "0");
    tbl.setAttribute("bgcolor", "silver");

    tblBody2.appendChild(row3);
    tbl2.appendChild(tblBody2);
    tbl2.setAttribute("width", "100%");
    tbl2.setAttribute("border", "0");
    tbl2.setAttribute("bgcolor", "silver");

    doc.write(tbl.outerHTML);
    doc.write(tbl2.outerHTML);
}

function buildFooter(doc, aDoc) {
    var tbl = doc.createElement("table");
    var tblBody = doc.createElement("tbody");
    var row1 = doc.createElement("tr");
        var r1c1 = doc.createElement("td");
            var userName = aDoc.getElementById("lblUserName");
            var r1c1Text = doc.createTextNode("Printed by:  " + userName.innerHTML);
            r1c1.appendChild(r1c1Text);
            r1c1.width = "70%";

    row1.appendChild(r1c1);
    tblBody.appendChild(row1);
    tbl.appendChild(tblBody);
    tbl.width="100%";
    tbl.border="0";
    tbl.bgcolor="silver";
    doc.write(tbl.outerHTML);
}

function printStuff() {
    closePrintDlgIfOpen();
    dlgDetailPrint = getDialogWindow("DetailsPrint.aspx?" + location.search.substring(1),"printStuff");
}

function closePrintDlgIfOpen() {
    if (null !== dlgDetailPrint) {
        dlgDetailPrint.close();
    }
}

function printDetail() {
    closePrintDlgIfOpen();
    dlgDetailPrint = getDialogWindow("blank.htm","printDetail");
    if (null === dlgDetailPrint) {
        alert("Print window could not be opened");
        return;
    }
    var doc = dlgDetailPrint.contentDocument;
    if (undefined === doc || null === doc) {
        doc = dlgDetailPrint.document;
    }
    doc.open();
    var aDoc = this.document;
    buildDtlHeader(doc, aDoc);
    var txtArea = document.getElementById("aDiv");
    var newTxt = txtArea.cloneNode(true);
    doc.write(newTxt.innerHTML);
    buildDtlFooter(doc, aDoc);
    doc.close();
    dlgDetailPrint.focus();
    dlgDetailPrint.print();
}

function buildDtlHeader(doc, aDoc) {

    var ptNode = aDoc.getElementById("PatientLabel");
    var ptName = ptNode.childNodes[0].data;
    var ssnIdx = ptName.search(/\d{3}\D\d{2}\D\d{4}/);
    var newName = ptName.substring(0, ssnIdx - 2);
    var ptSsn = ptName.substring(ssnIdx + 7, ssnIdx + 11);
    ptSsn = "***-**-" + ptSsn;

    var tbl = doc.createElement("table");
    var tblBody = doc.createElement("tbody");

    //Create first row of header
    var row1 = doc.createElement("tr");
    var r1c1 = doc.createElement("td");
    var r1c1Text = doc.createTextNode("VistAWeb");
    var r1c1Font = doc.createElement("font");
    //r1c1Font.size="6";
    r1c1Font.appendChild(r1c1Text);
    r1c1.appendChild(r1c1Font);
    r1c1.align = "center";
    r1c1.width = "40%";
    r1c1.setAttribute("style", "font-size:small");
    var r1c2 = doc.createElement("td");
    var r1c2Text = doc.createTextNode(document.getElementById("gridDesc").childNodes[0].data);
    var r1c2Font = doc.createElement("font");
    r1c2Font.appendChild(r1c2Text);
    r1c2.appendChild(r1c2Font);
    r1c2.align = "center";
    r1c2Font.setAttribute("size", "3");
    r1c2.setAttribute("style", "font-size:large");
    r1c2.width = "30%";
    var r1c3 = doc.createElement("td");
    var dt = new Date();
    var curMth = dt.getMonth();
    curMth++;
    var r1c3Text = doc.createTextNode(curMth + "/" + dt.getDate() + "/" + dt.getFullYear());
    var r1c3Font = doc.createElement("font");
    r1c3Font.appendChild(r1c3Text);
    r1c3.appendChild(r1c3Font);
    r1c3.align = "center";
    r1c3.width = "30%";
    r1c3.setAttribute("style", "font-weight:bold");
    row1.appendChild(r1c1);
    row1.appendChild(r1c2);
    row1.appendChild(r1c3);

    //Create second row of header
    var row2 = doc.createElement("tr");
    var r2c1 = doc.createElement("td");
    var r2c1Text = doc.createTextNode(newName);
    r2c1.appendChild(r2c1Text);
    r2c1.align = "center";
    var r2c2 = doc.createElement("td");
    var r2c2Text = doc.createTextNode(ptSsn);
    r2c2.appendChild(r2c2Text);
    r2c2.align = "center";
    var r2c3 = doc.createElement("td");
    var lblDOB = aDoc.getElementById("lblDOB");
    var r2c3Text = doc.createTextNode("DOB:  " + lblDOB.innerHTML);
    r2c3.appendChild(r2c3Text);
    r2c3.align = "center";
    row2.appendChild(r2c1);
    row2.appendChild(r2c2);
    row2.appendChild(r2c3);

    tblBody.appendChild(row1);
    tblBody.appendChild(row2);
    tbl.appendChild(tblBody);
    tbl.setAttribute("width", "100%");
    tbl.setAttribute("border", "0");
    tbl.setAttribute("bgcolor", "silver");
    doc.write(tbl.outerHTML);
}

function buildDtlFooter(doc, aDoc) {
    var tbl = doc.createElement("table");
    var tblBody = doc.createElement("tbody");
    var row1 = doc.createElement("tr");
    var r1c1 = doc.createElement("td");
    var userName = aDoc.getElementById("lblUserName");
    var r1c1Text = doc.createTextNode("Printed by:  " + userName.innerHTML);
    r1c1.appendChild(r1c1Text);
    r1c1.width = "70%";

    row1.appendChild(r1c1);
    tblBody.appendChild(row1);
    tbl.appendChild(tblBody);
    tbl.width = "100%";
    tbl.border = "0";
    tbl.bgcolor = "silver";
    doc.write(tbl.outerHTML);
}

var dlgDetail=null;
var dlgDetailPrint=null;

//function setupTimeout() {
//    if(null!==timeoutId) {
//        window.clearTimeout(timeoutId);
//    }
//    timeoutId=window.setTimeout("PromptUser()",900000);
//}
//
//function PromptUser() {
//    var rtn = window.showModalDialog("Countdown.htm");
//    if (rtn === "Close") {
//        window.location="Timedout.aspx";
//    }
//    setupTimeout();
//}

function toClipboard() {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text",document.getElementById("TextVersion").value);
}

function maybeStartCheck() {
    if(typeof(ajax)!="undefined") {
        checkPage();
    }
}

function trimString(str) {
    str = this !== window? this : str;
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

var timeoutId=null;
var TipBoxID = "TipBox";
var tip_box_id;

function findPosX(obj){
    var curleft = 0;
    if(obj.offsetParent)
        while(1){
            curleft += obj.offsetLeft;
            if(!obj.offsetParent) break;
            obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj){
    var curtop = 0;
    if(obj.offsetParent)
        while(1){
            curtop += obj.offsetTop;
            if(!obj.offsetParent)
                break;
            obj = obj.offsetParent;
        }
    else if(obj.y)
    curtop += obj.y;
    return curtop;
}

function HideTip(){
    tip_box_id.style.display = "none";
}

function ShowTip() {
    tip_box_id.style.display = "block";
}

function ToggleTip() {
  if (tip_box_id.style.display == "none"){
    ShowTip();
  }
  else if (tip_box_id.style.display == "block"){
    HideTip();
  }
}

function DisplayTip(me,offX,offY,freeText,data){
    var content = me.innerHTML;
    var tdLength = me.parentNode.offsetWidth;
    var textLength = me.innerHTML.length;
    var left, top;
    if(((textLength-1)*10) > tdLength) {
        var tipO = me;
        tip_box_id = document.getElementById(TipBoxID);
        var x = findPosX(me);
        var y = findPosY(me);

        if(freeText=='1'){
             left = x + offX - 300;

            if( left < 0) {
            left = 0;
            }
          top = y + offY + 75;

          tip_box_id.style.left = String(parseInt(left) + 'px');
          tip_box_id.style.top = String(parseInt(top) + 'px');
          tip_box_id.innerHTML = content;
          tip_box_id.style.display = "none";
          tipO.onclick = ToggleTip;
        }
        else{
            left = x + offX - 100;

            if(left < 0){
                left = 0;
            }
            
            top = y + offY - 10;
            tip_box_id.style.left = String(parseInt(left) + 'px');
            tip_box_id.style.top = String(parseInt(top) + 'px');
            tip_box_id.innerHTML = content;
            tip_box_id.style.display = "block";
            tipO.onmouseout = HideTip;
        }
    }
}


