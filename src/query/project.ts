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
        }
    ];
};
