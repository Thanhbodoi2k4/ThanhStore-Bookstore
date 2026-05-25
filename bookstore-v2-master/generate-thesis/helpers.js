const { Paragraph, TextRun, HeadingLevel, AlignmentType, TableRow, TableCell, Table, WidthType, BorderStyle, convertInchesToTwip, PageBreak } = require("docx");
const { DEFAULT_FONT, FONT_SIZE_BODY, LINE_SPACING } = require("./styles");

// Helper: tạo paragraph text thường (có indent đầu dòng)
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { line: LINE_SPACING, after: 120 },
    indent: opts.noIndent ? undefined : { firstLine: convertInchesToTwip(0.5) },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    ...opts.paragraphOpts,
    children: [
      new TextRun({ text, font: DEFAULT_FONT, size: FONT_SIZE_BODY, bold: !!opts.bold, italics: !!opts.italics, ...(opts.runOpts || {}) }),
    ],
  });
}

// Helper: tạo paragraph bold
function pBold(text, opts = {}) { return p(text, { ...opts, bold: true }); }

// Helper: heading cấp 1 (Chương)
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: text.toUpperCase(), bold: true, font: DEFAULT_FONT, size: 32 })], spacing: { before: 360, after: 200 } });
}

// Helper: heading cấp 2
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, bold: true, font: DEFAULT_FONT, size: 28 })], spacing: { before: 240, after: 120 } });
}

// Helper: heading cấp 3
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, bold: true, font: DEFAULT_FONT, size: 26 })], spacing: { before: 200, after: 100 } });
}

// Helper: bullet list
function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { line: LINE_SPACING, after: 60 },
    children: [new TextRun({ text, font: DEFAULT_FONT, size: FONT_SIZE_BODY })],
  });
}

// Helper: tạo bảng đơn giản
function simpleTable(headers, rows) {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };
  
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      borders,
      shading: { fill: "D9E2F3" },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, font: DEFAULT_FONT, size: FONT_SIZE_BODY })] })],
    })),
  });

  const dataRows = rows.map(row => new TableRow({
    children: row.map(cell => new TableCell({
      borders,
      children: [new Paragraph({ children: [new TextRun({ text: String(cell), font: DEFAULT_FONT, size: FONT_SIZE_BODY })], spacing: { after: 40 } })],
    })),
  }));

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...dataRows] });
}

// Helper: page break
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// Helper: empty line
function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

// Helper: Tạo nhiều paragraph từ array string
function paragraphs(texts, opts = {}) {
  return texts.map(t => p(t, opts));
}

module.exports = { p, pBold, h1, h2, h3, bullet, simpleTable, pageBreak, emptyLine, paragraphs };
