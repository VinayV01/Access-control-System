export function Layout({ children }) {

  return (
    <div className="app">

      {/* Page Content */}
      <main className="main-content">
        {children}
      </main>

    </div>
  );
}

export function Loader() {
  return <p className="status">Loading..</p>;
}

export function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
