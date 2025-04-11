import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    botLinks: '',
    location: '',
    businessType: '',
    tokensToAdd: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleOpen = (user = null) => {
    setCurrentUser(user);
    setFormData({
      name: user?.name || '',
      company: user?.company || '',
      botLinks: user?.botLinks?.join(', ') || '',
      location: user?.location || '',
      businessType: user?.businessType || '',
      tokensToAdd: 0
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        name: formData.name,
        company: formData.company,
        botLinks: formData.botLinks.split(',').map(link => link.trim()),
        location: formData.location,
        businessType: formData.businessType
      };

      let updatedUsers;
      if (currentUser) {
        await userService.updateUser(currentUser.id, userData);
        if (formData.tokensToAdd > 0) {
          await userService.addTokens(currentUser.id, Number(formData.tokensToAdd));
        }
      } else {
        await userService.addUser(userData);
      }
      
      updatedUsers = await userService.getAllUsers();
      setUsers(updatedUsers);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.removeUser(id);
      const updatedUsers = await userService.getAllUsers();
      setUsers(updatedUsers);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" onClick={() => handleOpen()}>
        Add New User
      </Button>

      {loading && <Typography>Loading users...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Bot Links</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Business Type</TableCell>
              <TableCell>Current Tokens</TableCell>
              <TableCell>Total Purchased</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>
                  {user.botLinks?.map((link, i) => (
                    <div key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </div>
                  ))}
                </TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.businessType}</TableCell>
                <TableCell>{user.currentTokens}</TableCell>
                <TableCell>{user.totalPurchasedTokens}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="company"
            label="Company"
            fullWidth
            value={formData.company}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="botLinks"
            label="Bot Links (comma separated)"
            fullWidth
            value={formData.botLinks}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="businessType"
            label="Business Type"
            fullWidth
            value={formData.businessType}
            onChange={handleChange}
          />
          {currentUser && (
            <TextField
              margin="dense"
              name="tokensToAdd"
              label="Tokens to Add"
              type="number"
              fullWidth
              value={formData.tokensToAdd}
              onChange={handleChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {currentUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
