import { Users, Tasks, Projects } from "../../src/models";
import user from "./fixtures/user.json";
import tasks from "./fixtures/task.json";
import project from "./fixtures/project.json";

export const userCollection = {
    reset () {
        return Users.deleteMany({});
    },
    populate () {
        return Users.create(user);
    }
}

export const taskCollection = {
    reset () {
        return Tasks.deleteMany({});
    },
    populate () {
        return Tasks.create(tasks);
    }
}

export const projectCollection = {
    reset () {
        return Projects.deleteMany({})
    },
    populate () {
        return Projects.create(project);
    }
}
