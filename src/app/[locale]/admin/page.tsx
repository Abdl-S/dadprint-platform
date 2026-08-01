'use client';

import {
  ShoppingCart, FileText, Wallet, UserPlus, Star, Factory, Truck, Clock3,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts';
import { StatCard } from '@/components/admin/StatCard';
import { DailyAiBriefing } from '@/components/admin/DailyAiBriefing';
import { dashboardStats, revenueByMonth, topProducts, recentActivity } from '@/lib/mock/admin';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <div className="rounded-md bg-ink-8 p-3 text-xs text-ink-70">
        ⚠️ Toutes les données ci-dessous sont des exemples — prêtes à être reliées à Supabase.
      </div>

      <DailyAiBriefing />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ShoppingCart} label="Commandes" value={String(dashboardStats.ordersCount)} accent="ink" />
        <StatCard icon={FileText} label="Devis" value={String(dashboardStats.quotesCount)} accent="cyan" />
        <StatCard icon={Wallet} label="Chiffre d'affaires" value={`${(dashboardStats.revenue / 1000).toFixed(0)}k MRU`} accent="magenta" />
        <StatCard icon={UserPlus} label="Nouveaux clients" value={String(dashboardStats.newClients)} accent="success" />
        <StatCard icon={Star} label="Nouveaux avis" value={String(dashboardStats.newReviews)} accent="magenta" />
        <StatCard icon={Factory} label="En production" value={String(dashboardStats.inProduction)} accent="ink" />
        <StatCard icon={Truck} label="À livrer" value={String(dashboardStats.toDeliver)} accent="cyan" />
        <StatCard icon={Clock3} label="Paiements en attente" value={String(dashboardStats.pendingPayments)} accent="success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Chiffre d'affaires (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8A8583" />
              <YAxis tick={{ fontSize: 12 }} stroke="#8A8583" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#EA0E8A" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Produits les plus commandés</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E6" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#8A8583" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5 }} width={130} stroke="#8A8583" />
              <Tooltip />
              <Bar dataKey="orders" fill="#15A1D6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-bold">Activité récente</h3>
        <ul className="space-y-3">
          {recentActivity.map((a) => (
            <li key={a.id} className="flex items-center justify-between border-b border-ink-8 pb-3 text-sm last:border-0 last:pb-0">
              <span>{a.text}</span>
              <span className="shrink-0 text-xs text-ink-40">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
