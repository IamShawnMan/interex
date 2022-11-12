import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import PostSendCourier from "./PostSendCourier";

const Posts = () => {
  const { user } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const [regionValue, setRegionValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [info, setInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const getAllPosts = async () => {
    try {
      const res = await http({
        url: `/posts?page=${page}&size=${size}`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, [page, info]);
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
      id: "postStatus",
      Header: "Pochta holati",
      accessor: "postStatus",
    },
    {
      id: "postTotalPrice",
      Header: "Pochta narxi",
      accessor: "postTotalPrice",
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
                navigate(`/posts/${post.id}/orders`);
              }}
            >
              Ma'lumot
            </Button>
            {user.userRole === "ADMIN" && (
              <Button
                size="small"
                name="btn"
                disabled={post.postStatus !== "NEW"}
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
  const getAllRegions = async () => {
    try {
      const res = await http({
        url: `/posts/new/regions`,
      });
      setRegionValue(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    user.userRole !== "COURIER" && getAllRegions();
  }, []);

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

  const regionCols = [
    {
      id: "region",
      Header: "Viloyat",
      accessor: (region) => {
        return (
          <Link to={`/posts/${region.id}/regionorders`}>{region.name}</Link>
        );
      },
    },
  ];
  return (
    <Layout pageName="Postlar">
      {user.userRole === "ADMIN" ? (
        <>
          {regionValue?.length > 0 ? (
            <>
              <p>Viloyatlar</p>
              <BasicTable columns={regionCols} data={regionValue} />
            </>
          ) : (
            <p>Viloyat ma'lumotlari yo'q</p>
          )}
        </>
      ) : (
        ""
      )}

      {info && (
        <PostSendCourier
          id={info}
          onClose={() => {
            setInfo(false);
          }}
        />
      )}
      {value?.length > 0 ? (
        <BasicTable
          columns={postCols}
          data={value}
          pagination={pagination}
          url="/posts"
        />
      ) : (
        <p>Pochta ma'lumotlari yo'q</p>
      )}
    </Layout>
  );
};

export default Posts;
