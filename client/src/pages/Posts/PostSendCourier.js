import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Modal from "../../components/Modal/Modal";
import http from "../../utils/axios-instance";
const PostSendCourier= ({ id,url,onClose}) => {
    const [note,setNote] = useState(null)

   const sendPost=async()=>{
        try {
            const res = await http({
                url: `posts/${id}/send`,
                method: 'PUT',
                data:{postStatus:"DELIVERING",note}
              });
              console.log(res);
              toast.success(res.data.message)
              
        } catch (error) {
            console.log(error);
        }finally{
            onClose()
        }
    }
    const changeOrderStatusByCourier = async () => {
        try {
          const res = await http({
            url: `/orders/delivered/${id.id}/status`,
            method: "PUT",
            data: {
              orderStatus: id.status,
              note
            },
          });
         
        } catch (error) {
          console.log(error);
        }finally{
             onClose()
        }
      };
    return ( 
        <Modal onClose={onClose} >
            <div style={{padding:"20px"}}>
            <Input type="text" placeholder="note" onChange={(e)=>setNote(e.target.value)}/>

            <Button name="btn" size="small" btnStyle={{marginTop:"10px"}} onClick={ typeof id!== 'object'?sendPost:changeOrderStatusByCourier}>{typeof id!=='object'?"Send Post":`${id.status} Order`}</Button>
            </div>
      
        </Modal>
     );
}
 
export default PostSendCourier