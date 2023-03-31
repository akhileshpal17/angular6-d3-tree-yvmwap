import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Input,
  SimpleChanges,
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-d3-tree',
  templateUrl: './d3-tree.component.html',
  styleUrls: ['./d3-tree.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class D3TreeComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() sourceData: {};

  margin = { top: 20, right: 80, bottom: 200, left: 5 };
  width = 800;
  height = 1000;
  rectW = 200;
  rectH = 40;
  svg: any;
  treeGrp: any;
  treeData: any;
  element: any;
  treemap: any;
  transitionDelay = 500;

  constructor() {}

  ngOnInit() {
    console.log(this.sourceData);
    this.element = this.chartContainer.nativeElement;

    // declares a tree layout and assigns the size
    this.treemap = d3
      .tree()
      .size([
        this.height - this.margin.top - this.margin.bottom,
        this.width - this.margin.left - this.margin.right,
      ]);

    // assigns the data to a hierarchy using parent-child relationships
    this.treeData = d3.hierarchy(this.sourceData);

    // sets all nodes in a path to active where the child is active
    this.treeData.leaves().forEach((d) => {
      if (d.data.active) {
        d.ancestors().forEach((d) => (d.data.active = true));
      }
    });

    // maps the node data to the tree layout, adds x and y values
    // this.treeData = this.treemap(this.treeData);

    this.treeData.children.forEach(this.collapseInactive);

    // append the svg object to the body of the page
    this.svg = d3
      .select(this.element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.drawTree();

    //this.drawGrid();
  }

  collapseInactive = (d) => {
    if (!d.data.active && d.children) {
      d._children = d.children;
      d._children.forEach(this.collapseInactive);
      d.children = null;
    } else if (d.data.active && d.children) {
      d.children.forEach(this.collapseInactive);
    }
  };

  collapseChildren = (d, i) => {
    console.log(d, i);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    this.updateTreeMap();
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.sourceData.previousValue) {
      let oldTree = d3.hierarchy(changes.sourceData.previousValue);
      let newTree = d3.hierarchy(changes.sourceData.currentValue);

      newTree.leaves().forEach((d) => {
        if (d.data.active) {
          d.ancestors().forEach((d) => (d.data.active = true));
        }
      });

      // this.treeData = this.treemap(newTree);

      newTree.children.forEach(this.collapseInactive);
      this.treeData = newTree;

      this.updateTreeMap();
    }
  }

  drawTree() {
    this.treeData = this.treemap(this.treeData);

    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.treeGrp = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    // adds each node as a group
    let node = this.treeGrp
      .selectAll('.node')
      .data(this.treeData.descendants())
      .enter()
      .append('g')
      .attr(
        'class',
        (d: any) => 'node' + (d.children ? ' node-branch' : ' node-leaf')
      )
      .attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')')
      .on('click', this.collapseChildren);

    // adds the circle to the node
    node.append('circle').attr('r', 5);

    node
      .append('rect')
      .attr('width', this.rectW)
      .attr('height', this.rectH)
      .attr('y', -1 * (this.rectH / 2))
      .attr('x', -1 * (this.rectW / 2))
      .style('opacity', 0.2)
      .style('fill', (d: any) => (d.data.active ? 'red' : 'blue'));

    // adds the text to the node
    node
      .append('text')
      .attr('dy', '.35em')
      .text((d: any) => `${d.data.name} ${d.data.active ? 'active' : ''}`);

    // adds the links between the treeData
    let link = this.treeGrp
      .selectAll('.link')
      .data(this.treeData.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        return (
          'M' +
          d.x +
          ',' +
          d.y +
          'C' +
          (d.x + d.parent.x) / 2 +
          ',' +
          d.y +
          ' ' +
          (d.x + d.parent.x) / 2 +
          ',' +
          d.parent.y +
          ' ' +
          d.parent.x +
          ',' +
          d.parent.y
        );
      });

    // adds text labels on the branches of the tree
    let linkText = this.treeGrp
      .selectAll('.link-text')
      .data(this.treeData.links());

    let linkTextGrp = linkText
      .enter()
      .append('g')
      .attr('class', 'link-text')

      .attr('transform', (d: any) => {
        return (
          'translate(' +
          (d.source.x + d.target.x) / 2 +
          ',' +
          (d.source.y + d.target.y) / 2 +
          ')'
        );
      });

    linkTextGrp
      .append('text')
      .attr('dy', '.35em')
      .text((d: any) => {
        // if (d.data.name && d.data.active !== undefined) {
        return `${d.target.data.label}`;
        //}
        // return '';
      });
  }

  updateTreeMap() {
    this.treeData = this.treemap(this.treeData);

    let node = this.treeGrp
      .selectAll('.node')
      .data(this.treeData.descendants());

    // For the creation of new nodes if any
    let nodeEnter = node
      .enter()
      .append('g')
      .attr(
        'class',
        (d: any) => 'node' + (d.children ? ' node-branch' : ' node-leaf')
      )
      .attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')')
      .on('click', this.collapseChildren);

    nodeEnter
      .append('rect')
      .attr('width', this.rectW)
      .attr('height', this.rectH)
      .attr('y', -1 * (this.rectH / 2))
      .attr('x', -1 * (this.rectW / 2))
      .style('opacity', 0.2)
      .style('fill', (d: any) => (d.data.active ? 'red' : 'blue'));

    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .text((d: any) => `${d.data.name} ${d.data.active ? 'active' : ''}`);

    // merge new nodes and update
    let nodeUpdate = nodeEnter.merge(node);

    // Update existing nodes to new positions
    nodeUpdate //.transition().duration(this.transitionDelay)
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

    // node.enter().transition().call(endall, function(){console.log('all done')})

    // Update the highlighed active path
    nodeUpdate
      .select('rect') //.transition().duration(this.transitionDelay)
      .style('fill', (d: any) => (d.data.active ? 'red' : 'blue'));

    // Update the text in the nodes
    nodeUpdate
      .select('text') //.transition().duration(this.transitionDelay)
      .text((d: any) => `${d.data.name} ${d.data.active ? 'active' : ''}`);

    // remove any orphaned nodes
    node
      .exit() //.transition().duration(this.transitionDelay)
      .style('opacity', 0)
      .remove();

    // Update the links
    let link = this.treeGrp
      .selectAll('.link')
      .data(this.treeData.descendants().slice(1));

    // Add any new links required
    let linkEnter = link
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        return (
          'M' +
          (d.x - this.rectW / 2) +
          ' ' +
          d.y +
          ' C ' +
          (d.x + d.parent.x) / 2 +
          ' ' +
          d.y +
          ', ' +
          (d.x + d.parent.x) / 2 +
          ' ' +
          d.parent.y +
          ', ' +
          (d.parent.x + this.rectW / 2) +
          ' ' +
          d.parent.y
        );
      });

    // merge new nodes and update
    let linkUpdate = linkEnter.merge(link);

    // transition existing links to new positions
    linkUpdate //.transition().duration(this.transitionDelay)
      .attr('d', (d: any) => {
        return (
          'M' +
          d.x +
          ' ' +
          d.y +
          ' C ' +
          (d.x + d.parent.x) / 2 +
          ' ' +
          d.y +
          ', ' +
          (d.x + d.parent.x) / 2 +
          ' ' +
          d.parent.y +
          ', ' +
          d.parent.x +
          ' ' +
          d.parent.y
        );
      });

    // remove any orphaned links
    link
      .exit() //.transition().duration(this.transitionDelay)
      .style('opacity', 0)
      .remove();
  }
}
