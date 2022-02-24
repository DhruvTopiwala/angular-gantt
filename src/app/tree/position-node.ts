export interface PositionNode {
  name: string;
  isChild: boolean;
  children: PositionNode[];
  isExpanded: boolean;
  level: number;
  positionCode:string
}
