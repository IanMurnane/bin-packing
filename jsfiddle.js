// jsfiddle.net - requires resource
// https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js

const numberOfMarkers = 200; // Specify the number of markers here

const data = {
  name: "root",
  children: [
    {
      name: "Inner Node",
      size: 100, // Size of the inner node
    },
    ...Array.from({ length: numberOfMarkers }, (_, i) => ({
      name: i,
      size: 1,
    })),
  ],
};

const width = 600;
const height = 600;

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

const node = svg.selectAll("g")
  .data(root.descendants())
  .enter().append("g")
  .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("circle")
  .attr("r", d => d.r)
  .attr("fill", d => d.children ? "#ccc" : "#69b3a2");

node.append("text")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text(d => d.children ? d.data.name : d.data.name);