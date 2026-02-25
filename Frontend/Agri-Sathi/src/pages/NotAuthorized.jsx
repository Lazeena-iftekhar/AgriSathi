function NotAuthorized() {
  return (
    <div style={{ padding: "2rem", color: "red" }}>
      <h2>🚫 Access Denied</h2>
      <p>Buyers are not allowed to access this page.</p>
    </div>
  );
}

export default NotAuthorized;
