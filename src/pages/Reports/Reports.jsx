import { useState, useEffect } from 'react'
import './Reports.css'

function Reports() {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = JSON.parse(localStorage.getItem('issueReports') || '[]')
    setReports(storedReports)
  }, [])

  const getIssueTypeIcon = (type) => {
    const icons = {
      damaged: '📦',
      missing: '❌',
      wrong: '🔄',
      quality: '⚠️',
      late: '⏰',
      other: '🤔'
    }
    return icons[type] || '❓'
  }

  const getIssueTypeText = (type) => {
    const texts = {
      damaged: 'Product Damaged',
      missing: 'Item Missing',
      wrong: 'Wrong Item Received',
      quality: 'Quality Issue',
      late: 'Delivery Delayed',
      other: 'Other'
    }
    return texts[type] || 'Unknown'
  }

  const handleSelectReport = (report) => {
    if (selectedReport?.id === report.id) {
      setSelectedReport(null)
    } else {
      setSelectedReport(report)
    }
  }

  // Filter and search logic
  const filteredReports = reports.filter(report => {
    const statusMatch = filterStatus === 'All' || report.status === filterStatus
    const searchMatch =
      report.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  return (
    <div className="reports-admin-container">
      <div className="reports-header-banner">
        <h1 className="reports-title">📋 My Issue Reports</h1>
        <p className="reports-subtitle">View your submitted issue reports and admin responses</p>
      </div>

      <div className="reports-main-content">
        {/* Sidebar - Reports List */}
        <div className="reports-sidebar">
          {/* Controls */}
          <div className="reports-controls">
            <input
              type="text"
              placeholder="Search by Order ID, Report ID..."
              className="reports-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="reports-filter">
              <label className="reports-filter-label">Filter by Status:</label>
              <select
                className="reports-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Reports</option>
                <option value="Open">Open (Pending)</option>
                <option value="Resolved">Resolved (Replied)</option>
              </select>
            </div>

            <div className="reports-stats">
              <div className="stat-box open-stat">
                <p className="stat-number">{reports.filter(r => r.status === 'Open').length}</p>
                <p className="stat-label">Pending</p>
              </div>
              <div className="stat-box resolved-stat">
                <p className="stat-number">{reports.filter(r => r.status === 'Resolved').length}</p>
                <p className="stat-label">Replied</p>
              </div>
              <div className="stat-box total-stat">
                <p className="stat-number">{reports.length}</p>
                <p className="stat-label">Total</p>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="reports-list">
            {filteredReports.length === 0 ? (
              <div className="no-reports">
                <p className="no-reports-icon">📭</p>
                <p className="no-reports-text">No reports found</p>
              </div>
            ) : (
              filteredReports.map(report => (
                <div
                  key={report.id}
                  className={`report-item ${selectedReport?.id === report.id ? 'active' : ''}`}
                  onClick={() => handleSelectReport(report)}
                >
                  <div className="report-item-header">
                    <span className="report-issue-icon">{getIssueTypeIcon(report.issueType)}</span>
                    <span className="report-id">{report.id}</span>
                    <span className={`report-status-badge ${report.status.toLowerCase()}`}>
                      {report.status === 'Open' ? 'Pending' : 'Replied'}
                    </span>
                  </div>
                  <p className="report-order-id">Order: {report.orderId}</p>
                  <p className="report-customer">{report.customerName}</p>
                  <p className="report-date">{new Date(report.submittedDate).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content - Report Details */}
        <div className="reports-detail">
          {selectedReport ? (
            <div className="report-detail-content">
              {/* Report Header */}
              <div className="detail-header">
                <div className="detail-header-top">
                  <h2 className="detail-title">
                    <span className="detail-icon">{getIssueTypeIcon(selectedReport.issueType)}</span>
                    {selectedReport.id}
                  </h2>
                  <span className={`detail-status-badge ${selectedReport.status.toLowerCase()}`}>
                    {selectedReport.status === 'Open' ? 'Pending' : 'Replied'}
                  </span>
                </div>
              </div>

              {/* Report Info Grid */}
              <div className="detail-info-grid">
                <div className="info-box">
                  <p className="info-label">Report ID</p>
                  <p className="info-value">{selectedReport.id}</p>
                </div>
                <div className="info-box">
                  <p className="info-label">Order ID</p>
                  <p className="info-value">{selectedReport.orderId}</p>
                </div>
                <div className="info-box">
                  <p className="info-label">Issue Type</p>
                  <p className="info-value">{getIssueTypeText(selectedReport.issueType)}</p>
                </div>
                <div className="info-box">
                  <p className="info-label">Status</p>
                  <p className="info-value">{selectedReport.status === 'Open' ? 'Pending' : 'Replied'}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="detail-section">
                <h3 className="section-title">👤 Your Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <p className="info-label">Name</p>
                    <p className="info-value">{selectedReport.customerName}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Email</p>
                    <p className="info-value">{selectedReport.customerEmail}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Submitted On</p>
                    <p className="info-value">{selectedReport.submittedAt}</p>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="detail-section">
                <h3 className="section-title">📝 Your Issue Description</h3>
                <div className="description-box">
                  <p>{selectedReport.description}</p>
                </div>
              </div>

              {/* Products in Order */}
              {selectedReport.products && selectedReport.products.length > 0 && (
                <div className="detail-section">
                  <h3 className="section-title">📦 Order Items</h3>
                  <div className="products-list">
                    {selectedReport.products.map(product => (
                      <div key={product.id} className="product-item">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-qty">Qty: {product.qty}</p>
                        </div>
                        <p className="product-price">₹{product.price * product.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Response Section - Read Only */}
              {selectedReport.status === 'Resolved' && selectedReport.adminResponse && (
                <div className="detail-section">
                  <h3 className="section-title">💬 Admin Response</h3>
                  <div className="response-box resolved">
                    <p className="response-text">{selectedReport.adminResponse}</p>
                    <p className="response-date">Replied on: {selectedReport.respondedAt}</p>
                  </div>
                </div>
              )}

              {selectedReport.status === 'Open' && (
                <div className="detail-section">
                  <div className="pending-message">
                    <p className="pending-icon">⏳</p>
                    <p className="pending-text">Our team is reviewing your issue. We'll respond soon!</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <p className="no-selection-icon">👈</p>
              <p className="no-selection-text">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports

