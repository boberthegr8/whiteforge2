import { ReactNode, useState, useRef, useEffect } from 'react';
import { Search, User, FileText, Building2, ArrowRightLeft } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { useToast } from '../lib/toast';

export function Topbar({ title, actions }: { title: string; actions?: ReactNode }) {
  const [q, setQ] = useState('');
  const [showRes, setShowRes] = useState(false);
  const { contacts, quotes, userRole, users, viewFilter, setViewFilter, currentUser, stores, currentStoreId, switchStore } = useAppStore();
  const { addToast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowRes(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scopedContacts = userRole === 'admin' ? contacts : contacts.filter(c => (c.ownerId || 1) === currentUser.id);
  const scopedQuotes   = userRole === 'admin' ? quotes   : quotes.filter(qu => (qu.ownerId || 1) === currentUser.id);

  const resContacts = q ? scopedContacts.filter(c =>
    (c.first + ' ' + c.last).toLowerCase().includes(q.toLowerCase()) ||
    c.company?.toLowerCase().includes(q.toLowerCase())
  ) : [];
  const resQuotes = q ? scopedQuotes.filter(qu =>
    qu.client?.toLowerCase().includes(q.toLowerCase()) ||
    qu.desc?.toLowerCase().includes(q.toLowerCase())
  ) : [];

  const handleStoreSwitch = (storeId: string) => {
    if (storeId === currentStoreId) return;
    switchStore(storeId);
    addToast(`Switched to ${stores.find(s => s.id === storeId)?.name}`, 'info');
  };

  return (
    <div className="h-[56px] bg-[#111111] border-b border-[#1e1e1e] flex items-center px-5 gap-4 shrink-0 relative z-40">
      {/* Page title */}
      <div className="text-[18px] font-bold text-white flex-1 tracking-tight">{title}</div>

      {/* Store switcher (admin) */}
      {userRole === 'admin' && stores.length > 1 && (
        <div className="flex items-center gap-2 mr-2">
          <Building2 className="w-3.5 h-3.5 text-[#6b7280]" />
          <select
            className="win-input py-1 text-xs px-2 w-[160px] bg-[#1a1a1a]"
            value={currentStoreId}
            onChange={e => handleStoreSwitch(e.target.value)}
          >
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* View filter (admin) */}
      {userRole === 'admin' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6b7280] font-semibold uppercase tracking-wider">View:</span>
          <select
            className="win-input py-1 text-xs px-2 w-[140px] bg-[#1a1a1a]"
            value={viewFilter}
            onChange={e => setViewFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.first} {u.last} ({u.role})</option>
            ))}
          </select>
        </div>
      )}

      {/* Global search */}
      <div className="relative w-56" ref={searchRef}>
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280] pointer-events-none" />
        <input
          type="text"
          className="win-input w-full pl-8 py-1.5 text-xs bg-[#1a1a1a]"
          placeholder="Search contacts, quotes…"
          value={q}
          onChange={e => { setQ(e.target.value); setShowRes(true); }}
          onFocus={() => { if (q) setShowRes(true); }}
        />
        {showRes && q && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#2e2e2e] shadow-xl rounded-[8px] max-h-80 overflow-y-auto z-50">
            {resContacts.length === 0 && resQuotes.length === 0 && (
              <div className="p-3 text-xs text-[#6b7280] text-center">No results for "{q}"</div>
            )}
            {resContacts.length > 0 && (
              <div>
                <div className="bg-[#111111] px-3 py-1.5 text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Contacts</div>
                {resContacts.slice(0, 4).map(c => (
                  <div key={c.id} className="p-2.5 border-b border-[#1e1e1e] hover:bg-[#222222] cursor-pointer flex gap-2 items-center text-xs">
                    <User className="w-3 h-3 text-[#f97316]" />
                    <span className="font-semibold text-white">{c.first} {c.last}</span>
                    <span className="text-[#9ca3af] truncate">{c.company}</span>
                  </div>
                ))}
              </div>
            )}
            {resQuotes.length > 0 && (
              <div>
                <div className="bg-[#111111] px-3 py-1.5 text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Quotes</div>
                {resQuotes.slice(0, 4).map(qu => (
                  <div key={qu.id} className="p-2.5 border-b border-[#1e1e1e] hover:bg-[#222222] cursor-pointer flex gap-2 items-center text-xs">
                    <FileText className="w-3 h-3 text-[#f97316]" />
                    <span className="font-semibold text-white">{qu.client}</span>
                    <span className="text-[#f97316] font-semibold">${Number(qu.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
