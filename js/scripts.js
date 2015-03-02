// JavaScript Document

$(document).ready(function(){
	$.datepicker.regional['es'] = {
                closeText: 'Cerrar',
                prevText: '&#x3c;Ant',
                nextText: 'Sig&#x3e;',
                currentText: 'Hoy',
                monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
                monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
                'Jul','Ago','Sep','Oct','Nov','Dic'],
                dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
                dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
                dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
                weekHeader: 'Sm',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''};
  
	$.datepicker.setDefaults($.datepicker.regional['es']);
				
	$('#datepicker').datepicker({
			dateFormat: "d 'de' MM 'de' yy",
			beforeShowDay: availableDate,
			onSelect: updateDate,
			numberOfMonths: 1,
			
	});
	
	
	$( "#slider" ).slider({
      min: 0,
      max: profundidades.length - 1,
      slide: updateDeep,
		});

});

function updateDate(value){     
    $('#fecha_calendar').empty();
		$('#fecha_calendar').append(value);
		
		pos=$.inArray(value, titulo_pronostico);
		history_change(pos);
}


function updateDeep( event, ui ) {
		$( "#deep" ).empty();
		$( "#deep" ).append("Profundidad: " + profundidades[ui.value]);		
		prof_change(ui.value);
}

function availableDate(date) 
{
		dmy = date.getDate() + " de " + (getMonthName(date)) + " de " + date.getFullYear();
		if ($.inArray(dmy, titulo_pronostico) == -1) 
		{
				return [false, ""];
		} 
		else 
		{		
				return [true, "", "Available"];
		}
}

function getMonthName(date)
{
	monthNames=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	return monthNames[date.getMonth()];
}