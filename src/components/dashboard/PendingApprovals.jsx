import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
  },
});

const ROLE_LABELS = {
  manager: "Manager",
  inventory_staff: "Inventory Staff",
};

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/users/pending", authHeaders());
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecision = async (id, decision) => {
    setActioningId(id);
    try {
      await axios.patch(`http://localhost:3000/api/users/${id}/${decision}`, {}, authHeaders());
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Card className="border-[#0C2B4E]/10 mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-[#0C2B4E]">Pending Account Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-200 text-red-700 p-2 mb-4 rounded text-center">{error}</div>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Requested Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{ROLE_LABELS[user.role] || user.role}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        className="bg-[#45BA8C] hover:bg-[#3CA07E]"
                        disabled={actioningId === user.id}
                        onClick={() => handleDecision(user.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actioningId === user.id}
                        onClick={() => handleDecision(user.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="border border-gray-300 p-4 text-center">
                    No pending approvals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
