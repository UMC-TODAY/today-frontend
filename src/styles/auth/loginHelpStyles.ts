export const loginHelpStyles = {
  page: {
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "#F4F5FA",
    padding: "40px 24px",
  } as const,

  container: {
    width: "100%",
    maxWidth: "980px",
  } as const,

  header: {
    textAlign: "center" as const,
    marginTop: "120px",
    marginBottom: "40px",
  } as const,

  subHeaderText: {
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: 400,
    color: "#4D4D4D",
    lineHeight: "145%",
  } as const,

  cardsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "150px",
    marginTop: "60px",
    flexWrap: "wrap" as const,
  } as const,

  cardButton: {
    width: "270px",
    height: "360px",
    border: "none",
    background: "#FFFFFF",
    borderRadius: "12px",
    cursor: "pointer",
    padding: "45px 26px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "flex-start",
  } as const,

  iconWrap: {
    marginTop: "30px",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const,

  cardTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#3182F6",
    textAlign: "center" as const,
    marginTop: "10px",
  } as const,

  cardDesc: {
    fontSize: "12px",
    fontWeight: 370,
    color: "#4D4D4D",
    textAlign: "center" as const,
    lineHeight: "150%",
    marginTop: "15px",
    maxWidth: "260px",
    whiteSpace: "pre-line",
  } as const,
};
