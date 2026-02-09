'use client'

import { useState } from 'react'
import { Download, FileText, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { VoterRecord } from '@/lib/types'
import { exportToCSV, exportToJSON, getExportFilename } from '@/lib/export'

interface ExportButtonProps {
  data: VoterRecord[]
}

export function ExportButton({ data }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true)
    try {
      const filename = getExportFilename('voters', format)

      if (format === 'csv') {
        exportToCSV(data, filename)
      } else {
        exportToJSON(data, filename)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting || data.length === 0}
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Export ({data.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
