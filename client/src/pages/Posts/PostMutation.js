import {useEffect, useState} from "react"
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
const PostMutation = () => {
    const [value, setValue] = useState([]);
    const [pagination, setPagination] = useState({});
    const [searchParams] = useSearchParams();

    const page = searchParams.get("page") || 1;
    const size = searchParams.get("size") || 10;
    const getAllRegions = async () => {
      try{
        const res = await http({
          url: `/regions?page=${page}&size=${size}`,
        });
        console.log(res);
        setValue(res.data.data.content);
        setPagination(res.data.data.pagination);
      }catch (error) {
        toast.error(error.response.data.message);
      }   
    };   
    useEffect(() => {
      getAllRegions();
    }, [page]);
    const regionCols = [
      {  
        id: "name",
        Header: "Viloyat",
        accessor: (region) => {
          return <Link to={`/posts/new/${region.id}`}>{region.name}</Link>;
        },
      }  
    ];   
         
    return (
      <Layout pageName="Add Post">
<<<<<<< HEAD
     <form>
     <Select
              data={regions?.map(e=>{
                return {id:e.id, 
                name:e.name}
              })}
              onChange={(e)=>{setRegionId(e.target.value)}}
            >
              Viloyatlar
            </Select>

    {orders&&<ul>
      {orders?.map(e=>{return <li style={{border: '1px solid black'}}>
      <p style={{display: 'inline',padding: '5rem'}}> {e.recipient}</p> 
              
               <Button
                  size="small"
                  name="btn"
                  btnStyle={{width: "12rem"}}
                  onClick={() => {
                    navigate(`/orders/info/${e.id}`);
                  }}
                >
                  Info
                </Button>
                <div style={{textAlign: "center",display: 'inline-block',padding:"2rem"}} >
                    {ordersArr&& <Input type="checkbox" checked={ordersArr.includes(e.id)} onClick={() => {
                    const index = ordersArr.includes(e.id);
                   if(index){
                    let orderIsArr=ordersArr.filter(i =>i!==e.id)
                    setOrdersArr(orderIsArr)
                   } else{
                    setOrdersArr(prev => ([...prev, e.id]));
                   }
                  }}></Input>}
                </div>
             
      </li>})}
       <Input type="text" placeholder="note" onChange={(e)=>setNote(e.target.value)}/>
     <Button name="btn" size="small" onClick={()=>async() =>{
         const res = await http({
          url:`posts/${postId}/send`,
          data: {postStatus:"DELIVERING",note: note},
          method: "PUT",
        });
        // navigate("/posts")
      }}>Send</Button> </ul>}

     </form>
=======
        {value?.length > 0 ? (
          <BasicTable columns={regionCols} data={value} pagination={pagination}           url="posts/new"
          />
        ) : (
          <p>Malumotlar yoq</p>
        )}
>>>>>>> 33dc528d0615a12269ab388bb9818c5be58b5422
      </Layout>
    );
}
export default PostMutation;
