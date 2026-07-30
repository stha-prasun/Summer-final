import { User } from "../user.model.js";

const VALID_ROLES = ["user"];

export const createUser = (data) => {
  const { name, email, password, phone } = data;

  if (!name || !email || !password || !phone) {
    throw new Error("Name, email, password, and phone are required.");
  }

  if (data.role && !VALID_ROLES.includes(data.role)) {
    throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`);
  }

  return new User({
    name,
    email,
    password,
    phone,
    address: {
      street: data.address?.street || "",
      city: data.address?.city || "",
      state: data.address?.state || "",
      zip: data.address?.zip || "",
      country: data.address?.country || "",
    },
    role: data.role || "user",
  });
};

export const applyUserUpdates = (user, data) => {
  const fields = ["name", "email", "phone"];

  for (const field of fields) {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  }

  if (data.address) {
    const addrFields = ["street", "city", "state", "zip", "country"];
    for (const field of addrFields) {
      if (data.address[field] !== undefined) {
        user.address[field] = data.address[field];
      }
    }
  }
};
