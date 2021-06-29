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
        event.subject.fx = null;
        event.subject.fy = null;
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

export function graph(contacts, onNodeClick){
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
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", '#000')
        .attr("d", d =>'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.8)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("marker-end", "url(#arrow)")

    const node = svg.append("g")
        .selectAll("g-nodes")
        .data(nodes)
        .join("g")
        .attr("class", "g-nodes")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)

    // Add image
    node.append("image")
        .attr("xlink:href", d => d.data.profile_pic_url)
        .attr("width", d => d.image_size)
        .attr("height", d => d.image_size)
        // Centers image so that edge comes out from the middle
        .attr("x", d => - d.image_size/2)
        .attr("y", d => - d.image_size/2);

    // Add circle
    // node.append("circle")
    //     .attr("r", d => d.image_size/2)
    //     .attr('fill', '#6baed6');


    // const text = node.append("text")
    //     .attr("x", d => d.x)
    //     .attr("y", d => d.y)
    //     .text(d => d.data.organization_name);


    node.append("title")
        .text(d => d.data.organization_name);

    node.on("click", (event, node) => {
        onNodeClick(node)
    })

    node.call(drag(simulation));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => keepInBound(d))
    });

    return svg.node()
}


