import { readFileSync } from 'fs'
import { join } from 'path'
import { WardStatsPage } from '@/components/ward/ward-stats-page'

export function generateStaticParams() {
  const dataPath = join(process.cwd(), 'public', 'voter_data.json')
  const rawData = JSON.parse(readFileSync(dataPath, 'utf-8'))
  return rawData.wards.map((w: { wardNo: number }) => ({
    wardNo: String(w.wardNo),
  }))
}

interface PageProps {
  params: Promise<{ wardNo: string }>
}

export default async function WardStatsDetailPage({ params }: PageProps) {
  const { wardNo } = await params
  return <WardStatsPage wardNo={parseInt(wardNo, 10)} />
}
