import { useState, useCallback } from "react";
import API from "../api/api";
import useAsync from "./useAsync";

/* Custom hook to manage dashboard form state (create/edit operations)
 Handles form data, validation, and API calls */
export default function useDashboardForm(onSuccess) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "", coverImage: null, status: "published", tags: [] });
  const [success, setSuccess] = useState("");
  const {
    loading: formLoading,
    error: formError,
    setError: setFormError,
    execute: executeForm,
  } = useAsync();

  // Initialize form for creating a new post
  const openCreateForm = useCallback(() => {
    setIsEditing(true);
    setEditPostId(null);
    setFormData({ title: "", content: "", coverImage: null, status: "published", tags: [] });
    setSuccess("");
    setFormError("");
  }, [setFormError]);

  // Initialize form for editing an existing post
  const openEditForm = useCallback(
    (post) => {
      setIsEditing(true);
      setEditPostId(post.id);
      setFormData({ 
        title: post.title, 
        content: post.content,
        coverImage: post.coverImage || null,
        status: post.status || "published",
        tags: post.tags ? post.tags.map(t => t.name) : []
      });
      setSuccess("");
      setFormError("");
    },
    [setFormError],
  );

  // Close the form and reset state
  const closeForm = useCallback(() => {
    setIsEditing(false);
    setEditPostId(null);
    setFormData({ title: "", content: "", coverImage: null, status: "published", tags: [] });
  }, []);

  // Update form field value
  const updateField = useCallback((fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  // Submit form (create or update)
  const submitForm = useCallback(
    async (e, explicitStatus) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.content.trim()) return;
      setSuccess("");

      const payload = { ...formData };
      if (explicitStatus) {
        payload.status = explicitStatus;
      }

      const action = editPostId
        ? () => API.put(`/posts/${editPostId}`, payload)
        : () => API.post("/posts", payload);

      const { error } = await executeForm(action);

      if (!error) {
        const message = editPostId
          ? "Article updated successfully."
          : "Article published successfully.";
        setSuccess(message);
        closeForm();
        onSuccess?.();
      }
    },
    [formData, editPostId, executeForm, onSuccess, closeForm],
  );

  return {
    isEditing,
    editPostId,
    formData,
    updateField,
    success,
    formLoading,
    formError,
    setFormError,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
  };
}
