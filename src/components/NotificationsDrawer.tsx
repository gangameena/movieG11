import React from 'react';
import { X, Bell, Check, Trash2, Ticket, AlertCircle, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onOpenMyBookings: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onMarkRead,
  onClearAll,
  onOpenMyBookings,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm sm:max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white">Notifications & Alerts</h3>
            {notifications.some((n) => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                title="Clear all"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No new notifications</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkRead(item.id);
                  if (item.type === 'booking') {
                    onOpenMyBookings();
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-950/60 border-slate-850 text-slate-400'
                    : 'bg-slate-950 border-slate-700/80 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    {item.type === 'booking' && <Ticket className="w-3.5 h-3.5 text-emerald-400" />}
                    {item.type === 'cancellation' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                    {item.type === 'offer' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-300">
                  {item.message}
                </p>

                {item.type === 'booking' && (
                  <span className="inline-block text-[10px] text-red-400 font-medium hover:underline pt-1">
                    Click to view your digital ticket pass →
                  </span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
