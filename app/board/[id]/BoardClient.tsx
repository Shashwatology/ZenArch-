"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  updateItemApproval, 
  removeItem, 
  shareBoard, 
  revokeShare, 
  addComment, 
  generateQuoteFromBoard 
} from "@/lib/actions/boards";
import { getProductWhatsAppUrl } from "@/lib/config/brand";
import { 
  CheckCircle2, XCircle, Clock, Trash2, MessageSquare, 
  Share2, FileText, ArrowLeft, Image as ImageIcon, Box, Mail
} from "lucide-react";
import { useRouter } from "next/navigation";

import { InviteModal } from "./InviteModal";
import { DecisionMode } from "./DecisionMode";

export default function BoardClient({ boardId, initialBoard, currentUserId, isSharedView = false }: any) {
  const router = useRouter();
  const [board, setBoard] = useState(initialBoard);
  const [isLocal, setIsLocal] = useState(boardId === 'local');
  const [commentText, setCommentText] = useState("");
  const [itemCommentText, setItemCommentText] = useState<{ [key: string]: string }>({});
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDecisionModeOpen, setIsDecisionModeOpen] = useState(false);
  
  // Local storage sync for anonymous users
  useEffect(() => {
    if (isLocal) {
      const stored = localStorage.getItem('zen_arch_local_board');
      if (stored) {
        setBoard(JSON.parse(stored));
      } else {
        setBoard({ name: "My Temporary Board", items: [], comments: [] });
      }
    }
  }, [isLocal]);

  // Sync back to local storage if local
  useEffect(() => {
    if (isLocal && board) {
      localStorage.setItem('zen_arch_local_board', JSON.stringify(board));
    }
  }, [board, isLocal]);

  const handleApproval = async (itemId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    if (isLocal) {
      // Local state update
      setBoard((prev: any) => ({
        ...prev,
        items: prev.items.map((i: any) => i.id === itemId ? { ...i, status } : i)
      }));
      return;
    }
    
    if (isSharedView) return; // Viewers can't approve
    
    await updateItemApproval(itemId, status, currentUserId);
    router.refresh();
  };

  const handleRemove = async (itemId: string) => {
    if (isLocal) {
      setBoard((prev: any) => ({
        ...prev,
        items: prev.items.filter((i: any) => i.id !== itemId)
      }));
      return;
    }
    
    if (isSharedView) return;
    
    await removeItem(itemId, currentUserId);
    router.refresh();
  };

  const handleShare = async () => {
    if (isLocal || isSharedView) return;
    const res = await shareBoard(boardId, currentUserId);
    // the server action revalidates the path, but we can also manually navigate or alert
    alert(`Board Shared! Link: ${window.location.origin}/shared/board/${res.shareToken}`);
    router.refresh();
  };

  const handleRevokeShare = async () => {
    if (isLocal || isSharedView) return;
    await revokeShare(boardId, currentUserId);
    router.refresh();
  };

  const handleAddComment = async (e: React.FormEvent, boardItemId?: string) => {
    e.preventDefault();
    const text = boardItemId ? itemCommentText[boardItemId] : commentText;
    if (!text?.trim()) return;
    
    if (isLocal) {
      setBoard((prev: any) => {
         const newComment = { id: Date.now().toString(), authorName: "Guest", content: text, createdAt: new Date().toISOString(), boardItemId };
         if (boardItemId) {
           return {
             ...prev,
             items: prev.items.map((i:any) => i.id === boardItemId ? { ...i, comments: [newComment, ...(i.comments||[])] } : i)
           }
         }
         return {
           ...prev,
           comments: [newComment, ...prev.comments]
         }
      });
      if (boardItemId) setItemCommentText(prev => ({ ...prev, [boardItemId]: "" }));
      else setCommentText("");
      return;
    }

    // Pass the display name for the comment author. (In a real app, fetch from dbUser, but for now we'll just say "Collaborator" or "Owner")
    const isOwner = board.userId === currentUserId;
    const authorName = isOwner ? "Owner" : "Collaborator";

    await addComment(boardId, text, authorName, currentUserId, false, boardItemId);
    
    if (boardItemId) setItemCommentText(prev => ({ ...prev, [boardItemId]: "" }));
    else setCommentText("");
    
    router.refresh();
  };

  const handleQuote = async () => {
    if (isLocal) {
      alert("Please login to request a quote for your board.");
      router.push('/login');
      return;
    }
    try {
      const quoteId = await generateQuoteFromBoard(boardId, currentUserId);
      router.push(`/account/quotes/${quoteId}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'APPROVED') return <CheckCircle2 size={16} className="text-green-500" />;
    if (status === 'REJECTED') return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-zen-accent" />;
  };

  if (!board) return <div className="p-12 text-center">Loading board...</div>;

  return (
    <div className="min-h-screen bg-zen-offwhite text-zen-black pt-32 pb-24 selection:bg-zen-accent selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-12">
        {isInviteOpen && <InviteModal boardId={boardId} onClose={() => setIsInviteOpen(false)} />}
        {isDecisionModeOpen && <DecisionMode board={board} onClose={() => setIsDecisionModeOpen(false)} />}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zen-border pb-8">
          <div>
            {!isSharedView && (
              <Link href="/account/boards" className="text-[10px] uppercase tracking-[0.3em] text-zen-muted hover:text-zen-black transition-colors font-mono flex items-center gap-2 mb-4">
                <ArrowLeft size={12}/> My Boards
              </Link>
            )}
            <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight uppercase">
              {board.name}
            </h1>
            <p className="text-sm text-zen-charcoal/80 font-light mt-4">
              {board.description || "Curated spatial selections."}
              {isLocal && " (Temporary Session Board)"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {!isLocal && !isSharedView && (
              <>
                {board.items.length >= 2 && (
                  <Button onClick={() => setIsDecisionModeOpen(true)} variant="outline" size="sm" icon={<MessageSquare size={14}/>}>
                    Decision Mode
                  </Button>
                )}
                {board.shareToken && !board.shareRevokedAt && (!board.shareExpiresAt || new Date(board.shareExpiresAt) > new Date()) && (
                  <Button onClick={handleRevokeShare} variant="outline" size="sm" icon={<Share2 size={14}/>}>
                    Revoke View Link
                  </Button>
                )}
                <Button onClick={() => setIsInviteOpen(true)} variant="outline" size="sm" icon={<Mail size={14}/>}>
                  Invite Collaborator
                </Button>
                
                <Button onClick={handleQuote} variant="primary" size="sm" icon={<FileText size={14}/>}>
                  Request Quote for Approved
                </Button>
              </>
            )}
            
            <Button 
              href={getProductWhatsAppUrl("Board Inquiry: " + board.name)} 
              isExternal 
              variant="whatsapp" 
              size="sm" 
              icon={<MessageSquare size={14}/>}
            >
              Discuss with Atelier
            </Button>
          </div>
        </div>

        {board.items?.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-zen-taupe mb-4">Your board is empty.</p>
            <Button href="/furniture" variant="outline">Explore Catalogue</Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Editorial Board Layout */}
            <div className="lg:w-2/3 space-y-16">
              {board.items?.map((item: any, index: number) => {
                const product = item.product;
                const isPrimary = index % 3 === 0; // Every 3rd item is large
                
                return (
                  <div key={item.id} className={`flex flex-col ${isPrimary ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center bg-white border border-zen-border p-6 hover:border-zen-black transition-colors relative group`}>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 border border-zen-border text-[9px] uppercase tracking-widest font-mono">
                      <StatusIcon status={item.status} /> 
                      {item.status === 'PENDING' ? 'AWAITING DECISION' : item.status}
                    </div>

                    <div className={`${isPrimary ? 'md:w-1/2' : 'md:w-1/3'} w-full relative bg-zen-stone/10 aspect-square md:aspect-auto md:h-[400px]`}>
                      {product?.images?.[0]?.url && (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-contain p-8 mix-blend-multiply" />
                      )}
                    </div>
                    
                    <div className={`${isPrimary ? 'md:w-1/2' : 'md:w-2/3'} w-full space-y-6`}>
                      <div>
                        <span className="text-[10px] font-mono text-zen-taupe uppercase tracking-widest block mb-1">
                          {product?.collection?.name || product?.collection || 'Collection'} &bull; QTY: {item.quantity}
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl">{product?.name}</h3>
                        <p className="text-xs font-mono text-zen-charcoal mt-2">
                          {item.approvedPrice ? (
                            <span>Approved Snapshot: ₹{Number(item.approvedPrice).toLocaleString('en-IN')}</span>
                          ) : (
                            product?.priceStatus === 'VERIFIED' && product?.basePrice ? `Current: ₹${Number(product.basePrice).toLocaleString('en-IN')}` : 'CONFIRM PRICE'
                          )}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-zen-border/50 flex flex-wrap gap-3">
                        <Button href={`/furniture/${product?.slug}`} variant="outline" size="sm" icon={<Box size={14}/>}>
                          View Product
                        </Button>
                        <Button href={`/ai/transform-space?product=${product?.slug}`} variant="outline" size="sm" icon={<ImageIcon size={14}/>}>
                          Try In My Space
                        </Button>
                      </div>

                      {/* Approvals */}
                      {!isSharedView && (
                        <div className="pt-4 flex gap-2">
                          {item.status !== 'APPROVED' && (
                            <button onClick={() => handleApproval(item.id, 'APPROVED')} className="flex-1 py-2 text-[10px] uppercase tracking-widest font-medium border border-green-500 text-green-600 hover:bg-green-50 transition-colors">
                              Approve
                            </button>
                          )}
                          {item.status !== 'REJECTED' && (
                            <button onClick={() => handleApproval(item.id, 'REJECTED')} className="flex-1 py-2 text-[10px] uppercase tracking-widest font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-colors">
                              Reject
                            </button>
                          )}
                          {item.board.userId === currentUserId && (
                            <button onClick={() => handleRemove(item.id)} className="px-3 py-2 border border-zen-border text-zen-charcoal hover:bg-zen-stone/20 transition-colors" title="Remove from board">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Item-Level Comments */}
                      <div className="mt-8 pt-6 border-t border-zen-border/50">
                        <div className="space-y-4 mb-4">
                          {item.comments?.map((comment: any) => (
                            <div key={comment.id} className="text-sm bg-zen-stone/5 p-3 border border-zen-border/50">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-[10px] uppercase tracking-widest">{comment.authorName}</span>
                                <span className="text-[9px] font-mono text-zen-taupe">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-zen-charcoal text-xs">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                        
                        {!isSharedView && (
                          <form onSubmit={(e) => handleAddComment(e, item.id)} className="flex gap-2">
                            <input 
                              type="text"
                              value={itemCommentText[item.id] || ''}
                              onChange={e => setItemCommentText(prev => ({...prev, [item.id]: e.target.value}))}
                              placeholder="Add a note about this item..." 
                              className="w-full bg-transparent border-b border-zen-border pb-2 text-xs focus:outline-none focus:border-zen-black"
                            />
                            <button type="submit" className="text-[10px] font-mono uppercase text-zen-accent hover:text-zen-black">
                              Post
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Collaboration & Notes */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 bg-white border border-zen-border p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2 border-b border-zen-border pb-4">
                  <MessageSquare size={16} className="text-zen-accent" />
                  <h3 className="font-serif text-2xl uppercase">Collaboration</h3>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {board.comments?.length === 0 ? (
                    <p className="text-xs font-mono text-zen-taupe">No comments yet.</p>
                  ) : (
                    board.comments?.map((comment: any) => (
                      <div key={comment.id} className="bg-zen-stone/10 p-4 border border-zen-border text-sm space-y-2">
                        <div className="flex justify-between items-center border-b border-zen-border/50 pb-2">
                          <span className="font-medium text-xs uppercase tracking-widest">{comment.authorName}</span>
                          <span className="text-[9px] font-mono text-zen-taupe">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-zen-charcoal leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {!isSharedView && (
                  <form onSubmit={(e) => handleAddComment(e)} className="pt-4 border-t border-zen-border space-y-3">
                    <textarea 
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a general board note..." 
                      className="w-full bg-zen-offwhite border border-zen-border p-3 text-sm focus:outline-none focus:border-zen-black min-h-[80px]"
                      required
                    />
                    <Button type="submit" variant="outline" className="w-full text-xs">
                      Post Comment
                    </Button>
                  </form>
                )}

                {/* Activity Feed */}
                {!isSharedView && board.activity && board.activity.length > 0 && (
                  <div className="pt-8 border-t border-zen-border mt-8">
                    <h4 className="font-serif text-lg uppercase mb-4">Board Activity</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {board.activity.map((log: any) => {
                        let text = "";
                        const details = log.after ? JSON.parse(log.after) : {};
                        const name = log.user?.customerProfile?.firstName || log.user?.email || "Someone";
                        
                        if (log.action === 'ITEM_APPROVED') text = `${name} approved ${details.productName}`;
                        else if (log.action === 'ITEM_REJECTED') text = `${name} rejected ${details.productName}`;
                        else if (log.action === 'COLLABORATOR_INVITED') text = `Invited collaborator ${details.email || ''}`;
                        else if (log.action === 'COLLABORATOR_ACCEPTED') text = `${name} joined the board`;
                        else if (log.action === 'COMMENT_CREATED') text = `${name} added a comment`;
                        else text = `${name} made a change`;

                        return (
                          <div key={log.id} className="text-xs font-mono text-zen-charcoal pb-2 border-b border-zen-border/30 last:border-0">
                            <span className="block text-zen-taupe mb-1">{new Date(log.createdAt).toLocaleString()}</span>
                            {text}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
