// jsfiddle.net - requires resource
// https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js

const numberOfMarkers = 600; // Specify the number of markers here

const data = {
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
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("font", "10px sans-serif")
  .style("user-select", "none");

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
  .attr("fill", d => d.children ? "#00000000" : "#0000ff33");
