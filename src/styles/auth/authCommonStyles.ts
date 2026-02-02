export const FIND_ID_EMAIL_KEY = "today_find_id_email";

export const authCommenStyles = {
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
    width: "380px",
    height: "480px",
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "105px 45px 26px",
    position: "relative",
  } as const,

  title: {
    display: "flex",
    justifyContent: "center",
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

  subtitle: {
    fontSize: "14px",
    color: "#000000",
    textAlign: "center" as const,
    marginTop: "15px",
    marginBottom: "34px",
    fontWeight: 400,
    lineHeight: 1.4,
  } as const,

  fieldBlock: { 
    marginTop: "65px",
    marginBottom: "14px", 
  },

  labelRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
    gap: "3px",
    marginLeft: "8px",
  } as const,

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

  error: {
    display: "flex",
    justifyContent: "center",
    marginTop: "18px",
    fontSize: "13px",
    color: "#d93025",
    fontWeight: 600,
    lineHeight: 1.4,
  } as const,

  success: {
    marginTop: "18px",
    fontSize: "13px",
    color: "#0066FF",
    fontWeight: 500,
    lineHeight: 1.4,
  } as const,

  submitBase: {
    width: "100%",
    height: "44px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: 800,
    marginTop: "14px",
  } as const,
};