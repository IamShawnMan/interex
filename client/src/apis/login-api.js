import http from "../utils/axios-instance";

export const loginSubmit = async (data) => {
  const res = await http({
    url: "/auth/login",
    method: "POST",
    data,
  });
  return res.data;
};
