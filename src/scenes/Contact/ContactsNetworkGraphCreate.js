import { getFormattedDataFromContacts } from "./ContactsNetworkUtil";
import * as d3 from "d3";

let height = 1000;
let width = 1000;
let maxRadius = 20;

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


export function graph(contacts, onNodeClick){
    let data = getFormattedDataFromContacts(contacts);

    const links = data.links;
    const nodes = data.nodes;

    console.log({data, links, nodes});

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("marker-end", "url(#arrow)")

    const node = svg.append("g")
        .selectAll("g-nodes")
        .data(nodes)
        .join("g")
        .attr("class", "g-nodes")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)



    /*
    const circle = node.append("circle")
        .attr("fill", '#ff0000')
        .attr("r", (d) => getCirlcleSize(d))
    */

    const image = node.append("image")
        .attr("xlink:href", d => d.profile_pic_url)
        .attr("width", d => d.image_size)
        .attr("height", d => d.image_size);

    /*
    const text = node.append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.id);
    */

    node.append("title")
        .text(d => d.id);

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
            .attr("cx", d => Math.max(maxRadius, Math.min(width - maxRadius, d.x)))
            .attr("cy", d => Math.max(maxRadius, Math.min(height - maxRadius, d.y)));

        image
            .attr("x", d => (d.x - d.image_size / 2))
            .attr("y", d => (d.y - d.image_size / 2))
    });

    // d3.invalidation.then(() => simulation.stop());

    return svg.node()
}
