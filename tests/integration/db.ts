import { Users } from "../../src/models";
import user from "./fixtures/user.json";

export const userCollection = {
    reset () {
        return Users.deleteMany({});
    },
    populate () {
        return Users.create(user);
    }
}
