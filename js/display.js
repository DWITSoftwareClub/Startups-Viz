$(function () {
	var companyName;
	$("#selectCompany").change(function(){ 
		//companyName =$(this).find(":selected").text();		
		//var companyName=$('.garib :selected').text();
	    companyName=$('#selectCompany').find(":selected").text();	
		loadContent(companyName);	
		}); 
var secondCompanyName;
    $('#compareCompany').change(function(){
        secondCompanyName=$(this).find(":selected").text();
        loadContentForCompare(companyName,secondCompanyName);
    });
	var ddd;
    var public_spreadsheet_url='https://docs.google.com/spreadsheets/d/1--POrwu6Lom3stoNe5LQz_BhyAb4Nz8-7ccRIpix4yM/pubhtml';
    
    function loadContentForCompare(firstCompanyName,secondCompanyName){
        var company1Data=[];
        var company2Data=[]
        $('#container2').remove();

        Tabletop.init({
            key:public_spreadsheet_url,
            callback:showInfo1,
            simpleSheet: firstCompanyName
        })

        Tabletop.init({
            key:public_spreadsheet_url,
            callback:showInfo2,
            simpleSheet:secondCompanyName
        })

        function showInfo1(data,tabletop){            
            
            for(i=0;i<data.length;i++){  // loop for adding date and likes according to the date in info
                if(data[i].date.substr(3,9)== ddd){
                    item= {"date":data[i].date,"likes":data[i].likes};              
                    company1Data.push(item);                
                }
            }
        }

        function showInfo2(data,tabletop){
            for(i=0;i<data.length;i++){  // loop for adding date and likes according to the date in info
                if(data[i].date.substr(3,9)== ddd){
                    item= {"date":data[i].date,"likes":data[i].likes};              
                    company2Data.push(item);                
                }
            }

            goInChart(company1Data,company2Data);
        }

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
	   
		
		Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo,
                     simpleSheet: companyName
                      } )
     
	var info=[];  // list of date and likes
	var countryInfo=[]; // list of country and its respective likes
	ddd='03/2016';
	var startIndexForYear;
	var endIndexForMonth;
	var total_sum_of_country_likes=0;  // total sum of likes of page 
	
	function showInfo(data,tabletop){		
		for(i=0;i<data.length;i++){  // loop for adding date and likes according to the date in info
				if(data[i].date.substr(3,9)== ddd){
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
		 dateList=[]; // dates are put here as a list
		 lineData=[]; // data for dates are put here as a list
		 for(var i =0;i<info.length;i++){
				dateList.push(info[i].date);
				lineData.push(Number(info[i].likes));
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
            name: 'CloudFactory',            
			data:lineData
        }]
    });
    
    
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
	}
	});

