'use client'
import React, { useState, useEffect } from 'react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {Switch} from '@/components/ui/switch'
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
  Eye,
  EyeOff,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteWebhookCredential, saveWebhookCredentials, WebhookCredentials } from '@/lib/db/content';
import { toast } from 'sonner';
import { useContent } from '@/context/GenerationContext';

// Mock Encryption/Decryption Utility (Simulating secure storage/retrieval)
const mockEncrypt = (data) => `ENC:${btoa(data)}`;
const mockDecrypt = (data) => data.startsWith('ENC:') ? atob(data.slice(4)) : data;

// Default state for a new webhook
const defaultWebhook = {
  url: '',
  trigger_event: 'content.complete',
  secret_key: "", // Auto-generate a strong initial secret
  is_active: true,
};

const TRIGGER_EVENTS = [
  { value: 'content.complete', label: 'Content Generation Complete' },
  { value: 'content.published', label: 'Content Published' },
  { value: 'content.draft', label: 'Content Saved as Draft' },
];

// --- Dialog Component (Simulating shadcn/ui Dialog) ---
interface WebhookFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  onSave: (data: any) => void;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const WebhookFormDialog = ({ isOpen, onClose, initialData, onSave, status, message }: WebhookFormDialogProps) => {
  const [formData, setFormData] = useState(initialData || defaultWebhook);
  // Local state for the message box to handle self-closing copy notifications
  const [messageBox, setMessageBox] = useState({ message: message, status: status });
  // control whether secret is shown or masked
  const [showSecret, setShowSecret] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update form data if initialData changes (e.g., when editing starts)
  useEffect(() => {
    // Decrypt the key for presentation in the form
    const decryptedData = initialData ? {
      ...initialData,
      secret_key: mockDecrypt(initialData.secret_key)
    } : { ...defaultWebhook, secret_key: crypto.randomUUID() };

    setFormData(decryptedData);
  }, [initialData]);

  // Sync global status message to local message box state
  useEffect(() => {
    // Added a slight delay for better transition visibility if needed
    const timer = setTimeout(() => setMessageBox({ message, status }), 50); 
    return () => clearTimeout(timer);
  }, [status, message]);


  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const url = new URL(formData.url.trim());
      if (url.protocol !== 'https:') {
        console.error("Validation Error: Only HTTPS URLs are permitted for security.");
        setMessageBox({ message: 'Validation Error: Only HTTPS URLs are permitted for security.', status: 'error' });
        return;
      }
    } catch(e) {
      console.error("Validation Error: Please provide a valid URL.");
      setMessageBox({ message: 'Validation Error: Please provide a valid URL.', status: 'error' });
      return;
    }

    if (!formData.secret_key) {
      console.error("Validation Error: Secret key is required.");
      setMessageBox({ message: 'Validation Error: Secret key is required.', status: 'error' });
      return;
    }

    onSave(formData);
  };

  const isEditing = !!initialData?.id;

  // Handler to safely close dialog and clear local messages
  const handleClose = () => {
      setMessageBox({message: '', status: 'idle'});
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-2xl">
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <h3 className="text-xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Webhook Integration' : 'Add New Webhook'}
          </h3>
          <button onClick={handleClose} className="text-neutral-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicator */}
        {messageBox.status !== 'idle' && messageBox.message && (
          <div className={cn(
            "p-4 mx-6 mt-4 rounded-lg text-xs flex items-center",
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
          <div className={'space-y-2.5'}>
            <Label icon={Link} className={'text-xs'} htmlFor="url">Destination Endpoint URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              className={'text-xs'}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://yourcms.com/api/webhooks/ingest"
              disabled={messageBox.status === 'loading'}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Must use HTTPS. The server checks the IP for SSRF prevention.
            </p>
          </div>

          {/* Secret Key Input */}
          <div className={'space-y-2.5'}>
            <Label htmlFor="secret" className={'text-xs'} icon={Key}>Secret Key / Validation Token</Label>
            <div className="flex space-x-2">
              <Input
                id="secret"
                type={showSecret ? 'text' : 'password'}
                value={formData.secret_key}
                className={'text-xs'}
                onChange={(e) => setFormData(prev => ({ ...prev, secret_key: e.target.value }))}
                placeholder="Automatically generated secure token"
                disabled={messageBox.status === 'loading'}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const text = formData.secret_key || '';
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(text);
                      } else if (typeof document.execCommand === 'function') {
                        const textarea = document.createElement('textarea');
                        textarea.value = text;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                      } else {
                        throw new Error('Clipboard not available');
                      }

                      setMessageBox({ message: 'Secret Key copied to clipboard!', status: 'success' });
                      setTimeout(() => setMessageBox({ message: '', status: 'idle' }), 1000);
                    } catch (err) {
                      setMessageBox({ message: 'Copy failed. Browser not supported.', status: 'error' });
                    }
                  }}
                  className="h-10 px-3  bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-md text-xs transition-colors flex items-center"
                  title="Copy Key"
                  variant="secondary"
                >
                  <Clipboard className="w-4 h-4 mr-1" /> Copy
                </Button>

                <Button
                  onClick={() => setShowSecret(s => !s)}
                  className="h-10 px-3  bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-md text-xs transition-colors flex items-center"
                  title={showSecret ? 'Hide secret' : 'Show secret'}
                  variant="secondary"
                >
                  {showSecret ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />} {showSecret ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
          </div>

          {/* Trigger and Active Status (Dropdown and Switch) */}
          <div className="flex space-x-4">
            {/* Trigger Event Dropdown */}
            <div className="flex-1 space-y-2.5">
              <Label htmlFor="trigger" className={'text-xs'} icon={Zap}>Trigger Event</Label>
              <DropdownMenu>
                <DropdownMenuTrigger 
                  onClick={() => setIsDropdownOpen(p => !p)} 
                  className="h-10 w-full justify-start px-3 bg-neutral-200 center font-medium rounded-md text-xs" 
                  disabled={messageBox.status === 'loading'}
                >
                  <span className="truncate">{TRIGGER_EVENTS.find(e => e.value === formData.trigger_event)?.label}</span>
                  {/* <ChevronDown className="ml-2 h-4 w-4 opacity-50" /> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {TRIGGER_EVENTS.map((event) => (
                    <DropdownMenuItem
                      key={event.value}
                      className={cn('text-xs font-medium p-2 hover:bg-neutral-300 transition-300')}
                      onSelect={() => {
                        setFormData(prev => ({ ...prev, trigger_event: event.value }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      {event.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Status Switch */}
            <div className="flex-1 space-y-2.5">
              <Label htmlFor="active" className={'text-xs'} icon={Zap}>Status: {formData.is_active ? 'Active' : 'Disabled'}</Label>
              <div className="flex items-center h-10 px-3 pt-1">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  disabled={messageBox.status === 'loading'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-end p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
          <div className="flex space-x-2">
            <Button className={cn('transition-300 hover:bg-neutral-300 rounded-sm text-xs')} onClick={handleClose} disabled={messageBox.status === 'loading'}>
              Cancel
            </Button>
            <Button  className={cn('bg-black transition-300 text-xs rounded-sm hover:bg-neutral-800')} onClick={handleSave} disabled={messageBox.status === 'loading'}>
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
  const {
    webhookCredentials: webhooks,
    setWebhookCredentials: setWebhooks,
    isWebhookCredentialsLoading
  } = useContent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);

  // UI Status State (used for global actions like delete or toggle)
  const [status, setStatus] = useState<'idle'| 'loading'| 'success'| 'error'>('idle');
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

  const handleSave = async (data) => {
    setStatus('loading');
    setMessage(data.id ? 'Updating webhook...' : 'Creating new webhook...');

    try {
      const dataToSave = {
        ...data,
        // Re-encrypt the key before saving to mock persistent storage
        secret_key: mockEncrypt(data.secret_key),
        updated_at: Date.now(),
      };

      await saveWebhookCredentials(dataToSave);

      if (data.id) {
        // Update existing hook (use current webhooks snapshot)
        setWebhooks(webhooks.map(hook => hook.id === data.id ? { ...dataToSave, id: data.id } : hook));
      } else {
        // Add new hook
        const newHook = { ...dataToSave, id: crypto.randomUUID(), created_at: Date.now() };
        setWebhooks([...webhooks, newHook]);
      }

      setMessage(data.id ? 'Webhook updated successfully!' : 'New webhook created successfully!');
      setStatus('success');

      // Close dialog after success
      setTimeout(() => {
        setStatus('idle');
        setIsDialogOpen(false);
      }, 1000);

    }catch (e) {
      toast.error(e.message || "Error saving webhook...");
      setMessage("Error saving webhook...");
      setStatus('error');
    }finally {

    }
  };

  const handleDelete = async (id) => {
    setStatus('loading');
    setMessage('Deleting webhook...');
    try {
      await deleteWebhookCredential(id);

      setWebhooks(webhooks.filter(hook => hook.id !== id));
      setMessage('Webhook deleted.');
      setStatus('success');
      setStatus('idle')
    } catch (e) {
      toast.error(e.message || "Error deleting webhook...");
      setMessage("Error deleting webhook...");
      setStatus('error');
      return;
    }
  };

  const handleToggleActive = (hook) => {
    setStatus('loading');
    const newStatus = !hook.is_active;

    setTimeout(() => {
      setWebhooks(webhooks.map(h => h.id === hook.id ? { ...h, is_active: newStatus } : h));
      setMessage(`Webhook ${newStatus ? 'activated' : 'deactivated'}.`);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1500);
    }, 500); // Mock network delay
  };


  return (
    <div className="p-2 bg-neutral-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header and Add Button */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-neutral-200">
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center">
            <Zap className="mr-2 h-6 w-6 text-black" />
            Webhook Integrations
          </h1>
          <Button  className={cn('bg-black transition-300 text-xs rounded-sm hover:bg-neutral-800')}  onClick={startCreate} disabled={status === 'loading'}>
            <Plus className="h-4 w-4 mr-2" /> Add New Webhook
          </Button>
        </div>

        {/* Global Status Display */}
        {message && status !== 'idle' && status !== 'loading' && (
          <div className={cn(
            "p-3 mb-4 rounded-lg text-xs flex items-center",
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
        ) : isWebhookCredentialsLoading ? (
          <div className="flex flex-col space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col border rounded-xl bg-white p-3 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-neutral-200" />
                    <div className="flex flex-col">
                      <Skeleton className="h-5 w-48 rounded-md bg-neutral-200" />
                      <Skeleton className="h-3 w-28 mt-1 rounded-md bg-neutral-200" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md bg-neutral-200" />
                    <Skeleton className="h-8 w-8 rounded-md bg-neutral-200" />
                    <Skeleton className="h-8 w-8 rounded-md bg-neutral-200" />
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <Skeleton className="h-4 w-full rounded-sm bg-neutral-200" />
                  <Skeleton className="h-3 w-2/3 mt-2 rounded-sm bg-neutral-200" />
                </div>

                <div className="flex justify-between items-center text-xs mt-2 text-neutral-500">
                  <Skeleton className="h-3 w-28 rounded-sm bg-neutral-200" />
                  <Skeleton className="h-3 w-36 rounded-sm bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="flex flex-col space-y-4 max-h-[78dvh] rounded-lg pr-3">
            {webhooks.length === 0 ? (
              <div className="text-center p-8 border border-neutral-200 rounded-lg bg-white shadow-sm">
                <Database className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-neutral-700">No webhooks configured.</p>
                <p className="text-xs text-neutral-500">
                  Start automating by adding your first content ingestion endpoint.
                </p>
              </div>
            ) : (
              webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className={cn(
                    "flex flex-col border rounded-xl mb-4 bg-white p-3 shadow-sm transition-300",
                    hook.is_active ? 'border-neutral-400 hover:shadow-lg' : 'border-neutral-300  opacity-70 hover:opacity-100 hover:shadow-md'
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
                        <div className="text-xs text-neutral-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(hook.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2.5">
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
                    <code className="text-xs font-mono text-neutral-900 break-all">
                      {hook.url}
                    </code>
                  </div>

                  <div className="flex justify-between items-center text-xs! mt-2 text-neutral-500">
                    <span>Trigger: <span className="font-medium text-black">{hook.trigger_event}</span></span>
                    <span>Secured by Secret Key</span>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        )}
      </div>

      {/* Webhook Dialog */}
      <WebhookFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={editingWebhook}
        onSave={handleSave}
        status={status}
        message={message}
      />
    </div>
  );
};