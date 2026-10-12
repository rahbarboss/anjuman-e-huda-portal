import * as XLSX from 'xlsx';
import { WingProgram, Wing, ReportProgram, Program } from '../types';

export interface ReportExportOptions {
  fileName?: string;
  sheetTitle?: string;
}

// Helper to sanitize sheet names for Excel (max 31 characters, no special chars)
function sanitizeSheetName(name: string): string {
  const sanitized = name.replace(/[\\/?*[\]:]/g, '_').trim();
  return sanitized.slice(0, 31) || 'Sheet';
}

type AnyProgramItem = ReportProgram | WingProgram | Program | any;

// Format a single program into a standard row object matching upload fields
function formatProgramRow(prog: AnyProgramItem, index: number) {
  const isCore =
    prog.wingId === 'core-committee' ||
    prog.wingName?.toLowerCase().includes('core committee');

  return {
    'S.No': index + 1,
    'Sector Type': isCore ? 'Core Committee (Apex Council)' : 'Specialized Wing',
    'Wing / Committee Name': prog.wingName || (isCore ? 'Core Committee' : 'Specialized Wing'),
    'Program Name (Title)': prog.title || '',
    'Category': prog.category || prog.targetClass || '',
    'Target Class / Audience': prog.targetClass || (prog.tags && Array.isArray(prog.tags) ? prog.tags.join(', ') : '') || 'All Campus Students',
    'Academic Year': prog.academicYear || '',
    'Month': prog.month || '',
    'Date Conducted': prog.date || '',
    'Time': prog.time || '',
    'Venue': prog.venue || 'Darul Huda',
    'Status': prog.status || 'Completed',
    'Program Description / Details': prog.description || '',
    'Program ID': prog.id || '',
  };
}

/**
 * Downloads a Complete Master Excel Workbook (.xlsx)
 * Contains:
 * 1. MASTER_ALL_PROGRAMS: All programs consolidated
 * 2. CORE_COMMITTEE: Only Core Committee programs
 * 3. WINGS_PROGRAMS: Only Specialized Wings programs
 * 4. YEAR_MONTH_MATRIX: Summary counts by Year & Month
 * 5. Dedicated sheets for each Wing that has programs
 */
export function exportMasterExcelReport(
  programs: AnyProgramItem[],
  wings: Wing[],
  fileNamePrefix = 'ANJUMAN_E_HUDA_Programs_Master_Report'
) {
  const wb = XLSX.utils.book_new();

  // 1. All Programs Master Sheet
  const masterData = programs.map((p, idx) => formatProgramRow(p, idx));
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  setColumnWidths(wsMaster);
  XLSX.utils.book_append_sheet(wb, wsMaster, sanitizeSheetName('All Programs Master'));

  // 2. Core Committee Sheet
  const corePrograms = programs.filter(
    (p) =>
      p.wingId === 'core-committee' ||
      p.wingName?.toLowerCase().includes('core committee')
  );
  if (corePrograms.length > 0) {
    const coreData = corePrograms.map((p, idx) => formatProgramRow(p, idx));
    const wsCore = XLSX.utils.json_to_sheet(coreData);
    setColumnWidths(wsCore);
    XLSX.utils.book_append_sheet(wb, wsCore, sanitizeSheetName('Core Committee'));
  }

  // 3. Wings Programs Sheet
  const wingPrograms = programs.filter(
    (p) =>
      p.wingId !== 'core-committee' &&
      !p.wingName?.toLowerCase().includes('core committee')
  );
  if (wingPrograms.length > 0) {
    const wingData = wingPrograms.map((p, idx) => formatProgramRow(p, idx));
    const wsWings = XLSX.utils.json_to_sheet(wingData);
    setColumnWidths(wsWings);
    XLSX.utils.book_append_sheet(wb, wsWings, sanitizeSheetName('All Wings Programs'));
  }

  // 4. Year & Month Summary Matrix Sheet
  const summaryRows = generateYearMonthSummary(programs);
  if (summaryRows.length > 0) {
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    setColumnWidths(wsSummary);
    XLSX.utils.book_append_sheet(wb, wsSummary, sanitizeSheetName('Year Month Summary'));
  }

  // 5. Individual Wing Sheets
  const wingMap = new Map<string, AnyProgramItem[]>();
  programs.forEach((p) => {
    const key = p.wingName || p.wingId;
    if (!wingMap.has(key)) {
      wingMap.set(key, []);
    }
    wingMap.get(key)!.push(p);
  });

  const usedSheetNames = new Set<string>([
    'All Programs Master',
    'Core Committee',
    'All Wings Programs',
    'Year Month Summary',
  ]);

  wingMap.forEach((wProgs, wingName) => {
    // Avoid re-creating Core Committee duplicate
    if (wingName.toLowerCase().includes('core committee')) return;

    let sheetName = sanitizeSheetName(wingName);
    if (usedSheetNames.has(sheetName)) {
      sheetName = sanitizeSheetName(`${sheetName}_${wProgs.length}`);
    }
    usedSheetNames.add(sheetName);

    const sheetRows = wProgs.map((p, idx) => formatProgramRow(p, idx));
    const wsIndividual = XLSX.utils.json_to_sheet(sheetRows);
    setColumnWidths(wsIndividual);
    XLSX.utils.book_append_sheet(wb, wsIndividual, sheetName);
  });

  // Timestamped Filename
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFileName = `${fileNamePrefix}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, fullFileName);
  return fullFileName;
}

/**
 * Downloads a Filtered / Specific List of Programs into Excel (.xlsx)
 */
export function exportFilteredExcelReport(
  programs: AnyProgramItem[],
  sheetName = 'Filtered_Programs',
  fileName = 'ANJUMAN_E_HUDA_Filtered_Report'
) {
  const wb = XLSX.utils.book_new();
  const formattedData = programs.map((p, idx) => formatProgramRow(p, idx));

  const ws = XLSX.utils.json_to_sheet(formattedData);
  setColumnWidths(ws);
  XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(sheetName));

  const timestamp = new Date().toISOString().split('T')[0];
  const fullFileName = `${fileName}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, fullFileName);
  return fullFileName;
}

/**
 * Generates summary rows grouping by Academic Year and Month
 */
function generateYearMonthSummary(programs: AnyProgramItem[]) {
  const matrix: { [key: string]: { year: string; month: string; coreCount: number; wingsCount: number; total: number } } = {};

  programs.forEach((p) => {
    const year = p.academicYear || '2026-27';
    const month = p.month || 'Other';
    const key = `${year}___${month}`;

    if (!matrix[key]) {
      matrix[key] = {
        year,
        month,
        coreCount: 0,
        wingsCount: 0,
        total: 0,
      };
    }

    const isCore =
      p.wingId === 'core-committee' ||
      p.wingName?.toLowerCase().includes('core committee');

    if (isCore) {
      matrix[key].coreCount += 1;
    } else {
      matrix[key].wingsCount += 1;
    }
    matrix[key].total += 1;
  });

  return Object.values(matrix)
    .sort((a, b) => b.year.localeCompare(a.year) || a.month.localeCompare(b.month))
    .map((item, idx) => ({
      'S.No': idx + 1,
      'Academic Year': item.year,
      'Month': item.month,
      'Core Committee Programs': item.coreCount,
      'Specialized Wings Programs': item.wingsCount,
      'Total Programs Conducted': item.total,
    }));
}

/**
 * Sets automatic column widths for clean readability in Microsoft Excel
 */
function setColumnWidths(ws: XLSX.WorkSheet) {
  const colWidths = [
    { wch: 6 },  // S.No
    { wch: 28 }, // Sector Type
    { wch: 26 }, // Wing / Committee Name
    { wch: 38 }, // Program Name
    { wch: 20 }, // Category
    { wch: 26 }, // Target Class / Audience
    { wch: 16 }, // Academic Year
    { wch: 14 }, // Month
    { wch: 14 }, // Date Conducted
    { wch: 12 }, // Time
    { wch: 26 }, // Venue
    { wch: 14 }, // Status
    { wch: 50 }, // Description
    { wch: 20 }, // ID
  ];
  ws['!cols'] = colWidths;
}
