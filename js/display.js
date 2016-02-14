$(function () {
    init();    
    var counter=0;
	var tabletop;
 	var finalDateSelected;
    var initialDateSelected;
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
//console.log('Test');
		var public_spreadsheet_url='https://docs.google.com/spreadsheets/d/1--POrwu6Lom3stoNe5LQz_BhyAb4Nz8-7ccRIpix4yM/pubhtml';
		    tabletop = Tabletop.init( { key: public_spreadsheet_url,
                callback: showInfo
         })
	}

           function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
               // console.log(start.format('DD/MM/YYYY') + ' ' + end.format('DD/MM/YYYY'));
                initialDateSelected=Date.parse(start.format('YYYY-MM-DD'));
                finalDateSelected=Date.parse(end.format('YYYY-MM-DD'));
             //   console.log(typeof initialDateSelected);                
                }
                
               cb(moment().subtract(29, 'days'), moment());
                
                $('#reportrange').daterangepicker({
                    ranges: {
                       'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                       'This Month': [moment().startOf('month'), moment().endOf('month')],
                       'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        }
                    }, cb);
    
    function createLineChart(){
             lineCharts = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'line'
         },
	title:{
	    text: ''
	}
    });
    }
    
      function createPieChart(counter, companyName){
          pieCharts = new Highcharts.Chart({
        chart: {
            renderTo: 'container'+counter,
            type: 'pie'
         }, plotOptions: {
            pie: {
                size: 150
            }
        }
             
        });
          pieCharts.setTitle({text: String(companyName)});
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
            
            $('#countrylink').show();
            $.each(selectedCompanies, function(index, value){
                loadContent(this);
			});

		}
	}); 

    function showInfo(data,tabletop){
		$.each(tabletop.model_names, function(index, value){
			company[this] = tabletop.sheets(this).all();
          
	});
	$( "#submit" ).prop( "disabled", false );
	}
    
    var initialDateToShow=function(){
        var today=new Date();
        var year=today.getFullYear();
        var month=today.getMonth()+1;
        if(month==1){
            year=year-1;
            month=12;
        }
        initialDateSelected=(year+'-'+month+'-'+'1');
        finalDateSelected= (year+'-'+month+'-'+'1');   
    }
    
    
	function loadContent(companyName){
        counter=0;
        bigCounter=bigCounter+1;
       
        createPieChart(bigCounter, companyName);
        var info=[];  // list of date and likes
		var countryInfo=[]; // list of country and its respective likes
		var data = company[companyName];
        //finalDateSelected=dateSelected.substr(5,6)+'/'+dateSelected.substr(0,4);    
		for(i=0;i<data.length;i++){  // loop for adding date and likes according to the date in info
				//if(data[i].date.substr(3,9)== finalDateSelected)
                if((Date.parse(returnDate(data[i].date)) >= initialDateSelected) && (Date.parse(returnDate(data[i].date))<=finalDateSelected)){
					item= {"date":data[i].date,"likes":data[i].likes};				
					info.push(item);				
				}

			}
            console.log(info);
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
			     
				goInChart(info,countryInfo, companyName);//info is for line graph while countryInfo is for pie chart
		}
	
    function returnDate(oldDate){
        var newDate=oldDate.substring(6,10)+'-'+oldDate.substring(3,5)+'-'+oldDate.substring(0,2);
        return newDate;
    }

	function returnPercentage(countryLikes){
		var percentage= (countryLikes/total_sum_of_country_likes) * 100;
		return percentage;
	}
    
    

	function goInChart(info,countryInfo, companyName){ // function to display both line graph and pie chart
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
       name: String(companyName),
        type: 'line', 
        data: lineData
    });
        
   // center: ['80%', '50px'],
        pieCharts.addSeries({
	    name: String(companyName),
            size: 150,
            data: countryInfo
        });
    
}
});


 