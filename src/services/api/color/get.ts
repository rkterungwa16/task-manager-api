export interface ColorInterface {
    code: string;
    name: string;
}
export const colors = [
    {
        code: "#FF6900",
        name: "Blaze Orange"
    },
    {
        code: "#FCB900",
        name: "Selective Yellow"
    },
    {
        code: "#7BDCB5",
        name: "Bermuda"
    },
    {
        code: "#00D084",
        name: "Caribbean Green"
    },
    {
        code: "#8ED1FC",
        name: "Malibu"
    },
    {
        code: "#0693E3",
        name: "Cerulean"
    },
    {
        code: "#8D8D8D",
        name: "Gray"
    },
    {
        code: "#EB144C",
        name: "Crimson"
    },
    {
        code: "#F78DA7",
        name: "Persian Pink"
    }
];

export const viewColors = (): ColorInterface[] => {
    return colors;
};
