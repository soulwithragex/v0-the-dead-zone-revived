'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

export function NotificationSystem() {
  const { notifications, clearNotification } = useGameStore()

  if (notifications.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-4 h-4" />
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-destructive/90 text-destructive-foreground border-destructive'
      case 'success': return 'bg-primary/90 text-primary-foreground border-primary'
      case 'warning': return 'bg-yellow-500/90 text-yellow-950 border-yellow-500'
      default: return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5 duration-300",
            getColors(notification.type)
          )}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => clearNotification(notification.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
