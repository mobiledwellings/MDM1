import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminPasswordModal } from './AdminPasswordModal';
import {
  Search, Plus, Trash2, ExternalLink, Star, Filter,
  Youtube, Globe, MessageSquare, Instagram, ShoppingBag,
  Loader2, RefreshCw, ChevronDown, ChevronUp, ArrowLeft,
  Bookmark, Clock, CheckCircle2, XCircle, AlertCircle, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d`;

// ---- Types ----
interface Lead {
  id: string;
  platform: string;
  title: string;
  url: string;
  author: string;
  content: string;
  score: number; // 1-10
  status: 'new' | 'reviewing' | 'contacted' | 'scheduled' | 'rejected';
  notes: string;
  tags: string[];
  discoveredAt: string;
  updatedAt: string;
}

type Platform = 'reddit' | 'youtube' | 'facebook' | 'instagram' | 'blog' | 'marketplace';
type LeadStatus = Lead['status'];

const PLATFORM_META: Record<Platform, { label: string; icon: typeof Youtube; color: string }> = {
  reddit: { label: 'Reddit', icon: MessageSquare, color: 'text-orange-500' },
  youtube: { label: 'YouTube', icon: Youtube, color: 'text-red-500' },
  facebook: { label: 'Facebook', icon: Globe, color: 'text-blue-500' },
  instagram: { label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  blog: { label: 'Blog', icon: FileText, color: 'text-green-500' },
  marketplace: { label: 'Marketplace', icon: ShoppingBag, color: 'text-purple-500' },
};

const STATUS_META: Record<LeadStatus, { label: string; icon: typeof Star; color: string; bg: string }> = {
  new: { label: 'New', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  reviewing: { label: 'Reviewing', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
  contacted: { label: 'Contacted', icon: Bookmark, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  scheduled: { label: 'Scheduled', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/40' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' },
};

const DEFAULT_KEYWORDS = [
  'skoolie', 'bus conversion', 'van life', 'vanlife', 'bus life',
  'mobile dwelling', 'school bus conversion', 'tiny home on wheels',
  'rv renovation', 'camper van build', 'shuttle bus conversion',
  'diy camper', 'off grid bus', 'nomad life', 'full time rving'
];

// ---- API helpers ----
async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...(opts.headers || {}),
    },
  });
  return res.json();
}

// ---- Component ----
export function LeadFinder() {
  const { isAdmin } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);

  // Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  // UI
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanPlatform, setScanPlatform] = useState<Platform>('reddit');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanPanel, setShowScanPanel] = useState(false);
  const [scanKeywords, setScanKeywords] = useState(DEFAULT_KEYWORDS.join(', '));
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Add Lead form
  const [newLead, setNewLead] = useState({
    platform: 'reddit' as Platform,
    title: '',
    url: '',
    author: '',
    content: '',
    tags: '',
  });

  // ---- Fetch leads ----
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/leads');
      setLeads(Array.isArray(data) ? data : data.leads || []);
    } catch (e) {
      console.error('Failed to fetch leads', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchLeads();
  }, [isAdmin, fetchLeads]);

  // ---- Actions ----
  const handleScan = async () => {
    setScanning(true);
    try {
      const keywords = scanKeywords.split(',').map(k => k.trim()).filter(Boolean);
      const data = await apiFetch('/leads/scan', {
        method: 'POST',
        body: JSON.stringify({ platform: scanPlatform, keywords }),
      });
      if (data.leads?.length) {
        toast.success(`Found ${data.leads.length} potential leads from ${PLATFORM_META[scanPlatform].label}!`);
        await fetchLeads();
      } else {
        toast.info(data.message || 'No new leads found. Try different keywords.');
      }
    } catch {
      toast.error('Scan failed. Check server logs.');
    } finally {
      setScanning(false);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.title || !newLead.url) {
      toast.error('Title and URL are required');
      return;
    }
    try {
      const lead: Omit<Lead, 'id'> = {
        platform: newLead.platform,
        title: newLead.title,
        url: newLead.url,
        author: newLead.author,
        content: newLead.content,
        score: 5,
        status: 'new',
        notes: '',
        tags: newLead.tags.split(',').map(t => t.trim()).filter(Boolean),
        discoveredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await apiFetch('/leads', { method: 'POST', body: JSON.stringify(lead) });
      toast.success('Lead added!');
      setShowAddModal(false);
      setNewLead({ platform: 'reddit', title: '', url: '', author: '', content: '', tags: '' });
      await fetchLeads();
    } catch {
      toast.error('Failed to add lead');
    }
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      await apiFetch('/leads/update', {
        method: 'POST',
        body: JSON.stringify({ leadId, updates: { status, updatedAt: new Date().toISOString() } }),
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const updateLeadScore = async (leadId: string, score: number) => {
    try {
      await apiFetch('/leads/update', {
        method: 'POST',
        body: JSON.stringify({ leadId, updates: { score, updatedAt: new Date().toISOString() } }),
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, score, updatedAt: new Date().toISOString() } : l));
    } catch {
      toast.error('Failed to update score');
    }
  };

  const saveNotes = async (leadId: string) => {
    try {
      await apiFetch('/leads/update', {
        method: 'POST',
        body: JSON.stringify({ leadId, updates: { notes: notesDraft, updatedAt: new Date().toISOString() } }),
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: notesDraft, updatedAt: new Date().toISOString() } : l));
      setEditingNotes(null);
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await apiFetch('/leads/delete', { method: 'POST', body: JSON.stringify({ leadId }) });
      setLeads(prev => prev.filter(l => l.id !== leadId));
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  // ---- Filtering ----
  const filtered = leads
    .filter(l => statusFilter === 'all' || l.status === statusFilter)
    .filter(l => platformFilter === 'all' || l.platform === platformFilter)
    .filter(l => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.author.toLowerCase().includes(q) ||
        l.content.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime();
    });

  // ---- Auth gate ----
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lead Finder</h1>
          <p className="text-neutral-500">Admin access required.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>
          <AdminPasswordModal open={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      </div>
    );
  }

  // ---- Stats ----
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    reviewing: leads.filter(l => l.status === 'reviewing').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    scheduled: leads.filter(l => l.status === 'scheduled').length,
    highScore: leads.filter(l => l.score >= 8).length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition">
                <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </a>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">🎯 Lead Finder</h1>
                <p className="text-xs text-neutral-500">Find qualified leads for Mobile Dwellings videos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScanPanel(!showScanPanel)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
              >
                <Search className="w-4 h-4" />
                Scan Platforms
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Leads', value: stats.total, color: 'border-neutral-300' },
            { label: 'New', value: stats.new, color: 'border-blue-400' },
            { label: 'Reviewing', value: stats.reviewing, color: 'border-yellow-400' },
            { label: 'Contacted', value: stats.contacted, color: 'border-purple-400' },
            { label: 'Scheduled', value: stats.scheduled, color: 'border-green-400' },
            { label: 'High Score (8+)', value: stats.highScore, color: 'border-orange-400' },
          ].map(s => (
            <div
              key={s.label}
              className={`bg-white dark:bg-neutral-800 rounded-xl p-4 border-l-4 ${s.color}`}
            >
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scan Panel */}
        {showScanPanel && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <h2 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5" /> Platform Scanner
            </h2>
            <p className="text-sm text-neutral-500">
              Scan social platforms for potential video leads. The scanner searches for posts, comments, 
              and content matching your keywords and evaluates them as potential subjects for your channel.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Platform Picker */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PLATFORM_META) as Platform[]).map(p => {
                    const meta = PLATFORM_META[p];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={p}
                        onClick={() => setScanPlatform(p)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition
                          ${scanPlatform === p
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'}`}
                      >
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keywords */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Search Keywords (comma-separated)
                </label>
                <textarea
                  value={scanKeywords}
                  onChange={e => setScanKeywords(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                💡 Facebook, Instagram, and Marketplace require manual entry (no public API). Use the "Add Lead" button instead.
              </p>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm"
              >
                {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {scanning ? 'Scanning...' : `Scan ${PLATFORM_META[scanPlatform].label}`}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white outline-none placeholder:text-neutral-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>

          <select
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value as Platform | 'all')}
            className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="all">All Platforms</option>
            {Object.entries(PLATFORM_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'score' | 'date')}
            className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="score">Sort by Score</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            onClick={fetchLeads}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500">Loading leads…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Search className="w-12 h-12 mx-auto text-neutral-300" />
            <p className="text-neutral-500 font-medium">No leads found</p>
            <p className="text-sm text-neutral-400">Scan platforms or add leads manually to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(lead => {
              const platformMeta = PLATFORM_META[lead.platform as Platform] || PLATFORM_META.blog;
              const statusMeta = STATUS_META[lead.status] || STATUS_META.new;
              const PlatformIcon = platformMeta.icon;
              const StatusIcon = statusMeta.icon;
              const isExpanded = expandedLead === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden transition hover:shadow-md"
                >
                  {/* Row header */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                    onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                  >
                    {/* Platform icon */}
                    <PlatformIcon className={`w-5 h-5 shrink-0 ${platformMeta.color}`} />

                    {/* Score */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        lead.score >= 8
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : lead.score >= 5
                          ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
                      }`}
                    >
                      {lead.score}
                    </div>

                    {/* Title + author */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {lead.title}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">
                        by {lead.author || 'Unknown'} • {new Date(lead.discoveredAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      {lead.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <span
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${statusMeta.bg} ${statusMeta.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusMeta.label}
                    </span>

                    {/* Expand */}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100 dark:border-neutral-700 px-5 py-4 space-y-4">
                      {/* Content */}
                      {lead.content && (
                        <div>
                          <h4 className="text-xs font-medium text-neutral-500 uppercase mb-1">Content Preview</h4>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap line-clamp-6">
                            {lead.content}
                          </p>
                        </div>
                      )}

                      {/* Actions Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Score adjustment */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500 mr-1">Score:</span>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                            <button
                              key={s}
                              onClick={() => updateLeadScore(lead.id, s)}
                              className={`w-6 h-6 rounded text-[10px] font-bold transition ${
                                s <= lead.score
                                  ? s >= 8
                                    ? 'bg-green-500 text-white'
                                    : s >= 5
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-neutral-400 text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        {/* Status change */}
                        <select
                          value={lead.status}
                          onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                        >
                          {Object.entries(STATUS_META).map(([key, meta]) => (
                            <option key={key} value={key}>{meta.label}</option>
                          ))}
                        </select>

                        <a
                          href={lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" /> Open Source
                        </a>

                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium ml-auto"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>

                      {/* Notes */}
                      <div>
                        <h4 className="text-xs font-medium text-neutral-500 uppercase mb-1">Notes</h4>
                        {editingNotes === lead.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={notesDraft}
                              onChange={e => setNotesDraft(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Add notes about this lead…"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveNotes(lead.id)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingNotes(null)}
                                className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotes(lead.id);
                              setNotesDraft(lead.notes || '');
                            }}
                            className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg p-2 transition min-h-[40px]"
                          >
                            {lead.notes || <span className="italic text-neutral-400">Click to add notes…</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-lg mx-4 p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Add Lead Manually</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Platform</label>
                <select
                  value={newLead.platform}
                  onChange={e => setNewLead(p => ({ ...p, platform: e.target.value as Platform }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                >
                  {Object.entries(PLATFORM_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Title *</label>
                <input
                  value={newLead.title}
                  onChange={e => setNewLead(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                  placeholder="Lead title or headline"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">URL *</label>
                <input
                  value={newLead.url}
                  onChange={e => setNewLead(p => ({ ...p, url: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Author / Creator</label>
                <input
                  value={newLead.author}
                  onChange={e => setNewLead(p => ({ ...p, author: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                  placeholder="Username or name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Tags (comma-separated)</label>
                <input
                  value={newLead.tags}
                  onChange={e => setNewLead(p => ({ ...p, tags: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none"
                  placeholder="skoolie, bus life"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Content / Description</label>
                <textarea
                  value={newLead.content}
                  onChange={e => setNewLead(p => ({ ...p, content: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white resize-none outline-none"
                  placeholder="Why is this a good lead?"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
