export enum Visibility {
    public = "PUBLIC",
    private = "PRIVATE"
}

export const projectProperties = [
    {
        label: "title",
        type: "string"
    },
    {
        label: "description",
        type: "string"
    },
    {
        label: "color",
        type: "string"
    },
    {
        label: "owner",
        type: "string"
    },
    {
        label: "tasks",
        type: "array-string"
    },
    {
        label: "collaborators",
        type: "array-string"
    },
    {
        label: "visibility",
        type: "public|private"
    },
    {
        label: "isDeleted",
        type: "boolean"
    },
    {
        label: "isArchived",
        type: "boolean"
    },
    {
        label: "isFavourite",
        type: "boolean"
    }
];
