'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import type { VoterStats } from '@/lib/types'

interface VoterChartsProps {
  stats: VoterStats | null
}

const COLORS = {
  male: '#10b981',
  female: '#ec4899',
  occupation: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#a855f7', '#14b8a6', '#6366f1'],
}

export function VoterCharts({ stats }: VoterChartsProps) {
  // Top 10 occupations data
  const occupationData = useMemo(() => {
    if (!stats) return []
    const sortedOccupations = Object.entries(stats.occupationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count], index) => ({
        name,
        count,
        fill: COLORS.occupation[index % COLORS.occupation.length],
      }))
    return sortedOccupations
  }, [stats])

  if (!stats) return null

  // Gender distribution data
  const genderData = [
    { name: 'পুরুষ (Male)', value: stats.male, color: COLORS.male },
    { name: 'মহিলা (Female)', value: stats.female, color: COLORS.female },
  ]

  // Age distribution data (if available)
  const ageData = stats.ageDistribution || []

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Pie Chart */}
        <Card className="p-6 border-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            লিঙ্গ বিতরণ • Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="font-medium">পুরুষ: {stats.male.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-500"></div>
              <span className="font-medium">মহিলা: {stats.female.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Top Occupations Bar Chart */}
        <Card className="p-6 border-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            শীর্ষ ১০ পেশা • Top 10 Occupations
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {occupationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Age Distribution Chart (if data available) */}
      {ageData.length > 0 && (
        <Card className="p-6 border-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            বয়স বিতরণ • Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          পরিসংখ্যান সারাংশ • Statistics Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.uniqueOccupations.length}</p>
            <p className="text-sm text-gray-600">ভিন্ন পেশা</p>
            <p className="text-xs text-gray-500">Unique Occupations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {((stats.male / stats.total) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">পুরুষ অনুপাত</p>
            <p className="text-xs text-gray-500">Male Ratio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">
              {((stats.female / stats.total) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">মহিলা অনুপাত</p>
            <p className="text-xs text-gray-500">Female Ratio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600">মোট ভোটার</p>
            <p className="text-xs text-gray-500">Total Voters</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
