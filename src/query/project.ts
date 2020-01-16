import { ObjectId } from "mongodb";
export const listOfUserAsOwnerAndColloaboratorProjects = (id: ObjectId) => {
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
