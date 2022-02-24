import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PositionNode } from '../tree/position-node';

import { BoxModel } from './box.model';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
})
export class GanttComponent {
  dragActive: boolean = false;
  timelineStartDate: Date;
  timelineEndDate: Date;
  dataSource: any = [];
  months: string[] = [];
  days: string[] = [];
  rows: number = 5;
  previousFrom: string = '';
  scrollPos:number;

  @ViewChild('container') container:ElementRef;

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
              level: 2,
              positionCode: 'EM-01',
            },
            {
              name: 'Associate Software Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level: 2,
              positionCode: 'ASE-01',
            },
            {
              name: 'Senior Software Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level: 2,
              positionCode: 'SSE-01',
            },
          ],
          isExpanded: true,
          level: 1,
          positionCode: 'NMS',
        },
      ],
      isExpanded: true,
      level: 0,
      positionCode: 'SEV',
    },
    {
      name: 'eCarVault',
      isChild: false,
      children: [
        {
          name: 'eCareVault Team',
          isChild: false,
          children: [
            {
              name: 'Senior Software Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level: 2,
              positionCode: 'SSE-01',
            },
            {
              name: 'QA Engineer',
              isChild: true,
              children: [],
              isExpanded: false,
              level: 2,
              positionCode: 'QA-01',
            },
          ],
          isExpanded: true,
          level: 1,
          positionCode: 'ECVT',
        },
      ],
      isExpanded: true,
      level: 0,
      positionCode: 'ECV',
    },
  ];

  constructor() {

    this.timelineEndDate = new Date("2022-01");
    this.timelineStartDate = new Date("2022-01");
    this.timelineStartDate.setDate(this.timelineStartDate.getDate() -1);

    this.initTimeline(true, 5);

    for (const customer of this.POSITION_DATA) {
      this.dataSource[customer.positionCode] = [];
      for (const team of customer.children) {
        this.dataSource[customer.positionCode][team.positionCode] = [];
        for (const position of team.children) {
          this.dataSource[customer.positionCode][team.positionCode][
            position.positionCode
          ] = [];
          for (const index of this.days)
            this.dataSource[customer.positionCode][team.positionCode][
              position.positionCode
            ][index] = [];
        }
      }
    }

    this.addTask(
      'SEV',
      'NMS',
      'EM-01',
      'Engineering Manager A',
      'yellow',
      '2022-1-1',
      '2022-2-5'
    );
    this.addTask(
      'SEV',
      'NMS',
      'ASE-01',
      'Software Engineer A',
      'steelblue',
      '2022-1-1',
      '2022-2-5'
    );
    this.addTask(
      'SEV',
      'NMS',
      'SSE-01',
      'Senior Software Engineer A',
      'green',
      '2022-1-1',
      '2022-1-23'
    );
    this.addTask(
      'ECV',
      'ECVT',
      'SSE-01',
      'Senior Software Engineer B',
      'green',
      '2022-1-1',
      '2022-2-5'
    );
    this.addTask(
      'ECV',
      'ECVT',
      'QA-01',
      'QA Engineer A',
      'blue',
      '2022-1-1',
      '2022-2-5'
    );
  }

  initTimeline(addAtEnd: boolean, weeks: number) {
    if (addAtEnd) {
      let tommorow: Date = new Date(this.timelineEndDate);
      for (let week = 1; week <= weeks; week++) {
        let monStart = tommorow.getMonth();
        let grpName: string = this.getMonthString(tommorow.getMonth());
        for (let day = 0; day < 7; day++) {
          const index =
            tommorow.getFullYear().toString() +
            '-' +
            (tommorow.getMonth() + 1).toString() +
            '-' +
            tommorow.getDate().toString();
          this.days.push(index);
          tommorow.setDate(tommorow.getDate() + 1);
        }
        let monEnd = tommorow.getMonth();
        if (monStart != monEnd) {
          grpName += '-' + this.getMonthString(monEnd);
        }
        grpName += '_' + week.toString();
        this.months.push(grpName);
      }
      this.timelineEndDate = new Date(tommorow);
    } else {
      let yesterday: Date = new Date(this.timelineStartDate);
      for (let week = 1; week <= weeks; week++) {
        let monStart = yesterday.getMonth();
        let grpName: string = this.getMonthString(yesterday.getMonth());
        for (let day = 0; day < 7; day++) {
          const index =
            yesterday.getFullYear().toString() +
            '-' +
            (yesterday.getMonth() + 1).toString() +
            '-' +
            yesterday.getDate().toString();
          this.days.unshift(index);
          yesterday.setDate(yesterday.getDate() - 1);
        }
        let monEnd = yesterday.getMonth();
        if (monStart != monEnd) {
          grpName += '-' + this.getMonthString(monEnd);
        }
        grpName += '_' + week.toString();
        this.months.unshift(grpName);
      }
      this.timelineStartDate = new Date(yesterday);
    }
  }

  getMonthString(month: number): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month];
  }

  onDrop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.dragActive = false;
    this.previousFrom = '';
  }

  onDragEntered(event: any) {
    console.log({
      from: event.item.dropContainer.id,
      to: event.container.id,
    });
  }

  addTask(
    customer: string,
    team: string,
    position: string,
    name: string,
    color: string,
    start: string,
    end: string
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    this.dataSource[customer][team][position][start].push({
      name: name,
      color: color,
      length: this.getLength(startDate, endDate),
    } as BoxModel);
  }

  onDragStart(event: any) {
    this.dragActive = true;
  }

  getLength(startDate: Date, endDate: Date): number {
    const days = this.getDays(startDate, endDate);
    return days * 32 - 2;
  }

  getDays(startDate: Date, endDate: Date): number {
    return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  }

  onCustomerToggle(customerIndex: number) {
    this.POSITION_DATA[customerIndex].isExpanded =
      !this.POSITION_DATA[customerIndex].isExpanded;
  }

  onTeamToggle(customerIndex: number, teamIndex: number) {
    this.POSITION_DATA[customerIndex].children[teamIndex].isExpanded =
      !this.POSITION_DATA[customerIndex].children[teamIndex].isExpanded;
  }

  onScroll() {
    const totalScrollWidth = this.container.nativeElement.scrollWidth - this.container.nativeElement.clientWidth - 1;
    this.scrollPos= this.container.nativeElement.scrollLeft;
     if (this.scrollPos >= totalScrollWidth) {
      this.initTimeline(true,4);
      console.log('right end')
    }
    // // console.log({target: event.target});

  }

  mouseUp(){
    if (this.scrollPos == 0) {
      this.initTimeline(false,4);
      this.container.nativeElement.scrollLeft = 894;
      console.log('left end');
    }
  }
}
