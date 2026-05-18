'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

export function NotificationSystem() {
  const { notifications, clearNotification } = useGameStore()

  const typeStyles = {
    info: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
    warning: 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100',
    danger: 'bg-red-900/90 border-red-500/50 text-red-100',
    success: 'bg-green-900/90 border-green-500/50 text-green-100',
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => clearNotification(notification.id)}
          className={cn(
            "px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300 shadow-lg backdrop-blur-sm animate-in slide-in-from-right",
            typeStyles[notification.type]
          )}
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  )
}
