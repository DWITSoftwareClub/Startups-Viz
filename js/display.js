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
    var lineCharts;
    var pieCharts;
    var lineData = [];
    var  dateSelected;
    var bigCounter=0;
    	function init(){
		var public_spreadsheet_url='https://docs.google.com/spreadsheets/d/1--POrwu6Lom3stoNe5LQz_BhyAb4Nz8-7ccRIpix4yM/pubhtml';
		tabletop = Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo
		 })
	}
    
    
    function createLineChart(){
             lineCharts = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'line'
         }
    });
    }
    
      function createPieChart(counter){
          pieCharts = new Highcharts.Chart({
        chart: {
            renderTo: 'container'+counter,
            type: 'pie'
         }
             
        });
          
    }
    var submitCounter=0;
	$("#submit").click(function(){ 
		selectedCompanies = $('.selectpicker').val()	
		if (selectedCompanies != null){		
            createLineChart();
            //createPieChart(selectedCompanies.length);
           // console.log(selectedCompanies.length);
            bigCounter=0;
            submitCounter=submitCounter+1;
            if (submitCounter>1){
            pieCharts.destroy();
            }
            
            
            $.each(selectedCompanies, function(index, value){
                loadContent(this);
			});
		}
	}); 

    function showInfo(data,tabletop){
		$.each(tabletop.model_names, function(index, value){
			company[this] = tabletop.sheets(this).all();
            dateSelected= '2016-03';
	});
	}
    
    
    
    
	function loadContent(companyName){
        counter=0;
        bigCounter=bigCounter+1;
       
        createPieChart(bigCounter);
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
    
    
    function updateDate(){
        
        
    }

	function goInChart(info,countryInfo){ // function to display both line graph and pie chart
         categoriesData=[]; // dates are put here as a list
        lineData = [];
        if (categoriesData.length < 1)
        {
            for(var i=0;i<info.length;i++){	
                categoriesData.push(info[i].date);
            }
       
        }
          lineCharts.xAxis[0].setCategories(categoriesData);
         for(var i =0;i<info.length;i++){	
             lineData.push(Number(info[i].likes));
        }      
              lineCharts.addSeries({
        name: companyName,
        type: 'line',
        color: '#FFA500',  
        data: lineData
    });
        
    
        pieCharts.addSeries({
            name: 'Total Consumption',
            data: countryInfo
        });
    
}
});


 