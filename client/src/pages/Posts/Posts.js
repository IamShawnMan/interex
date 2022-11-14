import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const location = useLocation();
  const url = location.pathname;
  const getAllPosts = async () => {
    try {
      const res = await http({
        url:url==="/posts"? `/posts?page=${page}&size=${size}`:`/postback/rejectedposts`,
      });
      console.log(res);
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, [page, info]);
  const postCols = [
    {
      id: "id",
      Header: "NO",
      accessor: (_, i) => {
        return i + 1;
      },
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
      accessor: (post)=>{
        return(
          <>
          {(post.postTotalPrice)?.toLocaleString("Ru-Ru")}
          </>
        )
      },
    },
    {
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew=new Date(order.createdAt)
        console.log(dateNew);
        return (
          <>
             {dateNew.getDate()}/
             {dateNew.getMonth()+1}/
             {dateNew.getFullYear()}
             <br/>
             {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
    {
      Header: "Tugmalar",
      accessor: (post) => {
        return (
          <div style={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              name="btn"
              onClick={() => {
                navigate(`/posts/${post.id}/orders`);
              }}
            >
              Ma'lumot
            </Button>

            {(user.userRole === "ADMIN" ||user.userRole === "COURIER")&& (
              <Button
                size="small"
                name="btn"
                disabled={user.userRole === "COURIER"?post.postStatus !== "REJECTED_NEW":post.postStatus !== "NEW"}
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
    postCols.unshift({
      id: "regionName",
      Header: "regionName",
      accessor: "region.name",
    });
  }
  const regionCols = [
    {
      id: "name",
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
              <p>Regions</p>
              <BasicTable columns={regionCols} data={regionValue} />
            </>
          ) : (
            <p>Ma'lumotlar yo'q</p>
          )}
        </>
      ) : (
        ""
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
      {value?.length > 0 ? (
        <BasicTable
          columns={postCols}
          data={value}
          pagination={pagination}
          url="/posts"
        />
      ) : (
        <p>Ma'lumotlar yo'q</p>
      )}
    </Layout>
  );
};

export default Posts;
