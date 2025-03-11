import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from '@mui/material';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const mockProfile: Profile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 234 567 8900',
  address: '123 Main St, City, Country',
};

// Profile page is not ready or integrated with the backend
const Profile = () => {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>(mockProfile);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Personal Information</Typography>
          {!isEditing && (
            <Button variant="outlined" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={isEditing ? formData.firstName : profile.firstName}
              onChange={handleChange('firstName')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={isEditing ? formData.lastName : profile.lastName}
              onChange={handleChange('lastName')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              value={isEditing ? formData.email : profile.email}
              onChange={handleChange('email')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              value={isEditing ? formData.phone : profile.phone}
              onChange={handleChange('phone')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={isEditing ? formData.address : profile.address}
              onChange={handleChange('address')}
              fullWidth
              multiline
              rows={3}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Settings
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Button variant="outlined" color="error">
          Change Password
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile; 