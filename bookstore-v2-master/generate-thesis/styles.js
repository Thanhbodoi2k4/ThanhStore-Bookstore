const { AlignmentType, HeadingLevel, TabStopPosition, TabStopType, LevelFormat, convertInchesToTwip } = require("docx");

// Font mặc định
const DEFAULT_FONT = "Times New Roman";
const FONT_SIZE_BODY = 26; // 13pt * 2
const FONT_SIZE_H1 = 32;  // 16pt * 2
const FONT_SIZE_H2 = 28;  // 14pt * 2
const FONT_SIZE_H3 = 26;  // 13pt * 2
const LINE_SPACING = 360; // 1.5 line

const styles = {
  default: {
    document: {
      run: { font: DEFAULT_FONT, size: FONT_SIZE_BODY },
      paragraph: { spacing: { line: LINE_SPACING, after: 120 } },
    },
    heading1: {
      run: { font: DEFAULT_FONT, size: FONT_SIZE_H1, bold: true, color: "000000" },
      paragraph: { spacing: { before: 240, after: 120, line: LINE_SPACING }, alignment: AlignmentType.LEFT },
    },
    heading2: {
      run: { font: DEFAULT_FONT, size: FONT_SIZE_H2, bold: true, color: "000000" },
      paragraph: { spacing: { before: 200, after: 100, line: LINE_SPACING }, alignment: AlignmentType.LEFT },
    },
    heading3: {
      run: { font: DEFAULT_FONT, size: FONT_SIZE_H3, bold: true, color: "000000" },
      paragraph: { spacing: { before: 160, after: 80, line: LINE_SPACING } },
    },
  },
  paragraphStyles: [
    { id: "wellSpaced", name: "Well Spaced", basedOn: "Normal",
      run: { font: DEFAULT_FONT, size: FONT_SIZE_BODY },
      paragraph: { spacing: { line: LINE_SPACING, after: 120 }, indent: { firstLine: convertInchesToTwip(0.5) } },
    },
  ],
};

const numbering = {
  config: [{
    reference: "thesis-numbering",
    levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "Chương %1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 0, hanging: 0 } } } },
      { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) } } } },
      { level: 2, format: LevelFormat.DECIMAL, text: "%1.%2.%3.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } } },
    ],
  }],
};

module.exports = { styles, numbering, DEFAULT_FONT, FONT_SIZE_BODY, FONT_SIZE_H1, FONT_SIZE_H2, LINE_SPACING };
