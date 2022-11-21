import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import { formatDate } from "../../utils/dateFormatter";
import PostSendCourier from "./PostSendCourier";
const Posts = () => {
  const { user } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [info, setInfo] = useState(null);
  const [viewAllPosts, setViewAllPosts] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const location = useLocation();
  const url = location.pathname;
  const getAllPosts = async () => {
    try {
      const res = await http({
        url:
          url === "/posts"
            ? `/posts?page=${page}&size=${size}`
            : `/postback/rejectedposts`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, [page, info, url]);
  const postCols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "postTotalPrice",
      Header: "Pochta narxi",
      accessor: (post) => {
        return <>{post.postTotalPrice?.toLocaleString("Ru-Ru")}</>;
      },
    },
    {
      id: "postStatus",
      Header: "Pochta holati",
      accessor: "postStatusUz",
    },

    {
      Header: "Oxirgi o'zgarish",
      accessor: (order) => {
        return formatDate(order.updatedAt);
      },
    },
    {
      Header: "Tugmalar",
      accessor: (post) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
              gap: "0.5rem",
              width: "14rem",
            }}
          >
            <Button
              size="small"
              name="btn"
              onClick={() => {
                url === "/postback"
                  ? navigate(`/postback/rejectedposts/${post.id}`)
                  : navigate(`/posts/${post.id}/orders`);
              }}
            >
              Ma'lumot
            </Button>

            {(user.userRole === "ADMIN" || user.userRole === "COURIER") && (
              <Button
                size="small"
                name="btn"
                disabled={
                  user.userRole === "COURIER"
                    ? post.postStatus !== "REJECTED_NEW"
                    : post.postStatus !== "NEW"
                }
                onClick={() => {
                  setInfo(post.id);
                }}
              >
                Pochtani jo'natish
              </Button>
            )}
          </div>
        );
      },
    },
  ];


  if (user.userRole !== "COURIER") {
    postCols.splice(0, 1);
    postCols.unshift({
      id: "region",
      Header: "Viloyat",
      accessor: "region.name",
    });

    postCols.unshift({
      id: "id",
      Header: "ID",
      accessor: "id",
    });
  }


  return (
    <Layout pageName="Postlar">
      {user.userRole === "COURIER" && (
        <div style={{ width: "25rem" }}>
          <Button
            name="btn"
            onClick={() => {
              url === "/postback"
                ? navigate("/postback/rejected/orders")
                : navigate("/new-post");
            }}
          >
            {url === "/postback" ? "Pochta yaratish" : "Bugungi pochta"}
          </Button>
        </div>
      )}
      {user.userRole === "ADMIN" && (
        <div style={{ width: "45rem", display: "flex", gap: "2rem" }}>
          <Button
            name="btn"
            type="button"
            onClick={() => {
              navigate("/rejected/posts");
            }}
          >
            Qaytarilgan po'chtalar
          </Button>
          <Button
            name="btn"
            type="button"
            onClick={() => {
              setViewAllPosts(!viewAllPosts);
            }}
          >
            {viewAllPosts ? "Hamma po'chtalar" : "Hamma po'chtalarni yashirish"}
          </Button>
          <Button
            name="btn"
            type="button"
            onClick={() => {
              navigate("/post/create");
            }}
          >
            Pochta Yaratish
          </Button>
        </div>
      )}
     
      {info && (
        <PostSendCourier
          id={info}
          url={url}
          onClose={() => {
            setInfo(false);
          }}
        />
      )}

      {!viewAllPosts && value?.length > 0 ? (
        <BasicTable
          columns={postCols}
          data={value}
          pagination={pagination}
          url="/posts"
        />
      ) : (
        <>{viewAllPosts && <p>Pochta ma'lumotlari yo'q</p>}</>
      )}
    </Layout>
  );
};

export default Posts;
