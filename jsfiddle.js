// jsfiddle.net - requires resource
// https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js

const numberOfMarkers = 850; // Specify the number of markers here

const data = {
	name: "",
  children: Array.from({ length: numberOfMarkers }, (_, i) => ({
    name: i,
    size: 1,
  })),
};

const width = 600;
const height = 600;

const layerRadii = [300, 240, 180, 120, 60];
const layerColors = ["#E4E4E4", "#C9C9C9", "#AEAEAE", "#939393", "#787878"];

const pack = d3.pack()
  .size([width, height])
  .padding(3);

const root = d3.hierarchy(data)
  .sum(d => d.size)
  .sort((a, b) => b.value - a.value);

pack(root);

const svg = d3.select("body").append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

// Draw the inner layers
layerRadii.forEach((radius, index) => {
  svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", radius)
    .attr("fill", layerColors[index]);
});

// Draw the parent node and its children
const node = svg.selectAll("g")
  .data(root.descendants())
  .enter().append("g")
  .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("circle")
  .attr("r", d => d.r)
  .attr("fill", d => {
    const isValid = !isNearRadius(d, layerRadii);

    // Set fill color based on proximity to layer radii
    return d.children ? "#00000000" : (isValid ? "#0000ff33" : "#ff000033");
  });

// Function to check if a node is near any layer radius
function isNearRadius(node, layerRadii) {
  const distanceToCenter = Math.sqrt(Math.pow(node.x - width / 2, 2) + Math.pow(node.y - height / 2, 2));
  const tolerance = node.r;
  return layerRadii.some(radius =>
    distanceToCenter >= (radius - tolerance) && distanceToCenter <= (radius + tolerance)
  );
}