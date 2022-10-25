import {useEffect, useState} from "react"
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";

const Posts = () => {
    const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
    const getAllPosts = async () => {
      try {
        const res = await http({
          url: `/posts?page=${page}&size=${size}`,
        });
        // console.log(res);
        setValue(res.data.data.allPosts.content);
      setPagination(res.data.data.allPosts.pagination);

      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    useEffect(() => {
      getAllPosts();
    }, [page]);
  
    const regionCols = [
      {
        id: "id",
        Header: "id",
        accessor:"id"
      },
      {
        id: "note",
        Header: "note",
        accessor:"note"
      },
      {
        id: "postStatus",
        Header: "postStatus",
        accessor:"postStatus"
      },
      {
        id: "postTotalPrice",
        Header: "postTotalPrice",
        accessor:"postTotalPrice"
      },
      {
        id: "regionName",
        Header: "regionName",
        accessor:"region.name"
      },
      {
        id: "regionId",
        Header: "regionId",
        accessor:"regionId"
      }
    ];
  
    return (
      <Layout pageName="Postlar">
        <Link style={{width:"12rem",display: "block"}} to="./new"><Button size="small" name="btn">Add Post</Button></Link>
        {value?.length > 0 ? (
          <BasicTable columns={regionCols} data={value} pagination={pagination} url="posts"
          />
        ) : (
          <p>Malumotlar yoq</p>
        )}
      </Layout>
    );
}
 
export default Posts;