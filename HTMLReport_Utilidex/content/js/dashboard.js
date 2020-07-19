/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9899193548387096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "50 Sites"], "isController": false}, {"data": [1.0, 500, 1500, "40 Login"], "isController": false}, {"data": [0.75, 500, 1500, "31 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "28 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "35 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "45 Login"], "isController": false}, {"data": [1.0, 500, 1500, "49 Sites"], "isController": false}, {"data": [1.0, 500, 1500, "39 Login"], "isController": false}, {"data": [1.0, 500, 1500, "42 Login"], "isController": false}, {"data": [1.0, 500, 1500, "44 Login"], "isController": false}, {"data": [1.0, 500, 1500, "30 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "34 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "29 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "37 Login"], "isController": false}, {"data": [1.0, 500, 1500, "47 Login"], "isController": false}, {"data": [1.0, 500, 1500, "25 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "46 Login"], "isController": false}, {"data": [1.0, 500, 1500, "33 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "51 Sites"], "isController": false}, {"data": [1.0, 500, 1500, "36 Login"], "isController": false}, {"data": [1.0, 500, 1500, "41 Login"], "isController": false}, {"data": [1.0, 500, 1500, "26 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "32 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "43 Login"], "isController": false}, {"data": [1.0, 500, 1500, "48 Login"], "isController": false}, {"data": [1.0, 500, 1500, "38 Login"], "isController": false}, {"data": [1.0, 500, 1500, "27 Launchutilidex"], "isController": false}, {"data": [1.0, 500, 1500, "52 ClickSite"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1240, 0, 0.0, 44.54677419354834, 3, 1253, 116.0, 175.80000000000018, 655.3599999999997, 11.959761190574937, 7.442054082956376, 3.8586468048629934], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["50 Sites", 10, 0, 0.0, 5.1, 4, 7, 6.9, 7.0, 7.0, 2.2207417277370642, 0.832778147901399, 0.6549453142349545], "isController": false}, {"data": ["40 Login", 50, 0, 0.0, 4.959999999999999, 3, 10, 7.0, 8.0, 10.0, 0.5125997006417748, 0.19222488774066557, 0.15117686483771092], "isController": false}, {"data": ["31 Launchutilidex", 50, 0, 0.0, 511.18000000000006, 311, 1253, 687.5, 711.55, 1253.0, 0.509741153442282, 1.1653359767659983, 0.18468160930379554], "isController": false}, {"data": ["28 Launchutilidex", 50, 0, 0.0, 4.9, 3, 12, 6.899999999999999, 7.0, 12.0, 0.5131468215685872, 0.1924300580882202, 0.1488326230526078], "isController": false}, {"data": ["35 Launchutilidex", 50, 0, 0.0, 5.140000000000001, 3, 13, 7.899999999999999, 8.449999999999996, 13.0, 0.5124525981346726, 0.19216972430050222, 0.15113348109049915], "isController": false}, {"data": ["45 Login", 50, 0, 0.0, 19.519999999999992, 11, 65, 37.699999999999996, 47.34999999999999, 65.0, 0.5131257568604914, 0.14732321534861764, 0.19091886070688205], "isController": false}, {"data": ["49 Sites", 10, 0, 0.0, 9.2, 7, 19, 18.200000000000003, 19.0, 19.0, 2.2192632046160674, 0.8322237017310252, 0.6436730193075898], "isController": false}, {"data": ["39 Login", 50, 0, 0.0, 5.459999999999999, 3, 12, 8.899999999999999, 11.0, 12.0, 0.5125891905191503, 0.19222094644468138, 0.14867088826580827], "isController": false}, {"data": ["42 Login", 50, 0, 0.0, 87.92000000000002, 72, 139, 116.69999999999999, 130.79999999999998, 139.0, 0.5123265774535319, 0.3507235652294199, 0.19312310439166344], "isController": false}, {"data": ["44 Login", 50, 0, 0.0, 88.6, 70, 148, 117.8, 136.35, 148.0, 0.5125629170980738, 0.35088535633373996, 0.19321219335923484], "isController": false}, {"data": ["30 Launchutilidex", 50, 0, 0.0, 4.8, 3, 8, 6.0, 7.0, 8.0, 0.5131889561736632, 0.19244585856512367, 0.15135064918402955], "isController": false}, {"data": ["34 Launchutilidex", 50, 0, 0.0, 5.26, 3, 10, 8.0, 8.449999999999996, 10.0, 0.5124263387138099, 0.1921598770176787, 0.15112573661286188], "isController": false}, {"data": ["29 Launchutilidex", 50, 0, 0.0, 4.680000000000001, 3, 10, 5.0, 8.0, 10.0, 0.5131994909061051, 0.1924498090897894, 0.15135375610707394], "isController": false}, {"data": ["37 Login", 50, 0, 0.0, 5.040000000000003, 3, 14, 7.0, 10.449999999999996, 14.0, 0.5125471543381992, 0.19220518287682464, 0.15116136778333605], "isController": false}, {"data": ["47 Login", 50, 0, 0.0, 8.220000000000002, 5, 27, 11.899999999999999, 18.499999999999957, 27.0, 0.5132627083846596, 0.4004451591627659, 0.1904685831896198], "isController": false}, {"data": ["25 Launchutilidex", 50, 0, 0.0, 15.66, 7, 155, 17.699999999999996, 74.59999999999997, 155.0, 0.5122793356761575, 0.19210475087855908, 0.14858101825763553], "isController": false}, {"data": ["46 Login", 50, 0, 0.0, 9.359999999999994, 5, 24, 15.899999999999999, 19.89999999999999, 24.0, 0.5132047584345202, 0.4003999468833075, 0.19044707832531022], "isController": false}, {"data": ["33 Launchutilidex", 50, 0, 0.0, 5.580000000000001, 3, 11, 8.899999999999999, 11.0, 11.0, 0.5123790785374651, 0.19214215445154942, 0.14860994758362026], "isController": false}, {"data": ["51 Sites", 10, 0, 0.0, 5.3, 3, 8, 8.0, 8.0, 8.0, 2.218278615794144, 0.8318544809228039, 0.6542188886424135], "isController": false}, {"data": ["36 Login", 50, 0, 0.0, 4.920000000000001, 3, 10, 7.0, 8.449999999999996, 10.0, 0.5124841129924972, 0.1921815423721865, 0.148640411678488], "isController": false}, {"data": ["41 Login", 50, 0, 0.0, 5.0, 3, 9, 7.0, 9.0, 9.0, 0.5126207221800734, 0.19223277081752754, 0.15118306454920133], "isController": false}, {"data": ["26 Launchutilidex", 50, 0, 0.0, 5.339999999999999, 3, 26, 7.899999999999999, 10.349999999999987, 26.0, 0.5131257568604914, 0.19242215882268426, 0.15133201032409024], "isController": false}, {"data": ["32 Launchutilidex", 50, 0, 0.0, 107.17999999999996, 88, 176, 146.9, 167.59999999999997, 176.0, 0.5116240995415848, 1.2675686919306648, 0.19036013859896858], "isController": false}, {"data": ["43 Login", 50, 0, 0.0, 144.51999999999998, 108, 196, 184.7, 195.45, 196.0, 0.5117445371270662, 0.3503251177012435, 0.1929037024717261], "isController": false}, {"data": ["48 Login", 50, 0, 0.0, 9.179999999999998, 5, 26, 17.9, 21.349999999999987, 26.0, 0.5132416341613631, 0.4004287171525354, 0.19046076267706835], "isController": false}, {"data": ["38 Login", 50, 0, 0.0, 5.260000000000001, 3, 13, 7.0, 10.799999999999983, 13.0, 0.5125103783351612, 0.19219139187568549, 0.15115052173556515], "isController": false}, {"data": ["27 Launchutilidex", 50, 0, 0.0, 5.1000000000000005, 4, 13, 6.0, 9.449999999999996, 13.0, 0.513083632632119, 0.19240636223704463, 0.15131958696767572], "isController": false}, {"data": ["52 ClickSite", 10, 0, 0.0, 140.3, 118, 185, 184.3, 185.0, 185.0, 2.134927412467976, 1.4615079259180188, 0.8047675597779675], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1240, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
