import type { VoterRecord } from './types'

/**
 * Convert voter records to CSV format
 */
export function exportToCSV(data: VoterRecord[], filename: string = 'voter_data.csv'): void {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // CSV headers
  const headers = [
    'Serial No',
    'Name',
    'Voter ID',
    "Father's Name",
    "Mother's Name",
    'Occupation',
    'Date of Birth',
    'Address',
  ]

  // Convert data to CSV rows
  const rows = data.map((voter) => [
    voter.sl_no,
    voter.name,
    voter.voter_no,
    voter.father_name,
    voter.mother_name,
    voter.occupation,
    voter.dob,
    voter.address,
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  // Create and download file
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

/**
 * Convert voter records to JSON format
 */
export function exportToJSON(data: VoterRecord[], filename: string = 'voter_data.json'): void {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;')
}

/**
 * Download a file with given content
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  // Create a Blob with the content
  const blob = new Blob([content], { type: mimeType })

  // Create a temporary download link
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename

  // Trigger download
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * Get export filename with timestamp
 */
export function getExportFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${prefix}_${timestamp}.${extension}`
}
