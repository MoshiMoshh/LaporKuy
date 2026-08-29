'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Gift, ThumbsUp, ShieldCheck, Flame, ChevronRight } from 'lucide-react';

export default function NotifikasiPage() {
  const { notifications, markNotificationsRead } = useLaporKuyStore();
  const [filter, setFilter] = useState<'all' | 'status' | 'community' | 'reward'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter !== 'all' && n.type !== filter) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'status':
        return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      case 'community':
        return <ThumbsUp className="h-5 w-5 text-emerald-500" />;
      case 'reward':
        return <Gift className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Riwayat pembaruan status laporan, upvote komunitas, dan reward.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markNotificationsRead}
          className="text-xs gap-1.5"
        >
          <CheckCheck className="h-4 w-4" /> Tandai Semua Dibaca
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          Semua Notifikasi
        </Button>
        <Button
          size="sm"
          variant={filter === 'status' ? 'default' : 'ghost'}
          onClick={() => setFilter('status')}
          className="text-xs"
        >
          Status Laporan
        </Button>
        <Button
          size="sm"
          variant={filter === 'community' ? 'default' : 'ghost'}
          onClick={() => setFilter('community')}
          className="text-xs"
        >
          Komunitas
        </Button>
        <Button
          size="sm"
          variant={filter === 'reward' ? 'default' : 'ghost'}
          onClick={() => setFilter('reward')}
          className="text-xs"
        >
          Reward & Poin
        </Button>
      </div>

      {/* Notifications List */}
      <Card className="divide-y border-border/60">
        {filteredNotifs.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Belum ada notifikasi di kategori ini.
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                !item.isRead ? 'bg-primary/5 font-medium' : 'hover:bg-muted/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-muted shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">{item.title}</h3>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.message}</p>
                  <span className="text-[10px] text-muted-foreground block">{item.timestamp}</span>
                </div>
              </div>

              {item.link && (
                <Link href={item.link} className="shrink-0 pt-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
