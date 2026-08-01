'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/admin/StatCard';
import { AdminTable } from '@/components/admin/AdminTable';
import { Eye, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { revenueByMonth, topProducts } from '@/lib/mock/admin';

const conversionData = [
  { name: 'Visiteurs → Devis', value: 18 },
  { name: 'Devis → Commande', value: 62 },
  { name: 'Reste', value: 20 },
];
const COLORS = ['#EA0E8A', '#15A1D6', '#ECE9E6'];

export default function AdminStatistiquesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-ink-8 p-3 text-xs text-ink-70">⚠️ Données d'exemple — à connecter à un vrai outil d'analytics.</div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Eye} label="Visiteurs (30j)" value="4 820" accent="cyan" />
        <StatCard icon={TrendingUp} label="Taux de conversion" value="6.2%" accent="magenta" />
        <StatCard icon={ShoppingBag} label="Panier moyen" value="21 000 MRU" accent="ink" />
        <StatCard icon={Users} label="Clients récurrents" value="34%" accent="success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Évolution du CA</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8A8583" />
              <YAxis tick={{ fontSize: 12 }} stroke="#8A8583" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#EA0E8A" fill="#EA0E8A" fillOpacity={0.12} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Tunnel de conversion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={conversionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {conversionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-bold">Produits — vues, commandes, rentabilité</h3>
        <AdminTable headers={['Produit', 'Vues', 'Commandes', 'Chiffre d\'affaires']}>
          {topProducts.map((p) => (
            <tr key={p.name}>
              <td className="px-4 py-3 font-semibold">{p.name}</td>
              <td className="px-4 py-3">{p.views}</td>
              <td className="px-4 py-3">{p.orders}</td>
              <td className="px-4 py-3 font-semibold">{p.revenue.toLocaleString('fr-FR')} MRU</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
