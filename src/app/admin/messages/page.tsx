"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Search, MailOpen, Mail, Loader2, 
  CheckCircle, AlertTriangle, Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { orderBy, query, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getDocumentsWithAuth, 
  updateDocumentWithAuth, 
  deleteDocumentWithAuth 
} from '@/lib/firestoreWithAuth';
import { auth } from '@/lib/firebase';

// Define ContactMessage interface
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
}

interface FirebaseError extends Error {
  code?: string;
}

const AdminMessagesPage = () => {
  const router = useRouter();
  const { isAdmin, loading: authLoading, logout } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByRead, setFilterByRead] = useState<'all' | 'read' | 'unread'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<FirebaseError | null>(null);

  // Memoize fetchMessages function
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedMessages = await getDocumentsWithAuth<ContactMessage>(
        'contact-messages',
        (q) => query(q, orderBy('createdAt', 'desc'))
      );
      
      setMessages(fetchedMessages);
    } catch (error: unknown) {
      console.error("Error fetching messages:", error);
      const firebaseError = error as FirebaseError;
      setError(firebaseError);
      setActionResult({ 
        success: false, 
        message: `Failed to load messages: ${firebaseError.message || 'Unknown error'}` 
      });
      
      // If permission denied, attempt to logout and redirect
      if (firebaseError.code === 'permission-denied') {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Check authentication on component mount
  useEffect(() => { 
    if (!authLoading) {
      if (isAdmin === false) {
        router.push('/login');
      } else if (isAdmin === true) {
        fetchMessages();
      }
    }
  }, [authLoading, isAdmin, router, fetchMessages]);

  useEffect(() => {
    const refreshAuthToken = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true);
          sessionStorage.setItem('firebaseToken', token);
        } catch {
        }
      }
    };
  
    refreshAuthToken();
  }, []);
  
  // Clear action result after 3 seconds
  useEffect(() => {
    if (actionResult) {
      const timer = setTimeout(() => {
        setActionResult(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [actionResult]);
  
  // Mark message as read/unread
  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await updateDocumentWithAuth('contact-messages', id, { 
        read: !currentReadStatus 
      });
      
      // Update local state
      setMessages(messages.map(message => 
        message.id === id ? { ...message, read: !currentReadStatus } : message
      ));
      
      // Update selected message if it's the one being toggled
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({
          ...selectedMessage,
          read: !currentReadStatus
        });
      }
      
      setActionResult({ 
        success: true, 
        message: `Message marked as ${!currentReadStatus ? 'read' : 'unread'}` 
      });
    } catch (error: unknown) {
      console.error("Error toggling read status:", error);
      const firebaseError = error as FirebaseError;
      setActionResult({ 
        success: false, 
        message: `Failed to update message status: ${firebaseError.message}` 
      });
      
      if (firebaseError.code === 'permission-denied') {
        logout();
      }
    }
  };
  
  // Delete message
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteDocumentWithAuth('contact-messages', id);
      
      // Remove from local state
      setMessages(messages.filter(message => message.id !== id));
      
      // Close detail view if the deleted message was selected
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      
      setActionResult({ 
        success: true, 
        message: "Message deleted successfully" 
      });
    } catch (error: unknown) {
      console.error("Error deleting message:", error);
      const firebaseError = error as FirebaseError;
      setActionResult({ 
        success: false, 
        message: `Failed to delete message: ${firebaseError.message}` 
      });
      
      if (firebaseError.code === 'permission-denied') {
        logout();
      }
    } finally {
      setIsDeleting(null);
      setShowDeleteConfirm(null);
    }
  };
  
  // Open message detail
  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.read) {
      handleToggleRead(message.id, false);
    }
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp: Timestamp | Date | string | number | null | undefined) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore timestamp
    const date = timestamp && typeof timestamp === 'object' && 'toDate' in timestamp 
      ? timestamp.toDate() 
      : new Date(timestamp);
    
    return format(date, 'MMM dd, yyyy • h:mm a');
  };

  // Filter messages
  const filteredMessages = messages.filter(message => {
    // Filter by search query
    const matchesSearch = 
      (message.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (message.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (message.message?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    // Filter by read status
    const matchesReadFilter = 
      filterByRead === 'all' || 
      (filterByRead === 'read' && message.read) || 
      (filterByRead === 'unread' && !message.read);
    
    return matchesSearch && matchesReadFilter;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Add debug button at the top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
          <div className="flex items-center">
            <button 
              onClick={() => fetchMessages()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {/* Action result notification */}
        {actionResult && (
          <div className={`mb-6 p-3 rounded-md flex items-center ${
            actionResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'
          }`}>
            {actionResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span>{actionResult.message}</span>
          </div>
        )}
        
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <h3 className="text-lg font-medium text-red-300 mb-2">Error Loading Messages</h3>
            <p className="text-red-200">{error.message}</p>
            <p className="text-red-400 text-sm mt-2">
              {error.code === 'permission-denied' ? 
                'You do not have permission to view these messages. Try logging out and back in.' : 
                `Error code: ${error.code || 'unknown'}`}
            </p>
          </div>
        )}
        
        {/* Filters and search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-md"
            />
          </div>
          
          {/* Filter */}
          <div className="col-span-1">
            <div className="relative">
              <Filter className="absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <select
                value={filterByRead}
                onChange={(e) => setFilterByRead(e.target.value as 'all' | 'read' | 'unread')}
                className="w-full pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-md appearance-none"
              >
                <option value="all">All Messages</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section - Split into two columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message list panel */}
          <div className="col-span-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 h-[calc(100vh-220px)]">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 bg-gray-800/80">
                <h2 className="text-lg font-medium text-white">
                  {filteredMessages.length} {filteredMessages.length === 1 ? 'Message' : 'Messages'}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                    <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No messages found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {filteredMessages.map(message => (
                      <li 
                        key={message.id}
                        className={`flex cursor-pointer hover:bg-gray-700/50 transition-colors ${selectedMessage?.id === message.id ? 'bg-gray-700' : ''}`}
                        onClick={() => handleOpenMessage(message)}
                      >
                        <div className="px-4 py-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium truncate ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                              {message.name}
                            </p>
                            <div className="flex items-center ml-2">
                              {!message.read && (
                                <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{message.email}</p>
                          <p className="text-sm text-gray-400 mt-1 truncate">{message.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Message detail panel */}
          <div className="col-span-2">
            {selectedMessage ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 h-[calc(100vh-220px)] flex flex-col">
                <div className="p-4 border-b border-gray-700 bg-gray-800/80 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Message Details</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                      className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                      title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedMessage.read ? (
                        <MailOpen className="h-5 w-5 text-gray-400 hover:text-white" />
                      ) : (
                        <Mail className="h-5 w-5 text-purple-400 hover:text-white" />
                      )}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(selectedMessage.id)}
                      className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">From</p>
                      <p className="text-white font-medium">{selectedMessage.name}</p>
                      <p className="text-purple-400">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Date</p>
                      <p className="text-white">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Message</p>
                      <div className="bg-gray-900 rounded-md p-4 text-gray-300 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-400 mr-2">Status:</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedMessage.read 
                          ? 'bg-green-900/30 text-green-400 border border-green-900' 
                          : 'bg-purple-900/30 text-purple-400 border border-purple-900'
                      }`}>
                        {selectedMessage.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 h-[calc(100vh-220px)] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="bg-gray-700/50 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                    <Mail className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-medium text-white mb-2">No message selected</h2>
                  <p className="text-gray-400 max-w-md">
                    Select a message from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                disabled={isDeleting !== null}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                disabled={isDeleting !== null}
              >
                {isDeleting === showDeleteConfirm ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;