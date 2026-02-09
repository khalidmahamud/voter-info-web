import type { VoterStats } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Users, UserCheck, UserCog, Briefcase } from 'lucide-react'

interface StatsCardsProps {
  stats: VoterStats | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null

  const cards = [
    {
      title: 'মোট ভোটার',
      subtitle: 'Total Voters',
      value: stats.total.toLocaleString('en-US'),
      icon: Users,
      textColor: 'text-blue-800',
      bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
    },
    {
      title: 'পুরুষ',
      subtitle: 'Male',
      value: stats.male.toLocaleString('en-US'),
      icon: UserCheck,
      textColor: 'text-green-800',
      bgColor: 'bg-gradient-to-br from-green-200 to-green-300',
    },
    {
      title: 'মহিলা',
      subtitle: 'Female',
      value: stats.female.toLocaleString('en-US'),
      icon: UserCog,
      textColor: 'text-pink-800',
      bgColor: 'bg-gradient-to-br from-pink-200 to-pink-300',
    },
    {
      title: 'পেশা',
      subtitle: 'Unique Occupations',
      value: stats.uniqueOccupations.length.toString(),
      icon: Briefcase,
      textColor: 'text-purple-800',
      bgColor: 'bg-gradient-to-br from-purple-200 to-purple-300',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className={`relative overflow-hidden p-5 md:p-6 border-0 hover:shadow-xl transition-all duration-200 ${card.bgColor}`}>
            {/* Large background icon */}
            <div className="absolute -right-6 -bottom-6">
              <Icon className="h-32 w-32 md:h-40 md:w-40 text-white/20" strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <p className={`text-sm md:text-base font-bold ${card.textColor} leading-tight mb-2`}>
                {card.title}
              </p>
              <p className={`text-3xl md:text-4xl font-bold ${card.textColor} leading-none`}>
                {card.value}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
