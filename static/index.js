

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

function initSetup(){
         
        safariVideoWorkaround();
                
        if (window.FileReader != undefined) {
                document.getElementsByTagName("input")[0].checked = false;
                document.getElementsByTagName("input")[0].disabled = false;
                document.getElementsByTagName("input")[1].checked = false;
                document.getElementsByTagName("input")[1].disabled = false;
                }
        else {
                alert("Please update your browser to use this website's analysis features");
                }
           
        }

//detect browser and set correct video
//safari only supports aac audio not mp3
//therefore use original mov file
function safariVideoWorkaround(){
        
                
        video = document.getElementsByTagName("video")[0];
         
        
        if ( video.canPlayType ) {
                // Check for MPEG-4 support
                if (video.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ) ){
                        source = document.createElement("source");
                        source.type = 'video/mp4; codecs="mp4v.20.8"';
                        source.src = "video/demo.mov";
                        video.appendChild(source);
                        }
                // Check for Webm support
                if ( video.canPlayType( 'video/webm; codecs="vp8, vorbis"' ) ){
                        source = document.createElement("source");
                        source.type = 'video/webm; codecs="vp8, vorbis"';
                        source.src = "video/demo.webm";
                        video.appendChild(source);
                        }
                // Check for h264 mp3 support
                if ( video.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp3"' )){
                        source = document.createElement("source");
                        source.type = 'video/mp4; codecs="avc1.42E01E, mp3"';
                        source.src = "video/demo.mp4";
                        video.appendChild(source);
                        }
                // Check for Ogg support
                if (  video.canPlayType( 'video/ogg; codecs="theora, vorbis"' ) ){
                        source = document.createElement("source");
                        source.type = 'video/ogg; codecs="theora, vorbis"';
                        source.src = "video/demo.ogv";
                        video.appendChild(source);
                        }
                }
        
        
        
        
        }



////////////////////////////////////////////////////////////////////////////////
//File drop handlers
////////////////////////////////////////////////////////////////////////////////






function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        files = evt.dataTransfer.files; // FileList object.

        file = files[0];
	reader = new FileReader();
	reader.onload = function (event) {
	        fileData = event.target.result;
                parsedData = d3.csv.parse(fileData);
        
	        if (parsedData[0]["exposure"] != null && parsedData[0]["quantity"] != null && parsedData[0]["effective_date"] != null){
                        holdingsFileDrop(parsedData);
                        }
                //sensitivity file
                else if (parsedData[0]["factor"] != null && parsedData[0]["shock"] != null){
                        shockFileDrop(parsedData);
                        }
                else {
                        alert ("Bad file format");
                        }
		}
	reader.readAsText(file);
	resetDrag();
	}

function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        
        //change when dragging
        document.getElementById('dropFile').style.backgroundColor = '#FFFFFF';
        document.getElementById('dropFile').style.borderStyle = 'solid';
        }

function resetDrag(){
        document.getElementById('dropFile').style.backgroundColor = null;
        document.getElementById('dropFile').style.borderStyle = null;
        }


//*********************************************
// Setup the dnd listeners.
//********************************************* 
//should be part of an init functio??
var dropZone = document.getElementById('dropFile');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
dropZone.addEventListener('dragleave', resetDrag, false);


function demoHoldingsDrop(){
        readCSVFile("demo/demo_portfolio.csv", holdingsFileDrop);
        }
function demoShockDrop(){
        readCSVFile("demo/demo_shocks.csv", shockFileDrop);
        }
        
function readCSVFile(filePath, f){
	d3.csv(filePath, function(error, parsedData) {
		f( parsedData.slice() );
		});
	}
    


function holdingsFileDrop(parsedData){
        document.getElementsByTagName("input")[0].checked = true;
        document.getElementsByTagName("input")[0].disabled = true;
        //document.getElementsByClassName("blurb")[0].style.display = "none";
        document.getElementsByClassName("fiResults")[0].style.display = "block";
        document.getElementsByClassName("todoHolding")[0].style.textDecoration = "line-through";

        document.getElementsByClassName('downloadResults')[0].style.display="none";

        //prompt to upload holdings in order to calc sensitivities

        l = document.getElementById("holdingsPrompt");
        l.removeChild(l.childNodes[0]);

        //reset
        globalPositions = [];
        //holdings is a global var, non necessary dupe?
        //what's the difference between globalPositions and holdings?
        //global positions are results, and holdings is an input
        //need a global holdings, when sensitivity is dropped...
        holdings = parsedData;


        addHierarchyDropdown();

        processFileHoldings( sensitivityScenarios, holdings );
        }

function shockFileDrop(parsedData){
        document.getElementsByTagName("input")[1].checked = true;
        document.getElementsByTagName("input")[1].disabled = true;
        //document.getElementsByClassName("blurb")[0].style.display = "none";
        document.getElementsByClassName("sensitivityResults")[0].style.display = "block";
        document.getElementsByClassName("todoShock")[0].style.textDecoration = "line-through";

        document.getElementsByClassName('downloadResults')[0].style.display="none";

        //reset
        sensitivityScenarios = [];
        globalPositions = [];
        //sensitivityScenarios is a global var
        //required when holdings hasn't been dropped yet
        sensitivityScenarios = parsedData

        if (holdings.length > 0){
                processFileHoldings( sensitivityScenarios, holdings );
                }
                
        
        }


//*************************************************************************
//Hierarchy stuff
//*************************************************************************
        
Array.prototype.filterPositivePositions = function(filterFunction){
        this.filter(function(p){
                return filterFunction(p) > 0;
                });
        }
        
Array.prototype.filterNegativePositions = function(filterFunction){
        this.filter(function(p){
                return filterFunction(p) < 0;
                });
        }  
        
        






//****************************************************************
//Volkills interop
//****************************************************************

//********************************************************************

var holdings = [];
var sensitivityScenarios = [];
var globalNodes = []; 


//******************************************************************
//Grabs data from VolKills.org


var globalPositions = [];
var sensitivityPLs = [];
var path = [];


aggregateShockPLs = function(_this) {
        //combine shocks together into one array
        
        
        
        document.getElementsByName('stress')[0].innerHTML = 
                _this.slice()
                        //extract and flatten
                        .reduce(
                                function(acc,cur){
                                        return acc.concat(cur.shocks);
                                        }
                                ,[])
                        //sum
                        .reduce(
                                function(acc,cur){
                                        i = _.findIndex( acc, {factor: cur.factor, shock: cur.shock} );
                                        
                                        if ( i != -1 ) {
                                                acc[i].pl = acc[i].pl + cur.pl;
                                                }
                                        else {
                                                acc.push(_.clone(cur));
                                                }
                                        return acc;
                                        
                                        }
                                ,[])
                        .reduce(
                                function(acc,s){
                                        
                                                return acc
                                                + "<div class='shockResult'><span class='factor'>"+s.factor+"</span><span class='shock'>("+(s.shock*100).roundTwo()+"%)</span><span class='pl'>"+(s.pl).getDollarFormat2()+"</span>"
                                                + "<div id='positive"+(s.factor+s.shock).replace(' ','_').replace('.','_')+"' class='pie'>(+)</div><div id='negative"+(s.factor+s.shock).replace(' ','_').replace('.','_')+"' class='pie'>(-)</div>"
                                                + "</div>"
                                        }
                                        ,""
                                )
                                ;
                        
        };




//do all this thru the hierarchy framework?
//super simple hierarchy when nothing's selected, calc the same stuff.
Array.prototype.calcWeightedAverages = function() {
        r = this.reduce(
                function(p,position){
                
                        //console.log(position);
                        //in case it's case or equity or whatever
                        if (position.duration != null && position.z_spread != null){
                                //swap case
                                return {
                                        durationSum:    p.durationSum+durationCalculation(position,1), 
                                        creditSpreadSum:p.creditSpreadSum+spreadCalculation(position,1),
                                        }             
                                }
                        else {
                                return p;
                                }
                        }
                        ,{durationSum:0,creditSpreadSum:0});
        
        
        //make sure there's something to report
        if ( r.durationSum == 0 && r.creditSpreadSum == 0 && r.totalNPV == 0 ){
                document.getElementsByName('maturity')[0].innerHTML = "N/A";
                document.getElementsByName('credit')[0].innerHTML = "N/A";
                }
        else{
                document.getElementsByName('maturity')[0].innerHTML = (r.durationSum/totalDurationNPV(this)).roundTwo() + " years";
                document.getElementsByName('credit')[0].innerHTML = (r.creditSpreadSum/totalSpreadNPV(this)).roundTwo() + " bps";
                }
        
        };


processFileHoldings = function (scenarios, positions) {
        //if exposure = NAME then
        //calibrate
        //grab spread
        //grab duration
        //aggregate up
                //report back npv*duration, npv
                //weighted sum of durations
                //include fixed_leg_npv for swaps
                
              
        //foldl
        positions.forEach(
                function (position) {
                
                        myWorker = new Worker("my_task.js");
        				
			//callback
                        myWorker.onmessage = function (oEvent) {
                                
                                //shock input
                                //get shocked npv
                                
                                //take highest and lowest shocks for each factor
                                //5 factors means ~10 shocks
                                //for each shock
                                //modify inputs (take from oEvent.data) and create 'shocked' object
                                //record PL

                                globalPositions.push(oEvent.data);
                                
                                console.log(oEvent.data);
                                
                                globalPositions.slice().calcWeightedAverages();
                                
                                aggregateShockPLs(globalPositions.slice());
                                
                                //csv file containing all durations
                                //all credit spreads
                                //sensitivities
                                      
                                percentageComplete = Math.round(100*globalPositions.length/holdings.length);
                                      
                                document.getElementsByTagName('title')[0].innerHTML = percentageComplete + "% - IFRS 7 Risk Reporting";
                                document.getElementsByClassName('downloadResults')[0].style.display="inline-block";
                                
                                //for each shock
                                //create new shocked object
                                //record pl
                                
                                this.terminate();
                                };
                
                        createObjects(scenarios, position, myWorker);
                        
                        }
                );
        }
        
        
function generateResults(){
        return globalPositions.slice().map(function(o){
                
                if(o.origPosition.exposure == 'swap'){
                        //console.log("xoxoxo");
                        o.origPosition.fixedLegNPV = o.fixedLegNPV;
                        //console.log(o.origPosition.fixedLegNPV);
                        }
                
                
                o.origPosition.duration = o.duration;  
                o.origPosition.z_spread = o.z_spread;  
                o.origPosition.nPV = o.nPV;  
        
                //origPosition
                //add shocks array
                //{factor,shock,pl}
                //.., "factor shock", ..
                
                o.shocks.forEach(
                        function(shock){
                                o.origPosition[shock.factor +" "+ shock.shock] = shock.pl;
                                }
                        );
        
                return o.origPosition;
                });
        }
        
        
function downloadCSV(){
        //connect original holdings object with position object
        //have the orig holdings object embedded?
        
        console.log( generateResults() );
        
        //update gp with results
        r = escape(
                d3.csv.format(
                        generateResults()
                        )
                );
        
        document.getElementsByClassName('downloadResults')[0].href = "data:text/csv;charset=utf-8," + r;
        
        }

function createObjects(shocks, position, myWorker){
        
        //break out into function
        //apply shocks automatically, default to zero
        //inputs are shock object plus position object

	expiry_date = new Date(position.expiry_date+" UTC");
	effective_date = new Date(position.effective_date+" UTC");
	maturity_date = new Date(position.maturity_date+" UTC");
	start_date = new Date(position.start_date+" UTC");
        
	//create object which contains results
        //	
        switch (position.exposure){
                case 'cds':
			//incorporate a constructor to calibrate as object is created?
			//market value is unit price or position value??
			myWorker.postMessage(new Cds(	+position.quantity,
        						effective_date,
        						+position.market_value,
        						maturity_date,
        						+position.face,
        						+position.rate_1m,
        						+position.rate_3m,
        						+position.rate_6m,
        						+position.rate_1y,
        						+position.rate_2y,
        						+position.rate_3y,
        						+position.rate_5y,
        						+position.rate_7y,
        						+position.rate_10y,
        						+position.rate_20y,
        						+position.rate_30y,
        						+position.spread,
                                                        shocks,
                                                        position        )
        						);
			break;
		case 'option':
			//incorporate a constructor to calibrate as object is created?
			//market value is unit price or position value??
			myWorker.postMessage(new Option(	+position.quantity,
        							effective_date,
        							+position.strike_price,
        							expiry_date,
        							position.put_or_call,
        							+position.underlying_price,
        							+position.market_value,
        							+position.dividend_yield,
        							+position.rate_1y,
        							position.style,
                                                                shocks,
                                                                position        			)
					);
			break;
		case 'swap':
			myWorker.postMessage(new Swap(	+position.quantity,
					                effective_date,
        						+position.market_value,
        						maturity_date,
        						+position.face,
        						+position.rate_1m,
        						+position.rate_3m,
        						+position.rate_6m,
        						+position.rate_1y,
        						+position.rate_2y,
        						+position.rate_3y,
        						+position.rate_5y,
        						+position.rate_7y,
        						+position.rate_10y,
        						+position.rate_20y,
        						+position.rate_30y,
        						+position.coupon,
        						position.fixed_frequency,
        						+position.ref_rate_1m,
        						+position.ref_rate_3m,
        						+position.ref_rate_6m,
        						+position.ref_rate_1y,
        						+position.ref_rate_2y,
        						+position.ref_rate_3y,
        						+position.ref_rate_5y,
        						+position.ref_rate_7y,
        						+position.ref_rate_10y,
        						+position.ref_rate_20y,
        						+position.ref_rate_30y,
        						+position.spread,
        						position.floating_frequency,
        						start_date,
        						shocks,
                                                        position         )
				);
			break;
		case 'frn':
			myWorker.postMessage(new FloatingRateNote(	+position.quantity,
        								effective_date,
        								+position.market_value,
        								maturity_date,
        								+position.face,
        								+position.rate_1m,
        								+position.rate_3m,
        								+position.rate_6m,
        								+position.rate_1y,
        								+position.rate_2y,
        								+position.rate_3y,
        								+position.rate_5y,
        								+position.rate_7y,
        								+position.rate_10y,
        								+position.rate_20y,
        								+position.rate_30y,
        								+position.ref_rate_1m,
        								+position.ref_rate_3m,
        								+position.ref_rate_6m,
        								+position.ref_rate_1y,
        								+position.ref_rate_2y,
        								+position.ref_rate_3y,
        								+position.ref_rate_5y,
        								+position.ref_rate_7y,
        								+position.ref_rate_10y,
        								+position.ref_rate_20y,
        								+position.ref_rate_30y,
        								+position.spread,
        								position.payment_frequency,
        								+position.current_floating_rate,
                                                                        shocks,
                                                                        position        )
						);
			break;
		case 'bond':
			//send data to worker
                        myWorker.postMessage(   new Bond(	+position.quantity,
                						effective_date,
                					        +position.market_value,
                						maturity_date,
                						+position.face,
                						+position.rate_1m,
                						+position.rate_3m,
                						+position.rate_6m,
                						+position.rate_1y,
                						+position.rate_2y,
                						+position.rate_3y,
                						+position.rate_5y,
                						+position.rate_7y,
                						+position.rate_10y,
                						+position.rate_20y,
                						+position.rate_30y,
                						+position.coupon,
                						position.payment_frequency,
                                                                shocks,
                                                                position         )
                                                );
			break;
		case 'equity':
			myWorker.postMessage( new Equity(+position.quantity,+position.underlying_price,+position.market_value,shocks,position) );
			break;
		case 'cash':
			myWorker.postMessage( new Cash(+position.quantity,+position.market_value,position) );
			break;
                }
        }


////////////////////////////////////////////////////////////////////////////////
//General
////////////////////////////////////////////////////////////////////////////////


function getData2(url){

        xmlhttp = new XMLHttpRequest();

        xmlhttp.open("GET",url,false);
        xmlhttp.send();

        return xmlhttp.response;
        }

Number.prototype.roundTwo = function() {
        return Math.round(this*100) / 100;
        }
        
Number.prototype.getDollarFormat2 = function(){
        v = this.roundTwo().toLocaleString();

        if ((v+"").indexOf(".") == -1){
                return v+".00";
                }
        else if ((v+"").length - (v+"").indexOf(".") < 3){
       
        
                return v+"0";
                }
        else {
                return v;
                }
        }

Array.prototype.last = function() {
        return this[this.length-1];
        };

Array.prototype.tail = function() {
        return this.slice(0,this.length-1)
        };


////////////////////////////////////////////////////////////////////////////////
