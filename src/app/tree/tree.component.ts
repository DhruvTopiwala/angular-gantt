import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { PositionNode } from './position-node';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  public POSITION_DATA: PositionNode[] = [
    {
      name: 'SevOne',
      isChild: false,
      children: [
        {
          name: 'SevOne NMS',
          isChild: false,
          children: [
            {
              name: 'Engineering Manager',
              isChild: true,
              children: [],
              isExpanded: false,
              level:2,
              positionCode:'EM-01',
            },
            {
              name: 'Associate Software Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level:2,
              positionCode:'ASE-01',
            },
            {
              name: 'Senior Software Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level:2,
              positionCode:'SSE-01',
            },
          ],
          isExpanded: false,
          level:1,
          positionCode:'NMS',
        },
      ],
      isExpanded: false,
      level:0,
      positionCode:'SEV',
    },
    {
      name: 'eCarVault',
      isChild: false,
      children: [],
      isExpanded: false,
      level:0,
      positionCode:'ECV',
    },
  ];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
