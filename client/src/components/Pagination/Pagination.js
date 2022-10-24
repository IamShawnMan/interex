import React from "react";
import { Link } from "react-router-dom";
import styles from "./Pagination.module.css";
import PaginationArrow from "../../assets/icons/PaginationArrow";

function Pagination(props) {
  // const { allPagesCount, hasNextPage, isLastPage, page } = props.pagination;
  const url = props.url;
  const page = 2;
  const allPagesCount = 3;
  const hasNextPage = true;
  const isLastPage = true;

  return (
    <div className={styles.paginationContainer}>
      <Link
        disabled
        to={`${url}?page=${page ? page : 0 - 1}&size=3`}
        className={`${styles.prev} ${!isLastPage ? styles.disabledTrue : ""} ${
          styles.arrowLeft
        }`}
      >
        <PaginationArrow />
      </Link>
      {allPagesCount &&
        Array.from({ length: allPagesCount }).map((_, i) => {
          return (
            <Link
              disabled
              className={`${styles.linkPages}  ${
                +page === i + 1 ? styles.active : ""
              }`}
              to={`${url}?page=${i + 1}&size=3`}
              key={i + "xksxskj"}
              style={page === i + 1 ? { pointerEvents: "none" } : null}
            >
              {i + 1}
            </Link>
          );
        })}

      <Link
        to={`${url}?page=${+page + 1}&size=3`}
        className={`${styles.next} ${!hasNextPage ? styles.disabledTrue : ""}`}
      >
        <PaginationArrow />
      </Link>
    </div>
  );
}

export default Pagination;
