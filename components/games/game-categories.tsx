"use client"

import { Button } from '@/components/ui/button'

import { 
  Gamepad2, 
  Zap, 
  Brain, 
  Sword, 
  Car, 
  Puzzle,
  Heart,
  Sparkles 
} from 'lucide-react'

import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n';

const categories = [
  { name: 'Action', key: 'category_action', icon: Zap, color: 'bg-red-100 text-red-600 dark:bg-red-900/20' },
  { name: 'Adventure', key: 'category_adventure', icon: Gamepad2, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' },
  { name: 'Puzzle', key: 'category_puzzle', icon: Puzzle, color: 'bg-green-100 text-green-600 dark:bg-green-900/20' },
  { name: 'Strategy', key: 'category_strategy', icon: Brain, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' },
  { name: 'RPG', key: 'category_rpg', icon: Sword, color: 'bg-orange-100 text-orange-600 dark:bg-orange-600/20' },
  { name: 'Racing', key: 'category_racing', icon: Car, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' },
  { name: 'Casual', key: 'category_casual', icon: Heart, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20' },
  { name: 'Indie', key: 'category_indie', icon: Sparkles, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20' },
]

export function GameCategories() {
  const { t } = useI18n();

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">{t('browse_by_category_title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            asChild
            variant="ghost"
            className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted"
          >
            <Link href={`/games?category=${category.name.toLowerCase()}`}>
              <div className={`p-3 rounded-full ${category.color}`}>
                <category.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{t(category.key)}</span>
            </Link>
          </Button>
        ))}
      </div>
    </section>
  )
}