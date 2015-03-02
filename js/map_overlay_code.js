
	var map ;
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
		    zoom: 5,
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
		  
		  // bounds lon -98 a -81.66666 
		  // bounds lat 15.55531 a 31.18437  
				  
          var swBound = new google.maps.LatLng(15.6, -97.7);
          var neBound = new google.maps.LatLng(30.54087, -81.0);
		  var bounds = new google.maps.LatLngBounds(swBound, neBound);

		  // Iniciar mostrando votemper
		  curr_forecast_day = titulo_pronostico.length -1 
		  img_src = img_src_vot ; 
		  colorbar_src = img_src.colorbars ;
		  var srcImage = img_src.files[curr_forecast_day][curr_prof][curr_img] ;
			
			$("#fecha_calendar").empty();
			$("#fecha_calendar").append(document.getElementById("datepicker").value);
			$("#deep").empty();
			$("#deep").append("Profundidad: " + profundidades[curr_prof]);
			$("#selectedVar").empty();
			$("#selectedVar").append("Temperatura");
			
		  $("#colorbar").append('<img src="' + colorbar_src[curr_forecast_day][curr_prof] +'">') ;
		  $("#fecha_frame").append('Fecha : ' + fecha_frames[curr_forecast_day][curr_img] + ' : frame ' + (curr_img+1) + '/6'  ) ;
		  $("#titulo_graf").append(img_src.title + ' - Prof: ' + profundidades[curr_prof] ) ;
		  $("#framenumber").append('Frame ' + (curr_img+1)) ;
		  $("#fecha_pronostico").append('Pronostico generado: ' + titulo_pronostico[curr_forecast_day]) ;

		  // Iniciamos controles
		  //init_historico() ;
		  //init_prof() ;
		  
		  // Creamos la clase que se encarga de dibujar los overlays
		  overlay = new ForcOverlay(bounds, srcImage, map);
		  overlay_vector = new ForcOverlay(bounds,img_src_vec.files[curr_forecast_day][curr_prof][curr_img],map)
		  overlay_vector.setMap(null) ; 
		  
		  grid_overlay = new Graticule(map, false);
		  grid_overlay.hide() ;
		  
		  
		}
		
	google.maps.event.addDomListener(window, 'load', initialize);	
	
	/*function init_prof() {
		hl=profundidades.length ;
		htm = '<ul class="dropdown-menu" role="menu">' ;
		for (d=0;d<hl;d++){
			htm = htm + '<li><a href="javascript:void(0)" onclick="prof_change(' + d.toString() + ')">' + profundidades[d] + '</a></li>' ;
		}
		htm = htm + '</ul>' ;		
		$('#select_prof').append(htm)
	}*/
	
	function prof_change(idx) {
		hl = profundidades.length ;
		if (idx >= hl || idx < 0) {
			return ;
		}
		curr_prof = idx ;
		refresh_colorbar_title() ;
		refresh_overlay() ;		
	}
	
	/*function init_historico() {
		hl = titulo_pronostico.length ;
		htm = '<ul class="dropdown-menu" role="menu">' ;
		// Entradas de historico, segun lo que aparesca en images_src.js
		for (d=0;d<hl;d++){
			htm = htm + '<li><a href="javascript:void(0)" onclick="history_change(' + d.toString() + ')">' + titulo_pronostico[d] + '</a></li>' ;
		}
		htm = htm + '</ul>' ;
		$('#select_historico').append(htm)
	}*/
	
	function history_change(frame) {
		hl = titulo_pronostico.length ;
		if (frame >= hl || frame < 0) {
			return ;
		}
		curr_forecast_day = frame ; curr_img = 0 ; curr_prof = 0
		if (show_vector) $('#vect_btn').button('toggle') ;
		show_vector = false ; 
		$("#slider").slider('value', curr_prof);
		$("#deep").empty();
		$("#deep").append("Profundidad: " + profundidades[curr_prof]);
		$("#fecha_pronostico").empty(); 
		$("#fecha_pronostico").append('Pronostico generado: ' + titulo_pronostico[curr_forecast_day]) ;
		refresh_colorbar_title() ;
		refresh_overlay() ;
		
	}
	
	function refresh_colorbar_title() {
		$("#colorbar").empty();
		$("#colorbar").append('<img src="' + colorbar_src[curr_forecast_day][curr_prof] +'">') ;
		$("#titulo_graf").empty();
		$("#titulo_graf").append(img_src.title + ' - Prof: ' + profundidades[curr_prof]) ;		
	}
	function select_v_sst() {
		
		$("#selectedVar").empty();
		$("#selectedVar").append("Nivel de mar");
		
		onelvl_var = true ;
		//curr_prof = 0 ;
		$("#slider").slider('value', curr_prof);
		$("#slider").slider("option", "disabled", onelvl_var);
		$("#deep").empty();
		$("#deep").append("Profundidad: " + profundidades[curr_prof]);
		
		img_src = img_src_sst ;
		colorbar_src = img_src.colorbars ;
		refresh_colorbar_title() ;
		refresh_overlay() ;
	}

	function select_v_vot() {
		
		$("#selectedVar").empty();
		$("#selectedVar").append("Temperatura");
		
		onelvl_var = false ;
		//curr_prof = 0 ;
		$("#slider").slider('value', curr_prof);
		$("#slider").slider("option", "disabled", onelvl_var);
		$("#deep").empty();
		$("#deep").append("Profundidad: " + profundidades[curr_prof]);
		
		img_src = img_src_vot ;
		colorbar_src = img_src.colorbars ; 
		refresh_colorbar_title() ;
		refresh_overlay() ;
	}

	function select_v_vos() {
		
		$("#selectedVar").empty();
		$("#selectedVar").append("Salinidad");
		
		onelvl_var = false ;
		//curr_prof = 0 ;
		$("#slider").slider('value', curr_prof);
		$("#slider").slider("option", "disabled", onelvl_var);
		$("#deep").empty();
		$("#deep").append("Profundidad: " + profundidades[curr_prof]);
		
		img_src = img_src_vos ;
		colorbar_src = img_src.colorbars ; 
		refresh_colorbar_title() ;
		refresh_overlay() ;
	}	
	
	function select_v_vecc() {
	
		$("#selectedVar").empty();
		$("#selectedVar").append("Corrientes");
		
		//curr_prof = 0 ;
		onelvl_var = false ;
		$("#slider").slider('value', curr_prof);
		$("#slider").slider("option", "disabled", onelvl_var);
		$("#deep").empty();
		$("#deep").append("Profundidad: " + profundidades[curr_prof]);
		
		img_src = img_src_vecc ;
		colorbar_src = img_src.colorbars ; 
		refresh_colorbar_title() ;
		refresh_overlay() ;
	}	
		
	function refresh_overlay() {
		if (onelvl_var){
			overlay.image_ = img_src.files[curr_forecast_day][curr_img] ;
		}else {
			overlay.image_ = img_src.files[curr_forecast_day][curr_prof][curr_img] ;
		}
		overlay.setMap(null) ;
		overlay.setMap(map) ;
		//overlay.onAdd() ;
		//overlay.draw() ; 
		$("#fecha_frame").empty() ;
		$("#fecha_frame").append('Fecha : ' + fecha_frames[curr_forecast_day][curr_img] + ' : frame ' + (curr_img+1) + '/7' ) ;
		if (show_graticule) {
			grid_overlay.draw() ;	
		}
		if (show_vector) {
			overlay_vector.image_ = img_src_vec.files[curr_forecast_day][curr_prof][curr_img] ;
			overlay_vector.setMap(null) ;
			overlay_vector.setMap(map) ;			
		}
	}
	
	function change_image() {
		curr_img = curr_img + 1 ; 
		if (curr_img > framesForecast) curr_img = 0 ; 
		
		refresh_overlay() ;
	}
	
	var timid ; 
	var animating = false ;
	
	function animate_start() {
		if (animating == true){
			clearInterval(timid);
			animating = false ;
			document.getElementById("animate_img").innnerHTML="animate";
		}
		else{	
			animating = true ;
			timid = setInterval(change_image, 400);
			document.getElementById("animate_img").innnerHTML="Stop";
			document.getElementById("animate_img").value="Stop";
			
		}
	}
	
	function animate_do(){
		console.log('animating') ;
		change_image() ;
		timid = setTimeout(animate_do, 100);
	}
	
	// JQuery events
	$('#back_btn').on('click', function (e) {
		curr_img = curr_img - 1 ; 
		if (curr_img < 0) curr_img = framesForecast ;	
		refresh_overlay() ;
	})
	$('#next_btn').on('click', function (e) {
		curr_img = curr_img + 1 ; 
		if (curr_img > framesForecast) curr_img = 0 ;
		refresh_overlay() ;
	})	
	$('#play_btn').on('click', function (e) {
		animating = true ;
		timid = setInterval(change_image, 400);
		$('#play_btn').prop('disabled', true);
	})	
	$('#stop_btn').on('click', function (e) {
		clearInterval(timid);
		animating = false ;
		$('#play_btn').prop('disabled', false);
	})		
	$('#ret_btn').on('click', function(e){
		$('#ret_btn').button('toggle') ;
		show_graticule = ! show_graticule  ;
		if (show_graticule){
			grid_overlay.show() ;
		} else {
			grid_overlay.hide() ;
		}
		grid_overlay.draw() ;
	}) 
	$('#vect_btn').on('click', function (e) { 
		$('#vect_btn').button('toggle') ;
		show_vector = !show_vector ; 
		if (show_vector) {
			overlay_vector.image_ = img_src_vec.files[curr_forecast_day][curr_prof][curr_img] ;
			overlay_vector.setMap(map) ;
		}else{
			overlay_vector.setMap(null) ; 
		}
		overlay_vector.draw() ;
	} )
	// JQuery events EOF
	
	
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
	
	
