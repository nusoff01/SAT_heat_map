d3.xml("../maps/New_York_City_District_Map.svg").mimeType("image/svg+xml").get(function(error, xml) {
   if (error) throw error;
   body_width = $("body").width();
   body_height = $("body").height();
   console.log("body height: " + body_height)
   svg_map = xml.documentElement;

   svg_map.setAttribute("height", body_height * .8);
   svg_map.setAttribute("width", body_width * .8);
   // $("#map_container").css("width", body_width * .8).css("margin", "0 auto")

   d3.select("#map_container").node().appendChild(svg_map);
   colorMap();
   
});

function coords_to_x_y(latitude, longitude) {
	x_slope = 4285.98641184
	x_int = 318362.504604
	x =  Math.floor(x_int + (x_slope * latitude))

	y_slope = -5916.07505916
	y_int = 242108.76704
	y = Math.floor(y_int + (y_slope * longitude))

	return {x: x, y: y}
}

function score_to_color(score, db_id) {
	degree = Math.abs(500 - score)
	var color_string_start = ""
	if(score < 500){
		red = 255
		green = 255 - score
		blue = 255 - score
	} else {
		red = 255 - score
		green = 255
		blue = 255 - score
	}
	color_string_start = "rgba(" + red + ", " + green + ", " + blue + ", ";
	var defs = d3.select("#defs5");
	defs.append("radialGradient")
		.attr("id", "sun-gradient-" + db_id)
		.attr("cx", "50%")	//not really needed, since 50% is the default
		.attr("cy", "50%")	//not really needed, since 50% is the default
		.attr("r", "50%")	//not really needed, since 50% is the default
		.selectAll("stop")
		.data([
				{offset: "0%", color: color_string_start + "1)"},
				{offset: "20%", color: color_string_start + ".25)"},
				{offset: "40%", color: color_string_start + ".08)"},
				{offset: "60%", color: color_string_start + ".06)"},
				{offset: "80%", color: color_string_start + ".04)"},
				{offset: "100%", color: color_string_start + ".01)"},
			])
		.enter().append("stop")
		.attr("offset", function(d) { return d.offset; })
		.attr("stop-color", function(d) { return d.color; });

}

function create_gradients(defs, svg) {

	var scale_width = 1400

	var gradient_lower = defs.append("linearGradient")
						    .attr("id", "under-500")
						    .attr("x1", "0%")
						    .attr("x2", "100%")
						    .attr("spreadMethod", "pad");

	gradient_lower.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "red")
	    .attr("stop-opacity", 1);

	gradient_lower.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "white")
	    .attr("stop-opacity", 1);

	svg.append("rect")
	    .attr("width", scale_width / 2)
	    .attr("height", 100)
	    .attr("y", 50)
	    .style("fill", "url(#under-500)");



	var gradient_upper = defs.append("linearGradient")
						    .attr("id", "over-500")
						    .attr("x1", "0%")
						    .attr("x2", "100%")
						    .attr("spreadMethod", "pad");

	gradient_upper.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "white")
	    .attr("stop-opacity", 1);

	gradient_upper.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "green")
	    .attr("stop-opacity", 1);

	svg.append("rect")
	    .attr("width", scale_width / 2)
	    .attr("height", 100)
	    .attr("x", 700)
	    .attr("y", 50)
	    .style("fill", "url(#over-500)");

	svg.append("text")
		.attr("x", 20)
		.attr("y", 220)
                 .text( "200")
                 .attr("font-family", "helvetica")
                 .attr("font-size", "50px")
                 .attr("fill", "black");

    svg.append("text")
		.attr("x", scale_width - 100)
		.attr("y", 220)
                 .text( "800")
                 .attr("font-family", "helvetica")
                 .attr("font-size", "50px")
                 .attr("fill", "black");

    svg.append("text")
    	.attr("x", scale_width / 2)
		.attr("y", 300)
                 .text("SAT Score Color Scale")
                 .attr("font-family", "helvetica")
                 .attr("font-size", "50px")
                 .attr("text-anchor", "middle")
                 .attr("fill", "black");

}

function colorMap() {
	var defs = d3.select("#defs5");
	var svg = d3.select("svg")

	$.getJSON( "../geo_data/school_data.json", function( data ) {
  	  console.log(data)
  	  var g = svg.append("g")
  	  				.attr("clip-path", "url(#clippy)")

  	  for( var key in data){
  	  	var school = data[key]
  	  	var x_y = coords_to_x_y(school["lat"], school["long"]);

  	  	average_score = Math.floor((parseInt(school["writing"]) + 
  	  								parseInt(school["math"]) + 
  	  								parseInt(school["reading"])) / 3)
  	  	console.log(average_score)

  	  	score_to_color(average_score, key)
  	  	g.append("circle")
				.attr("r", school["num_takers"])
				.attr("cx", x_y["x"])
				.attr("cy", x_y["y"])
				.style("fill", "url(#sun-gradient-" + key + ")");

  	  }
  	});

  	create_gradients(defs, svg);
}