import { cookies } from "next/headers";

export default async function nextFetch(url, tags, method = "GET", body) {
  const nextCookies = cookies();
  url = url.includes("http")
    ? url
    : `${process.env.NEXT_PUBLIC_AUTH0_SIGNOUT_CALLBACK_URL}/${url}`;
  try {
    let initOptions = {
      method,
      headers: {
        cookie: nextCookies
          .getAll()
          .map((x) => `${x.name}=${x.value}`)
          .join(";"),
      },
    };
    if (method == "GET") initOptions.next = { tags: [...tags] };
    if (method == "POST" || method == "PUT")
      initOptions.body = JSON.stringify(body);

    const response = await fetch(url, initOptions);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log({ err });
    return { err };
  }
}
