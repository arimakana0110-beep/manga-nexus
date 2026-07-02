"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ThumbsUp, ThumbsDown, MessageCircle, Send, CornerDownRight } from 'lucide-react';

export default function CommentSection({ mangaId }: { mangaId: string }) {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => data.authenticated && setUser(data));
    loadComments();
  }, [mangaId]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?mangaId=${mangaId}`);
      if (res.ok) setComments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuth = () => {
    if (!user) {
      router.push('/profile');
      return false;
    }
    return true;
  };

  const postComment = async (parentId: number | null = null, contentBody: string) => {
    if (!checkAuth()) return;
    if (!contentBody.trim()) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mangaId, content: contentBody, parentId })
    });
    
    if (res.ok) { 
      if (parentId) {
        setReplyText('');
        setReplyTo(null);
      } else {
        setText('');
      }
      loadComments(); 
    }
  };

  const castVote = async (commentId: number, voteType: 'like' | 'dislike') => {
    if (!checkAuth()) return;
    const res = await fetch('/api/comments/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, voteType })
    });
    if (res.ok) loadComments();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 border-t border-neutral-900 bg-black text-white mt-12 pb-24">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-400"/> Discussion Arena
      </h2>
      
      {/* Root Context Input Box */}
      <div className="flex gap-2 mb-8 bg-neutral-900/40 p-2 rounded-xl border border-neutral-800 focus-within:border-emerald-500/50 transition-all">
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type your review or thoughts..." 
          className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-white" 
        />
        <button 
          onClick={() => postComment(null, text)} 
          className="p-2 bg-emerald-500 rounded-lg text-black hover:bg-emerald-600 transition-colors"
        >
          <Send className="w-4 h-4"/>
        </button>
      </div>

      {/* Main Stream Loop */}
      <div className="space-y-4">
        {comments.filter(c => !c.parent_id).map(comment => {
          const hasLiked = comment.userVote === 'like';
          const hasDisliked = comment.userVote === 'dislike';

          return (
            <div key={comment.id} className="bg-neutral-900/30 border border-neutral-800/60 p-5 rounded-2xl transition-all">
              <p className="text-xs text-emerald-400 font-bold">@{comment.display_name || 'MangaLumeReader'}</p>
              <p className="text-sm text-neutral-200 mt-1.5">{comment.content}</p>
              
              {/* Engagement Controls */}
              <div className="flex items-center gap-5 mt-4 text-xs select-none">
                <button 
                  onClick={() => castVote(comment.id, 'like')} 
                  className={`flex items-center gap-1.5 transition-all outline-none ${hasLiked ? 'text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'text-neutral-500 hover:text-emerald-400'}`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-emerald-400/20' : ''}`}/> 
                  <span>{comment.likes || 0}</span>
                </button>

                <button 
                  onClick={() => castVote(comment.id, 'dislike')} 
                  className={`flex items-center gap-1.5 transition-all outline-none ${hasDisliked ? 'text-red-400 font-bold drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]' : 'text-neutral-500 hover:text-red-400'}`}
                >
                  <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-red-400/20' : ''}`}/> 
                  <span>{comment.dislikes || 0}</span>
                </button>

                <button 
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} 
                  className={`flex items-center gap-1.5 transition-colors ${replyTo === comment.id ? 'text-white font-bold' : 'text-neutral-500 hover:text-white'}`}
                >
                  <MessageCircle className="w-4 h-4"/> 
                  <span>Reply</span>
                </button>
              </div>

              {/* Dynamic Inline Reply Input Field */}
              {replyTo === comment.id && (
                <div className="flex gap-2 mt-4 bg-neutral-950 p-2 rounded-xl border border-neutral-800 items-center">
                  <CornerDownRight className="w-4 h-4 text-neutral-600 ml-1 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={replyText} 
                    onChange={e => setReplyText(e.target.value)} 
                    placeholder={`Reply to @${comment.display_name}...`} 
                    className="flex-1 bg-transparent px-2 py-1 text-xs text-white focus:outline-none"
                    autoFocus 
                  />
                  <button 
                    onClick={() => postComment(comment.id, replyText)} 
                    className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Nested Reply Tree Rendering */}
              <div className="ml-6 mt-4 pl-4 border-l-2 border-neutral-800 space-y-3">
                {comments.filter(r => r.parent_id === comment.id).map(reply => (
                  <div key={reply.id} className="bg-neutral-900/20 p-3 rounded-xl border border-neutral-800/40">
                    <p className="text-xs text-neutral-400 font-semibold">@{reply.display_name || 'Reader'}</p>
                    <p className="text-xs text-neutral-300 mt-1">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
