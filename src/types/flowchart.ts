export type NodeType = 'terminator' | 'input_output' | 'process' | 'decision';

export type BranchDecision = 'ya' | 'tidak' | 'both';

export interface NodeTelemetry {
  metric: string;
  value: string;
  unit: string;
  status: 'NOMINAL' | 'CALIBRATING' | 'ACTIVE' | 'OPTIMAL';
  specName: string;
  scientificDetail: string;
  confidence: number;
}

export interface FlowNode {
  id: string;
  stepIndex: number; // Order in construction
  type: NodeType;
  titleId: string;
  titleEn: string;
  subtitleId?: string;
  subtitleEn?: string;
  itemsId?: string[];
  itemsEn?: string[];
  telemetry: NodeTelemetry;
  // Canvas coordinate anchor (in SVG viewBox coordinates 0 0 1000 1350)
  x: number;
  y: number;
  width: number;
  height: number;
  branch?: 'ya' | 'tidak' | 'common';
}

export interface FlowEdge {
  id: string;
  fromId: string;
  toId: string;
  points: { x: number; y: number }[];
  label?: string;
  labelPosition?: { x: number; y: number };
  branch?: 'ya' | 'tidak';
  activeAtStep: number;
}

export interface LegendItem {
  type: NodeType;
  nameId: string;
  nameEn: string;
  roleId: string;
  roleEn: string;
  shapeDescription: string;
  colorTheme: {
    stroke: string;
    fill: string;
    glow: string;
    badgeBg: string;
    text: string;
  };
}
