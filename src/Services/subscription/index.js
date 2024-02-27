import axios from "axios";

async function getSubscriptions(params) {
  const response = await axios.get("/subscription", {
    params,
  });
  return response;
}

async function getSingleSubscription(subscriptionId) {
  const response = await axios.get(`/subscription/${subscriptionId}`);
  return response;
}

async function adminAssignSubscription(data) {
  const response = await axios.post("/subscription/admin", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function deleteSubscription(subscriptionId) {
  const response = await axios.delete(`/subscription/${subscriptionId}`);
  return response;
}

export default {
  getSubscriptions,
  getSingleSubscription,
  adminAssignSubscription,
  deleteSubscription,
};
