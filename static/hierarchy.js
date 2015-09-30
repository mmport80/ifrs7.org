
  
function addHierarchyDropdown(){
        
        document.getElementsByClassName("createHierarchyHeader")[0].style.display='block';
        
        s = document.createElement("select");
        s.setAttribute("onchange",'addToHierarchy(this);');
        
        o = document.createElement("option");
        o.disabled = true;
        o.selected = true;
        o.text = "Select Grouping";
        
        s.add(o);
        
        o2 = document.createElement("option");
        o2.text = "Remove Grouping";
        
        s.add(o2);
        
        Object.keys(holdings.last())
                .forEach( function(i){
                        //create option
                        c = document.createElement("option");
                        c.text = i;
                        c.value = i;
                        //add option to first select
                        s.add(c);
                        }
                );
        
        (document.getElementsByClassName("createHierarchy")[0]).appendChild(s);

        }


//**************************************************************************
//analytic calcs used for aggregating up
//use origPosition because it includes descriptive info
//how about using the globalPosition objects... and just refer to origPosition?

var durationCalculation = function(p, totalNPV){
        if (p.exposure == "swap" ){
                return p.duration*p.fixedLegNPV*p.quantity/totalNPV;
                }
        else {
                return p.duration*p.nPV*p.quantity/totalNPV;
                }
        };

var shockCalculation = function(p, totalNPV, factor, shock){
                                
                                //i = _.findIndex( p.shocks, {factor: factor, shock: shock} );
                                //console.log(p.shocks);
                                result = p.shocks.filter(function(q){return q.shock == shock && q.factor == factor});
                                
                                //str = factor+" "+shock;
                                //console.log(result);
                                //if (p[str] == undefined){return 0;}
                                if (result.length == 0){return 0;}
                                else {  
                                        return result[0].pl;
                                        }
                                
                                };

var spreadCalculation = function(p, totalNPV){
        
        if (p.origPosition.exposure == "cds" ){
                return -10000*p.z_spread*(+p.face)*p.quantity/totalNPV;
                }
        else {
                return 10000*p.z_spread*p.nPV*p.quantity/totalNPV;
                }
        };


//**************************************************************************
//**************************************************************************
//take selected element in dropdown and add it to the hierarchy
//then generate new hierarchy and pie charts

function addToHierarchy(_this){

        globalPies = [];
        
        //if latest added grouping
        if(_this.nextSibling == null){
                addHierarchyDropdown();
                }
        
        //in case parent node has been deleted
        pn = _this.parentNode;
                
        //i.e. deselect
        if(_this.value == "Remove Grouping"){
                _this.remove();
                }
        
        positions = globalPositions;
        
        //!!change to calc for different NPV totals for different analytics!!
        
        hierarchyCalculations(durationCalculation,"Liquidity","", totalDurationNPV(positions) );

        hierarchyCalculations(spreadCalculation,"Spread","", totalSpreadNPV(positions) );

        totalNPV = totalVanillaNPV(positions);

        //find all risk factor and shock combos
        //cycle thru each 
        y = positions.slice()
                .reduce(
                        function(acc,cur){
                                return acc.concat(cur.shocks);
                                }
                        ,[])
                .reduce(
                        function(acc,cur){
                                i = _.findIndex( acc, {factor: cur.factor, shock: cur.shock} );
                                
                                if ( i == -1 ) {
                                        acc.push(  {factor: cur.factor, shock: cur.shock}  );
                                        }
                                return acc;
                                }
                        ,[])
                .forEach(
                        function(shock){
                                hierarchyCalculations(shockCalculation,shock.factor,shock.shock,totalNPV);
                                }
                        )
                ;
        
        
        }        
        
//***********************************************************************
//***********************************************************************        

var totalVanillaNPV = function(positions){
        return positions.reduce(
                function(acc,cur){
                        return acc + cur.nPV * cur.quantity
                        }
                ,0);
        }

var totalDurationNPV = function(positions){
        return positions.reduce(
                function(acc,cur){
                        if (cur.exposure == 'swap'){
                                return acc + cur.fixedLegNPV * cur.quantity;
                                }
                        else {
                                return acc + cur.nPV * cur.quantity;
                                }
                        }
                ,0);
        }

var totalSpreadNPV = function(positions){
        return positions.reduce(
                function(acc,cur){
                        if (cur.exposure == 'cds'){
                                return acc + (+cur.face) * cur.quantity;
                                }
                        else {
                                return acc + cur.nPV * cur.quantity;
                                }
                        }
                ,0);
        }
        
//***********************************************************************
//***********************************************************************

        
        
//all the setup calcs needed before we create the final hierarchy        

function hierarchyCalculations(calcFunction,factor,shock,totalNPV){
        
        //!!use plain globalPositions instead of origPositions!!
        positions = globalPositions.slice();
        
        negativePositions = positions.filter(function(p){
                                //console.log(calcFunction(p, totalNPV, factor, shock));
                                return calcFunction(p, totalNPV, factor, shock) < 0;
                                });
        
        //console.log(factor, shock);         
        //console.log(negativePositions);
                                
        positivePositions = positions.filter(function(p){
                                //console.log(calcFunction(p, totalNPV, factor, shock));
                                return calcFunction(p, totalNPV, factor, shock) > 0;
                                });
        
        //console.log(positivePositions);
        
        //calculate total result, so that we can show pie areas reflecting exposure
        //sqrt each for area (pi*r^2)
        totalNegativeResult = Math.abs(negativePositions.reduce(function(acc,cur){return acc + calcFunction(cur, totalNPV, factor, shock);},0));
        totalPositiveResult = Math.abs(positivePositions.reduce(function(acc,cur){return acc + calcFunction(cur, totalNPV, factor, shock);},0));
        
        //ratio in area terms
        negativeRatio = Math.sqrt(totalNegativeResult / (totalNegativeResult + totalPositiveResult) );
        
        if     (negativeRatio<Math.sqrt(0.1)){negativeRatio = Math.sqrt(0.1);}
        else if(negativeRatio>Math.sqrt(0.9)){negativeRatio = Math.sqrt(0.9);}
        
        //inner breackets are width terms, outer are back in area terms
        positiveRatio = Math.sqrt(1 - Math.pow(negativeRatio,2));
        
        
        //send positions which are negative
        buildHierarchy( [].slice.call(pn.children)
                        ,negativePositions
                        ,"negative"
                        ,totalNPV
                        ,negativeRatio
                        ,calcFunction
                        ,factor
                        ,shock
                        );
        
        //send positions which are positive      
        buildHierarchy( [].slice.call(pn.children)
                        ,positivePositions
                        ,"positive"
                        ,totalNPV
                        ,positiveRatio
                        ,calcFunction
                        ,factor
                        ,shock
                        );
        }
        
        
//build the hierarchy and lastly the pie
        
function buildHierarchy(hierarchyElements,ps,divId,totalNPV,ratio,resultCalculation, factor, shock){
        
        //map positions into right format
        yy2 = ps.map( function(p){
                return hierarchyElements
                        //top is 'select grouping' choice
                        .tail()
                        //just need selected value from dropdown
                        .map( function(i){ return i.value })
                        //build inside out
                        .reverse()
                        //amalgamate array of selected elements into object
                        //p is position
                        //cur is current hierarchy element
                        .reduce( function(acc2,cur){
                                        if (acc2 == null){
                                                //weighted duration
                                                return  {"grouping":cur,
                                                        "name":p.origPosition[cur],
                                                        //*************************************************************
                                                        //Duration specific
                                                        //*************************************************************
                                                        "children":[ {"grouping":"","name":"","result":resultCalculation(p, totalNPV, factor, shock),"children":[] } ]};
                                                }
                                        else {
                                                return {"grouping":cur,"name":p.origPosition[cur],"children":[acc2] };
                                                }
                                        }
                                ,null );
                });
        
        //root of tree
        root = {grouping:"Total",name:"",children:[]};
        
        //merge together
        merge = function(acc,cur){
                check = acc.children.reduce(
                                function(acc2,cur2){
                                        //match 
                                        if (cur2["name"] == cur["name"]){
                                                return {index:-1,mIndex:acc2.index};
                                                }
                                        //no match
                                        else {
                                                return {index:acc2.index+1,mIndex:acc2.mIndex};
                                                }
                                        } 
                                        , {index:0,mIndex:-1}
                                );
                                
                //check whether cur.name is already in children array
                //match
                if(check.mIndex != -1){
                        //insert if this node has children
                        if (cur.children.length > 0){
                                acc.children[check.mIndex] = merge(acc.children[check.mIndex],cur.children[0]);
                                }
                        //if node with no children
                        else {
                                acc.children.push(_.clone(cur));
                                }
                        }
                //no match
                else{   //push
                        acc.children.push(_.clone(cur));
                        }
                
                return acc;
                }
        
        yy3 = yy2.reduce( function(acc,cur){
                        return merge(acc,_.clone(cur));
                        }
                        , root)
        
        
        var tagID = ("#"+divId+factor+shock).replace(' ','_').replace('.','_');
        
        PieGraph.prototype.clicks = function(d){
                
                //tagID = ("#"+divId+factor+shock).replace(' ','_').replace('.','_');
                
                console.log(globalPies);
                console.log(this);
                
                _this = globalPies.filter(function(p){return p.divId == tagID})[0];
                
                _this.node = d;
                _this.path      .transition()
                                .duration(1000)
                                .attrTween("d", _this.arcTweenZoom(d));
                }
        
        
        //globalPies.push
        dd = new PieGraph(
                        yy3
                        ,tagID
                        ,ratio
                        )
                ;
        
        console.log(dd);
        
        dd.path.on("click", dd.clicks );
        
        globalPies.push(dd);
        }
        
var globalPies = [];
//var globalPies = [];
      
