
METADATOS con WMS

---------------------------------------------------------------------------------------------------------------------------------------------
"layerDetails"   Obtener detalles de una capa (variable)

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc?REQUEST=GetMetadata&item=layerDetails&layerName=TEMPERATURE&time=2015-03-03T12:53:11Z

Entrega
{
 "units":"Celsius",
 "bbox":["-97.69999694824219","15.600000381469727","-79.0","30.54087257385254"],
 "scaleRange":["-5.15","34.85"],
 "numColorBands":20,
 "supportedStyles":["boxfill"],
 "zaxis":{"units":"meters","positive":false,"values":[-2,-10,-20,-30,-50,-75,-100,-150,-200,-300,-400,-600,-800,-1000,-1200,-1500,-2000,-3000,-4000,-5000]},
 "datesWithData": 
                  { 
                  	 "2015": {
                  	 	       "2": [2,3,4,5,6,7]
                  	 	     }
                  },
 "nearestTimeIso":"2015-03-03T12:00:00.000Z",
 "timeAxisUnits":"ISO8601",
 "moreInfo":"",
 "copyright":"",
 "palettes":["redblue","alg","alg2","ncview","greyscale","occam","rainbow","sst_36","ferret","occam_pastel-30"],
 "defaultPalette":"rainbow",
 "logScaling":false
}


---------------------------------------------------------------------------------------------------------------------------------------------
"minmax"     Obtener valores maximos y minimos para la escala de color para una capa.

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc?REQUEST=GetMetadata&item=minmax&LAYERS=TEMPERATURE&ELEVATION=-2&SRS=EPSG:4326&BBOX=-97.912156677246,15.60000038147,-78.787840270996,30.540872573854&WIDTH=256&HEIGHT=256

Entrega
{ 
 "min":11.995589,
 "max":27.448944
}


---------------------------------------------------------------------------------------------------------------------------------------------
"timesteps"

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc?REQUEST=GetMetadata&item=timesteps&layerName=TEMPERATURE&day=2015-03-02T00:00:00.00Z

Entrega
{ 
 "timesteps":["00:00:00.000Z","12:00:00.000Z"]
}


---------------------------------------------------------------------------------------------------------------------------------------------
"animationTimesteps"

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc?REQUEST=GetMetadata&item=animationTimesteps&layerName=TEMPERATURE&start=2015-03-02T00:00:00.00Z&end=2015-03-07T12:00:00.00Z

Entrega
{ 
 "timeStrings":[ 
                {
                   "title":"Full (12 frames)",
                   "timeString":"2015-03-02T00:00:00.00Z/2015-03-07T12:00:00.00Z"}, 
                      {
                      	"title":"Daily (6 frames)",
                      	"timeString":"2015-03-02T00:00:00.000Z,2015-03-03T00:00:00.000Z,2015-03-04T00:00:00.000Z,2015-03-05T00:00:00.000Z,2015-03-06T00:00:00.000Z,2015-03-07T00:00:00.000Z"
                      }
               ]
}


---------------------------------------------------------------------------------------------------------------------------------------------
"menu"

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc?REQUEST=GetMetadata&item=menu

{ 
 "label":"Catalogo Thredds CICESE",
 "children":[
   { "label":"FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150302.nc",
     "children": [ 
                   {"id":"SSH","label":"sea_surface_height_above_geoid"},
                   {"id":"SALINITY","label":"sea_water_salinity"},
                   {"id":"TEMPERATURE","label":"sea_water_temperature"},
                   {"id":"UCOMP_X","label":"eastward_sea_water_velocity"},
                   {"id":"VCOMP_Y","label":"northward_sea_water_velocity"},
                   {"id":"sea_water_velocity","label":"sea_water_velocity"}
                 ]
    }
 ]
}


---------------------------------------------------------------------------------------------------------------------------------------------
"GetFeatureInfo"

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc?REQUEST=GetFeatureInfo&SERVICE=WMS&VERSION=1.1.1&QUERY_LAYERS=TEMPERATURE&TIME=2015-02-27T00:00:00.000Z&CRS=EPSG:4326&SRS=EPSG:4326&ELEVATION=-2&X=700&Y=196&BBOX=-101.1728515625,24.971950563885322,-58.765625,31.86434076019342&WIDTH=1930&HEIGHT=357&INFO_FORMAT=text/xml

Regresa xml

<FeatureInfoResponse>
 <longitude>-85.055908203125</longitude>
 <latitude>25.072089172175954</latitude>
 <iIndex>253</iIndex>
 <jIndex>202</jIndex>
 <gridCentreLon>-85.05000305175781</gridCentreLon>
 <gridCentreLat>25.0585994720459</gridCentreLat>
  <FeatureInfo> 
   <time>2015-02-27T00:00:00.000Z</time>
   <value>22.546618</value>
  </FeatureInfo>
</FeatureInfoResponse>


---------------------------------------------------------------------------------------------------------------------------------------------
"GetTransect"

http://cic-pem.cicese.mx:8080/thredds/wms/cdmdata/MODELOScdm/CIRCULACION/ROMS_RUTGERS/FORECAST_ROMSRUTGERS_GOLFOMEXICO_20150227.nc?REQUEST=GetTransect&LAYER=TEMPERATURE&CRS=EPSG:4326&ELEVATION=-2&TIME=2015-03-04T00:00:00.000Z&LINESTRING=-93.952825546265%2027.702106857301,-94.064882087707%2021.202827453614&FORMAT=image/png&COLORSCALERANGE=-5.15,34.85&NUMCOLORBANDS=20&LOGSCALE=false&PALETTE=rainbow&VERSION=1.1.1

