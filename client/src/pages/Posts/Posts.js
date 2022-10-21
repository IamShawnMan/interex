import {useEffect, useState} from "react"
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";

const Posts = () => {
    const [value, setValue] = useState([]);
    const getAllUser = async () => {
      try {
        const res = await http({
          url: "/regions",
        });
        setValue(res.data.data.allRegions);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    useEffect(() => {
      getAllUser();
    }, []);
  
    const userStatusChangeHandler = async ({ id, status }) => {
      try {
        const res = await http({
          url: `users/${id}/status`,
          data: { status },
          method: "PUT",
        });
  
        getAllUser();
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error.response.data);
      }
    };
  
    const regionCols = [
      {
        id: "name",
        Header: "Viloyat",
        accessor: (region) => {
          return <Link to={`/posts/${region.id}`}>{region.name}</Link>;
        },
      }
    ];
  
    return (
      <Layout pageName="Postlar">
        {value?.length > 0 ? (
          <BasicTable columns={regionCols} data={value} />
        ) : (
          <p>Malumotlar yoq</p>
        )}
      </Layout>
    );
}
 
export default Posts;