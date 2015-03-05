
/* 
 JSON Example  
*/
// ROMS Rutgers

modelData = {
	"levels" : [2.0, 10.0, 20.0, 30.0, 50.0, 75.0, 100.0, 150.0, 200.0, 300.0, 400.0, 600.0, 800.0, 1000.0, 1200.0, 1500.0, 2000.0, 3000.0, 4000.0, 5000.0] , 
	"variables" : [ "TEMPERATURE" , "SALINITY" , "SSH" , "sea_water_velocity" ] ,
	"forecasts" : [ 
	 				 {"date" : "20150227" , "dapurl" : "http://cic-pem.cicese.mx:8080/thredds/dodsC/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc" , "wmsurl" : "http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc"} ,
	 				 {"date" : "20150226" , "dapurl" : "http://cic-pem.cicese.mx:8080/thredds/dodsC/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150226.nc" , "wmsurl" : "http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150226.nc"} 
	              ]
} ; 


/*
 SISPROGOM javascript framework. V3.0

 Favio Medrano
 Cicese 2015 hmedrano@cicese.mx 
*/

// Development vars
var workingRemote = true ;

// google map object
var map ;
var currentForecast ;

// Plot appearance
var defaultModel = "ROMSRutgers" ; 
var defaultVar = "TEMPERATURE" ; 
var WMSTileSize = 128 ; 
var WMSColorbands = 254 ; 
// 
var grid_overlay ;
var show_graticule = false ;



// Initiate google map 
google.maps.event.addDomListener(window, 'load', initialize);
// 

function initialize() {
	var GOLFOM_centro = new google.maps.LatLng(23.59,-89) ;

    var mapOptions = {
	    zoom: 6,
	    center: GOLFOM_centro ,
	    disableDefaultUI: true,
	    zoomControl:true,
	    zoomControlOptions: {
	          style:google.maps.ZoomControlStyle.SMALL
	    },
	    mapTypeId: google.maps.MapTypeId.HYBRID
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

    initOverlays(map) ; 
    initHolders() ; 
    loadModelData(defaultModel) ; 


    // Registrar funciones de eventos

    google.maps.event.addListener(map, 'click', function(e) { 
    	// position
        console.log(e.latLng) ;

        //if (currentForecast instanceof ModelForecast) {
        //	setPointProfile(getPointProfile(currentForecast, e.latLng) , map) ;
        //}


        // featureInfo TEST 
        // Get map bounds 
        ne = map.getBounds().getNorthEast() ;  // LatLng obj
        sw = map.getBounds().getSouthWest() ;

  		getfeatInfo(currentForecast.getWMSUrl() , {
  			"layerName" : currentForecast.getCVar() ,
  			"elevation" : currentForecast.getZ() , 
  			"x" : e.pixel.x , "y" : e.pixel.y ,
  			"bbox" : "" + sw.lng() + "," + sw.lat() + "," + ne.lng() + "," + ne.lat() , 
  			"width" : map.getDiv().offsetWidth ,
  			"height" : map.getDiv().offsetHeight, 
  			"time" : currentForecast.getDates()[currentForecast.getDidx()] + "T" + currentForecast.getTimeSteps()[currentForecast.getTSidx()] , 
  			"callback" : function(dataxml, caller) { 
  				// Si el valor que regresa este punto es diferente de Nan, recuperar el pointProfile.
  				var val = parseFloat(getElementValue(dataxml, 'value')); 
  				var lon = parseFloat(getElementValue(dataxml, 'longitude'));
				var lat = parseFloat(getElementValue(dataxml, 'latitude'));
				var iIndex = parseInt(getElementValue(dataxml, 'iIndex'));
				var jIndex = parseInt(getElementValue(dataxml, 'jIndex'));
				var gridCentreLon = parseFloat(getElementValue(dataxml, 'gridCentreLon'));
				var gridCentreLat = parseFloat(getElementValue(dataxml, 'gridCentreLat'));

				if (lon) {
					var truncVal = val.toPrecision(4); 
					if (!isNaN(truncVal)) { 
						titleStr = "Posicion : " + lon.toFixed(3) + "E" + " , " + lat.toFixed(3) + "  Valor: " + truncVal ;  
						setPointProfile(getPointProfile(currentForecast, e.latLng) , titleStr , map) ;
					}
				}

  				//console.log(dataxml) ; 
  			}
  		}, null ) ;



    });

    
}

// 
function initOverlays(map) {

    // Bounds para modelos
    var swBound = new google.maps.LatLng(15.6, -97.7);
    var neBound = new google.maps.LatLng(30.54087, -81.0);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);    

 	// GRid overlay
    grid_overlay = new Graticule(map, false);
    grid_overlay.hide() ;


	console.log(modelData) ;
}

// Div's que flotan dentro del mapa, uno para colormap, y para los graficos de perfiles y transectos.
function initHolders() {
	// Colorbar holder 
	clbWidth = parseInt(findCSSProperty(".colormap-drag","width")) ; 
	clbHeight = parseInt(findCSSProperty(".colormap-drag","height")) ; 
	mrgLeft = 15 ; 	mrgBottom = 25 ;
	$("<div id='colormapholder' class='colormap-drag'><img id='loaderimg' src='loader.gif'></div>").appendTo('#map-canvas').draggable({containment: "#map-canvas", scroll: false}) ; 
	$("#colormapholder").css({left: ($("#map-canvas").width() - clbWidth - mrgLeft) +  "px"}) ;
	$("#colormapholder").css({top: ($("#map-canvas").height() - clbHeight - mrgBottom) +  "px"}) ;	
	$("#colormapholder").hide() ; 

	// ProfilePlot holder.
	$("<div id='pplotholder' class='pplot-drag'></div>").appendTo('#map-canvas').draggable({containment: "#map-canvas", scroll: false}) ; 
	ppWidth = parseInt(findCSSProperty(".pplot-drag","width")) ; 
	ppHeight = parseInt(findCSSProperty(".pplot-drag","height")) ; 
	mrgTop = 10 ; 	
	$("#pplotholder").css({left: ($("#map-canvas").width() - ppWidth - mrgLeft) +  "px"}) ;
	$("#pplotholder").css({top: ( mrgTop -clbHeight  ) +  "px"}) ;	
	$("#pplotholder").hide() ; 	

}


function loadModelData(idM) {
	// TODO Cargar con ajax, datos del modelo


	// Una vez cargada la informacion del modelo en "modelData" crear una instancia de la clase ModelForecast
	// Se manda llamar la funcion fillControls una vez capturados los metadatos relevantes del modelo. 
	currentForecast = new ModelForecast(modelData, 0 , fillControls ) ;

}

// Callback function..
function fillControls() {

	// TODO Llenar la informacion de los controles de fecha, los metodos son
	// this.getDates regresa un arreglo con las fechas en las que hay datos.


	console.log(this) ;


	// llenar el primer grafico por default. 
	setLayer(this) ; 

}


function ModelForecast(obj, idx, readyCallb) {
	this.levels = obj["levels"] ; 
	this.vars = obj["variables"] ; 
	this.workingVar = defaultVar ; 
	// Indice de la dimension temporal, en dias
	this.cdateFrame = 0 ; 
	this.ctimestep = 0 ; 
	// Listado de fechas (dias YYYY-MM-DD) y listado de timesteps 
	this.dates = [] ;
	this.timesteps = [] ; 	
	// Caja de la dimension horizontal
	this.bbox = [] ; 
	// Valores para colorbar, en la variable y profundidad actual
	this.varmin = 0 ; 
	this.varmax = 0 ; 
	// Funcion que se ejecuta al finalizar el constructor.
	this.readycallback = readyCallb ; 
	this.zlevel = 0 ; 
	this.baseURL = obj["forecasts"][idx].wmsurl ;
	this.filled = false ; 

	// Cargar metadatos para obtener los tiempos. 
	getLayerDetails( this.baseURL , {"layerName" : defaultVar , "time" : dToString(new Date()) , "callback" : this.readDetails } , this) ; 

 }

 ModelForecast.prototype.readDetails = function(json, caller) { 
	fullDates = json["datesWithData"] ; 
	dates = [] ; 
	for (var year in fullDates) {				
		for (var month in fullDates[year]) { 					
			for (var day in fullDates[year][month]) {
				dates.push("" + fdig(parseInt(year)) + "-" + fdig(parseInt(month)+1) + "-" + fdig(parseInt(fullDates[year][month][day])) + "") ;					
			}
		}
	}		
	caller.bbox = json["bbox"] ; 
	caller.dates = dates ; 		

	// Cargar metadatos para obtener los timestep y  min, max para la variable default
	gettimesteps (
		caller.baseURL, 
		{"layerName" : defaultVar, "day" : caller.getDates()[caller.getDidx()] , "callback" : caller.readtimesteps } , caller );


 }

 ModelForecast.prototype.readtimesteps = function(json, caller) {
 	caller.timesteps = json["timesteps"] ;
 	// Ahora cargar el min y max
	getminmax (
		caller.baseURL , 
		{"layerName" : defaultVar , "time" : caller.getDates()[caller.getDidx()] + caller.getTimeSteps()[caller.getTSidx()] , "elevation" : caller.getZ() , "bbox" : caller.getBboxstr() , "callback" : caller.readminmax } , 
		caller 
		);
 }

 ModelForecast.prototype.readminmax = function(json, caller) {
 	caller.varmin = (Math.round(parseFloat(json["min"]) * 100) / 100).toFixed(2) ;
 	caller.varmax = (Math.round(parseFloat(json["max"]) * 100) / 100).toFixed(2) ;
 	caller.filled = true ;

	// Call the ready callback 	
	caller.readycallback.call(caller) ;  
 }

 ModelForecast.prototype.itsFilled = function() { 
 	return filled ; 
 }

 ModelForecast.prototype.getZidx = function() { 
 	return zlevel ; 
 }

 ModelForecast.prototype.getZ = function() { 
 	return this.levels[this.zlevel] ; 
 }

 ModelForecast.prototype.setZidx = function(idx, callback) {   	
 	zlevel = idx ; 
 	// TODO calcular los nuevos min y max, para la nueva profundidad, recibir una funcion callback.

 }

 ModelForecast.prototype.getWMSUrl = function() { 
 	return this.baseURL ; 
 }

 ModelForecast.prototype.getDates = function() { 
 	return this.dates ; 
 }

 ModelForecast.prototype.getTimeSteps = function() { 
 	return this.timesteps ; 
 }

 ModelForecast.prototype.getLevels = function() {
 	return this.levels ; 
 }

ModelForecast.prototype.getBbox = function() {
 	return this.bbox ; 
}

ModelForecast.prototype.getBboxstr = function() {
 	return this.bbox.join(",") ; 
}

ModelForecast.prototype.getMin = function() {
 	return this.varmin ; 
}

ModelForecast.prototype.getMax = function() {
 	return this.varmax ; 
}

ModelForecast.prototype.getCVar = function() {
 	return this.workingVar ; 
}

ModelForecast.prototype.getDidx = function() {
 	return this.cdateFrame ; 
}

ModelForecast.prototype.getTSidx = function() {
 	return this.ctimestep ; 
}




function setLayer(obj) { 

	// Obtener datos de "obj" que contiene los metadatos del modelo
	baseURL = obj.getWMSUrl() + "?" ;
	cmin = obj.getMin() ; 
	cmax = obj.getMax() ; 

 	customParams = [ 
	 "LAYERS=" + obj.getCVar() ,
	 "ELEVATION=-" + obj.getZ() , 
	 "TIME="  + obj.getDates()[obj.getDidx()] ,
	 "COLORSCALERANGE=" + cmin + "," + cmax + "",
	 "NUMCOLORBANDS=" + WMSColorbands + ""	 
	] ;  

	if (obj.getCVar() == "sea_water_velocity") { 
		customParams = customParams.concat("STYLES=vector/rainbow")
	}else {
		customParams = customParams.concat("STYLES=boxfill/rainbow")
	}	

	loadWMSOverlay(map, baseURL, customParams, WMSTileSize) ;  

	setColorMap(getWMSColorbar(baseURL,obj.getCVar(),obj.getZ(),cmin,cmax),map) ;

}

function getWMSColorbar(base, layer, level, cmin, cmax) { 	
	customParams = [ 
	 "REQUEST=GetLegendGraphic", 
	 "STYLE=boxfill/rainbow", 
	 "LAYER=" + layer,
	 "ELEVATION=-" + level,
	 "NUMCOLORBANDS=" + WMSColorbands + "",
	 "COLORSCALERANGE=" + cmin + "," + cmax + ""
	] ; 
 
	console.log("Colormap WMS: " + base + customParams.join("&")) ;
	return base + customParams.join("&") ; 
}

function setColorMap(cmimgSrc, map) {

	$("#colormapholder").empty() ; 
	$("#colormapholder").append('<img src="' + cmimgSrc + '">') ; 

	// TODO show with an fade in animation
	$("#colormapholder").show() ; 

}

function getPointProfile(obj , location) {  
	 baseURL = obj.getWMSUrl() + "?" ; 
	 customParams = [
	  "LAYER=" + obj.getCVar() ,	  
	  "REQUEST=GetVerticalProfile", 
	  "POINT=" + location.lng() + "%20" + location.lat() + "",
	  "FORMAT=image/png" ,
	  "CRS=CRS:84",
	  "TIME=" + obj.getDates()[obj.getDidx()] + "T" + obj.getTimeSteps()[obj.getTSidx()]	  
	 ] ; 

	 console.log(baseURL + customParams.join("&")) ; 
	 return baseURL + customParams.join("&") ;  
}

function setPointProfile(cmimgSrc , slabel , map) {

	$("#pplotholder").empty() ; 
	$("#pplotholder").append("<span id='pointinfo'>" + slabel + "</span>") ;
	$("#pplotholder").append("<center><img id='loaderimg' src='loader.gif'><center>") ; 
	$("#pplotholder").append('<img id="wmspp" src="' + cmimgSrc + '">') ; 
	$("#wmspp").hide() ; 	

	// TODO show with an fade in animation
	$("#pplotholder").show() ; 	

	$("#wmspp").on('load' , function() {
		$("#loaderimg").hide() ; 
		$("#wmspp").show() ; 
	}) ;
	
}


/* 
 Metadata requests.. In server only
*/

function getLayerDetails(url , params, caller) { 

	customParams = [ 
	 "REQUEST=GetMetadata",
	 "item=layerDetails",
	 "layerName=" + params.layerName, 
	 "time=" + params.time,
	] ;
	fullR = url + "?" + customParams.join("&") 
	console.log(fullR) ;

	if (workingRemote) {
		// Use proxy 
		proxyURL = "http://localhost/miniProxy.php/" + fullR ;
		$.ajax ({
			type : "GET",
			url : proxyURL ,	
			dataType: "json",			 
			async : true , 	
			success : function(data) { params.callback(data , caller) ;  }
			}) ; 	
	}else{
		$.ajax ({
			type : "GET",
			url : fullR ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ; 
	}
 	
}

function getminmax(url , params, caller) { 
	customParams = [ 
	 "REQUEST=GetMetadata",
	 "item=minmax",
	 "LAYERS=" + params.layerName, //"time=" + params.time, 	 
	 "ELEVATION=-" + params.elevation,
	 "SRS=EPSG:4326",
	 "BBOX=" + params.bbox , 
	 "WIDTH=" + WMSTileSize , 
	 "HEIGHT=" + WMSTileSize
	] ;
	fullR = url + "?" + customParams.join("&") 
	console.log(fullR) ;

	if (workingRemote) {
		// Use proxy when working remotely
		proxyURL = "http://localhost/miniProxy.php/" + fullR ;	
		$.ajax ({
			type : "GET",
			url : proxyURL ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  			
	} else {
		$.ajax ({
			type : "GET",
			url : fullR ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  	
	}
}

function gettimesteps(url , params, caller) { 
	customParams = [ 
	 "REQUEST=GetMetadata",	 
	 "item=timesteps",
	 "layerName=" + params.layerName,
	 "day=" + params.day
	] ;
	fullR = url + "?" + customParams.join("&") 
	console.log(fullR) ;

	if (workingRemote) {
		// Use proxy when working remotely
		proxyURL = "http://localhost/miniProxy.php/" + fullR ;	
		$.ajax ({
			type : "GET",
			url : proxyURL ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  			
	} else {
		$.ajax ({
			type : "GET",
			url : fullR ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  	
	}
}

function getfeatInfo(url , params, caller) { 
	customParams = [ 
	 "REQUEST=GetFeatureInfo",
	 "SERVICE=WMS",
	 "VERSION=1.1.1",	 
	 "QUERY_LAYERS=" + params.layerName,
	 "TIME=" + params.time, 
	 "CRS=EPSG:4326" ,
	 "SRS=EPSG:4326" , 
	 "ELEVATION=-" + params.elevation, 
	 "X=" + params.x.toFixed() , 
	 "Y=" + params.y.toFixed(),
	 "BBOX=" + params.bbox,
	 "WIDTH=" + params.width,
	 "HEIGHT=" + params.height, 
	 "INFO_FORMAT=text/xml"

	] ;
	fullR = url + "?" + customParams.join("&") 
	console.log(fullR) ;

	if (workingRemote) {
		// Use proxy when working remotely
		proxyURL = "http://localhost/miniProxy.php/" + fullR ;	
		$.ajax ({
			type : "GET",
			url : proxyURL ,
			dataType: "xml",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  			
	} else {
		$.ajax ({
			type : "GET",
			url : fullR ,	
			dataType: "json",
			async : true , 			
			success : function(data) { params.callback(data , caller) ;  }
			}) ;  	
	}
}

/*
 UTILIDADES
*/

function fdig(i) {
    if (i < 10) { return "0" + i ;} else {return "" + i ;} ;
}
// Convertir el tipo fecha a formato fecha string = YYYY-MM-DDTHH:MM:SS.MSCZ  ejemplo : 2015-02-28T00:00:00.000Z
function dToString(d) {     
    str = "" + d.getFullYear() + "-" ; 
    str = str + fdig(d.getMonth()) + "-" ;
    str = str + fdig(d.getDate()) + "T" ;
    str = str + fdig(d.getHours()) + ":" ;
    str = str + fdig(d.getMinutes()) + ":" ;
    str = str + fdig(d.getSeconds()) + "." ;
    str = str + fdig(d.getMilliseconds()) + "Z" ;
    
    return str ;
}
// Funcion inversa
function stringToDate(d) {

}

// Get CSS value from style.css
function findCSSProperty(selector, prop) {
    rules = document.styleSheets[0].cssRules
    for(i in rules) {
        //if(rules[i].selectorText==selector) 
            //return rules[i].cssText; // Original
        if(rules[i].selectorText == selector) 
            return rules[i].style[prop]; // Get property specifically
    }
    return false;
}

// Gets the value of the element with the given name from the given XML document,
// or null if the given element doesn't exist
function getElementValue(xml, elName)
{
var el = xml.getElementsByTagName(elName);
if (!el || !el[0] || !el[0].firstChild) return null;
return el[0].firstChild.nodeValue;
}








