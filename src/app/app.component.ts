import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { hierarchy } from 'd3'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  data: any;
  t: number;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.data = this.getData();
  }

  getData() {
    let data = this.dataService.getData();

    // randomly set a leaf node to active=true
    let leaves = [];
    let getLeafNodes = (leafNodes, obj) => {
      if (obj.children) {
        obj.children.forEach((child) => getLeafNodes(leafNodes, child));
      } else {
        leafNodes.push(obj);
      }
    }

    getLeafNodes(leaves, data)
    leaves[Math.floor(Math.random() * leaves.length)].active = true;

    return data;
  }

  updateOnce(){
    this.data = this.getData();
  }

  startUpdating() {
    this.t = setInterval(()=>{
      console.log('updating')
      this.data = this.getData();
    }, 2000);
    this.data = this.getData();
  }

  stopUpdating(){
    console.log('stopping')
    clearInterval(this.t);

  }

  ngOnDestroy() {
    clearInterval(this.t);
  }
}
