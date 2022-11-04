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
  }, [page,info]);

  const postCols = [
    {
      id: "id",
      Header: "id",
      accessor: "id",
    },
    {
      id: "note",
      Header: "note",
      accessor: "note",
    },
    {
      id: "postStatus",
      Header: "postStatus",
      accessor: "postStatus",
    },
    {
      id: "postTotalPrice",
      Header: "postTotalPrice",
      accessor: "postTotalPrice",
    },
    {
      Header: "Action",
      accessor: (post) => {
        return (
         <div style={{display: 'flex',gap: 1}}>
              <Button  
                size="small"
                name="btn"
                onClick={() => {
                  navigate(`/posts/${post.id}/orders`);
                }}
              >
                info
              </Button>
            
             <Button  
                size="small"
                name="btn"
                disabled={post.postStatus!=="NEW"}
              >
                Send Post
              </Button>
            
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
        return <Link to={`/posts/${region.id}/regionorders`}>{region.name}</Link>;
      },
    },
  ];
  return (
    <Layout pageName="Postlar">
   <p>Regions</p>
      {regionValue?.length > 0 ? (
          <BasicTable columns={regionCols} data={regionValue} />
        ) : (
          <p>Malumotlar yoq</p>
        )}
      {value?.length > 0 ? (
        <BasicTable
          columns={postCols}
          data={value}
          pagination={pagination}
          url="/posts"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
};

export default Posts;
