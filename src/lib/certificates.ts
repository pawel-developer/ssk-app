import { readFile } from "fs/promises";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TEMPLATE_PATH = path.join(process.cwd(), "public", "certificates", "template.pdf");
const MONTESERRAT_FONT_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "Montserrat-Regular.ttf"
);
const NAME_MAX_WIDTH = 420;
const NAME_TOP_OFFSET = 250;
const JOIN_DATE_LINE_TOP_OFFSET = 308;

type CertificateInput = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  joinDate: string | null | undefined;
};

function formatDatePL(dateValue: string | null | undefined) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = `${date.getFullYear()}`;
  return `${day}.${month}.${year}`;
}

function getFullName(firstName: string | null | undefined, lastName: string | null | undefined) {
  const full = [firstName, lastName].filter(Boolean).join(" ").trim();
  return full || "Członek SSK";
}

function toPdfSafeText(value: string) {
  const replacements: Record<string, string> = {
    "ą": "a",
    "ć": "c",
    "ę": "e",
    "ł": "l",
    "ń": "n",
    "ó": "o",
    "ś": "s",
    "ź": "z",
    "ż": "z",
    "Ą": "A",
    "Ć": "C",
    "Ę": "E",
    "Ł": "L",
    "Ń": "N",
    "Ó": "O",
    "Ś": "S",
    "Ź": "Z",
    "Ż": "Z",
  };
  return value.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (letter) => replacements[letter] || letter);
}

function normalizeForKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTopBasedY(pageHeight: number, topOffset: number) {
  return pageHeight - topOffset;
}

function fitTextSize(text: string, maxWidth: number, initialSize: number, minSize: number, widthAt: (value: string, size: number) => number) {
  let size = initialSize;
  while (size > minSize && widthAt(text, size) > maxWidth) {
    size -= 1;
  }
  return size;
}

export async function renderCertificatePdf(input: CertificateInput) {
  const templateBytes = await readFile(TEMPLATE_PATH);
  const montserratBytes = await readFile(MONTESERRAT_FONT_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.getPages()[0];
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const fullName = toPdfSafeText(getFullName(input.firstName, input.lastName)).toUpperCase();
  const joinDate = formatDatePL(input.joinDate);
  const joinDateLine = `Data wstąpienia: ${joinDate}`;

  const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const dateFont = await pdfDoc.embedFont(montserratBytes);

  const nameSize = fitTextSize(fullName, NAME_MAX_WIDTH, 26, 18, (value, size) => nameFont.widthOfTextAtSize(value, size));
  const nameWidth = nameFont.widthOfTextAtSize(fullName, nameSize);

  page.drawText(fullName, {
    x: (pageWidth - nameWidth) / 2,
    y: toTopBasedY(pageHeight, NAME_TOP_OFFSET),
    size: nameSize,
    font: nameFont,
    color: rgb(0.11, 0.17, 0.38),
  });

  const joinDateSize = 9;
  const joinDateWidth = dateFont.widthOfTextAtSize(joinDateLine, joinDateSize);
  page.drawText(joinDateLine, {
    x: (pageWidth - joinDateWidth) / 2,
    y: toTopBasedY(pageHeight, JOIN_DATE_LINE_TOP_OFFSET),
    size: joinDateSize,
    font: dateFont,
    color: rgb(0, 0, 0),
  });

  return pdfDoc.save();
}

export function buildCertificatePath(memberId: string) {
  return `${memberId}/certificate.pdf`;
}

export function buildCertificateFileName(firstName: string | null | undefined, lastName: string | null | undefined) {
  const base = normalizeForKey(getFullName(firstName, lastName)) || "certyfikat";
  return `certyfikat-ssk-${base}.pdf`;
}
