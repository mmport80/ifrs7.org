/*
    Stress Map Javascript example
    Copyright (C) 2014 John Orford

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//generate factor shocks using upper and lower limits 


//var server = 'dev';
var server = 'volkills.org';

function getResult(response, resultName){
        return +( $(response)	.find(resultName)
				.contents()[0]
				.textContent	);
        }

	
function defaultShock(expectedName, shock){
	if (shock.factor != expectedName) {
		return 0;
		}
	else {
		return +shock.shock;
		}
	}

//******************************************************************
//Instruments

//extract similarities out
//value method
//q, mv, npv

//******************************************************************
//******************************************************************
//add cash object -- another easy one
//domestic cash
function Cash(quantity,mktV,origPosition){
	//Holding related inputs
	this.quantity   = quantity;
	this.mktV	= mktV;

        this.origPosition = origPosition;
        
	//Results
	this.nPV = mktV;

        this.duration = 0;
        this.z_spread = 0;

        this.shocks = [];
        
        
        

	}

//******************************************************************
//******************************************************************

function Equity(quantity,stockPrice,mktV,shocks,origPosition){
	//Holding related inputs
	this.quantity   = quantity;
	this.stockPrice	= stockPrice;
	this.mktV	= mktV;

	//Results
	this.nPV = mktV;

        this.duration = 0;
        this.z_spread = 0;

        
        
        this.origPosition = origPosition;
        
        var _this = this;
        this.shocks = [];
        
        shocks.forEach(
                function(shock){
                        if (["Underlying Price"].indexOf(shock.factor) != -1){
                		shock_underlying_price = defaultShock("Underlying Price",shock);
                        
                                _this.shocks.push({ factor:shock.factor, shock:+shock.shock, pl:shock_underlying_price*_this.quantity*_this.nPV });
                                }
                        }
                );
	}

function Swap(	quantity,
		effective_date,
		market_value,
		maturity_date,
		face,
		rate_1m,
		rate_3m,
		rate_6m,
		rate_1y,
		rate_2y,
		rate_3y,
		rate_5y,
		rate_7y,
		rate_10y,
		rate_20y,
		rate_30y,
		coupon,
		fixed_frequency,
		ref_rate_1m,
		ref_rate_3m,
		ref_rate_6m,
		ref_rate_1y,
		ref_rate_2y,
		ref_rate_3y,
		ref_rate_5y,
		ref_rate_7y,
		ref_rate_10y,
		ref_rate_20y,
		ref_rate_30y,
		spread,
		floating_frequency,
		start_date,
		shocks,
                origPosition
		){

	//Holding related inputs
	this.quantity 			= quantity;

	//www.volkills.org Inputs
	this.effective_date 		= effective_date;
	this.market_value		= market_value;
	this.maturity_date 		= maturity_date;
	this.face 			= face;
	this.rate_1m 			= rate_1m;
	this.rate_3m 			= rate_3m;
	this.rate_6m 			= rate_6m;
	this.rate_1y 			= rate_1y;
	this.rate_2y 			= rate_2y;
	this.rate_3y 			= rate_3y;
	this.rate_5y 			= rate_5y;
	this.rate_7y 			= rate_7y;
	this.rate_10y 			= rate_10y;
	this.rate_20y 			= rate_20y;
	this.rate_30y 			= rate_30y;
	this.coupon			= coupon;
	this.fixed_frequency		= fixed_frequency;
	this.ref_rate_1m 		= ref_rate_1m;
	this.ref_rate_3m 		= ref_rate_3m;
	this.ref_rate_6m 		= ref_rate_6m;
	this.ref_rate_1y 		= ref_rate_1y;
	this.ref_rate_2y 		= ref_rate_2y;
	this.ref_rate_3y 		= ref_rate_3y;
	this.ref_rate_5y 		= ref_rate_5y;
	this.ref_rate_7y 		= ref_rate_7y;
	this.ref_rate_10y 		= ref_rate_10y;
	this.ref_rate_20y 		= ref_rate_20y;
	this.ref_rate_30y 		= ref_rate_30y;
	this.spread 			= spread;
	this.floating_frequency 	= floating_frequency;
	this.start_date 		= start_date;
        
        this.origPosition = origPosition;
        
	url = 'https://'+server+'/version/stable/swap/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/market_value/'+this.market_value+'/maturity/year/'+this.maturity_date.getUTCFullYear()+'/month/'+(this.maturity_date.getUTCMonth()+1)+'/day/'+this.maturity_date.getUTCDate()+'/face/'+this.face+'/term_structure/1m/'+this.rate_1m+'/3m/'+this.rate_3m+'/6m/'+this.rate_6m+'/1y/'+this.rate_1y+'/2y/'+this.rate_2y+'/3y/'+this.rate_3y+'/5y/'+this.rate_5y+'/7y/'+this.rate_7y+'/10y/'+this.rate_10y+'/20y/'+this.rate_20y+'/30y/'+this.rate_30y+'/coupon/'+this.coupon+'/fixed_frequency/'+this.fixed_frequency+'/reference_index_term_structure/1m/'+this.ref_rate_1m+'/3m/'+this.ref_rate_3m+'/6m/'+this.ref_rate_6m+'/1y/'+this.ref_rate_1y+'/2y/'+this.ref_rate_2y+'/3y/'+this.ref_rate_3y+'/5y/'+this.ref_rate_5y+'/7y/'+this.ref_rate_7y+'/10y/'+this.ref_rate_10y+'/20y/'+this.ref_rate_20y+'/30y/'+this.ref_rate_30y+'/spread/'+this.spread+'/floating_frequency/'+this.floating_frequency+'/start/year/'+this.start_date.getUTCFullYear()+'/month/'+(this.start_date.getUTCMonth()+1)+'/day/'+this.start_date.getUTCDate();

        console.log(url);

	response = getData2(url);

  	this.nPV = getResult(response, "#NPV");
	
        //unsure whether to include this...
        this.z_spread = getResult(response, "[id='Calibrated Spread']");
        
        this.fixedLegNPV = getResult(response, "[id='Fixed Leg NPV']");
        
        //get effective duration
        shock_interest_rate = 0.0001;
        
        url = 'https://'+server+'/version/stable/swap/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/z_spread/'+this.z_spread+'/maturity/year/'+this.maturity_date.getUTCFullYear()+'/month/'+(this.maturity_date.getUTCMonth()+1)+'/day/'+this.maturity_date.getUTCDate()+'/face/'+this.face+'/term_structure/1m/'+(Math.max(0.00001,this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,this.rate_30y+shock_interest_rate))+'/coupon/'+this.coupon+'/fixed_frequency/'+this.fixed_frequency+'/reference_index_term_structure/1m/'+this.ref_rate_1m+'/3m/'+this.ref_rate_3m+'/6m/'+this.ref_rate_6m+'/1y/'+this.ref_rate_1y+'/2y/'+this.ref_rate_2y+'/3y/'+this.ref_rate_3y+'/5y/'+this.ref_rate_5y+'/7y/'+this.ref_rate_7y+'/10y/'+this.ref_rate_10y+'/20y/'+this.ref_rate_20y+'/30y/'+this.ref_rate_30y+'/spread/'+this.spread+'/floating_frequency/'+this.floating_frequency+'/start/year/'+this.start_date.getUTCFullYear()+'/month/'+(this.start_date.getUTCMonth()+1)+'/day/'+this.start_date.getUTCDate();

        response = getData2(url);

  	newFixedLegNPV = getResult(response, "[id='Fixed Leg NPV']");
				
	this.duration = (newFixedLegNPV - this.fixedLegNPV) / (0.0001 * this.fixedLegNPV);
        
        //array of shocks
        //for each shock
        //value
        var _this = this;
        this.shocks = [];
        
        shocks.forEach(
                function(shock){
                        if (["Interest Rate"].indexOf(shock.factor) != -1){
                                shock_interest_rate = defaultShock("Interest Rate", shock);
                                //shock_z_spread = defaultShock("Z Spread", shock);
                        
                                url = 'https://'+server+'/version/stable/swap/effective/year/'+_this.effective_date.getUTCFullYear()+'/month/'+(_this.effective_date.getUTCMonth()+1)+'/day/'+_this.effective_date.getUTCDate()+'/z_spread/'+_this.z_spread+'/maturity/year/'+_this.maturity_date.getUTCFullYear()+'/month/'+(_this.maturity_date.getUTCMonth()+1)+'/day/'+_this.maturity_date.getUTCDate()+'/face/'+_this.face+'/term_structure/1m/'+(Math.max(0.00001,_this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,_this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,_this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,_this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,_this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,_this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,_this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,_this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,_this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,_this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,_this.rate_30y+shock_interest_rate))+'/coupon/'+_this.coupon+'/fixed_frequency/'+_this.fixed_frequency+'/reference_index_term_structure/1m/'+_this.ref_rate_1m+'/3m/'+_this.ref_rate_3m+'/6m/'+_this.ref_rate_6m+'/1y/'+_this.ref_rate_1y+'/2y/'+_this.ref_rate_2y+'/3y/'+_this.ref_rate_3y+'/5y/'+_this.ref_rate_5y+'/7y/'+_this.ref_rate_7y+'/10y/'+_this.ref_rate_10y+'/20y/'+_this.ref_rate_20y+'/30y/'+_this.ref_rate_30y+'/spread/'+_this.spread+'/floating_frequency/'+_this.floating_frequency+'/start/year/'+_this.start_date.getUTCFullYear()+'/month/'+(_this.start_date.getUTCMonth()+1)+'/day/'+_this.start_date.getUTCDate();
                        
        		        response = getData2(url);
         
                                shockedNPV = getResult(response, "#NPV");
                        
                        
                                _this.shocks.push({factor:shock.factor,shock:+shock.shock,pl:_this.quantity*(shockedNPV-_this.nPV)});
                                }
                        }
                );
	}

function FloatingRateNote(	quantity,
				effective_date,
				market_value,
				maturity_date,
				face,
				rate_1m,
				rate_3m,
				rate_6m,
				rate_1y,
				rate_2y,
				rate_3y,
				rate_5y,
				rate_7y,
				rate_10y,
				rate_20y,
				rate_30y,
				ref_rate_1m,
				ref_rate_3m,
				ref_rate_6m,
				ref_rate_1y,
				ref_rate_2y,
				ref_rate_3y,
				ref_rate_5y,
				ref_rate_7y,
				ref_rate_10y,
				ref_rate_20y,
				ref_rate_30y,
				spread,
				payment_frequency,
				current_floating_rate,
                                shocks,
                                origPosition
				){
	
	//Holding related inputs
	this.quantity 			= quantity;

	//www.volkills.org Inputs
	this.effective_date 		= effective_date;
	this.market_value		= market_value;
	this.maturity_date 		= maturity_date;
	this.face 			= face;
	this.rate_1m 			= rate_1m;
	this.rate_3m 			= rate_3m;
	this.rate_6m 			= rate_6m;
	this.rate_1y 			= rate_1y;
	this.rate_2y 			= rate_2y;
	this.rate_3y 			= rate_3y;
	this.rate_5y 			= rate_5y;
	this.rate_7y 			= rate_7y;
	this.rate_10y 			= rate_10y;
	this.rate_20y 			= rate_20y;
	this.rate_30y 			= rate_30y;
	this.ref_rate_1m 		= ref_rate_1m;
	this.ref_rate_3m 		= ref_rate_3m;
	this.ref_rate_6m 		= ref_rate_6m;
	this.ref_rate_1y 		= ref_rate_1y;
	this.ref_rate_2y 		= ref_rate_2y;
	this.ref_rate_3y 		= ref_rate_3y;
	this.ref_rate_5y 		= ref_rate_5y;
	this.ref_rate_7y 		= ref_rate_7y;
	this.ref_rate_10y 		= ref_rate_10y;
	this.ref_rate_20y 		= ref_rate_20y;
	this.ref_rate_30y 		= ref_rate_30y;
	this.spread 			= spread;
	this.payment_frequency 		= payment_frequency;
	this.current_floating_rate 	= current_floating_rate;
        
        this.origPosition = origPosition;
        
	//Results
	
	url = 'https://'+server+'/version/stable/frn/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/market_value/'+this.market_value+'/maturity/year/'+this.maturity_date.getUTCFullYear()+'/month/'+(this.maturity_date.getUTCMonth()+1)+'/day/'+this.maturity_date.getUTCDate()+'/face/'+this.face+'/term_structure/1m/'+this.rate_1m+'/3m/'+this.rate_3m+'/6m/'+this.rate_6m+'/1y/'+this.rate_1y+'/2y/'+this.rate_2y+'/3y/'+this.rate_3y+'/5y/'+this.rate_5y+'/7y/'+this.rate_7y+'/10y/'+this.rate_10y+'/20y/'+this.rate_20y+'/30y/'+this.rate_30y+'/reference_index_term_structure/1m/'+this.ref_rate_1m+'/3m/'+this.ref_rate_3m+'/6m/'+this.ref_rate_6m+'/1y/'+this.ref_rate_1y+'/2y/'+this.ref_rate_2y+'/3y/'+this.ref_rate_3y+'/5y/'+this.ref_rate_5y+'/7y/'+this.ref_rate_7y+'/10y/'+this.ref_rate_10y+'/20y/'+this.ref_rate_20y+'/30y/'+this.ref_rate_30y+'/spread/'+this.spread+'/payment_frequency/'+this.payment_frequency+'/current_floating_rate/'+this.current_floating_rate;
	
	response = getData2(url);

        this.nPV = getResult(response, "#NPV");
        this.z_spread = getResult(response, "[id='Z Spread']");

        //get effective duration
        shock_interest_rate = 0.0001;
        
        url = 'https://'+server+'/version/stable/frn/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/z_spread/'+this.z_spread+'/maturity/year/'+this.maturity_date.getUTCFullYear()+'/month/'+(this.maturity_date.getUTCMonth()+1)+'/day/'+this.maturity_date.getUTCDate()+'/face/'+this.face+'/term_structure/1m/'+(Math.max(0.00001,this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,this.rate_30y+shock_interest_rate))+'/reference_index_term_structure/1m/'+(Math.max(0.00001,this.ref_rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,this.ref_rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,this.ref_rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,this.ref_rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,this.ref_rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,this.ref_rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,this.ref_rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,this.ref_rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,this.ref_rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,this.ref_rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,this.ref_rate_30y+shock_interest_rate))+'/spread/'+this.spread+'/payment_frequency/'+this.payment_frequency+'/current_floating_rate/'+this.current_floating_rate;
	
        response = getData2(url);

  	newNPV = getResult(response, "[id='NPV']");
				
	this.duration = (newNPV - this.nPV) / (0.0001 * this.nPV);
        
        var _this = this;
        this.shocks = [];
        
        
        shocks.forEach(
                function(shock){
                        if (["Interest Rate","Z Spread"].indexOf(shock.factor) != -1){
                                shock_interest_rate = defaultShock("Interest Rate", shock);
                                shock_z_spread = defaultShock("Z Spread", shock);
                        
                                url = 'https://'+server+'/version/stable/frn/effective/year/'+_this.effective_date.getUTCFullYear()+'/month/'+(_this.effective_date.getUTCMonth()+1)+'/day/'+_this.effective_date.getUTCDate()+'/z_spread/'+(Math.max(0.00001,_this.z_spread+shock_z_spread))+'/maturity/year/'+_this.maturity_date.getUTCFullYear()+'/month/'+(_this.maturity_date.getUTCMonth()+1)+'/day/'+_this.maturity_date.getUTCDate()+'/face/'+_this.face+'/term_structure/1m/'+(Math.max(0.00001,_this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,_this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,_this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,_this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,_this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,_this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,_this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,_this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,_this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,_this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,_this.rate_30y+shock_interest_rate))+'/reference_index_term_structure/1m/'+(Math.max(0.00001,_this.ref_rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,_this.ref_rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,_this.ref_rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,_this.ref_rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,_this.ref_rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,_this.ref_rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,_this.ref_rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,_this.ref_rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,_this.ref_rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,_this.ref_rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,_this.ref_rate_30y+shock_interest_rate))+'/spread/'+_this.spread+'/payment_frequency/'+_this.payment_frequency+'/current_floating_rate/'+_this.current_floating_rate;
	
        		        response = getData2(url);
         
                                shockedNPV = getResult(response, "#NPV");
                                
                                _this.shocks.push({factor:shock.factor,shock:+shock.shock,pl:_this.quantity*(shockedNPV-_this.nPV)});
                                
                                }
                        }
                );
	}


function Bond(	quantity,
		effective_date,
		market_value,
		maturity_date,
		face,
		rate_1m,
		rate_3m,
		rate_6m,
		rate_1y,
		rate_2y,
		rate_3y,
		rate_5y,
		rate_7y,
		rate_10y,
		rate_20y,
		rate_30y,
		coupon,
		payment_frequency,
                shocks,
                origPosition
		){
		
	//Holding related inputs
	this.quantity 		= quantity;
	
	//www.volkills.org Inputs
	this.effective_date 	= effective_date;
	this.market_value	= market_value;
	this.maturity_date 	= maturity_date;
	this.face 		= face;
	this.rate_1m 		= rate_1m;
	this.rate_3m 		= rate_3m;
	this.rate_6m 		= rate_6m;
	this.rate_1y 		= rate_1y;
	this.rate_2y 		= rate_2y;
	this.rate_3y 		= rate_3y;
	this.rate_5y 		= rate_5y;
	this.rate_7y 		= rate_7y;
	this.rate_10y 		= rate_10y;
	this.rate_20y 		= rate_20y;
	this.rate_30y 		= rate_30y;
	this.coupon 		= coupon;
	this.payment_frequency 	= payment_frequency;
        
        this.origPosition = origPosition;
	
	url = 'https://'+server+'/version/stable/bond/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/market_value/'+this.market_value+'/maturity/year/'+this.maturity_date.getUTCFullYear()+'/month/'+(this.maturity_date.getUTCMonth()+1)+'/day/'+this.maturity_date.getUTCDate()+'/face/'+this.face+'/term_structure/1m/'+this.rate_1m+'/3m/'+this.rate_3m+'/6m/'+this.rate_6m+'/1y/'+this.rate_1y+'/2y/'+this.rate_2y+'/3y/'+this.rate_3y+'/5y/'+this.rate_5y+'/7y/'+this.rate_7y+'/10y/'+this.rate_10y+'/20y/'+this.rate_20y+'/30y/'+this.rate_30y+'/coupon/'+this.coupon+'/payment_frequency/'+this.payment_frequency;
        
	response = getData2(url);
	
	//assumes async call
	//synchronicity removes need to callback here - easier to use as a library
	
        //remove jquery dependency for parsing...
        this.nPV = getResult(response, "[id='NPV']");
        this.duration = getResult(response, "#Duration");
        this.z_spread  = getResult(response, "#Spread");
        
        var _this = this;
        this.shocks = [];
        
        shocks.forEach(
                function(shock){
                        if (["Interest Rate","Z Spread"].indexOf(shock.factor) != -1){
                                shock_interest_rate = defaultShock("Interest Rate", shock);
                                shock_z_spread = defaultShock("Z Spread", shock);
                        
                                url = 'https://'+server+'/version/stable/bond/effective/year/'+_this.effective_date.getUTCFullYear()+'/month/'+(_this.effective_date.getUTCMonth()+1)+'/day/'+_this.effective_date.getUTCDate()+'/z_spread/'+(Math.max(0.00001,_this.z_spread+shock_z_spread))+'/maturity/year/'+_this.maturity_date.getUTCFullYear()+'/month/'+(_this.maturity_date.getUTCMonth()+1)+'/day/'+_this.maturity_date.getUTCDate()+'/face/'+_this.face+'/term_structure/1m/'+(Math.max(0.00001,_this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,_this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,_this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,_this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,_this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,_this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,_this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,_this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,_this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,_this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,_this.rate_30y+shock_interest_rate))+'/coupon/'+_this.coupon+'/payment_frequency/'+_this.payment_frequency;
        
        		        response = getData2(url);
         
                                shockedNPV = getResult(response, "#NPV");
                        
                                _this.shocks.push({factor:shock.factor,shock:+shock.shock,pl:_this.quantity*(shockedNPV-_this.nPV)});
                                
                                }
                        }
                );
        }

//******************************************************************
//******************************************************************
//Option object
function Option(quantity,effective_date,strike_price,expiry_date,put_or_call,underlying_price,market_value,dividend_yield,rate_1y,style,shocks,origPosition){
	//Holding related inputs
	this.quantity = quantity;

	//www.volkills.org Inputs
	this.effective_date	= effective_date;
	this.strike_price	= strike_price;
	this.expiry_date	= expiry_date;
	this.put_or_call	= put_or_call;
	this.underlying_price	= underlying_price;
	this.market_value	= market_value;
	this.dividend_yield	= dividend_yield;
	this.rate_1y		= rate_1y;
	this.style		= style;
        
        this.origPosition = origPosition;
	//add promises to class array
	//when kill signal comes,
	//cycle through array and abort all related promises

	//calibrate
	//value
	url = 'https://'+server+'/version/stable/equity_option/effective/year/'+this.effective_date.getUTCFullYear()+'/month/'+(this.effective_date.getUTCMonth()+1)+'/day/'+this.effective_date.getUTCDate()+'/market_value/'+this.market_value+'/expiry/year/'+this.expiry_date.getUTCFullYear()+'/month/'+(this.expiry_date.getUTCMonth()+1)+'/day/'+this.expiry_date.getDate()+'/strike_price/'+this.strike_price+'/style/'+this.style+'/put_or_call/'+this.put_or_call+'/underlying_price/'+this.underlying_price+'/dividend_yield/'+this.dividend_yield+'/interest_rate/'+this.rate_1y;
	
	console.log(url);
	
	
	
	response = getData2(url);	
		        	
				        	
        
        this.nPV = getResult(response, "#NPV");
        this.volatility_rate  = getResult(response, "[id='Implied Volatility']");
        
        

        this.duration = 0;
        this.z_spread = 0;
        
        var _this = this;
        this.shocks = [];
        
        shocks.forEach(
                function(shock){
                        if (["Underlying Price","Volatility Rate","Dividend Yield","Interest Rate"].indexOf(shock.factor) != -1){
                		shock_volatility_rate = defaultShock("Volatility Rate",shock);
                		shock_interest_rate = defaultShock("Interest Rate",shock);
                		shock_underlying_price = defaultShock("Underlying Price",shock); 
                		shock_dividend_yield = defaultShock("Dividend Yield",shock);
		
                		url = 'https://'+server+'/version/stable/equity_option/effective/year/'+_this.effective_date.getUTCFullYear()+'/month/'+(_this.effective_date.getUTCMonth()+1)+'/day/'+_this.effective_date.getUTCDate()+'/volatility_rate/'+Math.max(0.00001,_this.volatility_rate+shock_volatility_rate)+'/expiry/year/'+_this.expiry_date.getUTCFullYear()+'/month/'+(_this.expiry_date.getUTCMonth()+1)+'/day/'+(_this.expiry_date.getUTCDate())+'/strike_price/'+_this.strike_price+'/style/'+_this.style+'/put_or_call/'+_this.put_or_call+'/underlying_price/'+(_this.underlying_price*(1+shock_underlying_price))+'/dividend_yield/'+(Math.max(0.00001,_this.dividend_yield+shock_dividend_yield))+'/interest_rate/'+(Math.max(0.00001,_this.rate_1y+shock_interest_rate));
		
		                console.log(shock)
		
		                console.log(url);
		
        		        response = getData2(url);
         
                                shockedNPV = getResult(response, "#NPV");
                        
                                _this.shocks.push({ factor:shock.factor, shock:+shock.shock, pl:_this.quantity*(shockedNPV-_this.nPV) });
                                
                                console.log({ factor:shock.factor, shock:+shock.shock, pl:_this.quantity*(shockedNPV-_this.nPV) });
                                
                                console.log(_this.quantity,shockedNPV,_this.nPV);
                                }
                        }
                );
	}
	
//******************************************************************
//******************************************************************

function Cds(	quantity,
		effective_date,
		market_value,
		maturity_date,
		face,
		rate_1m,
		rate_3m,
		rate_6m,
		rate_1y,
		rate_2y,
		rate_3y,
		rate_5y,
		rate_7y,
		rate_10y,
		rate_20y,
		rate_30y,
		spread,
                shocks,
                origPosition){
			
	//Holding related inputs
	this.quantity = quantity;

	//www.volkills.org Inputs
	this.effective_date	= effective_date;
	this.market_value	= market_value;
	this.maturity_date	= maturity_date;
	this.face		= face;
	this.rate_1m 		= rate_1m;
	this.rate_3m 		= rate_3m;
	this.rate_6m 		= rate_6m;
	this.rate_1y 		= rate_1y;
	this.rate_2y 		= rate_2y;
	this.rate_3y 		= rate_3y;
	this.rate_5y 		= rate_5y;
	this.rate_7y 		= rate_7y;
	this.rate_10y 		= rate_10y;
	this.rate_20y 		= rate_20y;
	this.rate_30y 		= rate_30y;
	this.spread		= spread;
        
        this.origPosition = origPosition;
	//Results
	
	//add promises to class array
	//when kill signal comes,
	//cycle through array and abort all related promises

	url ="https://"+server+"/version/stable/cds/effective/year/"+this.effective_date.getUTCFullYear()+"/month/"+(this.effective_date.getUTCMonth()+1)+"/day/"+this.effective_date.getUTCDate()+"/market_value/"+this.market_value+"/maturity/year/"+this.maturity_date.getUTCFullYear()+"/month/"+(this.maturity_date.getUTCMonth()+1)+"/day/"+this.maturity_date.getDate()+"/face/"+this.face+'/term_structure/1m/'+this.rate_1m+'/3m/'+this.rate_3m+'/6m/'+this.rate_6m+'/1y/'+this.rate_1y+'/2y/'+this.rate_2y+'/3y/'+this.rate_3y+'/5y/'+this.rate_5y+'/7y/'+this.rate_7y+'/10y/'+this.rate_10y+'/20y/'+this.rate_20y+'/30y/'+this.rate_30y+"/spread/"+this.spread;
	response = getData2(url);
			   
        //console.log(url);
			        
        this.nPV = getResult(response, "#NPV");
        this.default_probability  = getResult(response, "[id='Implied Hazard Rate']");

        this.z_spread =  (1 / (1 - this.default_probability * (1 - 0.4))) - 1;

        //get effective duration
        shock_interest_rate = 0.0001;
        
        url ="https://"+server+"/version/stable/cds/effective/year/"+this.effective_date.getUTCFullYear()+"/month/"+(this.effective_date.getUTCMonth()+1)+"/day/"+this.effective_date.getUTCDate()+"/default_probability/"+this.default_probability+"/maturity/year/"+this.maturity_date.getUTCFullYear()+"/month/"+(this.maturity_date.getUTCMonth()+1)+"/day/"+this.maturity_date.getDate()+"/face/"+this.face+'/term_structure/1m/'+(Math.max(0.00001,this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,this.rate_30y+shock_interest_rate))+"/spread/"+this.spread;
		
        response = getData2(url);

  	newNPV = getResult(response, "[id='NPV']");
				
	this.duration = (newNPV - this.nPV) / (0.0001 * this.nPV);
        
        
        var _this = this;
        this.shocks = [];
        
        shocks.forEach(
                function(shock){
                        if (["Interest Rate","Z Spread"].indexOf(shock.factor) != -1){
                                shock_interest_rate = defaultShock("Interest Rate", shock);
                                shock_z_spread = defaultShock("Z Spread", shock);
                                
                                z_spread =  (1 / (1 - _this.default_probability * (1 - 0.4))) - 1;
                                
                		shocked_z_spread = Math.max(0.000001, z_spread + shock_z_spread);
                                
                		shocked_default_probability = (1 - (1/(1+shocked_z_spread))) / (1 - 0.4);
                                
                		url ="https://"+server+"/version/stable/cds/effective/year/"+_this.effective_date.getUTCFullYear()+"/month/"+(_this.effective_date.getUTCMonth()+1)+"/day/"+_this.effective_date.getUTCDate()+"/default_probability/"+shocked_default_probability+"/maturity/year/"+_this.maturity_date.getUTCFullYear()+"/month/"+(_this.maturity_date.getUTCMonth()+1)+"/day/"+_this.maturity_date.getDate()+"/face/"+_this.face+'/term_structure/1m/'+(Math.max(0.00001,_this.rate_1m+shock_interest_rate))+'/3m/'+(Math.max(0.00001,_this.rate_3m+shock_interest_rate))+'/6m/'+(Math.max(0.00001,_this.rate_6m+shock_interest_rate))+'/1y/'+(Math.max(0.00001,_this.rate_1y+shock_interest_rate))+'/2y/'+(Math.max(0.00001,_this.rate_2y+shock_interest_rate))+'/3y/'+(Math.max(0.00001,_this.rate_3y+shock_interest_rate))+'/5y/'+(Math.max(0.00001,_this.rate_5y+shock_interest_rate))+'/7y/'+(Math.max(0.00001,_this.rate_7y+shock_interest_rate))+'/10y/'+(Math.max(0.00001,_this.rate_10y+shock_interest_rate))+'/20y/'+(Math.max(0.00001,_this.rate_20y+shock_interest_rate))+'/30y/'+(Math.max(0.00001,_this.rate_30y+shock_interest_rate))+"/spread/"+_this.spread;
		
        		        response = getData2(url);
         
                                shockedNPV = getResult(response, "#NPV");
                        
                                _this.shocks.push({factor:shock.factor,shock:+shock.shock,pl:_this.quantity*(shockedNPV-_this.nPV)});
                                }
                        }
                );
	}
