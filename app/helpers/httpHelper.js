export async function postCall(url, body, headers = {}) {
  try {
    const res_data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await res_data.json();
    return { status: "ok", data };
  } catch (err) {
    return { status: "error", data: err };
  }
}
export async function putCall(url, body, headers = {}) {
  try {
    const res_data = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await res_data.json();
    return { status: "ok", data };
  } catch (err) {
    return { status: "error", data: err };
  }
}
export async function getCall(url, searchParams = {}, headers = {}) {
  try {
    const res_data = await fetch(
      `${url}?` + new URLSearchParams(searchParams),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    );

    const data = await res_data.json();
    return { status: "ok", data };
  } catch (err) {
    return { status: "error", data: err };
  }
}
