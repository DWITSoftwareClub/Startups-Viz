$(function () {
	init();
    var counter=0;
	var tabletop;
 	var finalDateSelected;
	var dateSelected;
	var total_sum_of_country_likes=0;  // total sum of likes of page 
	var company = {};
	var companyName;
	var companyNameForCompare;
	$("#selectCompany").change(function(){ 
		 companyName=$('#selectCompany').find(":selected").text();
		 $('#container2').show();
		 loadContent(companyName);	
	}); 

    $('#dateSelect').change(function(){
        dateSelected=$('#dateSelect').val();
        console.log(dateSelected);
        if (counter==0) loadContent(companyName)
            else loadContentForCompare(companyName,companyNameForCompare);
});

	$("#selectCompareCompany").change(function(){
		$('#container2').hide();
		companyNameForCompare=$('#selectCompareCompany').find(":selected").text();
		loadContentForCompare(companyName,companyNameForCompare);
	})
		
	function init(){
		var public_spreadsheet_url='https://docs.google.com/spreadsheets/d/1--POrwu6Lom3stoNe5LQz_BhyAb4Nz8-7ccRIpix4yM/pubhtml';
		tabletop = Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo
		 })
	}

	function showInfo(data,tabletop){
		$.each(tabletop.model_names, function(index, value){
			
			company[this] = tabletop.sheets(this).all();
            dateSelected= '2016-03';// '03/2016';
			//console.log(company[this]);
	});
	}
	function loadContentForCompare(firstCompanyName,secondCompanyName){
        counter=1;
        var data1=company[firstCompanyName];
        var data2=company[secondCompanyName];
        var company1Data=[];
        var company2Data=[]
        $('#container2').hide();                    
        finalDateSelected=dateSelected.substr(5,6)+'/'+dateSelected.substr(0,4);    
        for(i=0;i<data1.length;i++){  // loop for adding date and likes according to the date in info
            if(data1[i].date.substr(3,9)== finalDateSelected){
                item= {"date":data1[i].date,"likes":data1[i].likes};              
                company1Data.push(item);                
            }
        }
        
        for(i=0;i<data2.length;i++){  // loop for adding date and likes according to the date in info
            if(data2[i].date.substr(3,9)== finalDateSelected){
                item= {"date":data2[i].date,"likes":data2[i].likes};              
                company2Data.push(item);                
            }
        }

            goInChart(company1Data,company2Data);
        

        function goInChart(company1Data, company2Data){
            var dateList=[];
            var company1LineData=[];
            var company2LineData=[];
            for(var i =0;i<company1Data.length;i++){
                dateList.push(company1Data[i].date);
                company1LineData.push(Number(company1Data[i].likes));
                company2LineData.push(Number(company2Data[i].likes));
             }  

              $('#container').highcharts({  // start of line graph
        title: {
            text: 'Daily progress',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Startups in Nepal',
            x: -20
        },
        xAxis: {
        categories: dateList
        },
        yAxis: {
            title: {
                text: 'Likes in Facebook'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: firstCompanyName,            
            data:company1LineData
        },
        {
            name:secondCompanyName,
            data:company2LineData
        }
        ]
    });
        }
    }
	function loadContent(companyName){
        counter=0;
		$('container2').show();
		var info=[];  // list of date and likes
		var countryInfo=[]; // list of country and its respective likes
		var data = company[companyName];
        finalDateSelected=dateSelected.substr(5,6)+'/'+dateSelected.substr(0,4);    
		for(i=0;i<data.length;i++){  // loop for adding date and likes according to the date in info
				if(data[i].date.substr(3,9)== finalDateSelected){
					item= {"date":data[i].date,"likes":data[i].likes};				
					info.push(item);				
				}
			}
			for(i=0;i<data.length;i++){ // loop for adding country likes
				if (data[i].country=="" || data[i].countrylikes==""){
					break;
				}
				else{
				total_sum_of_country_likes += parseInt(data[i].countrylikes);				
				}
			} 
			for(i=0;i<data.length;i++){
				if (data[i].country=="" || data[i].countrylikes==""){
					break;
				}
				else{				
					//country name and likes of that country are recorded as name and y.
				countryItem={"name":data[i].country,"y":returnPercentage(parseInt(data[i].countrylikes))};
				countryInfo.push(countryItem);
					}
				}
			
				goInChart(info,countryInfo);//info is for line graph while countryInfo is for pie chart
		}
	


	function returnPercentage(countryLikes){
		var percentage= (countryLikes/total_sum_of_country_likes) * 100;
		return percentage;
	}


	function goInChart(info,countryInfo){ // function to display both line graph and pie chart
		 categoriesData=[]; // dates are put here as a list
		 lineData=[]; // data for dates are put here as a list
		 for(var i =0;i<info.length;i++){
				categoriesData.push(info[i].date);
				lineData.push(Number(info[i].likes));
			 }	


			 $('#container').highcharts({
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: categoriesData//['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        labels: {
            items: [{
                html: 'Total fruit consumption',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [/*{
            type: 'column',
            name: 'Jane',
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'John',
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'column',
            name: 'Joe',
            data: [4, 3, 3, 9, 0]
        },*/ {
            type: 'spline',
            name: 'Average',
            data: lineData,//[3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }, {
            type: 'pie',
            name: 'Total consumption',
            data:/* [{
                name: 'Jane',
                y: 13,
                color: Highcharts.getOptions().colors[0] // Jane's color
            }, {
                name: 'John',
                y: 23,
                color: Highcharts.getOptions().colors[1] // John's color
            }, {
                name: 'Joe',
                y: 19,
                color: Highcharts.getOptions().colors[2] // Joe's color
            }],*/
            countryInfo,
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    }); 
    /*$('#container').highcharts({  // start of line graph
        title: {
            text: 'Daily progress',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Startups in Nepal',
            x: -20
        },
        xAxis: {
        categories: categoriesData
        },
        yAxis: {
            title: {
                text: 'Likes in Facebook'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'CloudFactory',            
			data:lineData
        }]
    });
    
    */
     $('#container2').highcharts({	//start of pie chart
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Number of likes from different country'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Country',
            colorByPoint: true,
            data: countryInfo
        }]
    });   // close of piechart setting 
}
});




