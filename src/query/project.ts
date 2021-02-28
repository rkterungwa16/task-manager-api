import { ObjectId } from "mongodb";
export const listOfUserAsOwnerAndColloaboratorProjects = (id: string) => {
    return [
        {
            $match: {
                $or: [
                    {
                        collaborators: {
                            $in: [new ObjectId(id)]
                        }
                    },
                    {
                        owner: new ObjectId(id)
                    }
                ]
            }
        },
        {
            $addFields: {
                isOwner: {
                    $eq: ["$owner", new ObjectId(id)]
                }
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "project",
                as: "tasks"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: false
            }
        },
        {
            $project: {
                "owner.password": 0,
                "owner.salt": 0
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "collaborators",
                foreignField: "_id",
                as: "collaborators"
            }
        },
        {
            $project: {
                "collaborators.password": 0,
                "collaborators.salt": 0
            }
        }
    ];
};

export const singleProjectWithTasks = (projectId: string) => {
    return [
        {
            $match: {
                _id: new ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "project",
                as: "tasks"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: false
            }
        },
        {
            $project: {
                "owner.password": 0,
                "owner.salt": 0
            }
        }
    ];
};
