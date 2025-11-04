import useSWR from "swr";

function CapsLock(props) {
  return <p>{props.text.toUpperCase()}</p>;
}

async function fetchAPI(key) {
  const response = await fetch(key);

  return await response.json();
}

function UpdateAt() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const { isLoading, data } = response;

  var updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <p>Update at: {updatedAtText}</p>;
}

function DatabaseInfo() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  const { isLoading, data } = response;

  let loadingText = "Carregando...";

  let maxConn = loadingText;
  let openedConn = loadingText;
  let v = loadingText;
  if (!isLoading && data) {
    const { max_connections, opened_connections, version } =
      data.dependencies.database;

    maxConn = max_connections;
    openedConn = opened_connections;
    v = version;
  }

  return (
    <>
      <h3>Database Info:</h3>
      <p>Max conn: {maxConn}</p>
      <p>Opened conn:{openedConn}</p>
      <p>Version: {v}</p>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <CapsLock text="CapsLock" />
      <UpdateAt />
      <DatabaseInfo />
    </>
  );
}
