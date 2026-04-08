'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';

// Lead types matching the API
interface LeadData extends Record<string, string> {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  client_segment: string;
  city: string;
  message: string;
  urgency_level: string;
  preferred_contact_method: string;
  site_or_event_location: string;
  date_or_start_date: string;
  shift_hours: string;
  number_of_personnel: string;
  male_or_female_staff: string;
  uniform_or_plain_clothes: string;
  duration: string;
  travel_required: string;
  guest_count: string;
  bouncers_required: string;
  site_type: string;
  cctv_access: string;
}

interface Lead {
  _id: string;
  type: 'contact' | 'emergency';
  status: 'new' | 'contacted' | 'converted' | 'lost';
  data: LeadData;
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

type LeadType = 'contact' | 'emergency';
type LeadStatus = 'new' | 'contacted' | 'converted' | 'lost';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const TYPE_OPTIONS: { value: LeadType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'contact', label: 'Contact' },
  { value: 'emergency', label: 'Emergency' },
];

const STATUS_FILTER_OPTIONS: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

// Field labels for display
const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  service_type: 'Service Type',
  client_segment: 'Client Segment',
  city: 'City',
  message: 'Brief / Message',
  urgency_level: 'Urgency Level',
  preferred_contact_method: 'Preferred Contact Method',
  site_or_event_location: 'Site/Event Location',
  date_or_start_date: 'Date/Start Date',
  shift_hours: 'Shift Hours',
  number_of_personnel: 'Number of Personnel',
  male_or_female_staff: 'Staff Gender',
  uniform_or_plain_clothes: 'Appearance',
  duration: 'Duration',
  travel_required: 'Travel Required',
  guest_count: 'Guest Count',
  bouncers_required: 'Bouncers Required',
  site_type: 'Site Type',
  cctv_access: 'CCTV Access',
};

function getDisplayDetailEntries(data: Record<string, string> | undefined): Array<[string, string]> {
  const safeData = data ?? {};

  const knownEntries = Object.keys(FIELD_LABELS).map((key) => {
    if (key === 'message') {
      const legacyMessage =
        safeData.message ??
        safeData.brief_or_message ??
        safeData.brief ??
        '';
      return [key, legacyMessage] as [string, string];
    }

    return [key, safeData[key] ?? ''] as [string, string];
  });

  const extraEntries = Object.entries(safeData).filter(([key]) => !(key in FIELD_LABELS));

  return [...knownEntries, ...extraEntries].filter(([key, value]) => {
    if (key === 'message') return true;
    return value.trim() !== '';
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBadgeClass(status: LeadStatus): string {
  switch (status) {
    case 'new':
      return styles.badgeNew;
    case 'contacted':
      return styles.badgeContacted;
    case 'converted':
      return styles.badgeConverted;
    case 'lost':
      return styles.badgeLost;
    default:
      return styles.badge;
  }
}

function getTypeBadgeClass(type: LeadType): string {
  return type === 'emergency' ? styles.badgeLost : styles.badgeContacted;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filters and pagination
  const [typeFilter, setTypeFilter] = useState<LeadType | ''>('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/admin/leads?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data: LeadsResponse = await response.json();
      setLeads(data.leads);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic update
    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setToast({ message: 'Status updated successfully', type: 'success' });
      // Refetch to ensure consistency
      fetchLeads();
    } catch (err) {
      // Revert optimistic update
      setLeads(previousLeads);
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const toggleExpand = (leadId: string) => {
    setExpandedLeadId((prev) => (prev === leadId ? null : leadId));
  };

  const handleTypeFilterChange = (value: LeadType | '') => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: LeadStatus | '') => {
    setStatusFilter(value);
    setPage(1);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Leads Manager</h1>
        <p className={styles.pageSubtitle}>
          View and manage contact form submissions and emergency requests
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.toastSuccess : styles.toastError
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <select
          className={`${styles.formInput} ${styles.formSelect}`}
          value={typeFilter}
          onChange={(e) => handleTypeFilterChange(e.target.value as LeadType | '')}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={`${styles.formInput} ${styles.formSelect}`}
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value as LeadStatus | '')}
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className={styles.card}>
        {loading ? (
          <p style={{ color: '#8a9099', textAlign: 'center', padding: '2rem' }}>
            Loading leads...
          </p>
        ) : error ? (
          <p style={{ color: '#f87171', textAlign: 'center', padding: '2rem' }}>
            {error}
          </p>
        ) : leads.length === 0 ? (
          <p style={{ color: '#8a9099', textAlign: 'center', padding: '2rem' }}>
            No leads found matching your filters.
          </p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Service</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => [
                  <tr
                    key={`${lead._id}-row`}
                    onClick={() => toggleExpand(lead._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>{lead.data.name || 'N/A'}</td>
                    <td>{lead.data.phone || 'N/A'}</td>
                    <td>
                      <span className={`${styles.badge} ${getTypeBadgeClass(lead.type)}`}>
                        {lead.type}
                      </span>
                    </td>
                    <td>{lead.data.service_type || 'N/A'}</td>
                    <td>{lead.data.city || 'N/A'}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`${styles.formInput} ${styles.formSelect} ${styles.btnSmall}`}
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value as LeadStatus)
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>,
                  expandedLeadId === lead._id ? (
                    <tr key={`${lead._id}-expanded`} className={styles.expandedRow}>
                      <td colSpan={8}>
                          <div className={styles.expandedContent}>
                          <div className={styles.detailGrid}>
                            {getDisplayDetailEntries(lead.data).map(([key, value]) => (
                                <div key={key} className={styles.detailItem}>
                                  <div className={styles.detailLabel}>
                                    {FIELD_LABELS[key] || key}
                                  </div>
                                  <div className={styles.detailValue}>{value && value.trim() ? value : 'Not provided'}</div>
                                </div>
                              ))}
                          </div>
                          <div style={{ marginTop: '1rem', color: '#8a9099', fontSize: '0.8rem' }}>
                            Lead ID: {lead._id} | Created: {formatDate(lead.createdAt)} |
                            Updated: {formatDate(lead.updatedAt)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null,
                ])}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Showing {startIndex}-{endIndex} of {total} leads
              </span>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
