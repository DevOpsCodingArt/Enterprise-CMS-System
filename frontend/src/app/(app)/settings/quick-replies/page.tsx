'use client';

import React, { useState } from 'react';
import { Zap, Plus, Trash2, Edit2, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { mockDb, MockQuickReply } from '@/mock-db';

export default function QuickRepliesPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [replies, setReplies] = useState<MockQuickReply[]>(mockDb.getQuickReplies());

  const [newTitle, setNewTitle] = useState('');
  const [newShortcut, setNewShortcut] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newContent, setNewContent] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newShortcut || !newContent) {
      showToast('Validation Error', 'All fields are required', 'error');
      return;
    }

    const shortcutFormatted = newShortcut.startsWith('/') ? newShortcut : `/${newShortcut}`;

    const newReply = {
      id: `qr_${Date.now()}`,
      title: newTitle,
      shortcut: shortcutFormatted,
      category: newCategory,
      content: newContent,
    };

    setReplies((prev) => [...prev, newReply]);
    showToast('Canned Reply Created', `Shortcut ${shortcutFormatted} is now active in chat`, 'success');
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewShortcut('');
    setNewContent('');
  };

  const handleDelete = (id: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== id));
    showToast('Deleted', 'Canned reply removed from chat templates', 'info');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              CANNED TEMPLATE REPLIES (/) MANAGER
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Configure shortcut templates that helpdesk agents trigger instantly by typing &apos;/&apos; in Prime Desk.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          CREATE CANNED SHORTCUT
        </Button>
      </div>

      {/* Grid of Canned Replies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {replies.map((r) => (
          <div
            key={r.id}
            className="bg-card border-2 border-border p-4 shadow-sm flex flex-col justify-between space-y-3 font-mono text-xs"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {r.shortcut}
                  </Badge>
                  <span className="font-heading font-bold text-foreground truncate">{r.title}</span>
                </div>
                <Badge variant="outline" size="xs">
                  {r.category}
                </Badge>
              </div>

              <p className="mt-2.5 text-muted-foreground text-xs leading-relaxed bg-card-subtle p-3 border border-border">
                &ldquo;{r.content}&rdquo;
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1 text-destructive hover:bg-destructive-light border border-transparent hover:border-destructive transition-colors"
                title="Delete Shortcut"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Canned Reply Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="CREATE CANNED TEMPLATE SHORTCUT"
        subtitle="Staff can invoke this response by pressing '/' in active chat conversations."
        size="md"
      >
        <form onSubmit={handleAdd} className="space-y-4 font-mono text-xs">
          <Input
            label="TEMPLATE TITLE"
            placeholder="e.g. Fiber Restoration Confirmed"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SHORTCUT TRIGGER (START WITH /)"
              placeholder="/restore"
              value={newShortcut}
              onChange={(e) => setNewShortcut(e.target.value)}
              required
            />
            <Input
              label="CATEGORY"
              placeholder="e.g. NOC Diagnostics"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>

          <Textarea
            label="EXPANDED MESSAGE CONTENT"
            placeholder="Write the full response message template..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
          />

          <div className="pt-4 border-t border-border flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              SAVE TEMPLATE
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
