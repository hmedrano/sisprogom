
function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}


// Metodos de la proyeccion mercator, de punto a lat,lng y viceversa.
function MercatorProjection() {
    var MERCATOR_RANGE = 256;
    this.pixelOrigin_ = new google.maps.Point(MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
    this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
    this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
};

MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
    var me = this;

    var point = opt_point || new google.maps.Point(0, 0);

    var origin = me.pixelOrigin_;
    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromDivPixelToLatLng = function(pixel, zoom) {
    var me = this;

    var origin = me.pixelOrigin_;
    var scale = Math.pow(2, zoom);
    var lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_;
    var latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_;
    var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};


function loadWMS(map, baseURL, customParams, wmsTileS){
    var tileHeight = 256;
    var tileWidth = 256;
    var opacityLevel = 1.0;
    var isPng = true;
    var minZoomLevel = 2;
    var maxZoomLevel = 28;

    //var baseURL = "";
    var wmsParams = [
    "REQUEST=GetMap",
    "SERVICE=WMS",
    "VERSION=1.1.1",
    "TRANSPARENT=TRUE",
    "SRS=EPSG:4326", 
    "FORMAT=image/png",
    "WIDTH="+ wmsTileS,
    "HEIGHT="+ wmsTileS
    ];

    // Se agregan los parametros adicionales
    var wmsParams = wmsParams.concat(customParams);

    var overlayOptions =
    {
        getTileUrl: function(coord, zoom)
        {
            // 256 x 256 points , for google map tile.
            var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
            var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);

            var projectionMap = new MercatorProjection();

            var lULg = projectionMap.fromDivPixelToLatLng(lULP, zoom);
            var lLRg  = projectionMap.fromDivPixelToLatLng(lLRP, zoom);

            var lUL_Latitude = lULg.lat();
            var lUL_Longitude = lULg.lng();
            var lLR_Latitude = lLRg.lat();
            var lLR_Longitude = lLRg.lng(); 

            // Correccion, si se cruza la longitude -180. 
            if (lLR_Longitude < lUL_Longitude){
              lLR_Longitude = Math.abs(lLR_Longitude);
            }
            var urlResult = baseURL + wmsParams.join("&") + "&bbox=" + lUL_Longitude + "," + lUL_Latitude + "," + lLR_Longitude + "," + lLR_Latitude;
            console.log(urlResult) ; 

            return urlResult;
        },

        tileSize: new google.maps.Size(tileHeight, tileWidth),

        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel,
        opacity: opacityLevel,
        isPng: isPng
    };

    overlayWMS = new google.maps.ImageMapType(overlayOptions); 
    map.overlayMapTypes.insertAt(0, overlayWMS);

    
}
