import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Modal from "../../components/Modal/Modal";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
const PostSendCourier = ({ id, url, onClose }) => {
  const [note, setNote] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const sendPost = async () => {
    try {
      const res = await http({
        url:
          user.userRole === "ADMIN"
            ? `/posts/${id}/send`
            : `/postback/${id}/send/rejected`,
        method: "PUT",
        data: {
          postStatus:
            user.userRole === "ADMIN" ? "DELIVERING" : "REJECTED_DELIVERING",
          note,
        },
      });
      navigate("/orders/delivered")
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };
  const changeOrderStatusByCourier = async () => {
    try {
      const res = await http({
        url: `/orders/delivered/${id.id}/status`,
        method: "PUT",
        data: {
          orderStatus: id.status,
          note,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "20px" }}>
        <Input
          type="text"
          placeholder="note"
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          name="btn"
          size="small"
          btnStyle={{ marginTop: "10px" }}
          onClick={
            ((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && changeOrderStatusByCourier) ||
            ((url === "/postback" || url === "/posts") && sendPost)
          }
        >
          {console.log(id)}
          {console.log(url)}
          {((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && `${id.status} Order`) ||
            ((url === "/postback" || url === "/posts") && "Send Post")}
        </Button>
      </div>
    </Modal>
  );
};

export default PostSendCourier;
