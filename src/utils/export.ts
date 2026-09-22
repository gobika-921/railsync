/**
 * Export data records to a real downloadable CSV file in the browser.
 */
export function exportToCSV<T extends object>(
  filename: string,
  rows: T[],
  columnHeaders?: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) return;

  const headers = columnHeaders || Object.keys(rows[0]).map((key) => ({ key, label: key }));

  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map((h) => `"${String(h.label).replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of rows) {
    const values = headers.map((h) => {
      const val = (row as Record<string, unknown>)[h.key as string];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers native browser print dialog configured for executive PDF generation.
 */
export function triggerPrintReport(): void {
  window.print();
}
