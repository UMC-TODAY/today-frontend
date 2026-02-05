export const settingsModalStyles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.36)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },

    modal: {
        width: "860px",
        height: "550px",
        background: "#FFFFFF",
        borderRadius: "8px",
        display: "flex",
        overflow: "hidden",
        position: "relative" as const,
    },

    closeBtn: {
        position: "absolute",
        top: "16px",
        right: "16px",
        width: "28px",
        height: "28px",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    } as const,

    left: {
        width: "220px",
        borderRight: "1px solid #E6E7E9",
        padding: "32px 32px",
        boxSizing: "border-box" as const,
    },

    leftTitle: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#525050",
        marginBottom: "16px",
    },

    menuItem: (active: boolean) => ({
        display: "block",
        width: "100%",
        paddingBlock: "10px",
        borderRadius: "8px",
        border: "none",
        color: active ? "#6987D2" : "#525050",
        fontWeight: 450,
        fontSize: "15px",
        textAlign: "left" as const,
        cursor: "pointer",
        marginBottom: "6px",
    }),

    right: {
        flex: 1,
        padding: "24px 28px",
        boxSizing: "border-box" as const,
        overflow: "auto" as const,
    },
} as const;