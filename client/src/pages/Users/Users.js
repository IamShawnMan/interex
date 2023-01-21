import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../utils/axios-instance";
import styles from "./Users.module.css";
import { useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import Switch from "../../components/Form/FormComponents/Switch/Switch";
import Button from "../../components/Form/FormComponents/Button/Button";
import AppContext from "../../context/AppContext";
import { phoneNumberFormat } from "../../utils/phoneNumberFormatter";
import Modal from "../../components/Modal/Modal";
import UserMutation from "./UserMutation";
function Users() {
  const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const { user } = useContext(AppContext);
  const [role, setRole] = useState(null);
  const [search, setSearch] = useState(null);
  const [modal, setModal] = useState(false);
  const onClose = () => {
    setModal(false);
  };
  const getAllUser = async () => {
    try {
      const res = await http({
        url: `/users?page=${page}&size=${size}${
          search ? `&search=${search}` : ""
        }${role ? `&userRole=${role}` : ""}`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  useEffect(() => {
    page = 1;
    getAllUser();
  }, [role]);
  useEffect(() => {
    getAllUser();
  }, [page, search]);

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
    }
  };

  const usersCols = [
    {
      id: "role",
      Header: "Nomi",
      accessor: (user) => {
        return <>{user?.storeName || user?.region?.name || "Interex"}</>;
      },
    },
    {
      id: "fullName",
      Header: "F.I.Sh",
      accessor: (user) => {
        return `${user.firstName} ${user.lastName}`;
      },
    },
    {
      id: "phoneNumber",
      Header: "Telefon raqam",
      accessor: (order) => {
        return (
          <a href={`tel:${order?.phoneNumber}`}>
            <b>{phoneNumberFormat(order?.phoneNumber)}</b>
          </a>
        );
      },
    },
    {
      id: "passportNumber",
      Header: "Passport raqam",
      accessor: "passportNumber",
    },
    { id: "status", Header: "Mansabi", accessor: "userRoleUz" },
  ];
  const superAdminAction = [
    {
      id: "userStatus",
      Header: "Status",
      accessor: (user) => {
        const status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        return (
          <Switch
            onSwitch={userStatusChangeHandler.bind(null, {
              id: user.id,
              status,
            })}
            enabled={user.status === "ACTIVE"}
            style={{ margin: "0 auto" }}
          />
        );
      },
    },
    {
      id: "actions",
      Header: "actions",
      accessor: (user) => {
        return (
          <Button
            size="iconSmall"
            name="icon"
            iconName="pen"
            onClick={() => {
              setModal({ onClose: onClose, filter: getAllUser, id: user.id });
            }}
            btnStyle={{
              margin: "0 auto",
              width: "4rem",
            }}
          />
        );
      },
    },
  ];
  if (user.userRole === "SUPER_ADMIN") {
    usersCols.push(...superAdminAction);
  }
  return (
    <Layout pageName="Foydalanuvchilar" setSearch={setSearch}>
      {user.userRole === "SUPER_ADMIN" && (
        <Button
        btnClass={styles.addUser}
          onClick={() => {
            setModal({ onClose, filter: getAllUser, id: "new" });
          }}
          size="iconSmall"
          name="btn"
        >
          Foydalanuvchi qo'shish
        </Button>
      )}
      <div className={styles.buttonDiv}>
        <button
          className={`${styles.button} ${
            role === null ? `${styles.buttonActive}` : ""
          }`}
          name="btn"
          onClick={() => setRole(null)}
        >
          Barchasi
        </button>
        <button
          className={`${styles.button} ${
            role === "ADMIN" ? `${styles.buttonActive}` : ""
          }`}
          name="btn"
          onClick={() => setRole("ADMIN")}
        >
          Adminlar
        </button>
        <button
          className={`${styles.button} ${
            role === "COURIER" ? `${styles.buttonActive}` : ""
          }`}
          name="btn"
          onClick={() => setRole("COURIER")}
        >
          Viloyat Boshliqlari
        </button>
        <button
          className={`${styles.button} ${
            role === "STORE_OWNER" ? `${styles.buttonActive}` : ""
          }`}
          name="btn"
          onClick={() => setRole("STORE_OWNER")}
        >
          Firmalar
        </button>
        {modal && <Modal children={<UserMutation modal={modal} />} onClose={onClose} />}
      </div>
      {value?.length > 0 ? (
        <BasicTable
          columns={usersCols}
          data={value}
          pagination={pagination}
          url="/users"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Users;
