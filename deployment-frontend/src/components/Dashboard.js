import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: { total: 0, online: 0, offline: 0 },
    packages: { total: 0 },
    deployments: { total: 0, pending: 0, inProgress: 0, completed: 0, failed: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch clients
        const clientsResponse = await apiService.getClients();
        const clients = clientsResponse.data.results || [];
        
        // Fetch packages
        const packagesResponse = await apiService.getPackages();
        const packages = packagesResponse.data.results || [];
        
        // Fetch deployments
        const deploymentsResponse = await apiService.getDeployments();
        const deployments = deploymentsResponse.data.results || [];
        
        // Calculate stats
        const clientStats = {
          total: clients.length,
          online: clients.filter(client => client.status === 'online').length,
          offline: clients.filter(client => client.status === 'offline').length
        };
        
        const packageStats = {
          total: packages.length
        };
        
        const deploymentStats = {
          total: deployments.length,
          pending: deployments.filter(d => d.status === 'pending').length,
          inProgress: deployments.filter(d => d.status === 'in_progress').length,
          completed: deployments.filter(d => d.status === 'completed').length,
          failed: deployments.filter(d => d.status === 'failed').length
        };
        
        setStats({
          clients: clientStats,
          packages: packageStats,
          deployments: deploymentStats
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Button as={Link} to="/new-deployment" variant="primary">
          New Deployment
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Clients</Card.Title>
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span>{stats.clients.total}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Online</span>
                  <span className="text-success">{stats.clients.online}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Offline</span>
                  <span className="text-secondary">{stats.clients.offline}</span>
                </div>
              </div>
              <div className="mt-3">
                <Button as={Link} to="/clients" variant="outline-primary" size="sm" className="w-100">
                  View All Clients
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Packages</Card.Title>
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span>{stats.packages.total}</span>
                </div>
              </div>
              <div className="mt-3">
                <Button as={Link} to="/packages" variant="outline-primary" size="sm" className="w-100">
                  View All Packages
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Deployments</Card.Title>
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span>{stats.deployments.total}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Pending</span>
                  <span className="text-warning">{stats.deployments.pending}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>In Progress</span>
                  <span className="text-info">{stats.deployments.inProgress}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Completed</span>
                  <span className="text-success">{stats.deployments.completed}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Failed</span>
                  <span className="text-danger">{stats.deployments.failed}</span>
                </div>
              </div>
              <div className="mt-3">
                <Button as={Link} to="/deployments" variant="outline-primary" size="sm" className="w-100">
                  View All Deployments
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;