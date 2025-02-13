// jsfiddle.net - requires resource
// https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js

const numberOfMarkers = 500; // Specify the number of markers here

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
    const isValid = !isNearBorder(d, layerRadii);

    // Set fill color based on proximity to layer radii
    return d.children ? "#00000000" : (isValid ? "#0000ff33" : "#ff000033");
  });

// Draw the horizontal line
svg.append("line")
  .attr("x1", 0)
  .attr("y1", height / 2)
  .attr("x2", width)
  .attr("y2", height / 2)
  .attr("stroke", "white")
  .attr("stroke-width", 4);

// Draw the vertical line
svg.append("line")
  .attr("x1", width / 2)
  .attr("y1", 0)
  .attr("x2", width / 2)
  .attr("y2", height)
  .attr("stroke", "white")
  .attr("stroke-width", 4);

// Function to check if a node is near any layer radius or border
function isNearBorder(node, layerRadii) {
  const distanceToCenter = Math.sqrt(Math.pow(node.x - width / 2, 2) + Math.pow(node.y - height / 2, 2));
  const toleranceForBorders = node.r * 1.5;

  // Check proximity to layer radii
  const nearLayer = layerRadii.some(radius =>
    distanceToCenter >= (radius - node.r) && distanceToCenter <= (radius + node.r)
  );

  // Check proximity to horizontal and vertical borders
  const nearHorizontalBorder = Math.abs(node.y - (height / 2)) <= toleranceForBorders;
  const nearVerticalBorder = Math.abs(node.x - (width / 2)) <= toleranceForBorders;

  return nearLayer || nearHorizontalBorder || nearVerticalBorder;
}