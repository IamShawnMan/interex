import {useEffect, useState} from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Select from "../../components/Form/FormComponents/Select/Select";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
const PostMutation = () => {
  const [regions,setRegions]=useState(null);
  const [regionId,setRegionId]=useState(null);  
  const [postId,setPostId]=useState(null);  
  const [orders,setOrders]=useState(null);  
  const [ordersArr,setOrdersArr]=useState(null);  
  const [note,setNote]=useState(null);  
  const navigate = useNavigate();
    useEffect(() => {
      getAllRegions();
    }, []);
    useEffect(() => {
      if(regionId){
        getOrdersByPackageId(regionId)
      }
    },[regionId])
    useEffect(() => {
      if(postId){
        getAllRegionsByIdOrders(postId)
      }
    },[postId])
    const getAllRegions = async () => {
      try{
        const res = await http({
          url: `/posts/new/regions`,
        });
        console.log(res);
        setRegions(res.data.data);
      }catch (error) {
        toast.error(error.response.data.message);
      }   
    };   
    const getAllRegionsByIdOrders = async (id) => {
      try{
        const res = await http({
          url: `/posts/${id}/orders`,
        });
        // console.log(res);
        setOrders(res.data.data.content)
        setOrdersArr(res.data.data.ordersArrInPost)
      }catch (error) {
        toast.error(error.response.data.message);
      }   
    };   
    const getOrdersByPackageId = async (id) => {
      try {
        const res = await http({
          url: `/posts/new`,
          method: "POST",
          data:{regionId:id}
        });
        // console.log(res);
        setPostId(res.data.data)
          toast.success(res.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Layout pageName="Add Post">
     <form>
     <Select
              data={regions?.map(e=>{return {id:e,name:e}})}
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
      </Layout>
    );
}
export default PostMutation;