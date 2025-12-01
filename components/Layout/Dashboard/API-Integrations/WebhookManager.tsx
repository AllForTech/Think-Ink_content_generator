'use client'
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Link,
  Key,
  Database,
  X,
  Plus,
  Trash2,
  Edit,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Clipboard,
  Calendar,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock Encryption/Decryption Utility (Simulating secure storage/retrieval)
const mockEncrypt = (data) => `ENC:${btoa(data)}`;
const mockDecrypt = (data) => data.startsWith('ENC:') ? atob(data.slice(4)) : data;

// Default state for a new webhook
const defaultWebhook = {
  url: '',
  trigger_event: 'content.complete',
  secret_key: crypto.randomUUID(), // Auto-generate a strong initial secret
  is_active: true,
};

// --- Mock Data Setup ---
const initialMockWebhooks = [
  {
    id: 'hook_1',
    url: 'https://staging.cms-backend.io/api/ingest',
    secret_key: mockEncrypt('MyCmsSecretToken'),
    trigger_event: 'content.complete',
    is_active: true,
    created_at: Date.now() - 86400000,
  },
  {
    id: 'hook_2',
    url: 'https://dev.marketing-tool.net/receive-updates',
    secret_key: mockEncrypt('MarketingApi123'),
    trigger_event: 'content.complete',
    is_active: false,
    created_at: Date.now() - 3600000,
  },
];

// --- Dialog Component (Simulating shadcn/ui Dialog) ---
const WebhookFormDialog = ({ isOpen, onClose, initialData, onSave, status, message }) => {
  const [formData, setFormData] = useState(initialData || defaultWebhook);
  const [messageBox, setMessageBox] = useState({ message: message, status: status });

  // Update form data if initialData changes (e.g., when editing starts)
  useEffect(() => {
    // We decrypt the key for presentation in the form
    const decryptedData = initialData ? {
      ...initialData,
      secret_key: mockDecrypt(initialData.secret_key)
    } : { ...defaultWebhook, secret_key: crypto.randomUUID() };

    setFormData(decryptedData);
  }, [initialData]);

  useEffect(() => {
    setMessageBox({ message, status })
  }, [status, message]);


  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const url = new URL(formData.url.trim());
      if (url.protocol !== 'https:') {
        // Using console.error instead of alert as per instructions
        console.error("Validation Error: Only HTTPS URLs are permitted for security.");
        // setMessageBox('Validation Error: Only HTTPS URLs are permitted for security.', 'error');
        return;
      }
    } catch(e) {
      console.error("Validation Error: Please provide a valid URL.");
      // setMessageBox('Validation Error: Please provide a valid URL.', 'error');
      return;
    }

    if (!formData.secret_key) {
      console.error("Validation Error: Secret key is required.");
      // setMessageBox('Validation Error: Secret key is required.', 'error');
      return;
    }

    onSave(formData);
  };

  const isEditing = !!initialData?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-2xl">
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <h3 className="text-xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Webhook Integration' : 'Add New Webhook'}
          </h3>
          <button onClick={() => {onClose(); setMessageBox({message: '', status: 'idle'})}} className="text-neutral-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicator */}
        {messageBox.status !== 'idle' && messageBox.message && (
          <div className={cn(
            "p-4 mx-6 mt-4 rounded-lg text-sm flex items-center",
            messageBox.status === 'loading' && "bg-neutral-100 text-neutral-700",
            messageBox.status === 'error' && "bg-red-50 text-red-600 border border-red-200",
            messageBox.status === 'success' && "bg-green-50 text-green-700 border border-green-200",
          )}>
            {messageBox.status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {messageBox.status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
            {messageBox.status === 'error' && <AlertTriangle className="mr-2 h-4 w-4" />}
            {messageBox.message}
          </div>
        )}

        {/* Dialog Content */}
        <div className="p-6 space-y-4">

          {/* URL Input */}
          <div>
            <Label htmlFor="url">Destination Endpoint URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://yourcms.com/api/webhooks/ingest"
              disabled={messageBox.status === 'loading'}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Must use HTTPS. The server checks the IP for SSRF prevention.
            </p>
          </div>

          {/* Secret Key Input */}
          <div>
            <Label htmlFor="secret" icon={Key}>Secret Key / Validation Token</Label>
            <div className="flex space-x-2">
              <Input
                id="secret"
                type="text"
                value={formData.secret_key}
                onChange={(e) => setFormData(prev => ({ ...prev, secret_key: e.target.value }))}
                placeholder="Automatically generated secure token"
                disabled={messageBox.status === 'loading'}
              />
              <Button
                onClick={() => {
                  // Clipboard function replacement for iFrame safety
                  if (typeof document.execCommand === 'function') {
                    const textarea = document.createElement('textarea');
                    textarea.value = formData.secret_key;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    setMessageBox({ message: "Secret Key copied to clipboard!", status: 'success' });
                    setTimeout(() => setMessageBox({ message: '', status: 'idle' }), 1000);
                  } else {
                    setMessageBox({ message: "Copy failed. Browser not supported.", status: 'error' });
                  }
                }}
                className="h-10 px-3 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-md text-sm transition-colors flex items-center"
                title="Copy Key"
                variant="secondary"
              >
                <Clipboard className="w-4 h-4 mr-1" /> Copy
              </Button>
            </div>
          </div>

          {/* Trigger and Active Status (Read-Only) */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="trigger" icon={Zap}>Trigger Event</Label>
              <Input id="trigger" value={formData.trigger_event} readOnly className="bg-neutral-100 text-neutral-600" />
            </div>
            <div className="flex-1">
              <Label htmlFor="active" icon={formData.is_active ? ToggleRight : ToggleLeft}>Status</Label>
              <Input id="active" value={formData.is_active ? 'Active' : 'Disabled'} readOnly className={cn("text-sm font-medium", formData.is_active ? "text-green-600 bg-green-50" : "text-neutral-500 bg-neutral-100")} />
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-end p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => {onClose(); setMessageBox({message: '', status: 'idle'})}} disabled={messageBox.status === 'loading'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={messageBox.status === 'loading'}>
              {messageBox.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditing ? 'Save Changes' : 'Add Webhook'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Webhook Manager Component ---
export const WebhookManager = () => {
  // Initialize state with mock data. We decrypt for display purposes.
  const [webhooks, setWebhooks] = useState(initialMockWebhooks.map(h => ({
    ...h,
    secret_key: mockDecrypt(h.secret_key),
  })));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);

  // UI Status State (used for global actions like delete or toggle)
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  // --- CRUD Handlers (Local State Management) ---

  const startCreate = () => {
    setEditingWebhook({ ...defaultWebhook, secret_key: crypto.randomUUID() });
    setIsDialogOpen(true);
  };

  const startEdit = (hook) => {
    // Pass the hook object to the dialog for pre-filling
    setEditingWebhook(hook);
    setIsDialogOpen(true);
  };

  const handleSave = (data) => {
    setStatus('loading');
    setMessage(data.id ? 'Updating webhook...' : 'Creating new webhook...');

    // Simulate async operation delay
    setTimeout(() => {
      const dataToSave = {
        ...data,
        // Re-encrypt the key before saving to mock persistent storage
        secret_key: mockEncrypt(data.secret_key),
        updated_at: Date.now(),
      };

      setWebhooks(prevHooks => {
        if (data.id) {
          // Update existing hook
          return prevHooks.map(hook =>
            hook.id === data.id ? { ...dataToSave, id: data.id } : hook
          );
        } else {
          // Add new hook
          const newHook = {
            ...dataToSave,
            id: crypto.randomUUID(),
            created_at: Date.now()
          };
          return [...prevHooks, newHook];
        }
      });

      setMessage(data.id ? 'Webhook updated successfully!' : 'New webhook created successfully!');
      setStatus('success');

      // Close dialog after success
      setTimeout(() => {
        setStatus('idle');
        setIsDialogOpen(false);
      }, 1000);

    }, 500); // Mock network delay
  };

  const handleDelete = (id) => {
    // Substitute for custom confirmation dialog
    if (!window.confirm("Confirm deletion: This action cannot be undone.")) return;

    setStatus('loading');
    setMessage('Deleting webhook...');

    setTimeout(() => {
      setWebhooks(prevHooks => prevHooks.filter(hook => hook.id !== id));
      setMessage('Webhook deleted.');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1500);
    }, 500); // Mock network delay
  };

  const handleToggleActive = (hook) => {
    setStatus('loading');
    const newStatus = !hook.is_active;

    setTimeout(() => {
      setWebhooks(prevHooks => prevHooks.map(h =>
        h.id === hook.id ? { ...h, is_active: newStatus } : h
      ));
      setMessage(`Webhook ${newStatus ? 'activated' : 'deactivated'}.`);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1500);
    }, 500); // Mock network delay
  };


  return (
    <div className="p-2 bg-neutral-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header and Add Button */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-neutral-200">
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center">
            <Zap className="mr-2 h-6 w-6 text-black" />
            Webhook Integrations
          </h1>
          <Button variant="primary" onClick={startCreate} disabled={status === 'loading'}>
            <Plus className="h-4 w-4 mr-2" /> Add New Webhook
          </Button>
        </div>

        {/* Global Status Display */}
        {message && status !== 'idle' && status !== 'loading' && (
          <div className={cn(
            "p-3 mb-4 rounded-lg text-sm flex items-center",
            status === 'error' && "bg-red-50 text-red-600 border border-red-200",
            status === 'success' && "bg-green-50 text-green-700 border border-green-200",
          )}>
            {status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
            {status === 'error' && <AlertTriangle className="mr-2 h-4 w-4" />}
            {message}
          </div>
        )}

        {/* Webhooks List */}
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-neutral-200 rounded-lg shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-black mb-4" />
            <p className="text-lg font-medium text-neutral-700">{message}</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {webhooks.length === 0 ? (
              <div className="text-center p-12 border border-neutral-200 rounded-lg bg-white shadow-sm">
                <Database className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-neutral-700">No webhooks configured.</p>
                <p className="text-sm text-neutral-500">
                  Start automating by adding your first content ingestion endpoint.
                </p>
              </div>
            ) : (
              webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className={cn(
                    "flex flex-col border rounded-xl bg-white p-4 shadow-sm transition-shadow",
                    hook.is_active ? 'border-black/50 hover:shadow-lg' : 'border-neutral-300 hover:shadow-md'
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                                    <span
                                      className={cn(
                                        "p-2 rounded-full",
                                        hook.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                                      )}
                                    >
                                        <Zap className="h-5 w-5" />
                                    </span>
                      <div className="flex flex-col">
                        <div className="text-lg font-semibold text-neutral-900 flex items-center">
                          {hook.is_active ? 'Active' : 'Disabled'} Integration
                        </div>
                        <div className="text-sm text-neutral-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(hook.created_at || hook.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="secondary" onClick={() => startEdit(hook)} className="h-8 px-2.5" title="Edit Webhook">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" onClick={() => handleToggleActive(hook)} className="h-8 px-2.5" title={hook.is_active ? "Deactivate" : "Activate"}>
                        {hook.is_active ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5" />}
                      </Button>
                      <Button variant="secondary" onClick={() => handleDelete(hook.id)} className="h-8 px-2.5 text-red-600 hover:bg-red-100" title="Delete Webhook">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-600 mb-1">Destination URL</p>
                    <code className="text-sm font-mono text-neutral-900 break-all">
                      {hook.url}
                    </code>
                  </div>

                  <div className="flex justify-between items-center text-xs mt-2 text-neutral-500">
                    <span>Trigger: <span className="font-medium text-black">{hook.trigger_event}</span></span>
                    <span>Secured by Secret Key</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Webhook Dialog */}
      <WebhookFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={editingWebhook}
        onSave={handleSave}
        status={'idle'} // Global status doesn't apply to dialog's internal actions
        message={''}
      />
    </div>
  );
};