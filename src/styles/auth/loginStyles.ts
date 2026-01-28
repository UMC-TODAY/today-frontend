export const AUTH_KEY = "today_auth";

export const loginStyles = {
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
    padding: "34px 45px 26px",
  } as const,

  subtitle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "14px",
    color: "#000000",
    textAlign: "center" as const,
    marginTop: "10px",
    marginBottom: "40px",
    fontWeight: 500,
  },

  fieldBlock: { marginBottom: "14px" },

  labelRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
    marginLeft: "8px",
  },

  inputWrap: { position: "relative" as const },

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

  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  } as const,

  input: {
    fontFamily: "Pretendard, sans-serif",
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid #E5E8EB",
    padding: "0 12px",
    outline: "none",
    fontSize: "12px",
    fontWeight: 400,
    background: "#fff",
  },

  inputPw: { paddingRight: "40px" },

  pwToggle: {
    position: "absolute" as const,
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    opacity: 0.7,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "14px",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#333",
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none" as const,
  },

  link: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "11px",
    color: "#4D4D4D",
    fontWeight: 400,
    textDecoration: "none",
  },

  submitBase: {
    fontFamily: "Pretendard, sans-serif",
    width: "100%",
    height: "44px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: 800,
    marginTop: "6px",
  } as const,

  error: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#d93025",
    fontWeight: 700,
    lineHeight: 1.4,
  } as const,

  orRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "16px 0",
    color: "#999",
    fontSize: "12px",
    fontWeight: 700,
  },

  line: { flex: 1, height: "1px", background: "#E5E8EB" },

  socialBtnBase: {
    position: "relative",
    width: "100%",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #e6e8ee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  } as const,

  googleIconWrap: {
    position: "absolute",
    left: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const,

  naverIconWrap: {
    position: "absolute",
    left: "19px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const,

  naverBtn: {
    background: "#03CF5D",
    border: "none",
    color: "#fff",
  } as const,

  bottomLink: {
    fontFamily: "Pretendard, sans-serif",
    display: "block",
    textAlign: "center" as const,
    marginTop: "10px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#4E5968",
    textDecoration: "none",
  },
};

export const getTextStyle = (weight: number, size: number, color: string) => ({
  fontFamily: "Pretendard, sans-serif",
  fontWeight: weight,
  lineHeight: "100%",
  fontSize: `${size}px`,
  display: "inline-flex",
  alignItems: "center",
  color: `${color}`,
} as const);