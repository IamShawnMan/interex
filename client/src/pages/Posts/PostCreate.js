import http from "../../utils/axios-instance";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import styles from "./Posts.module.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
const PostCreate = () => {
  const [regionValue, setRegionValue] = useState([]);
  const { user } = useContext(AppContext);

    useEffect(() => {
        user.userRole !== "COURIER" && getAllRegions();
      }, []);
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
    return (
    <Layout pageName="Post Yaratish">

    <>{ user.userRole === "ADMIN" ? (
        <>
        {console.log(regionValue)}
          {regionValue?.length > 0 ? (
            <div className={styles.div}>
            {regionValue.map((e)=>
              <div className={styles.divbox}>
                <Link style={{fontSize:"2rem"}} to={`/posts/${e.id}/regionorders`}>{e.name}</Link>
              </div>
            )}
            </div>
          ) : (
            <p
              style={{ width: "50%", margin: "2rem auto", textAlign: "center" }}
            >
              Yuborilishi kerak bo'lgan po'chtalar yo'q
            </p>
          )}
        </>
      ) : (
        ""
      )}</> 
      </Layout>);
}
 
export default PostCreate;