import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function TeamManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const res = await api.get('/team');
      return res.data;
    },
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<TeamMember>();

  const createMutation = useMutation({
    mutationFn: async (data: TeamMember) => {
      const res = await api.post('/team', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      reset();
      alert('Team member created successfully!');
    },
    onError: () => {
      alert('Failed to create team member. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TeamMember }) => {
      const res = await api.put(`/team/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setEditingId(null);
      reset();
      alert('Team member updated successfully!');
    },
    onError: () => {
      alert('Failed to update team member. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm('Are you sure you want to delete this team member?')) return;
      await api.delete(`/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      alert('Team member deleted successfully!');
    },
    onError: () => {
      alert('Failed to delete team member. Please try again.');
    },
  });

  const onSubmit = (data: TeamMember) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member._id!);
    setValue('name', member.name);
    setValue('role', member.role);
    setValue('bio', member.bio);
    setValue('image_url', member.image_url);
    setValue('social_links', member.social_links || {});
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
      <AdminLayout title="Team Manager">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Team Manager">
      <div style={{
        background: '#2b0949',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#993fea' }}>
          {editingId ? '✏️ Edit Team Member' : '➕ Add New Team Member'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input {...register('name', { required: true })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <input {...register('role', { required: true })} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Bio *</label>
            <textarea
              {...register('bio', { required: true })}
              rows={4}
              style={inputStyle}
            />
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
                  width: '150px',
                  height: '150px',
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
          <div>
            <label style={{ ...labelStyle, marginBottom: '15px' }}>Social Links (optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.9rem' }}>LinkedIn</label>
                <input {...register('social_links.linkedin')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.9rem' }}>GitHub</label>
                <input {...register('social_links.github')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.9rem' }}>Twitter</label>
                <input {...register('social_links.twitter')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.9rem' }}>Instagram</label>
                <input {...register('social_links.instagram')} type="url" style={inputStyle} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Team Members ({members?.length || 0})</h2>
        {!members || members.length === 0 ? (
          <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>
            No team members yet. Add your first team member above!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {members.map((member: TeamMember) => (
              <div
                key={member._id}
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
                  src={member.image_url}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '15px',
                  }}
                />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#993fea' }}>
                  {member.name}
                </h3>
                <p style={{ color: 'rgb(97, 225, 51)', marginBottom: '10px' }}>{member.role}</p>
                <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
                  {member.bio}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(member)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
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
                    onClick={() => deleteMutation.mutate(member._id!)}
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
