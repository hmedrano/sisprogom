
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

metaTransecs = [{ 
		"name" : "Seccion ejemplo uno" , 
		"start" : { "lon" : -95.074951 , "lat" : 27.629033 },
		"end" : { "lon" : -95.074951 , "lat" : 22.0 } } , 
	{ 
		"name" : "Seccion ejemplo dos" , 
		"start" : { "lon" : -87.074951 , "lat" : 29.629033 },
		"end" : { "lon" : -87.074951 , "lat" : 22.0 } } ,  	
	] ; 

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
var requestedSections ; 
var infowindow ; 

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


    // Al hacer click en el mapa solicitar informacion del punto, y si es posible generar un grafico del perfil
    google.maps.event.addListener(map, 'click', onClickMapBox ) ; 

    // Al mover el mouse, actualizar la posicion.
    google.maps.event.addListener(map, 'mousemove', onMouseMoveUpdatePos );

    // Al cambiar de tamano el mapa., resize window
    $( window ).resize( onWindowResize );



    /*
    function(e) { 
    	// google map position
        console.log(e.latLng) ;
        
        // Get map bounds 
        ne = map.getBounds().getNorthEast() ;  // LatLng obj
        sw = map.getBounds().getSouthWest() ;

        // Solicitar informacion de un punto en especifico, con parametros actuales de "currentForecast"
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
				var iIndex = parseInt(getElementValue(dataxml, 'iIndex')); // Indices malla del modelo.
				var jIndex = parseInt(getElementValue(dataxml, 'jIndex'));
				var gridCentreLon = parseFloat(getElementValue(dataxml, 'gridCentreLon'));  // lat , lon del modelo.
				var gridCentreLat = parseFloat(getElementValue(dataxml, 'gridCentreLat'));

				if (lon) {
					var truncVal = val.toPrecision(4); 
					if (!isNaN(truncVal)) { 
						titleStr = "Posicion : " + lon.toFixed(3) + "E" + " , " + lat.toFixed(3) + "  Valor: " + truncVal ;  
						setPointProfile(getPointProfile(currentForecast, e.latLng) , titleStr , map) ;
					}
				}

  				console.log(dataxml) ; 
  			}
  		}, null ) ;
    });
	*/

    
}

/* ON MOVE, ON CLICK Events */

function onWindowResize() {
	mrgLeft = 15 ; 	mrgBottom = 25 ;
	
	if ($("#positionInfo").length) {
 		$("#positionInfo").css( { left: mrgLeft + "px"}) ;
		$("#positionInfo").css( { top: ( $("#map-canvas").height() - 50 - mrgBottom) + "px" }) ; 	
	}

}

function onMouseMoveUpdatePos(obj) {
	// Mostrar las coordenadas donde pasa el mouse.
	var lat = obj.latLng.lat();
    lat = lat.toFixed(4);
    var lng = obj.latLng.lng();
    lng = lng.toFixed(4);	
	$("#positiontb").empty() ; 
	$("#positiontb").append('' + lng + ' , ' + lat) ; 
}

/* Funcion que dibujara una ventana de informacion, 
   describiendo el punto seleccionado, su valor y los graficos que se ofrecen para ese punto.
*/
function onClickMapBox(obj) { 

	// Consultar informacion sobre este punto (obj)  ---- 
	// Google map bounds visibles.
	ne = map.getBounds().getNorthEast() ; 
    sw = map.getBounds().getSouthWest() ;
	var latgm = obj.latLng.lat(); latgm = latgm.toFixed(4);
    var lnggm = obj.latLng.lng(); lnggm = lnggm.toFixed(4);	    
	// Solicitar informacion de un punto en especifico, con parametros actuales de "currentForecast"
	getfeatInfo(currentForecast.getWMSUrl() , {
		"layerName" : currentForecast.getCVar() ,
		"elevation" : currentForecast.getZ() , 
		"x" : obj.pixel.x , "y" : obj.pixel.y ,
		"bbox" : "" + sw.lng() + "," + sw.lat() + "," + ne.lng() + "," + ne.lat() , 
		"width" : map.getDiv().offsetWidth ,
		"height" : map.getDiv().offsetHeight, 
		"time" : currentForecast.getDates()[currentForecast.getDidx()] + "T" + currentForecast.getTimeSteps()[currentForecast.getTSidx()] , 
		"callback" : function(dataxml, caller) { 
			// TIP. Si el valor que regresa este punto es diferente de Nan, entonces hay informacion valida.
			// Informacion recuperada.
			var val = parseFloat(getElementValue(dataxml, 'value')); 
			var lon = parseFloat(getElementValue(dataxml, 'longitude'));  
			var lat = parseFloat(getElementValue(dataxml, 'latitude'));
			var iIndex = parseInt(getElementValue(dataxml, 'iIndex'));   // Indices malla del modelo.
			var jIndex = parseInt(getElementValue(dataxml, 'jIndex'));
			var gridCentreLon = parseFloat(getElementValue(dataxml, 'gridCentreLon'));  // lat , lon del modelo.
			var gridCentreLat = parseFloat(getElementValue(dataxml, 'gridCentreLat'));  

			// Si hay datos validos entonces... 	
			if (val) {   			 

				// Formatear contenido para el info window. 
				headertxt = '<p><strong>Coordenadas: </strong> ' + lnggm + 'E , ' + latgm + 'N ' + '<br><strong>Valor: </strong> ' + val.toFixed(4) + '</p>'; 
				bodytxt = '<p><strong>Graficos disponibles:</strong></p><ul>' ; 
				if (currentForecast.getCVar() != 'SSH') {
					bodytxt = bodytxt + '<li id="pprofile"><a href="#">Perfil del punto</a></li><li id="ptimeseries">Serie de tiempo del punto</li>' ;
				} else {
					bodytxt = bodytxt + '<li>Serie de tiempo del punto</li>' ;
				}				
				if (currentForecast.getCVar() == 'sea_water_velocity') {
					bodytxt = bodytxt + '<li id="directionrose">Rosa de direcciones</li>' ;
				}
				bodytxt = bodytxt + '</ul>' ; 
				contentString = headertxt + bodytxt ; 
				// remove any other infowindow
				if (typeof infowindow != 'undefined') {
					infowindow.close() ;
				}
				// The info window
				infowindow = new google.maps.InfoWindow({
			      content: contentString,
			      position: obj.latLng
			  	});
			  	
			  	infowindow.open(map) ;  

			  	google.maps.event.addListener(infowindow, 'domready' , function() {
					// Accion para point profile. 
					$("#pprofile").click( function() {
						console.log('Onclick pprofile') ; 
						pptitle = "<p><h5><strong>Perfil de:</strong> " + currentForecast.getCVar() + "&nbsp;&nbsp;&nbsp;<strong>Punto:</strong> " + lnggm + "E" + " , " + latgm + "</h5></p><p><h5><strong>Fecha-tiempo:</strong> " + currentForecast.getCurrentDatetimeString() + "</h5></p>" ; 
						setPointProfile(getPointProfile(currentForecast, obj.latLng) , pptitle, map) 
					}); 			  		
			  	}) ;
		  	
			} 
			
		}
	}, null ) ;		




}

function clickOnMap(obj) { 

	// Google map bounds
	ne = map.getBounds().getNorthEast() ; 
    sw = map.getBounds().getSouthWest() ;
	// Solicitar informacion de un punto en especifico, con parametros actuales de "currentForecast"
	getfeatInfo(currentForecast.getWMSUrl() , {
		"layerName" : currentForecast.getCVar() ,
		"elevation" : currentForecast.getZ() , 
		"x" : obj.pixel.x , "y" : obj.pixel.y ,
		"bbox" : "" + sw.lng() + "," + sw.lat() + "," + ne.lng() + "," + ne.lat() , 
		"width" : map.getDiv().offsetWidth ,
		"height" : map.getDiv().offsetHeight, 
		"time" : currentForecast.getDates()[currentForecast.getDidx()] + "T" + currentForecast.getTimeSteps()[currentForecast.getTSidx()] , 
		"callback" : function(dataxml, caller) { 
			// Si el valor que regresa este punto es diferente de Nan, recuperar el pointProfile.
			var val = parseFloat(getElementValue(dataxml, 'value')); 
			var lon = parseFloat(getElementValue(dataxml, 'longitude')); 
			var lat = parseFloat(getElementValue(dataxml, 'latitude'));
			var iIndex = parseInt(getElementValue(dataxml, 'iIndex')); // Indices malla del modelo.
			var jIndex = parseInt(getElementValue(dataxml, 'jIndex'));
			var gridCentreLon = parseFloat(getElementValue(dataxml, 'gridCentreLon'));  // lat , lon del modelo.
			var gridCentreLat = parseFloat(getElementValue(dataxml, 'gridCentreLat'));

			if (lon) {

				// Obtener U y V de este dataset y calcular la magnitud y direccion.  
				// Slice : [ : ] [ Z ] [ iIndex ] [ jIndex ]
				dapUrl = sDodsUrlBuilder(currentForecast.getDAPUrl() , [ 'UCOMP_X', 'VCOMP_Y'] , [ [ 0 , currentForecast.getTimeDimSize() ] , [ currentForecast.getZidx() ] , [ jIndex ] , [ iIndex ] ] ) ; 
				console.log('DAP Petition : ' + dapUrl ) ; 

				getDapData(dapUrl , function(data) {

					// Now flatten the arrays
					uArray = [] ; 
					vArray = [] ;
					magA = [] ; 
					dirA = [] ; 											
					uArray = flattenMArray (data['UCOMP_X'].data, uArray) ; 
					vArray = flattenMArray (data['VCOMP_Y'].data, vArray) ; 

					for (var i =0; i< uArray.length ; i++) {
						magA.push(Math.sqrt( Math.pow(uArray[i],2) + Math.pow(vArray[i],2) ) ) ;  						
						// Direccion en grados 0 a 359 
						if (vArray[i] == 0) {
							dirA.push(180.0) ;
						} else { 
							// East 0 degress , North 90 dg , West 180 dg   South 270 dg
							dirval = Math.atan2(vArray[i] , uArray[i]) * (180.0 / Math.PI) ; 
							if (dirval < 0) {
								dirval = ( 180 - Math.abs(dirval) ) + 180.0 ; 
							}
							dirA.push( dirval ) ;
						}						
					}

					console.log(magA) ;
					console.log(dirA) ;
					console.log(val.toPrecision(4)) ; // magnitud

					// Crear rosa de viento de todo el periodo.
					title = "Rosa de direccion " +  lon.toFixed(3) + "E" + " , " + lat.toFixed(3) + "  Valor: " + val.toPrecision(4) ;  
					setDirectionRose(title,map,magA, dirA) ; 

				}) ;

				// Codigo para obtener el pointProfile de un punto.
				/* 
				var truncVal = val.toPrecision(4); 
				if (!isNaN(truncVal)) { 
					titleStr = "Posicion : " + lon.toFixed(3) + "E" + " , " + lat.toFixed(3) + "  Valor: " + truncVal ;  
					setPointProfile(getPointProfile(currentForecast, e.latLng) , titleStr , map) ;
				} 
				*/
			}

			console.log(dataxml) ; 
		}
	}, null ) ;	

} 


// 
function initOverlays(map) {

    // Bounds para modelos
    var swBound = new google.maps.LatLng(15.6, -97.7);
    var neBound = new google.maps.LatLng(30.54087, -81.0);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);    

 	// Overlay de reticula de lineas lat y lon.
    grid_overlay = new Graticule(map, false);

    if (!show_graticule) {
    	grid_overlay.hide() ; 
    }
	
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
	$("<div id='pplotholder' class='pplot-drag panel panel-default'></div>").appendTo('#map-canvas').draggable({containment: "#map-canvas", scroll: false}) ; 
	ppWidth = parseInt(findCSSProperty(".pplot-drag","width")) ; 
	ppHeight = parseInt(findCSSProperty(".pplot-drag","height")) ; 
	mrgTop = 10 ; 	
	$("#pplotholder").css({left: ($("#map-canvas").width() - ppWidth - mrgLeft) +  "px"}) ;
	$("#pplotholder").css({top: ( mrgTop -clbHeight  ) +  "px"}) ;	
	$("#pplotholder").hide() ; 	

	// TransectPlot holder.
	$("<div id='tplotholder' class='tplot-drag'></div>").appendTo('#map-canvas').draggable({containment: "#map-canvas", scroll: false}) ; 
	ppWidth = parseInt(findCSSProperty(".tplot-drag","width")) ; 
	ppHeight = parseInt(findCSSProperty(".tplot-drag","height")) ; 
	mrgTop = 10 ; 	
	$("#tplotholder").css({left: ($("#map-canvas").width() - ppWidth - mrgLeft) +  "px"}) ;
	$("#tplotholder").css({top: ( mrgTop - clbHeight  ) +  "px"}) ;	
	$("#tplotholder").hide() ; 		

	// Rosas de direccion holder.
	$("<div id='dirplotholder' class='dirplot-drag'></div>").appendTo('#map-canvas').draggable({containment: "#map-canvas", scroll: false}) ; 
	ppWidth = parseInt(findCSSProperty(".dirplot-drag","width")) ; 
	ppHeight = parseInt(findCSSProperty(".dirplot-drag","height")) ; 
	mrgTop = 10 ; 	
	$("#dirplotholder").css({left: ($("#map-canvas").width() - ppWidth - mrgLeft) +  "px"}) ;
	$("#dirplotholder").css({top: ( mrgTop - clbHeight  ) +  "px"}) ;	
	$("#dirplotholder").hide() ; 		

	// Control de posicion (Lon, lat) 
	$("<div id='positionInfo' class='posInfo panel'></div>").appendTo('#map-canvas') ;   
	ppHeight = parseInt(findCSSProperty(".posInfo","height")) ; 
	$("#positionInfo").css({left: mrgLeft + "px"}) ;
	$("#positionInfo").css({top: ($("#map-canvas").height() - ppHeight - mrgBottom) +  "px" }) ; 
	$("#positionInfo").append('<center><span>Longitude, Latitude.</span></center><div id="positiontb" style="text-align: center;"></div>') ;
	$("#positionInfo").hide() ; 


}


function loadModelData(idM) {
	// TODO Cargar con ajax, datos del modelo en "modelData"


	// Una vez cargada la informacion del modelo en "modelData" crear una instancia de la clase ModelForecast
	// Se manda llamar la funcion fillControls una vez capturados los metadatos relevantes del modelo. 
	currentForecast = new ModelForecast(modelData, 0 , fillControls ) ;
	requestedSections = new Sections(metaTransecs) ;

}

// Callback function.
function fillControls() {

	// TODO Llenar la informacion de los controles de fecha, los metodos son
	// this.getDates() regresa un arreglo con las fechas en las que hay datos. 
	// this.getTimeSteps() regresa el arreglo con las horas en los que hay datos.


	//console.log(this) ;   // Para explorar la instancia de la clase ModelForecast.


	// Actualizar el grafico.
	this.setHTMLReport() ;
	setLayer(this) ; 	

	$("#positionInfo").show() ;

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
	this.dapURL = obj["forecasts"][idx].dapurl ;
	this.filled = false ; 

	// Cargar metadatos para obtener los tiempos. 
	getLayerDetails( this.baseURL , {"layerName" : defaultVar , "time" : dToString(new Date()) , "callback" : this.readDetails } , this) ; 

 }

 ModelForecast.prototype.readDetails = function(json, caller) {  	
	fullDates = json["datesWithData"] ; 
	dates = [] ; 
	for (var year in fullDates) {				
		for (var month in fullDates[year]) { 					
			for (var day=0 ; day < fullDates[year][month].length ; day++) {
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
 	return this.zlevel ; 
 }

 ModelForecast.prototype.getZ = function() { 
 	return this.levels[this.zlevel] ; 
 }

 ModelForecast.prototype.setZidx = function(idx) {   
 	 	
 	if (this.workingVar != 'SSH') {
 		this.zlevel = idx ; 
		// Cargar de nuevo datos de min, max
	 	// Ahora cargar el min y max
		getminmax ( this.baseURL , 
			{"layerName" : this.workingVar , "time" : this.getDates()[this.getDidx()] + this.getTimeSteps()[this.getTSidx()] , "elevation" : this.getZ() , "bbox" : this.getMapbbox() , "callback" : this.readminmax } , 
			this 
			);		
		// Al finalizar se vuelve a llamar la funcion "readycallback" 		
 	}

 }

 ModelForecast.prototype.getWMSUrl = function() { 
 	return this.baseURL ; 
 }

 ModelForecast.prototype.getDAPUrl = function() { 
 	return this.dapURL ; 
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

ModelForecast.prototype.getTimeDimSize = function() {
	totalSteps = (this.dates.length * this.timesteps.length) - 1 ; 
	return totalSteps ; 
}

ModelForecast.prototype.getCurrentDatetimeString = function() {
	dtstring = (this.dates[this.getDidx()] + " T" + this.timesteps[this.getTSidx()])  ; 
	return dtstring ;
}

ModelForecast.prototype.nextTimeStep = function(stepSize) {
	// Avanzar al siguiente paso de tiempo. 

	if (stepSize == "dates") {		
		this.cdateFrame = this.cdateFrame + 1 ; 
		if (this.cdateFrame >= this.dates.length) {
			this.cdateFrame = 0 ; 
		}
	}else {
		totalSteps = this.dates.length * this.timesteps.length ; 
		this.ctimestep = this.ctimestep + 1 ;
		if (this.ctimestep >= this.timesteps.length) { 
			this.ctimestep = 0 ;
			this.cdateFrame = this.cdateFrame + 1 ;  
			if (this.cdateFrame >= this.dates.length) {
				this.cdateFrame = 0 ; 
			}
		}
	}
	console.log ("Current timeStep : " + this.getDates()[this.getDidx()] + "T" + this.getTimeSteps()[this.getTSidx()]) ; 	

	// Run the callback function.
	this.readycallback.call(this) ;
}

ModelForecast.prototype.lastTimeStep = function(stepSize) {
	// Regresarl al anterior paso de tiempo. 

	if (stepSize == "dates") {		
		this.cdateFrame = this.cdateFrame - 1 ; 
		if (this.cdateFrame < 0 ) {
			this.cdateFrame = this.dates.length - 1 ; 
		}
	}else {		
		this.ctimestep = this.ctimestep - 1 ;
		if (this.ctimestep < 0) { 
			this.ctimestep = this.timesteps.length - 1 ;
			this.cdateFrame = this.cdateFrame - 1 ;  
			if (this.cdateFrame < 0) {
				this.cdateFrame = this.dates.length - 1 ; 
			}
		}
	}
	console.log ("Current timeStep : " + this.getDates()[this.getDidx()] + "T" + this.getTimeSteps()[this.getTSidx()]) ; 	

	// Run the callback function.
	this.readycallback.call(this) ;
}

ModelForecast.prototype.changeVar = function(varName, zlev) {
	zlev = typeof zlev !== 'undefined' ? zlev : this.zlevel ;
	if (this.vars.indexOf(varName) != -1)  {
		if (this.workingVar == varName) return 
		this.workingVar = varName ; 
		if (varName == "sea_water_velocity") {
			WMSTileSize = 256 ; 
		} else {
			WMSTileSize = 128 ;
		}
		if (varName == "SSH") {
			this.zlevel = 0 ; 
		} else {
			this.zlevel = zlev ; 
		}
		// Cargar de nuevo datos de min, max
	 	// Ahora cargar el min y max
		getminmax ( this.baseURL , 
			{"layerName" : this.workingVar , "time" : this.getDates()[this.getDidx()] + "T" + this.getTimeSteps()[this.getTSidx()] , "elevation" : this.getZ() , "bbox" : this.getMapbbox() , "callback" : this.readminmax } , 
			this 
			);		
		// Al finalizar se vuelve a llamar la funcion "readycallback"
	}  	
}

ModelForecast.prototype.reCalculateMM = function() {
 	// Ahora cargar el min y max
	getminmax ( this.baseURL , 
		{"layerName" : this.workingVar , "time" : this.getDates()[this.getDidx()] + this.getTimeSteps()[this.getTSidx()] , "elevation" : this.getZ() , "bbox" : this.getMapbbox() , "callback" : this.readminmax } , 
		this );		
}

ModelForecast.prototype.getMapbbox = function() {
    // Get map bounds 
    ne = map.getBounds().getNorthEast() ;  // LatLng obj
    sw = map.getBounds().getSouthWest() ;	
    return "" + sw.lng() + "," + sw.lat() + "," + ne.lng() + "," + ne.lat() ; 
}

ModelForecast.prototype.setHTMLReport = function() {
    // 
    htmlSTR = "Variable : " + this.getCVar() + "<br>" ;
    htmlSTR = htmlSTR + "Profundidad : " + this.getZ() + " metros <br>" ;
    htmlSTR = htmlSTR + "Dia : " + this.getDates()[this.getDidx()] + "  <br> Hora : " + this.getTimeSteps()[this.getTSidx()]  + "<br>" ;

    $("#statusInfo").empty() ;
    $("#statusInfo").append(htmlSTR) ;
}

/* --- Final Clase ModelForecast --- */ 

// 
// Clase Sections que se encargara de mostrar las lineas de los transectos y sus eventos.
function Sections(obj) {
	this.sections = obj ;
	this.secMarkers = [] ; 
	this.secLines = [] ; 
}

Sections.prototype.showSections = function() {
	if (this.secMarkers.length == 0) {
		for (var td=0; td<this.sections.length; td++) {

			// Agregar marcadores en el mapa
			var pos = new google.maps.LatLng(metaTransecs[td].start.lat, metaTransecs[td].start.lon);
			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				title:metaTransecs[td].name,
				secID : td
			});
			this.secMarkers.push(marker) ; 

			var line = [ pos , new google.maps.LatLng(metaTransecs[td].end.lat,metaTransecs[td].end.lon) ] ;
			var transLine = new google.maps.Polyline({ 
				path : line , 
				strokeColor : "#000000" ,
				strokeOpacity : 0,
				strokeWeight : 4.0 , 
				icons: [{
				    icon: {
							  path: 'M 0,-1 0,1',
							  strokeOpacity: 1,
							  scale: 4 },
				    offset: '0',
				    repeat: '20px'
				  }],

				map : map
			}) ;
			this.secLines.push(transLine) ;
			
			google.maps.event.addListener(marker, 'click', function(e) { 						
				
				setSectionPlot(getTransect(currentForecast, requestedSections.sections[this.secID]["start"], requestedSections.sections[this.secID]["end"]) , requestedSections.sections[this.secID]["name"] , map)

			}) ;
		}
	}
}

Sections.prototype.hideSections = function() {
	for (var td=0; td<this.secMarkers.length; td++) {	
		this.secMarkers[td].setMap(null) ;
		this.secLines[td].setMap(null) ;
	}
	this.secMarkers = [] ;
	this.secLines = [] ; 
}








function setLayer(obj) { 

	// Obtener datos de "obj" que contiene los metadatos del modelo
	baseURL = obj.getWMSUrl() + "?" ;
	cmin = obj.getMin() ; 
	cmax = obj.getMax() ; 

 	customParams = [ 
	 "LAYERS=" + obj.getCVar() ,
	 "ELEVATION=-" + obj.getZ() , 
	 "TIME="  + obj.getDates()[obj.getDidx()] + "T" + obj.getTimeSteps()[obj.getTSidx()] ,
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
 
	//console.log("Colormap WMS: " + base + customParams.join("&")) ;
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
	$("#pplotholder").append("<div class='panel-heading'><button id='pplotclose' type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button> <h3 class='panel-title'>" + slabel + "</h3> </div>") ;
	$("#pplotholder").append("<center><div id='loaderimg' style='height:170px;'><img  src='loader.gif'></div></center>") ; 
	$("#pplotholder").append('<center><img id="wmspp" src="' + cmimgSrc + '"></center>') ; 
	$("#wmspp").hide() ; 	

	// TODO show with an fade in animation
	$("#pplotholder").show() ; 	

	$("#wmspp").on('load' , function() {
		$("#loaderimg").hide() ; 
		$("#wmspp").show() ; 
	}) ;

	$("#pplotclose").click(function() { 
		$("#pplotholder").hide() ;
		$("#pplotholder").empty() ; 
	})
	
}


function getTransect(obj, start, end) {
	 baseURL = obj.getWMSUrl() + "?" ; 
	 customParams = [
	  "LAYER=" + obj.getCVar() ,	
	  "ELEVATION=-" + obj.getZ(),  
	  "REQUEST=GetTransect", 	  
	  "FORMAT=image/png" ,
	  "CRS=EPSG:4326",
	  "TIME=" + obj.getDates()[obj.getDidx()] + "T" + obj.getTimeSteps()[obj.getTSidx()],
	  "PALETTE=rainbow",
	  "COLORSCALERANGE=" + obj.getMin() + "," + obj.getMax(),
	  "NUMCOLORBANDS=" + WMSColorbands,
	  "LINESTRING=" + start["lon"] + "%20" + start["lat"] + "," + end["lon"] + "%20" + end["lat"]
	 ] ; 

	 console.log(baseURL + customParams.join("&")) ; 
	 return baseURL + customParams.join("&") ;  	
}

function setSectionPlot(cmimgSrc , slabel , map) {

	$("#tplotholder").empty() ; 
	$("#tplotholder").append("<span id='sectioninfo'>" + slabel + "</span>") ;
	$("#tplotholder").append("<center><img id='tloaderimg' src='loader.gif'><center>") ; 
	$("#tplotholder").append('<img id="wmstp" src="' + cmimgSrc + '">') ; 
	$("#wmstp").hide() ; 	

	// TODO show with an fade in animation
	$("#tplotholder").show() ; 	

	$("#wmstp").on('load' , function() {
		$("#tloaderimg").hide() ; 
		$("#wmstp").show() ; 
	}) ;
	
}

/* Metodo que inicia el contenedor div para la rosa de direcciones
   Una vez cargado, se dibuja dentro del div la rosa.   
*/
function setDirectionRose(slabel, map , m,d ) { 

	$("#dirplotholder").empty() ; 
	$("#dirplotholder").append("<span id='sectioninfo'>" + slabel + "</span>") ;
	$("#dirplotholder").append("<div id='directionRose' style='height:320px;width:320px;'></div>") ;
	$("#dirplotholder").append("<center><img id='tloaderimg' src='loader.gif'><center>") ; 	
	$("#directionRose").hide() ; 

	// TODO show with a fade in animation
	$("#dirplotholder").show() ; 

	flotDirRose(m,d,"#directionRose") ; 

	$("#tloaderimg").hide() ; 
	$("#directionRose").show() ;
	console.log('Direction rose ready') ;
	

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
			dataType: "xml",
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
    rules = document.styleSheets[1].cssRules
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

// Flatten or ravel a multidimensional array
function flattenMArray(a, r){
    if(!r){ r = []}
    for(var i=0; i<a.length; i++){
        if(a[i].constructor == Array){
            flattenMArray(a[i], r);
        }else{
            r.push(a[i]);
        }
    }
    return r;
}



/* Funciones para obtener datos de opendap , 
   Generador de peticiones para opendap. 
*/

function sDodsUrlBuilder (baseURL, Variables, indexes) {
    // baseUrl is our opendap Server,
    // Variables is an array of strings or string with the variables names
    // indexes is an array with the indexes to slice from the server, ej. [0:1:1000][0]
    if (baseURL) {
        baseURL = baseURL + '.dods' + '?' ;
    }
    vl = "" ;
    if (typeof(indexes) == 'undefined') {
        if (Variables.constructor === Array) {            
            for (i = 0 ; i < Variables.length ; i++) {
                vl = vl + Variables[i] + ( (i < Variables.length-1) ? "," : "");
            }
            retUrl = baseURL + vl ;
        }
        else {
            retUrl = baseURL + Variables ;
        }
    } else {
        // indexes come in array [start,end,step],[start,end], ..... 
        // make it to [start:end:step][start:end][start]
        sInd = "" ;
        for (i=0 ; i<indexes.length ; i++) {
            sDim = "" ; 
            if (indexes[i].constructor === Array) {
                sDim = "[" ; 
                for (j=0 ; j<indexes[i].length ;j++) {
                    sDim = sDim + indexes[i][j] + ((j < indexes[i].length-1) ? ":" : "") ;
                }
                sDim = sDim + "]" ;
                sInd = sInd + sDim ; 
            } else { 
                if (i==0) {sInd = "[" ; }
                sDim = sDim + indexes[i].toString() + ((i < indexes.length-1) ? ":" : "");
                sInd = sInd + sDim  ; 
                if (i==indexes.length-1) { sInd = sInd + "]"}
            }            
            
        }        
        if (Variables.constructor === Array) {            
            for (i = 0 ; i < Variables.length ; i++) {
                vl = vl + Variables[i] + sInd + ( (i < Variables.length-1) ? "," : "");
            }
            retUrl = baseURL + vl ;
        }
        else {
            retUrl = baseURL + Variables + sInd;
        }       
    }
    //myLogger(retUrl) ;
    return retUrl ;    
}

function getDapData(dapURL, callback) { 

	if (workingRemote) {
		// Use proxy when working remotely
		dapURL = "http://localhost/miniProxy.php/" + dapURL ;	
	} 
	loadData( dapURL , callback ) ; 

}
