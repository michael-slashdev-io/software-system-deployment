import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import apiService from '../services/api';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    version: ''
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPackages();
      setPackages(response.data.results || []);
      setError('');
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    
    if (!newPackage.name || !newPackage.version) {
      setError('Please fill all fields');
      return;
    }
    
    try {
      await apiService.createPackage(newPackage);
      setShowModal(false);
      setNewPackage({ name: '', version: '' });
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
      setError('Failed to create package');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && packages.length === 0) {
    return <div className="text-center mt-5">Loading packages...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Software Packages</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Package
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Version</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {packages.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                {loading ? 'Loading packages...' : 'No packages found'}
              </td>
            </tr>
          ) : (
            packages.map(pkg => (
              <tr key={pkg.id}>
                <td>{pkg.id}</td>
                <td>{pkg.name}</td>
                <td>{pkg.version}</td>
                <td>{formatDateTime(pkg.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Package Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePackage}>
            <Form.Group className="mb-3">
              <Form.Label>Package Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newPackage.name}
                onChange={handleInputChange}
                placeholder="e.g., Chrome, Firefox, Office"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Version</Form.Label>
              <Form.Control
                type="text"
                name="version"
                value={newPackage.version}
                onChange={handleInputChange}
                placeholder="e.g., 1.0.0, 95.0.1"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Package
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PackagesList;