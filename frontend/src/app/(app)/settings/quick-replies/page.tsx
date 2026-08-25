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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-warning/15 text-warning-foreground dark:text-warning">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Canned Template Replies (/) Manager
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure shortcut templates that helpdesk agents trigger instantly by typing &apos;/&apos; in Prime Desk.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Canned Shortcut
        </Button>
      </div>

      {/* Grid of Canned Replies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {replies.map((r) => (
          <div
            key={r.id}
            className="bg-card rounded-xl border border-border p-4 shadow-xs flex flex-col justify-between space-y-3 text-xs"
          >
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    <span className="font-mono">{r.shortcut}</span>
                  </Badge>
                  <span className="font-heading font-semibold text-foreground truncate">{r.title}</span>
                </div>
                <Badge variant="outline" size="xs">
                  {r.category}
                </Badge>
              </div>

              <p className="font-body text-xs text-muted-foreground mt-3 leading-relaxed">
                &ldquo;{r.content}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-md border border-border bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs transition-colors"
                title="Delete Shortcut"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Canned Chat Shortcut"
        subtitle="Quick template response accessible via '/' slash command in chat"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
              Save Shortcut
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Template Title"
            placeholder="e.g. Optical Power Signal Normal"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Trigger Shortcut (starts with /)"
              placeholder="e.g. /signal"
              value={newShortcut}
              onChange={(e) => setNewShortcut(e.target.value)}
              required
            />
            <Input
              label="Category"
              placeholder="e.g. Technical Support"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>

          <Textarea
            label="Message Template Content"
            placeholder="Write the exact reply sent to the customer..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
