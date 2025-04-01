import React, { useState, useEffect } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const DeploymentsList = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDeployments();
        setDeployments(response.data.results || []);
        setError('');
      } catch (error) {
        console.error('Error fetching deployments:', error);
        setError('Failed to load deployments data');
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDeployments, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'in_progress':
        return <Badge bg="info">In Progress</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && deployments.length === 0) {
    return <div className="text-center mt-5">Loading deployments...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Deployments</h2>
        <Button as={Link} to="/new-deployment" variant="primary">
          New Deployment
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Package</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                {loading ? 'Loading deployments...' : 'No deployments found'}
              </td>
            </tr>
          ) : (
            deployments.map(deployment => (
              <tr key={deployment.id}>
                <td>{deployment.id}</td>
                <td>{deployment.client_hostname}</td>
                <td>{deployment.package_name} v{deployment.package_version}</td>
                <td>{getStatusBadge(deployment.status)}</td>
                <td>{formatDateTime(deployment.created_at)}</td>
                <td>{formatDateTime(deployment.updated_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DeploymentsList;