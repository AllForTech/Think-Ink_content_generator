'use client'
import { useAuth } from '@/context/AuthContext';
import { fetchUserApiKeys, generateAndStoreNewApiKey, revokeOrUnrevokeApiKey } from '@/lib/db/content';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

/**
 * Utility to copy text to clipboard
 */
const copyToClipboard = (text) => {
    try {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        return true;
    } catch (err) {
        return false;
    }
};

const SkeletonLoader = () => (
   <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="flex justify-end pt-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
            </div>
        ))}
    </div>
);

const NewKeyDialog = ({ isOpen, onClose, userId, onKeyGenerated }) => {
    const [keyName, setKeyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [plainTextKey, setPlainTextKey] = useState('');
    const [error, setError] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!keyName.trim() || !userId) return;

        setIsLoading(true);
        setError(null);
        setPlainTextKey('');

        try {
            const plainTextKey = await generateAndStoreNewApiKey(keyName.trim());

            if (plainTextKey) {
                setPlainTextKey(plainTextKey);
                onKeyGenerated();
            } else {
                setError('Failed to generate key.');
            }
        } catch (err) {
            setError(err.message.toString() || 'Network error during key generation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setKeyName('');
        setPlainTextKey('');
        setError(null);
        onClose();
    };

    // Simulated Shadcn Dialog structure (Light theme)
    return (
        <div className={`fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 hidden'}`}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="fixed top-1/2 left-1/2 w-[90%] sm:w-[500px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 text-gray-900 p-6 rounded-lg shadow-2xl flex flex-col">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
                    {plainTextKey ? 'Key Generated!' : 'Create New API Key'}
                </h3>
                
                {plainTextKey ? (
                    <div className="space-y-4">
                        <p className="text-sm text-green-700 font-semibold">
                            ⚠️ SUCCESS: Copy the key below. It will not be shown again.
                        </p>
                        <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                            <code className="grow text-gray-900 break-all select-all text-sm">{plainTextKey}</code>
                            <button
                                onClick={() => copyToClipboard(plainTextKey)}
                                className="text-gray-500 hover:text-green-600 transition-colors p-1"
                                title="Copy"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                            </button>
                        </div>
                        <button onClick={handleClose} className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-700 py-2 rounded-lg font-semibold">
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Key Name (e.g., 'Integration for Blog')"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            required
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:outline-none placeholder-gray-500 text-sm"
                            disabled={isLoading}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors text-xs">
                                Cancel
                            </button>
                            <button type="submit" className={`px-4 py-2 bg-black text-white rounded-md font-semibold transition-opacity text-xs ${isLoading ? 'opacity-50' : 'hover:bg-gray-700'}`} disabled={isLoading}>
                                {isLoading ? 'Generating...' : 'Create Key'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const ApiKeysDashboard = () => {
    const { user} = useAuth();
    const userId = useMemo(() => user?.id || null, [user]); 

    const [isLoading, setIsLoading] = useState(true);
    const [keys, setKeys] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [message, setMessage] = useState(null);

    // 2. Data Fetching (GET /api/keys)
    const fetchKeys = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            const keys = await fetchUserApiKeys();
            if (keys) {
                setKeys(keys || []);
            } else {
                setMessage({ type: 'error', text: 'Failed to load keys.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Network error while fetching keys.' });
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);


    const handleRevoke = async (keyId, state) => {
        if (!window.confirm("Are you sure you want to permanently revoke this API key? This cannot be undone.")) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await revokeOrUnrevokeApiKey(keyId, state);
            if (response) {
                setMessage({ type: 'success', text: "Key revoke successfully" });
                fetchKeys(); // Refresh the list
            } else {
                setMessage({ type: 'error', text: 'Failed to revoke key.' });
                setIsLoading(false); 
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Network error while revoking key.' });
            setIsLoading(false);
        }
    };
    
    // Utility for date formatting
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        // Assuming dateValue is an ISO string or a Firestore Timestamp object from the API
        const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isDataLoading = isLoading;
    
    // Main Dashboard Render (Light theme)
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8 font-sans flex flex-col items-center">
            
            <NewKeyDialog 
                isOpen={showDialog} 
                onClose={() => setShowDialog(false)} 
                userId={userId} 
                onKeyGenerated={() => {
                    setShowDialog(false);
                    fetchKeys();
                    setMessage({ type: 'success', text: 'Key generated successfully! Check the dialog for the key value.' });
                }} 
            />

            <div className="w-full max-w-6xl flex flex-col">
                <header className="mb-8 border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-extrabold text-gray-900">API Keys Dashboard</h1>
                        <button 
                            onClick={() => setShowDialog(true)} 
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-150 text-sm disabled:opacity-50"
                            disabled={isDataLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span className="hidden sm:inline">New Key</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Use these keys to access your data via the external platform API.
                    </p>
                </header>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                
                {/* Key List / Skeleton Loader */}
                <div className="bg-white rounded-xl overflow-hidden">
                    {isDataLoading ? (
                        <SkeletonLoader />
                    ) : (
                        <div className="p-4 sm:p-6">
                            {keys.length === 0 ? (
                                <p className="text-center py-10 text-gray-500 text-sm">
                                    You have no API keys. Click "New Key" to create one.
                                </p>
                            ) : (
                                <div className="space-y-4 flex flex-col">
                                    {keys.map((key) => (
                                       <div 
                                        key={key.id} 
                                        className={`w-full rounded-lg border p-4 shadow-lg shadow-neutral-200 transition-all duration-200 ${key.isActive
                                            ? 'border-black/20 bg-neutral-100 hover:bg-neutral-200'
                                            : 'border-black/10 bg-neutral-200/50 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        {/* TOP SECTION: Name, Status, and REVOKE BUTTON */}
                                        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                                            
                                            {/* Left Section: Icon, Key Name, Status */}
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={`rounded-full border border-black p-2 transition-colors ${key.isActive ? 'bg-black text-white' : 'bg-white text-black/50'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold tracking-wide uppercase text-gray-900">
                                                        {key.name}
                                                    </p>
                                                    <div className="flex items-center text-xs font-semibold text-black/70">
                                                        <span
                                                            className="mr-2 h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: key.isActive ? 'green' : 'red' }}
                                                        ></span>
                                                        {key.isActive ? 'Active' : 'Revoked'}
                                                    </div>
                                                </div>

                                                {/* REVOKE BUTTON (Subtle, Icon-only) */}
                                                
                                                    <button
                                                        onClick={() => handleRevoke(key.id, key.isActive === true ? false : true)}
                                                        disabled={isDataLoading}
                                                        className="h-8 w-8 p-0 center text-red-600 transition-colors hover:bg-neutral-300 hover:text-red-800 rounded-full"
                                                        title="Revoke Key"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                            
                                            </div>

                                            {/* Right Section: Creation Date */}
                                            <div className="flex flex-col text-right">
                                                <div className="flex items-center justify-end space-x-2 text-xs">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-black/70"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                    <span className="font-medium text-black/90">Created:</span>
                                                    <span className="font-semibold text-black">{formatDate(key.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BOTTOM SECTION: Metadata Details (ID, Last Used) */}
                                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-black/10 pt-3 text-sm md:flex md:flex-wrap md:space-x-8">
                                            
                                            {/* Key ID
                                            <div className="flex max-w-md items-center text-neutral-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-3.5 w-3.5 text-black/60"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                <span className="mr-1.5 font-bold text-black text-xs">Key ID:</span>
                                                <code className="rounded border border-black/20 bg-white px-2 py-0.5 font-mono text-xs text-black/80">
                                                    {key.id}
                                                </code>
                                            </div> */}

                                            {/* Last Used */}
                                            <div className="flex items-center text-neutral-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-3.5 w-3.5 text-black/60"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                <span className="mr-1.5 font-bold text-black text-xs">Last Used:</span>
                                                <span className="capitalize text-xs">{formatDate(key.lastUsed)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(ApiKeysDashboard);