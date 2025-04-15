import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    width: '100vw',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  mainContainer: {
    width: '100%',
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: 'none',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '1rem',
  },
  controlsContainer: {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem',
    border: '1px solid #dee2e6',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    width: '100%',
  },
  controlsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginRight: '0.5rem',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    minWidth: 'max-content',
  },
  tableContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    border: '1px solid #dee2e6',
  },
  table: {
    width: '100%',
    margin: 0,
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  headerCell: {
    backgroundColor: '#212529',
    color: '#fff',
    padding: '0.75rem 1rem',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  cell: {
    padding: '0.75rem 1rem',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: '#fff',
    height: '57px', // Fixed height for rows
    verticalAlign: 'middle',
  },
  footer: {
    marginTop: '1.5rem',
    padding: '1rem 0',
    borderTop: '1px solid #dee2e6',
  }
} as const;

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface BookResponse {
  data: Book[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/Books?pageNumber=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        return res.json();
      })
      .then((data: BookResponse) => {
        setBooks(data.data);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, pageSize, sortField, sortOrder]);

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.mainContainer}>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.mainContainer}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <h1 className="h3 text-center mb-0">Book List</h1>
        </div>
        
        <div style={styles.controlsContainer}>
          <div style={styles.controlsWrapper}>
            <div style={styles.controlGroup}>
              <label style={styles.label}>Page Size:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: '80px' }}
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.controlGroup}>
              <label style={styles.label}>Sort By:</label>
              <select 
                className="form-select form-select-sm"
                style={{ width: '140px' }}
                value={sortField} 
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publisher">Publisher</option>
                <option value="isbn">ISBN</option>
                <option value="classification">Classification</option>
                <option value="category">Category</option>
                <option value="pagecount">Page Count</option>
                <option value="price">Price</option>
              </select>
            </div>
            
            <div style={styles.controlGroup}>
              <label style={styles.label}>Order:</label>
              <select 
                className="form-select form-select-sm"
                style={{ width: '120px' }}
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table} className="table table-hover">
              <thead>
                <tr>
                  <th style={{...styles.headerCell, width: '20%'}}>Title</th>
                  <th style={{...styles.headerCell, width: '15%'}}>Author</th>
                  <th style={{...styles.headerCell, width: '15%'}}>Publisher</th>
                  <th style={{...styles.headerCell, width: '15%'}}>ISBN</th>
                  <th style={{...styles.headerCell, width: '12%'}}>Classification</th>
                  <th style={{...styles.headerCell, width: '12%'}}>Category</th>
                  <th style={{...styles.headerCell, width: '5%', textAlign: 'right'}}>Pages</th>
                  <th style={{...styles.headerCell, width: '6%', textAlign: 'right'}}>Price</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookID}>
                    <td style={styles.cell}>{book.title}</td>
                    <td style={styles.cell}>{book.author}</td>
                    <td style={styles.cell}>{book.publisher}</td>
                    <td style={styles.cell}>{book.isbn}</td>
                    <td style={styles.cell}>{book.classification}</td>
                    <td style={styles.cell}>{book.category}</td>
                    <td style={{...styles.cell, textAlign: 'right'}}>{book.pageCount}</td>
                    <td style={{...styles.cell, textAlign: 'right'}}>${book.price.toFixed(2)}</td>
                  </tr>
                ))}
                {/* Add empty rows to maintain height when less data */}
                {books.length < pageSize && Array(pageSize - books.length).fill(0).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                    <td style={styles.cell}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.footer}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="small text-muted">
              Showing {books.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} books
            </div>
            
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <li 
                    key={pageNum} 
                    className={`page-item ${page === pageNum ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;