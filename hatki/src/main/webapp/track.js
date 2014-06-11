var map;

function init() {
    map = new OpenLayers.Map('map', {
        projection: 'EPSG:3857',
        layers: [
            new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.SATELLITE}
            ),
            new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {numZoomLevels: 20}
            ),
            new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
            ),
            new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            )
        ],
        center: new OpenLayers.LonLat(10.2, 48.9)
            // Google.v3 uses web mercator as projection, so we have to
            // transform our coordinates
            .transform('EPSG:4326', 'EPSG:3857'),
        zoom: 5
    });
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    
   //--------------------ADD A MARKER
    map.addLayer(new OpenLayers.Layer.OSM());
 
    var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
          );
    
    var lonLat1 = new OpenLayers.LonLat( -0.8089788 ,51.5097333 )
    .transform(
      new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
      map.getProjectionObject() // to Spherical Mercator Projection
    );
 
    var zoom=16;
 
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
 
    markers.addMarker(new OpenLayers.Marker(lonLat));
    markers.addMarker(new OpenLayers.Marker(lonLat1));
 
    map.setCenter (lonLat, zoom);
    //-----------------------------------------
    
    //---------ADD THE POPUP
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
    		lonLat, null,
            '<a target="_blank" href="http://openlayers.org/">We</a> ' +
            'could be here.<br>Or elsewhere.', null,
            true // <-- true if we want a close (X) button, false otherwise
        );
     map.addPopup(popup);
    //-----------Add a line between points----------
    
     var lineLayer = new OpenLayers.Layer.Vector("Line Layer"); 

     map.addLayer(lineLayer);                    
     map.addControl(new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path));                                     
     var points = new Array(
    	        (new OpenLayers.Geometry.Point(-0.1279688 ,51.5077286)).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
    	        (new OpenLayers.Geometry.Point(-0.8089788 ,51.5097333)).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
    	    );

     var line = new OpenLayers.Geometry.LineString(points);

     var style = { 
       strokeColor: '#0000ff', 
       strokeOpacity: 0.5,
       strokeWidth: 5
     };

     var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
     lineLayer.addFeatures([lineFeature]);
     map.addLayer(lineLayer);
     //Add gpx track
     var lgpx = new OpenLayers.Layer.Vector("PARSER LINE", {
         strategies: [new OpenLayers.Strategy.Fixed()],
         protocol: new OpenLayers.Protocol.HTTP({
             url: "http://www.topografix.com/fells_loop.gpx",
             format: new OpenLayers.Format.GPX()
         }),
         style: {strokeColor: "red", strokeWidth: 3, strokeOpacity: 0.8},
         projection: new OpenLayers.Projection("EPSG:4326")
     });

     map.addLayer(lgpx);
    // add behavior to html
    var animate = document.getElementById("animate");
    animate.onclick = function() {
        for (var i=map.layers.length-1; i>=0; --i) {
            map.layers[i].animationEnabled = this.checked;
        }
    };
    
}