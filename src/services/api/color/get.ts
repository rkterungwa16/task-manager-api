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
    },
    {
        code: "#AF38EB",
        name: "Violet"
    },
    {
        code: "#CCAC93",
        name: "Taupe"
    },
    {
        code: "#E05194",
        name: "Magenta"
    },
    {
        code: "#EB96EB",
        name: "Lavender"
    },
    {
        code: "#FF8d85",
        name: "Salmon"
    },
    {
        code: "#884DFF",
        name: "Grape"
    },
    {
        code: "#AFB83B",
        name: "Olive Green"
    }
];

export const viewColors = (): ColorInterface[] => {
    return colors;
};
