import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

interface GalleryImage {
  _id?: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  event_category?: string;
}

export default function GalleryManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await api.get('/gallery');
      return res.data;
    },
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<GalleryImage>();
  const imageUrl = watch('image_url');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const title = watch('title');
    const description = watch('description');
    const category = watch('category');
    const eventCategory = watch('event_category');
    
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (eventCategory) formData.append('event_category', eventCategory);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('image_url', res.data.image_url);
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      reset();
      alert('✅ Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Upload failed. Please check your Cloudinary configuration.';
      alert(`❌ Upload failed:\n\n${errorMessage}\n\nPlease check CLOUDINARY_SETUP_GUIDE.md for setup instructions.`);
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: GalleryImage) => {
      // Send as form data to match backend expectations
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description || '');
      if (data.category) formData.append('category', data.category || '');
      if (data.event_category) formData.append('event_category', data.event_category || '');
      if (data.image_url) formData.append('image_url', data.image_url);
      
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      reset();
      alert('✅ Gallery image added successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to add gallery image. Please try again.';
      alert(`❌ ${errorMessage}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GalleryImage }) => {
      // Send as form data to match backend expectations
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description || '');
      if (data.category) formData.append('category', data.category || '');
      if (data.event_category) formData.append('event_category', data.event_category || '');
      if (data.image_url) formData.append('image_url', data.image_url);
      
      const res = await api.put(`/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setEditingId(null);
      reset();
      alert('✅ Gallery image updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to update gallery image. Please try again.';
      alert(`❌ ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm('Are you sure you want to delete this image?')) return;
      await api.delete(`/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      alert('Gallery image deleted successfully!');
    },
    onError: () => {
      alert('Failed to delete gallery image. Please try again.');
    },
  });

  const onSubmit = (data: GalleryImage) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image._id!);
    setValue('title', image.title);
    setValue('description', image.description || '');
    setValue('image_url', image.image_url);
    setValue('category', image.category || '');
    setValue('event_category', image.event_category || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #333',
    background: '#1c1e24',
    color: 'white',
    fontSize: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#ccc',
    fontWeight: '500' as const,
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gallery Manager">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gallery Manager">
      <div style={{
        background: '#2b0949',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#993fea' }}>
          {editingId ? '✏️ Edit Gallery Image' : '➕ Add New Gallery Image'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input {...register('title', { required: true })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category (optional)</label>
              <input {...register('category')} style={inputStyle} placeholder="e.g., Event, Workshop" />
            </div>
            <div>
              <label style={labelStyle}>Event Category (optional)</label>
              <input {...register('event_category')} style={inputStyle} placeholder="e.g., tech-mun-2025, hica-inauguration-2025" />
              <small style={{ color: '#888', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                Link this image to an event. Use the same category as the event's event_category field.
              </small>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description (optional)</label>
            <textarea
              {...register('description')}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                ...inputStyle,
                opacity: uploading ? 0.6 : 1,
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            />
            {uploading && (
              <p style={{ color: '#00d4ff', marginTop: '10px' }}>⏳ Uploading...</p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Image URL * (or use upload above)</label>
            <input {...register('image_url', { required: true })} type="url" style={inputStyle} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  maxWidth: '400px',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid #993fea'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={uploading || createMutation.isPending || updateMutation.isPending}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(45deg, #993fea, #7a2fb8)',
                borderRadius: '5px',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: (uploading || createMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
              }}
            >
              {editingId ? '💾 Update' : '➕ Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '12px 30px',
                  background: '#444',
                  borderRadius: '5px',
                  color: 'white',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{
        background: '#2b0949',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Gallery Images ({images?.length || 0})</h2>
        {!images || images.length === 0 ? (
          <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>
            No gallery images yet. Add your first image above!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {images.map((image: GalleryImage) => (
              <div
                key={image._id}
                style={{
                  background: '#1c1e24',
                  borderRadius: '10px',
                  padding: '20px',
                  border: '1px solid #333',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '15px',
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#993fea' }}>
                  {image.title}
                </h3>
                {image.description && (
                  <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {image.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  {image.category && (
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 10px',
                      background: 'rgba(153, 63, 234, 0.3)',
                      borderRadius: '5px',
                      color: '#993fea',
                      fontSize: '0.8rem',
                    }}>
                      {image.category}
                    </span>
                  )}
                  {image.event_category && (
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 10px',
                      background: 'rgba(6, 182, 212, 0.3)',
                      borderRadius: '5px',
                      color: '#06b6d4',
                      fontSize: '0.8rem',
                    }}>
                      Event: {image.event_category}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(image)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'linear-gradient(45deg, #993fea, #7a2fb8)',
                      borderRadius: '5px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(image._id!)}
                    disabled={deleteMutation.isPending}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#d32f2f',
                      borderRadius: '5px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      opacity: deleteMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
