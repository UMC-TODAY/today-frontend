export const signupStyles = {
    page: {
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f5fA",
        padding: "24px",
    } as const,

    card: {
        width: "400px",
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "38px 45px 26px",
        position: "relative",
    } as const,

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

    title: {
        textAlign: "center" as const,
        marginBottom: "26px",
    } as const,

    fieldBlock: { marginBottom: "14px" } as const,

    labelRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: "6px",
        marginLeft: "8px",
    } as const,

    inputWrap: { position: "relative" as const } as const,

    input: {
        width: "100%",
        height: "42px",
        borderRadius: "10px",
        border: "1px solid #E5E8EB",
        padding: "0 12px",
        outline: "none",
        fontSize: "12px",
        fontWeight: 400,
        background: "#fff",
    } as const,

    leftIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
    } as const,

    // 생년월일 + 주민1 자리 한 줄
    rowBirth: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
    } as const,

    birthInput: {
        width: "130px",
    } as const,

    rrFrontWrap: {
        width: "50px",
    } as const,

    rrFrontInput: {
        width: "50px",
        textAlign: "center" as const,
    } as const,

    rrMask: {
        display: "inline-flex",
        gap: "9px",
        //alignItems: "center",
        color: "#B0B8C1",
        fontSize: "12px",
        marginTop: "4px",
        marginLeft: "2px",
        userSelect: "none" as const,
    } as const,

    // 이메일 + 전송하기 한 줄
    rowEmail: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    } as const,

    emailInputWrap: {
        flex: 1,
        position: "relative" as const,
    } as const,

    rightBtn: {
        width: "80px",
        height: "42px",
        borderRadius: "10px",
        background: "#FFFFFF",
        color: "#0066FF",
        fontWeight: 600,
        fontSize: "12px",
        cursor: "pointer",
    } as const,

    // 인증번호 + 확인하기 한 줄
    rowVerify: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    } as const,

    submitBase: {
        width: "100%",
        height: "44px",
        borderRadius: "12px",
        border: "none",
        color: "#fff",
        fontWeight: 700,
        marginTop: "10px",
        cursor: "pointer",
    } as const,

    footer: {
        marginTop: "12px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    } as const,

    agreeRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        color: "#6F6F6F",
        fontSize: "10px",
        lineHeight: 1.4,
        paddingLeft: "8px",
    } as const,

    error: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        fontSize: "13px",
        color: "#d93025",
        fontWeight: 600,
        lineHeight: 1.4,
    } as const,

    success: {
        marginTop: "10px",
        fontSize: "12px",
        color: "#2563eb",
        fontWeight: 600,
        lineHeight: 1.4,
    } as const,
};
