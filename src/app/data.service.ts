import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  isExpanded = false;
  constructor() {}

  getData() {
    return {
      name: 'Root Node',
      children: [
        {
          name: 'Decision Node',
          //rule: 'Yes',
          label: 'Yes',
          children: [
            {
              name: 'Leaf Node',
              // rule: 'Yes',
              //label: 'Branch Label 2',
            },
            {
              name: 'Decision Node',
              //rule: 'No',
              //label: 'Branch Label 3',
              children: [
                {
                  name: 'Leaf Node',
                  //rule: 'Yes',
                  //label: 'Branch Label 4',
                },
                {
                  name: 'Leaf Node',
                  //rule: 'Yes',
                  //label: 'Branch Label 5',
                },
              ],
            },
          ],
        },
        {
          name: 'Decision Node',
          rule: 'No',
          label: 'No',
          children: [
            {
              name: 'Leaf Node',
              //rule: 'Yes',
              //label: 'Branch Label 6',
            },
            {
              name: 'Leaf Node',
              //rule: 'Yes',
              //label: 'Branch Label 7',
            },
          ],
        },
      ],
    };
  }
}
