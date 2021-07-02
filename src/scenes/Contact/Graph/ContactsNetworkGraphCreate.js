import { getFormattedDataFromContacts } from "./ContactsNetworkUtil";
import * as d3 from "d3";

let height = 1000;
let width = 1000;
let maxRadius = 40;

const drag = simulation => {

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}


const keepInBound = node => {
    node.x = Math.max(maxRadius, Math.min(width - maxRadius, node.x))
    node.y = Math.max(maxRadius, Math.min(height - maxRadius, node.y))

    return `translate(${node.x},${node.y})`
}

export function graph(contacts, settings, onNodeClick){
    const { isNodeImage, showArrows } = settings;

    let data = getFormattedDataFromContacts(contacts);

    const links = data.links;
    const nodes = data.nodes;

    const simulation = d3.forceSimulation(nodes)
        // Read https://www.d3indepth.com/force-layout/ for more info about force
        .force("link", d3.forceLink(links).id(d => d.id).distance(30)) //default is 30
        .force("charge", d3.forceManyBody().strength(-30)) // default is -30
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 22)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", '#999')
        .attr("d", 'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.8)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))

     if (showArrows) {
         link.attr("marker-end", "url(#arrow)")
     }

    const node = svg.append("g")
        .selectAll("g-nodes")
        .data(nodes)
        .join("g")
        .attr("class", "g-nodes")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("style", "cursor: hand;")

    if (isNodeImage) {
        // Add image
        node.append("image")
            .attr("xlink:href", d => d.data.profile_pic_url)
            .attr("width", d => d.node_size)
            .attr("height", d => d.node_size)
            .attr("style", "border-radius: 50%;") // should make image become circular
            // Centers image so that edge comes out from the middle
            .attr("x", d => - d.node_size/2)
            .attr("y", d => - d.node_size/2);
    } else {
        // Add circle
        node.append("circle")
            .attr("r", d => d.node_size/2)
            .attr('fill', '#6baed6');
    }

    // const text = node.append("text")
    //     .attr("x", d => d.x)
    //     .attr("y", d => d.y)
    //     .text(d => d.data.organization_name);

    // Set dx and dy to be (1/2)*width and  (width + 5) respectively of the node image on hover 
    node.append("text")
    .style('text-anchor', 'middle')
    .attr("dx", 25)
    .attr("dy", 55)
    .style('stroke', 'black')
    .style('stroke-width', 0)
    .style('font-size', '14px')
    .text((d) => d.data.organization_name);

    node.append("title")
        .text(d => `@${d.data.instagram_username}`);

    node.on("click", (event, node) => {
        onNodeClick(node)
    })

    node.call(drag(simulation));

    simulation.on("tick", () => {
        node
            .attr("transform", d => keepInBound(d))

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    });

    return svg.node()
}


