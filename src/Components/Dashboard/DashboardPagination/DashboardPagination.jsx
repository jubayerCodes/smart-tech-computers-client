import React from "react";

const DashboardPagination = ({ limit, page, setLimit, setPage, pages }) => {
  const handleNext = () => {
    if (pages.length == page) {
      return;
    }

    setPage(page + 1);
  };

  const handlePrev = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
  };

  return (
    <>
      <div className="my-3">
        <span id="display-info"></span>
      </div>

      <div className="footer">
        <div className="entries-page">
          <label htmlFor="entries" className="mr-2">
            Products per page:
          </label>
          <div className="select-container">
            <select
              id="entries"
              className="form-control"
              style={{ width: "auto" }}
              onChange={(e) => setLimit(e.target.value)}
              value={limit}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="dropdown-icon">&#9662;</span>
            {/* <!-- Dropdown icon --> */}
          </div>
        </div>

        <div
          id="pagination"
          className="pagination"
          onClick={() => handlePrev()}
        >
          <button id="prevBtn" className="btn">
            Prev
          </button>
          {pages?.map((page, idx) => (
            <a
              onClick={() => {
                setPage(page);
                setLimit(10);
              }}
              key={idx}
              className={`page-link page-link--${page}`}
            >
              {page}
            </a>
          ))}

          <button id="nextBtn" className="btn" onClick={() => handleNext()}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardPagination;
