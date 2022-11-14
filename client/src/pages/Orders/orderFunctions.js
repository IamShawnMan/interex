export const changeOrderStatus = async (id, status) => {
  try {
    const res = await http({
      url: `/orders/${id}`,
      method: "PATCH",
      data: {
        orderStatus: status,
      },
    });
    filterFn();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
