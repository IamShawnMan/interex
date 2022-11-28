import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Modal from "../../components/Modal/Modal";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import * as yup from "yup";
const scheme=yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Ism kiriting"),
  phone: yup
    .string()
    .trim()
    .required("Telefon raqamini kiritng"),
    avtoNumber: yup
    .string()
    .trim()
    .required("Mashina raqamini kiriting"),
  comment: yup.string().trim().required("Eslatma kiritng"),
 
})
const PostSendCourier = ({ id, url, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(scheme),
	});
  useEffect(() => {
   reset({phone:"+998"})
  },[])
  const sendPost = async (data) => {
    console.log(data);
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
         ...data
        },
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };
  const changeOrderStatusByCourier = async (data) => {
    console.log(data);
    try {
      const res = await http({
        url: `/orders/delivered/${id.id}/status`,
        method: "PUT",
        data: {
          orderStatus: id.status,
         note: data.comment,
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
        <form style={{padding: "20px"}} onSubmit={handleSubmit(((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && changeOrderStatusByCourier) ||
      ((url === "/postback" || url === "/posts") && sendPost))} className="form">
					<Input
						id="text"
						type="text"
						placeholder="Ismi"
						register={register.bind(null, "name")}
						error={errors.name?.message}
					/>
					<Input
						id="phone"
						type="text"
						placeholder="Telefon Raqami"
						register={register.bind(null, "phone")}
						error={errors.phone?.message}
					/>

					<Input
						id="avtoNumber"
						type="text"
						placeholder="Mashina Raqami"
						register={register.bind(null, "avtoNumber")}
						error={errors.avtoNumber?.message}
					/>
					
					<Input
						id="text"
						type="text"
						placeholder="Eslatma"
						register={register.bind(null, "comment")}
						error={errors.comment?.message}
					/>

					<Button type="submit" size="small" name="btn" className="btnLogin">
          {((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && `${id.status} Order`) ||
      ((url === "/postback" || url === "/posts") && "Send Post")}
					</Button>
				</form>
    </Modal>
  );
};

{/* <div style={{ padding: "20px" }}>
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
</div> */}
export default PostSendCourier;
