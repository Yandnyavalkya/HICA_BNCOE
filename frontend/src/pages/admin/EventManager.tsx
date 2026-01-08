import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  registration_link?: string;
  event_category?: string;
}

export default function EventManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data;
    },
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<Event>();

  const createMutation = useMutation({
    mutationFn: async (data: Event) => {
      const res = await api.post('/events', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      reset();
      alert('Event created successfully!');
    },
    onError: () => {
      alert('Failed to create event. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Event }) => {
      const res = await api.put(`/events/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setEditingId(null);
      reset();
      alert('Event updated successfully!');
    },
    onError: () => {
      alert('Failed to update event. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm('Are you sure you want to delete this event?')) return;
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      alert('Event deleted successfully!');
    },
    onError: () => {
      alert('Failed to delete event. Please try again.');
    },
  });

  const onSubmit = (data: Event) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event._id!);
    
    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedDate = '';
    if (event.date) {
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
        // Format: YYYY-MM-DDTHH:mm
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    }
    
    setValue('title', event.title || '');
    setValue('description', event.description || '');
    setValue('date', formattedDate);
    setValue('location', event.location || '');
    setValue('image_url', event.image_url || '');
    setValue('registration_link', event.registration_link || '');
    setValue('event_category', event.event_category || '');
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
      <AdminLayout title="Event Manager">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Event Manager">
      <div style={{
        background: '#2b0949',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'rgb(97, 225, 51)' }}>
          {editingId ? '✏️ Edit Event' : '➕ Add New Event'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Event Title *</label>
            <input {...register('title', { required: true })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              {...register('description', { required: true })}
              rows={5}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Date & Time *</label>
              <input {...register('date', { required: true })} type="datetime-local" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input {...register('location', { required: true })} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Image URL *</label>
            <input {...register('image_url', { required: true })} type="url" style={inputStyle} />
            {watch('image_url') && (
              <img
                src={watch('image_url')}
                alt="Preview"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  maxWidth: '400px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid rgb(97, 225, 51)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Registration Link (optional)</label>
              <input {...register('registration_link')} type="url" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Event Category (optional)</label>
              <input {...register('event_category')} style={inputStyle} placeholder="e.g., tech-mun-2025" />
              <small style={{ color: '#888', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                Used to link gallery images to this event
              </small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(45deg, rgb(97, 225, 51), rgb(76, 175, 40))',
                borderRadius: '5px',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Events ({events?.length || 0})</h2>
        {!events || events.length === 0 ? (
          <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>
            No events yet. Add your first event above!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {events.map((event: Event) => (
              <div
                key={event._id}
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
                  src={event.image_url}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '15px',
                  }}
                />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'rgb(97, 225, 51)' }}>
                  {event.title}
                </h3>
                <p style={{ color: '#00d4ff', marginBottom: '5px' }}>
                  📅 {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p style={{ color: '#ccc', marginBottom: '10px' }}>📍 {event.location}</p>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.5' }}>
                  {event.description}
                </p>
                {event.registration_link && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      marginBottom: '15px',
                      color: '#00d4ff',
                      textDecoration: 'none',
                    }}
                  >
                    🔗 Registration Link →
                  </a>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(event)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'linear-gradient(45deg, rgb(97, 225, 51), rgb(76, 175, 40))',
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
                    onClick={() => deleteMutation.mutate(event._id!)}
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
