import { Users } from "../src/models";
import user from "./fixtures/user.json";

export const reset = () => {
    return Users.deleteMany({});
}

export const populate = () => {
    return Users.create(user);
}
