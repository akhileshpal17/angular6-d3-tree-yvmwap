import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-collapsible-tree',
  templateUrl: './d3-collapsible-tree.component.html',
  styleUrls: ['./d3-collapsible-tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class D3CollapsibleTreeComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    const element = this.chartContainer.nativeElement;

    let sourceData = this.dataService.getData();
    console.log(sourceData);

    // set the dimensions and margins of the diagram
    let margin = { top: 20, right: 100, bottom: 20, left: 100 },
      width = 1200, //- margin.left - margin.right,
      height = 800 //- margin.top - margin.bottom;

    let i = 0,
      duration = 750,
      treeData;

    let svg = d3.select(element).append("svg")
      .attr("width", width)
      .attr("height", height);

    // treemap function
    let treemap = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    // Assigns parent, children, height, depth
    treeData = d3.hierarchy(sourceData, (d: any) => d.children);
    treeData.x0 = height / 2;
    treeData.y0 = 0;
    console.log(treeData)

    // Assigns the x and y position for the nodes
    treeData = treemap(treeData);

    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    // Compute the new tree layout.
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    console.log(nodes)
    console.log(links)

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = svg.selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++i));

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      // .attr("transform", function (d) {
      //   return "translate(" + source.y0 + "," + source.x0 + ")";
      // })
    //   .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // // Add labels for the nodes
    // nodeEnter.append('text')
    //   .attr("dy", ".35em")
    //   .attr("x", function (d) {
    //     return d.children || d._children ? -13 : 13;
    //   })
    //   .attr("text-anchor", function (d) {
    //     return d.children || d._children ? "end" : "start";
    //   })
    //   .text(function (d) { return d.data.name; });

  }





}