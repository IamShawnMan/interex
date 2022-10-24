import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Pagination.module.css";
import PaginationArrow from "../../assets/icons/PaginationArrow";
import PaginationDots from "../../assets/icons/PaginationDots";

function Pagination(props) {
  const { allPagesCount, page, isFirstPage, isLastPage } = props.pagination;
  const url = props.url;
  const [pagesArray, setPagesArray] = useState(6);
  const offset = pagesArray - 6;
  const sixPageChange = (num) => {
    if (num === 1) {
      setPagesArray(pagesArray + 6);
    } else {
      setPagesArray(pagesArray - 6);
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <Link
        to={`/${url}?page=${+page - 1}&size=3`}
        className={`${styles.pageLinks} ${
          isFirstPage ? styles.disabledTrue : ""
        } ${styles.arrowLeft}`}
      >
        <PaginationArrow classname={`${styles.arrow}`} />
      </Link>
      {pagesArray > 7 && (
        <Link to={`/${url}?page=${+offset - 5}`} onClick={sixPageChange}>
          <PaginationDots />
        </Link>
      )}
      {allPagesCount &&
        Array.from({ length: allPagesCount }).map((_, i) => {
          if (i + 1 > offset && i + 1 <= pagesArray) {
            return (
              <Link
                className={`${styles.pageLinks}  ${
                  +page === i + 1 ? styles.active : ""
                }`}
                to={`/${url}?page=${+i + 1}&size=2`}
                key={i + "xksxskj"}
                style={page === i + 1 ? { pointerEvents: "none" } : null}
              >
                {i + 1}
              </Link>
            );
          }
        })}

      {allPagesCount > pagesArray && (
        <Link
          to={`/${url}?page=${+offset + 7}`}
          onClick={sixPageChange.bind(null, 1)}
        >
          <PaginationDots />
        </Link>
      )}

      <Link
        to={`/${url}?page=${+page + 1}&size=2`}
        className={`${styles.pageLinks} ${
          isLastPage ? styles.disabledTrue : ""
        }`}
      >
        <PaginationArrow classname={`${styles.arrow}`} />
      </Link>
    </div>
  );
}

export default Pagination;
