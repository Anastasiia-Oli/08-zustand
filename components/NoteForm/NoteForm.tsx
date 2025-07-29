"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { NoteTag } from "../../types/note";
import { useRouter } from "next/router";

const tagOptions: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  // const [tag, setTag] = useState<NoteTag | "">("");
  // const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleCancel = () => router.push("/notes/filter/All");

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData);
    console.log(values);
    // mutate(
    //   {
    //     SetTitle: values.title,
    //     content: values.content,
    //     tag: values.tag as NoteTag,
    //   },
    //   {
    //     onSuccess: () => {
    //       resetForm();
    //     },
    //   }
    // );
  };

  return (
    <form action={handleSubmit} className={css.form}>
      {/* Title field */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" className={css.input} />
        <ErrorMessage name="title" component="span" className={css.error} />
      </div>

      {/* Content field */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
        <ErrorMessage name="content" component="span" className={css.error} />
      </div>

      {/* Tag field */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select}>
          <option value="">Select tag</option>
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <ErrorMessage name="tag" component="span" className={css.error} />
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
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending || !isValid}
        >
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
