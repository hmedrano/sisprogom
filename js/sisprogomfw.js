/*
 SISPROGOM javascript framework. V3.0

 by Favio Medrano
 Cicese 2015 hmedrano@cicese.mx 
*/

// google map object
var map ;
// 
var overlay ;
var vector_overlay ;
var show_vector = false ;
var img_src ;
var colorbar_src ;
var curr_forecast_day = 0 ;
var curr_img = 0 ;
var curr_prof = 0 ;
var onelvl_var = false ;
var grid_overlay ;
var show_graticule = false ;
var GOLFOM_centro = new google.maps.LatLng(23.59,-89) ;
var framesForecast = 6 ;

function initialize() {

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

    initOverlay(map) ; 

    // Registrar funciones de eventos

    google.maps.event.addListener(map, 'click', function(e) {
        console.log(e.latLng) ;
    });

}

// 
// Initiate google map 
google.maps.event.addDomListener(window, 'load', initialize);
// 

// 
function initOverlay(map) {

    // Bounds para modelos
    var swBound = new google.maps.LatLng(15.6, -97.7);
    var neBound = new google.maps.LatLng(30.54087, -81.0);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);    

    // Iniciar mostrando votemper 
    curr_forecast_day = titulo_pronostico.length -1 
    img_src = img_src_vot ; 
    colorbar_src = img_src.colorbars ;
    var srcImage = img_src.files[curr_forecast_day][curr_prof][curr_img] ;

    //$("#fecha_calendar").empty();
    //$("#fecha_calendar").append(document.getElementById("datepicker").value);
    //$("#deep").empty();
    //$("#deep").append("Profundidad: " + profundidades[curr_prof]);
    //$("#selectedVar").empty();
    //$("#selectedVar").append("Temperatura");

    colorMapHolder('<img id="imodelclb" src="' + colorbar_src[curr_forecast_day][curr_prof] +'">', map) ;

    //$("#colorbar").append('<img src="' + colorbar_src[curr_forecast_day][curr_prof] +'">') ;
    //$("#fecha_frame").append('Fecha : ' + fecha_frames[curr_forecast_day][curr_img] + ' : frame ' + (curr_img+1) + '/7'  ) ;
    //$("#titulo_graf").append(img_src.title + ' - Prof: ' + profundidades[curr_prof] ) ;
    //$("#framenumber").append('Frame ' + (curr_img+1)) ;
    //$("#fecha_pronostico").append('Pronostico generado: ' + titulo_pronostico[curr_forecast_day]) ;

    // Creamos la clase que se encarga de dibujar los overlays
    //overlay = new ForcOverlay(bounds, srcImage, map);


 	// ejemplo de WMS overlay
 	//window.setTimeout( function () { initWMSLayer() ; } ,1000) ;  
 	initWMSLayer() ;



    overlay_vector = new ForcOverlay(bounds,img_src_vec.files[curr_forecast_day][curr_prof][curr_img],map)
    overlay_vector.setMap(null) ; 

    grid_overlay = new Graticule(map, false);
    grid_overlay.hide() ;


    console.log($("#imodelclb").width()) ;
	console.log($("#imodelclb").height()) ;
}

function colorMapHolder(cmimgSrc, map) {

	clbWidth = 500 ; 
	clbHeight = 50 ; 
	mrgLeft = 15 ;
	mrgBottom = 20 ;

	$("<div id='colormapholder' class='colormap-drag'>" + cmimgSrc + "</div>").appendTo('#map-canvas').draggable
	({containment: "#map-canvas", scroll: false}) ;


	$("#colormapholder").css({left: ($("#map-canvas").width() - clbWidth - mrgLeft) +  "px"}) ;
	$("#colormapholder").css({top: ($("#map-canvas").height() - clbHeight - mrgBottom) +  "px"}) ;

}

function setFrame(prof, imgidx) {



}


/*
 **************************************************************************
 Metodos WMS Overlay 
  Encargada de la superposicion de capas en el objeto google map, 
  capas que mostraran variables 3D de las salidas de modelos.
 ***************************************************************************/

nav_lev=[2.0, 10.0, 20.0, 30.0, 50.0, 75.0, 100.0, 150.0, 200.0, 300.0, 400.0, 600.0, 800.0, 1000.0, 1200.0, 1500.0, 2000.0, 3000.0, 4000.0, 5000.0] ; 

function initWMSLayer() {

	// Obtener el primer time frame, y el primer nivel de profundidad.
	getVelocityMap(0,0) ; 

}


function getTempMap(idx, level) { 

	baseURL = 'http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc?' ;
 	customParams = [ 
	 "LAYERS=TEMPERATURE",
	 "ELEVATION=-" + nav_lev[level] , 
	 "2015-02-27T00:00:00.000Z", 
	 "COLORSCALERANGE=12.21,27.21",
	 "NUMCOLORBANDS=254",
	 "STYLES=boxfill/rainbow"
	] ;    

	loadWMS(map, baseURL, customParams, 256) ;  

}

function getVelocityMap(idx, level) { 
	baseURL = 'http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc?' ; 
	customParams = [
	 "LAYERS=sea_water_velocity",
	 "ELEVATION=-" + nav_lev[level] , 
	 "2015-02-27T00:00:00.000Z", 
	 "COLORSCALERANGE=0.004978,1.607",
	 "NUMCOLORBANDS=254",
	 "STYLES=vector/rainbow"
	] ; 

	loadWMS(map, baseURL, customParams, 170) ;  	

}




/*
 **************************************************************************
 CLASE ForOverlay 
  Encargada de la superposicion de capas en el objeto google map, 
  capas que mostraran variables 3D de las salidas de modelos.
 ***************************************************************************/

    // Metodos de clase ForcOverlay
    ForcOverlay.prototype = new google.maps.OverlayView();

    /** @constructor */
    function ForcOverlay(bounds, image, map) {
    
      // Now initialize all properties.
      this.bounds_ = bounds;
      this.image_ = image;
      this.map_ = map;
    
      // We define a property to hold the image's div. We'll
      // actually create this div upon receipt of the onAdd()
      // method so we'll leave it null for now.
      this.div_ = null;
    
      // Explicitly call setMap on this overlay
      this.setMap(map);
    }
    
    ForcOverlay.prototype.onAdd = function() {

          // Note: an overlay's receipt of onAdd() indicates that
          // the map's panes are now available for attaching
          // the overlay to the map via the DOM.

          // Create the DIV and set some basic attributes.
          var div = document.createElement('div');
          div.style.borderStyle = 'none';
          div.style.borderWidth = '0px';
          div.style.position = 'absolute';

          // Create an IMG element and attach it to the DIV.
          var img = document.createElement('img');
          img.src = this.image_;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.position = 'absolute';
          div.appendChild(img);

          // Set the overlay's div_ property to this DIV
          this.div_ = div;

          // We add an overlay to a map via one of the map's panes.
          // We'll add this overlay to the overlayLayer pane.
          var panes = this.getPanes();
          panes.overlayLayer.appendChild(div);
    }

    ForcOverlay.prototype.draw = function() {

          // Size and position the overlay. We use a southwest and northeast
          // position of the overlay to peg it to the correct position and size.
          // We need to retrieve the projection from this overlay to do this.
          var overlayProjection = this.getProjection();

          // Retrieve the southwest and northeast coordinates of this overlay
          // in latlngs and convert them to pixels coordinates.
          // We'll use these coordinates to resize the DIV.
          var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
          var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

          // Resize the image's DIV to fit the indicated dimensions.
          var div = this.div_;
          if (div != null) {
              div.style.left = sw.x + 'px';
              div.style.top = ne.y + 'px';
              div.style.width = (ne.x - sw.x) + 'px';
              div.style.height = (sw.y - ne.y) + 'px';
          }
    }

    ForcOverlay.prototype.onRemove = function() {
          this.div_.parentNode.removeChild(this.div_);
          this.div_ = null;
    }
    
    ForcOverlay.prototype.hide = function() {
        this.get('container').style.visibility = 'hidden';
    }
    
    ForcOverlay.prototype.show = function() {
        this.get('container').style.visibility = 'visible';
    }

    // Metodos de clase ForcOverlay EOF 

/*-------------------------------------------------------------------------*/ 