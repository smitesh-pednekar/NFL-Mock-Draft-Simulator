/**
 * History Store — manages the in-memory list of saved drafts.
 * Reads from localStorage on first access, stays in sync via explicit mutations.
 * Kept separate from draftStore to maintain single-responsibility.
 */

import { create } from "zustand";
import type { SavedDraft } from "@/lib/types";
import {
  getSavedDrafts,
  deleteDraft,
  renameDraft,
  clearAllDrafts,
} from "@/lib/draftHistory";

interface HistoryStore {
  drafts: SavedDraft[];
  loaded: boolean;

  /** Load (or reload) drafts from localStorage */
  load: () => void;
  /** Add a newly created draft to the list */
  addDraft: (draft: SavedDraft) => void;
  /** Permanently delete a draft */
  remove: (id: string) => void;
  /** Rename / relabel a draft */
  rename: (id: string, label: string) => void;
  /** Wipe all */
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  drafts: [],
  loaded: false,

  load: () => {
    set({ drafts: getSavedDrafts(), loaded: true });
  },

  addDraft: (draft) => {
    // Reload from storage so ordering is consistent
    set({ drafts: getSavedDrafts() });
    // Ensure the new draft is present (saveDraft already wrote it)
    if (!get().drafts.find((d) => d.id === draft.id)) {
      set((s) => ({ drafts: [draft, ...s.drafts] }));
    }
  },

  remove: (id) => {
    deleteDraft(id);
    set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) }));
  },

  rename: (id, label) => {
    renameDraft(id, label);
    set((s) => ({
      drafts: s.drafts.map((d) => (d.id === id ? { ...d, label } : d)),
    }));
  },

  clearAll: () => {
    clearAllDrafts();
    set({ drafts: [] });
  },
}));
