import React, { useState } from 'react';
import { Send, Users, Mail, MessageSquare, Smartphone, CheckSquare, Square } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getApiUrl } from '../../utils/api';

export const AdminBroadcast: React.FC = () => {
  const { customers } = useAppContext();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [messageTypes, setMessageTypes] = useState<('email' | 'sms' | 'whatsapp')[]>(['email']);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const toggleCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(cId => cId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomers.length === 0 || !message.trim() || messageTypes.length === 0) return;

    setIsSending(true);
    
    try {
      if (messageTypes.includes('email')) {
        const selectedEmails = customers
          .filter(c => selectedCustomers.includes(c.id))
          .map(c => c.email);
          
        const broadcastUrl = getApiUrl('broadcast');
          
        await fetch(broadcastUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emails: selectedEmails,
            subject: 'Update from LuxeMotors',
            message: message,
          }),
        });
      }
      
      // Simulate WhatsApp and SMS sending if selected
      if (messageTypes.includes('whatsapp') || messageTypes.includes('sms')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setSuccess(true);
      setMessage('');
      setSelectedCustomers([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      alert('Failed to send broadcast. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Broadcast Messages</h1>
        <p className="text-zinc-400">Send updates, offers, and notifications to your registered customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Selection */}
        <div className="lg:col-span-1 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" /> Recipients ({selectedCustomers.length})
            </h3>
            <button 
              onClick={selectAll}
              className="text-sm text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1"
            >
              {selectedCustomers.length === customers.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              All
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {customers.map((customer) => (
              <div 
                key={customer.id}
                onClick={() => toggleCustomer(customer.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-1 ${
                  selectedCustomers.includes(customer.id) ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  selectedCustomers.includes(customer.id) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                }`}>
                  {selectedCustomers.includes(customer.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{customer.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{customer.email}</p>
                </div>
              </div>
            ))}
            {customers.length === 0 && (
              <div className="p-8 text-center text-zinc-500">No customers found.</div>
            )}
          </div>
        </div>

        {/* Message Composer */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-bold text-white mb-4">Compose Message</h3>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMessageTypes(prev => prev.includes('whatsapp') ? prev.filter(t => t !== 'whatsapp') : [...prev, 'whatsapp'])}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors border ${
                  messageTypes.includes('whatsapp') 
                    ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <MessageSquare className="w-5 h-5" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setMessageTypes(prev => prev.includes('email') ? prev.filter(t => t !== 'email') : [...prev, 'email'])}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors border ${
                  messageTypes.includes('email') 
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <Mail className="w-5 h-5" /> Email
              </button>
              <button
                type="button"
                onClick={() => setMessageTypes(prev => prev.includes('sms') ? prev.filter(t => t !== 'sms') : [...prev, 'sms'])}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors border ${
                  messageTypes.includes('sms') 
                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <Smartphone className="w-5 h-5" /> SMS
              </button>
            </div>
          </div>

          <form onSubmit={handleSend} className="flex-1 flex flex-col p-6">
            <div className="mb-4 flex gap-2">
              <span className="text-xs text-zinc-500">Available variables:</span>
              <button type="button" onClick={() => setMessage(prev => prev + '{{name}}')} className="text-xs px-2 py-1 bg-zinc-800 rounded text-emerald-400 hover:bg-zinc-700 transition-colors">
                {`{{name}}`}
              </button>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi {{name}}, we have a special offer for you...`}
              className="flex-1 w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
              required
            />
            
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {selectedCustomers.length === 0 ? 'Select recipients to send' : `Sending to ${selectedCustomers.length} recipient(s)`}
              </p>
              
              <button
                type="submit"
                disabled={isSending || selectedCustomers.length === 0 || !message.trim() || messageTypes.length === 0}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSending ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5" /> Send Broadcast
                  </>
                )}
              </button>
            </div>

            {success && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm flex items-center gap-2">
                <CheckSquare className="w-5 h-5" /> Broadcast sent successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
