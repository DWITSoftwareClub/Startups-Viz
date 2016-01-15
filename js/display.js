$(function () {
	init();
	var tabletop;
 	var info=[];  // list of date and likes
	var countryInfo=[]; // list of country and its respective likes
	var ddd='03/2016';
	var startIndexForYear;
	var endIndexForMonth;
	var total_sum_of_country_likes=0;  // total sum of likes of page 
	var company = {};
	var companyName;

	$("#selectCompany").change(function(){ 
		 companyName=$('#selectCompany').find(":selected").text();
		 loadContent(companyName);	
	}); 
		
	function init(){
		var public_spreadsheet_url='https://docs.google.com/spreadsheets/d/1--POrwu6Lom3stoNe5LQz_BhyAb4Nz8-7ccRIpix4yM/pubhtml';
		tabletop = Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo
		 })
	}

	function showInfo(data,tabletop){
		$.each(tabletop.model_names, function(index, value){
			console.log(this);
			company[this] = tabletop.sheets(this).all();
			console.log(company[this]);
	});
	}

	function loadContent(companyName){
		var data = company[companyName];
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
		 categoriesData=[]; // dates are put here as a list
		 lineData=[]; // data for dates are put here as a list
		 for(var i =0;i<info.length;i++){
				categoriesData.push(info[i].date);
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




