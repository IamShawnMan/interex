import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Modal from "../../components/Modal/Modal";
import http from "../../utils/axios-instance";
const PostSendCourier= ({ id,onClose}) => {
    const [note,setNote] = useState(null)
    const navigate = useNavigate();
    console.log(id);
    const sendPost=async()=>{
        try {
            const res = await http({
                url: `posts/${id}/send`,
                method: 'PUT',
                data:{postStatus:"DELIVERING",note}
              });
              console.log(res);
              toast.success(res.data.message)
              onClose()
            //   console.log(res);
            //   navigate("/posts")
        } catch (error) {
            console.log(error);
        }
    }
    return ( 
        <Modal onClose={onClose} >
            <Input type="text" placeholder="note" onChange={(e)=>setNote(e.target.value)}/>
            <Button name="btn" size="small" onClick={sendPost}>Send Post</Button>
        </Modal>
     );
}
 
export default PostSendCourier