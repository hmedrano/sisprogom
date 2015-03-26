
function flotDirRose( dMag, dDir , holder ) { 

	/* Convertir los arreglos de dMag y dDir al formato de flot rose, 
	   Asignando etiquetas para rango de valores. 	
	*/

	nrangos = 4 ; 
	sectorW = 22.5 ; 
	sectors = 16 ; 
	rangos = [] ;  // Que se convertiran en las etiqutas para flot rose, o labels

	// Colores
	var rainbow = new Rainbow(); 
	rainbow.setNumberRange(0, nrangos-1);
	rainbow.setSpectrum('blue','green','yellow','red');	

	// Min, Max maginitud
	maxMag = Math.max.apply(null, dMag); 
	minMag = Math.min.apply(null, dMag);  

	rangodelta = (maxMag - minMag) / nrangos ; 
	rangos.push(minMag) ;
	for (var i=1;i<nrangos;i++) {
		rangos.push(minMag + (rangodelta*i)) ; 
	}
	rangos.push(maxMag) ;

	rosedata = [] ; 
	datadirection = [] ;

	for (var i=0;i<nrangos;i++) {
		rangeData = [] ; 
		for(var m=0; m< dMag.length ;m++) { 
			if (dMag[m] >= rangos[i] && dMag[m] <= rangos[i+1]) { 
				// Invertir dDir y definir el ancho del sector
				ss = -dDir[m] - (sectorW/2) ;
				se = -dDir[m] + (sectorW/2)
				rangeData.push([dMag[m] , ss, se]) ;
			}
		}
		rosedata.push(rangeData) ; 

		// Metadatos para el rango i 		
		var lblTitle = '' + rangos[i].toFixed(3) + ' - ' + rangos[i+1].toFixed(3) ; 
		var hexColour = rainbow.colourAt(i);
		labelInfo = { label: lblTitle , color : '#' + hexColour , data: rosedata[i] , rose: { show: true }  } ; 
		datadirection.push(labelInfo) ; 

	}

	console.log(rosedata) ; 
	console.log(datadirection) ; 	
	datadirection.reverse() ;

	// Plot options
	optionsdirection = {
	    series: { 
	        rose: { 
	            active:true,
	            drawGrid:{
	                gridMode: "ticks",
	                labelPos: 0,
	                drawValue: false
	            }, 
	            dataMin: 0,
	            dataMax: maxMag
	        } 
	    },
	    grid: {
	        font: "14px Helvetica",
	        tickLabel:["E","SEE","SE","SSE","S","SSW","SW","SWW","W","NWW","NW","NNW","N","NNE","NE","NEE"]
	    }
	};		

	$.plot($(holder),datadirection,optionsdirection)  ;

}