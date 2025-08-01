"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { NoteTag } from "../../types/note";
import { useRouter } from "next/navigation";

const tagOptions: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export type NewNoteData = {
  title: string;
  content: string;
  tag: NoteTag;
};

function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag | "">("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/All");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (title.trim().length < 3) {
      newErrors.title = "Minimum 3 characters";
    }
    if (title.length > 50) {
      newErrors.title = "Maximum 50 characters";
    }
    if (content.length > 500) {
      newErrors.content = "Maximum 500 characters";
    }
    if (!tagOptions.includes(tag as NoteTag)) {
      newErrors.tag = "Tag is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => router.push("/notes/filter/All");

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as NewNoteData;
    if (!validate()) return;
    mutate(values);
    setTitle("");
    setContent("");
    setTag("");
  };

  return (
    <form action={handleSubmit} className={css.form}>
      {/* Title field */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          className={css.input}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      {/* Content field */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={content}
          className={css.textarea}
          onChange={(e) => setContent(e.target.value)}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      {/* Tag field */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          <option value="">Select tag</option>
          {tagOptions.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {/* Form actions */}
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
