"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inviteCollaborator } from "@/lib/actions/collaboration";
import { X, Copy, Mail } from "lucide-react";

export function InviteModal({ boardId, onClose }: { boardId: string, onClose: () => void }) {
  const [role, setRole] = useState<'COLLABORATOR' | 'VIEWER'>('COLLABORATOR');
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const collab = await inviteCollaborator(boardId, role, email);
      setInviteLink(`${window.location.origin}/board/invite/${collab.inviteToken}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zen-black/40 backdrop-blur-sm p-4">
      <div className="bg-white max-w-md w-full p-8 border border-zen-border relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zen-taupe hover:text-zen-black">
          <X size={20} />
        </button>

        <h3 className="font-serif text-2xl mb-2">Invite Collaborator</h3>
        <p className="text-xs text-zen-charcoal mb-6">Generate a secure invitation link for a family member or designer.</p>

        {!inviteLink ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-zen-taupe uppercase tracking-widest mb-2">Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black bg-zen-offwhite"
              >
                <option value="COLLABORATOR">Collaborator (Can Review & Comment)</option>
                <option value="VIEWER">Viewer (Read Only)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-mono text-zen-taupe uppercase tracking-widest mb-2">Email (Optional)</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black"
              />
            </div>

            <Button onClick={handleGenerate} variant="primary" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Invite Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 text-green-800 p-4 border border-green-200 text-sm">
              Invitation generated successfully. Share this secure link with them.
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={inviteLink}
                className="w-full border border-zen-border px-3 py-2 text-sm bg-zen-stone/10 text-zen-taupe font-mono"
              />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert("Copied to clipboard!");
                }} 
                variant="outline" 
                icon={<Copy size={16} />} 
              >
                Copy
              </Button>
            </div>
            
            <Button onClick={onClose} variant="outline" className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
