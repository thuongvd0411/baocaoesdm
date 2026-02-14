
export interface ESDMItem {
  skill: string;
  level0?: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface StudentInfo {
  name: string;
  dob: string;
  evalDate: string;
  age: string;
  gender: 'Nam' | 'Nữ';
  studentId: string;
}

export interface ESDMResult {
  table: ESDMItem[];
  percents: Record<string, number>;
  percentsOld?: Record<string, number>;
  summary: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// --- MODULE 4 TYPES ---
export interface MatrixHighlightState {
  [key: string]: boolean; // Format: "colIndex_rowIndex_value" (e.g., "0_0_0", "0_0_2+")
}

export interface Mod4TableInfo {
  id: number;
  index: number; // Index in XML
  previewHtml: string; // From Mammoth
  issues: string[]; // Detected issues
  canMergeNext: boolean; // Is followed by another table closely?
  isMergeTarget: boolean; // Is selected to be merged into previous?
  
  // New Options
  options: {
    fixBorders: boolean;
    fixSpacing: boolean;
    autofit: boolean;
    mergeNext: boolean;
    fixAlign: boolean; // Now with enhanced logic
    deleteTable: boolean; // New: Delete table
    rewrite: boolean; // New: Rewrite text
    matrixMode: boolean; // New: Enable matrix mode
    matrixType: 'replace' | 'highlight'; // New: Type of matrix action
    matrixHighlights: MatrixHighlightState; // New: State for red highlights
  };
}
