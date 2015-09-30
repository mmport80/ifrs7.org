//+ve, -ve pies
//attach to different divs

function colorize(str) {
        
        return ( ( ( sdbmCode("Zaltie"+str+"2ALTED.")  / 2147483647 ).roundTwo() ) * 180 ) + 180;
        
        }

function sdbmCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
        hash |= 0;
    }
    return hash;
}




function PieGraph(root,divId,ratio){
        
        if (root.children.length > 0) {
                document.getElementById(divId.slice(1,divId.length)).style.display = "block";
                }
        
        
        d3.select(divId).selectAll("svg").remove();
    
        //max 350
        //min 100
        //1/3.5
        //3.5/1
        
        //area ratio
        //area max
        //area min
    
    
        this.divId = divId;
    
        this.width = window.innerHeight*0.55*ratio,
        this.height = this.width,
        this.radius = Math.min(this.width, this.height) / 2;

        this.x = d3.scale    .linear()
                             .range([0, 2 * Math.PI]);

        this.y = d3     .scale.sqrt()
                        .range([0, this.radius]);


        //this.color = colorize();

        this.svg = d3.select(divId).append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("margin",0)
                //.attr("float","left")
                //.attr("top","50%")
                .append("g")
                .attr("transform", "translate(" + this.width/ 2 + "," + (this.height / 2) + ")");
        
        this.partition = d3  .layout.partition()
                        .sort(d3.ascending)
                        .value(function(d) { return 1; });

        
        
        this.arc = d3   .svg.arc()
                        .startAngle(    function(d) { return Math.max(0, Math.min(2 * Math.PI, _this.x(d.x))); })
                        .endAngle(      function(d) { return Math.max(0, Math.min(2 * Math.PI, _this.x(d.x + d.dx))); })
                        .innerRadius(   function(d) { return Math.max(0, _this.y(d.y)); })
                        .outerRadius(   function(d) { return Math.max(0, _this.y(d.y + d.dy)); })
                        ;

        // Keep track of the node that is currently being displayed as the root.
        //var node;
    
        //have to condence npv and grouping together
        
        this.node = root;
        
        
        
        
        _this = this
        
        
        
        // When zooming: interpolate the scales.
        this.arcTweenZoom = function(d) {
                xd = d3.interpolate(_this.x.domain(), [d.x, d.x + d.dx]);
                yd = d3.interpolate(_this.y.domain(), [d.y, 1]);
                yr = d3.interpolate(_this.y.range(), [d.y ? 20 : 0, _this.radius]);
                
                return function(d, i) {
                        return i
                        ? function(t) { 
                                return _this.arc(d); 
                                }
                        : function(t) { 
                                _this.x.domain(xd(t)); _this.y.domain(yd(t)).range(yr(t)); return _this.arc(d); 
                                };
                        };
                }
        
        
        // Setup for switching data: stash the old values for transition.
        this.stash = function(d) {
                d.x0 = d.x;
                d.dx0 = d.dx;
                }
        
        
        this.path = this.svg.datum(root).selectAll("path")
                        .data(_this.partition.value( function(d) { return d.result; } ).nodes)
                        .enter().append("path")
                        
                        .attr("d", _this.arc)
                        .attr("display", function(d) { return (d.children ? null : "none"); })
                        .style("stroke", "#fff")
                        .style("fill", function(d) {
                                if (d.depth == 0) { return d3.rgb(255,255,255); }
                                else { return d3.hsl(colorize(d.name),0.60,0.70); } 
                                })
                        .on("click", _this.clicks )
                        .each(_this.stash)
                        ;
                        
        this.path       .append("title")
                        .text(function (d) {
                                        if (d.depth == 0) { return d.grouping + ": " + (d.value.roundTwo()); }
                                        else { return d.grouping + " " + d.name + ": " + (d.value.roundTwo()); } 
                                        }
                                );

        
        
        
        //make pies visible
        
        }

