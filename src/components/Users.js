import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        All Accounts
      </h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">
                  Username
                </th>
                <th className="px-4 py-2 border-b">
                  Email
                </th>
                <th className="px-4 py-2 border-b">
                  Role
                </th>
                <th className="px-4 py-2 border-b">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {user.username || user.name}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.role || 'user'}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
