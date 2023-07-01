import { ObjectId } from "mongodb";
export const listProjectTasks = (id: ObjectId) => {
  return [
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project"
      }
    },
    {
      $unwind: {
        path: "$project"
      }
    }
  ];
};
