import React, { useState, useEffect } from 'react';
import { Table, Badge, Form, Card, Row, Col } from 'react-bootstrap';
import apiService from '../services/api';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    os_type: '',
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClients(filters);
      setClients(response.data.results || []);
      setError('');
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'online':
        return <Badge bg="success">Online</Badge>;
      case 'offline':
        return <Badge bg="secondary">Offline</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  const getOSBadge = (os) => {
    switch(os) {
      case 'windows':
        return <Badge bg="primary">Windows</Badge>;
      case 'macos':
        return <Badge bg="info">macOS</Badge>;
      case 'linux':
        return <Badge bg="warning" text="dark">Linux</Badge>;
      default:
        return <Badge bg="light" text="dark">{os}</Badge>;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && clients.length === 0) {
    return <div className="text-center mt-5">Loading clients...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Client Machines</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filters</Card.Title>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Operating System</Form.Label>
                <Form.Select 
                  name="os_type"
                  value={filters.os_type}
                  onChange={handleFilterChange}
                >
                  <option value="">All OS Types</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Hostname</th>
            <th>IP Address</th>
            <th>Status</th>
            <th>OS Type</th>
            <th>Last Check-in</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                {loading ? 'Loading clients...' : 'No clients found'}
              </td>
            </tr>
          ) : (
            clients.map(client => (
              <tr key={client.id}>
                <td>{client.hostname}</td>
                <td>{client.ip_address}</td>
                <td>{getStatusBadge(client.status)}</td>
                <td>{getOSBadge(client.os_type)}</td>
                <td>{formatDateTime(client.last_checkin)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ClientsList;